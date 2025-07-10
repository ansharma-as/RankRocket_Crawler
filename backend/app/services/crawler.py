import aiohttp
import asyncio
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from datetime import datetime
from typing import List, Dict, Optional
import time
import json
import re
from concurrent.futures import ThreadPoolExecutor
from playwright.async_api import async_playwright
import ssl
import xml.etree.ElementTree as ET

from app.models.schemas import CrawlResult, SEOMetrics, CrawlStatus
from app.core.config import settings
from app.services.ml_analyzer import MLAnalyzer
from bson import ObjectId


class CrawlerService:
    def __init__(self, db):
        self.db = db
        self.ml_analyzer = MLAnalyzer()
        self.semaphore = asyncio.Semaphore(settings.MAX_CONCURRENT_CRAWLS)
        self.session = None
        self.playwright = None
        self.browser = None

    async def crawl_url(self, submission_id: str, url: str):
        """Main crawling function that runs in background"""
        try:
            # Update status to crawling
            await self.db.url_submissions.update_one(
                {"_id": ObjectId(submission_id)},
                {"$set": {"status": CrawlStatus.CRAWLING}}
            )
            
            # Perform the crawl
            seo_metrics = await self._crawl_and_analyze(url)
            
            # Save crawl result
            crawl_result = CrawlResult(
                url_submission_id=submission_id,
                url=url,
                seo_metrics=seo_metrics
            )
            
            result = await self.db.crawl_results.insert_one(
                crawl_result.dict(by_alias=True)
            )
            
            # Generate ML recommendations
            recommendations = await self.ml_analyzer.generate_recommendations(
                str(result.inserted_id), seo_metrics
            )
            
            # Save recommendations
            if recommendations:
                await self.db.recommendations.insert_many(
                    [rec.dict(by_alias=True) for rec in recommendations]
                )
            
            # Update submission status
            await self.db.url_submissions.update_one(
                {"_id": ObjectId(submission_id)},
                {
                    "$set": {
                        "status": CrawlStatus.COMPLETED,
                        "completed_at": datetime.utcnow()
                    }
                }
            )
            
        except Exception as e:
            # Update status to failed
            await self.db.url_submissions.update_one(
                {"_id": ObjectId(submission_id)},
                {
                    "$set": {
                        "status": CrawlStatus.FAILED,
                        "error_message": str(e),
                        "completed_at": datetime.utcnow()
                    }
                }
            )

    async def _crawl_and_analyze(self, url: str) -> SEOMetrics:
        """Crawl URL and extract SEO metrics"""
        start_time = time.time()
        
        # Create proper SSL context
        ssl_context = ssl.create_default_context()
        connector = aiohttp.TCPConnector(ssl=ssl_context, limit=100)
        
        async with aiohttp.ClientSession(
            connector=connector,
            timeout=aiohttp.ClientTimeout(total=settings.CRAWL_TIMEOUT),
            headers={"User-Agent": settings.USER_AGENT}
        ) as session:
            async with session.get(url) as response:
                status_code = response.status
                html = await response.text()
                page_size = len(html.encode('utf-8'))
                load_time = time.time() - start_time
                
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract SEO metrics
                seo_metrics = SEOMetrics(
                    title=self._extract_title(soup),
                    meta_description=self._extract_meta_description(soup),
                    meta_keywords=self._extract_meta_keywords(soup),
                    canonical_url=self._extract_canonical(soup),
                    h1_tags=self._extract_headings(soup, 'h1'),
                    h2_tags=self._extract_headings(soup, 'h2'),
                    h3_tags=self._extract_headings(soup, 'h3'),
                    internal_links=self._extract_internal_links(soup, url),
                    external_links=self._extract_external_links(soup, url),
                    images=self._extract_images(soup, url),
                    page_size=page_size,
                    load_time=load_time,
                    status_code=status_code
                )
                
                return seo_metrics

    def _extract_title(self, soup: BeautifulSoup) -> Optional[str]:
        title_tag = soup.find('title')
        return title_tag.get_text().strip() if title_tag else None

    def _extract_meta_description(self, soup: BeautifulSoup) -> Optional[str]:
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        return meta_desc.get('content', '').strip() if meta_desc else None

    def _extract_meta_keywords(self, soup: BeautifulSoup) -> Optional[str]:
        meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
        return meta_keywords.get('content', '').strip() if meta_keywords else None

    def _extract_canonical(self, soup: BeautifulSoup) -> Optional[str]:
        canonical = soup.find('link', attrs={'rel': 'canonical'})
        return canonical.get('href') if canonical else None

    def _extract_headings(self, soup: BeautifulSoup, tag: str) -> List[str]:
        headings = soup.find_all(tag)
        return [h.get_text().strip() for h in headings]

    def _extract_internal_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        base_domain = urlparse(base_url).netloc
        links = []
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(base_url, href)
            if urlparse(full_url).netloc == base_domain:
                links.append(full_url)
        
        return list(set(links))

    def _extract_external_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        base_domain = urlparse(base_url).netloc
        links = []
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(base_url, href)
            if urlparse(full_url).netloc != base_domain and full_url.startswith('http'):
                links.append(full_url)
        
        return list(set(links))

    def _extract_images(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, str]]:
        images = []
        
        for img in soup.find_all('img'):
            src = img.get('src')
            if src:
                full_url = urljoin(base_url, src)
                images.append({
                    'src': full_url,
                    'alt': img.get('alt', ''),
                    'title': img.get('title', '')
                })
        
        return images

    async def initialize_browser(self):
        """Initialize Playwright browser for JS rendering"""
        if not self.playwright:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=True)

    async def close_browser(self):
        """Close Playwright browser"""
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def crawl_with_js(self, url: str) -> SEOMetrics:
        """Crawl URL with JavaScript rendering"""
        await self.initialize_browser()
        
        page = await self.browser.new_page()
        start_time = time.time()
        
        try:
            response = await page.goto(url, wait_until="networkidle")
            
            # Get page content after JS execution
            html = await page.content()
            load_time = time.time() - start_time
            
            # Get performance metrics
            performance = await page.evaluate("""
                () => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    return {
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                        firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime,
                        firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime,
                        largestContentfulPaint: performance.getEntriesByType('largest-contentful-paint')?.[0]?.startTime
                    };
                }
            """)
            
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract comprehensive SEO metrics
            seo_metrics = SEOMetrics(
                title=self._extract_title(soup),
                meta_description=self._extract_meta_description(soup),
                meta_keywords=self._extract_meta_keywords(soup),
                canonical_url=self._extract_canonical(soup),
                h1_tags=self._extract_headings(soup, 'h1'),
                h2_tags=self._extract_headings(soup, 'h2'),
                h3_tags=self._extract_headings(soup, 'h3'),
                internal_links=self._extract_internal_links(soup, url),
                external_links=self._extract_external_links(soup, url),
                images=self._extract_images(soup, url),
                page_size=len(html.encode('utf-8')),
                load_time=load_time,
                status_code=response.status
            )
            
            await page.close()
            return seo_metrics
            
        except Exception as e:
            await page.close()
            raise e

    def _extract_structured_data(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract structured data (JSON-LD, Microdata)"""
        structured_data = []
        
        # JSON-LD
        json_ld_scripts = soup.find_all('script', type='application/ld+json')
        for script in json_ld_scripts:
            try:
                data = json.loads(script.string)
                structured_data.append({
                    'type': 'json-ld',
                    'data': data
                })
            except:
                pass
        
        # Microdata
        microdata_items = soup.find_all(attrs={'itemscope': True})
        for item in microdata_items:
            item_type = item.get('itemtype', '')
            properties = {}
            
            for prop in item.find_all(attrs={'itemprop': True}):
                prop_name = prop.get('itemprop')
                prop_value = prop.get('content') or prop.get_text().strip()
                properties[prop_name] = prop_value
            
            if properties:
                structured_data.append({
                    'type': 'microdata',
                    'itemtype': item_type,
                    'properties': properties
                })
        
        return structured_data

    def _extract_og_tags(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract Open Graph tags"""
        og_tags = {}
        
        og_metas = soup.find_all('meta', property=re.compile(r'^og:'))
        for meta in og_metas:
            property_name = meta.get('property')
            content = meta.get('content')
            if property_name and content:
                og_tags[property_name] = content
        
        return og_tags

    def _extract_twitter_cards(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract Twitter Card tags"""
        twitter_tags = {}
        
        twitter_metas = soup.find_all('meta', attrs={'name': re.compile(r'^twitter:')})
        for meta in twitter_metas:
            name = meta.get('name')
            content = meta.get('content')
            if name and content:
                twitter_tags[name] = content
        
        return twitter_tags

    async def crawl_sitemap(self, sitemap_url: str) -> List[str]:
        """Crawl and parse sitemap for URLs"""
        urls = []
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(sitemap_url) as response:
                    if response.status == 200:
                        content = await response.text()
                        
                        # Parse XML sitemap
                        root = ET.fromstring(content)
                        
                        # Handle different sitemap formats
                        namespaces = {
                            'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9',
                            'news': 'http://www.google.com/schemas/sitemap-news/0.9',
                            'image': 'http://www.google.com/schemas/sitemap-image/1.1'
                        }
                        
                        # Extract URLs from sitemap
                        for url_elem in root.findall('.//sitemap:loc', namespaces):
                            urls.append(url_elem.text)
                        
                        # If it's a sitemap index, get URLs from individual sitemaps
                        for sitemap_elem in root.findall('.//sitemap:sitemap', namespaces):
                            loc_elem = sitemap_elem.find('sitemap:loc', namespaces)
                            if loc_elem is not None:
                                sub_urls = await self.crawl_sitemap(loc_elem.text)
                                urls.extend(sub_urls)
        
        except Exception as e:
            print(f"Error crawling sitemap {sitemap_url}: {e}")
        
        return urls

    async def discover_urls(self, base_url: str, max_depth: int = 2) -> List[str]:
        """Discover URLs by following internal links"""
        discovered_urls = set()
        to_crawl = [(base_url, 0)]
        crawled = set()
        
        while to_crawl:
            current_url, depth = to_crawl.pop(0)
            
            if current_url in crawled or depth > max_depth:
                continue
            
            try:
                async with self.semaphore:
                    seo_metrics = await self._crawl_and_analyze(current_url)
                    
                    discovered_urls.add(current_url)
                    crawled.add(current_url)
                    
                    # Add internal links to crawl queue
                    if depth < max_depth:
                        for link in seo_metrics.internal_links:
                            if link not in crawled:
                                to_crawl.append((link, depth + 1))
            
            except Exception as e:
                print(f"Error discovering URLs from {current_url}: {e}")
        
        return list(discovered_urls)

    async def check_robots_txt(self, base_url: str) -> Dict[str, any]:
        """Check and parse robots.txt"""
        robots_url = urljoin(base_url, '/robots.txt')
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(robots_url) as response:
                    if response.status == 200:
                        content = await response.text()
                        
                        # Parse robots.txt
                        rules = {
                            'user_agents': {},
                            'sitemaps': []
                        }
                        
                        current_user_agent = '*'
                        
                        for line in content.split('\n'):
                            line = line.strip()
                            if line.startswith('User-agent:'):
                                current_user_agent = line.split(':', 1)[1].strip()
                                if current_user_agent not in rules['user_agents']:
                                    rules['user_agents'][current_user_agent] = {
                                        'allow': [],
                                        'disallow': []
                                    }
                            elif line.startswith('Allow:'):
                                path = line.split(':', 1)[1].strip()
                                rules['user_agents'][current_user_agent]['allow'].append(path)
                            elif line.startswith('Disallow:'):
                                path = line.split(':', 1)[1].strip()
                                rules['user_agents'][current_user_agent]['disallow'].append(path)
                            elif line.startswith('Sitemap:'):
                                sitemap_url = line.split(':', 1)[1].strip()
                                rules['sitemaps'].append(sitemap_url)
                        
                        return rules
        
        except Exception as e:
            print(f"Error checking robots.txt for {base_url}: {e}")
        
        return {'user_agents': {}, 'sitemaps': []}

    def can_crawl_url(self, url: str, robots_rules: Dict, user_agent: str = '*') -> bool:
        """Check if URL can be crawled according to robots.txt"""
        if not robots_rules or not robots_rules.get('user_agents'):
            return True
        
        parsed_url = urlparse(url)
        path = parsed_url.path
        
        # Check rules for specific user agent first, then fallback to *
        for ua in [user_agent, '*']:
            if ua in robots_rules['user_agents']:
                rules = robots_rules['user_agents'][ua]
                
                # Check disallow rules
                for disallow in rules.get('disallow', []):
                    if disallow and path.startswith(disallow):
                        return False
                
                # Check allow rules
                for allow in rules.get('allow', []):
                    if allow and path.startswith(allow):
                        return True
        
        return True