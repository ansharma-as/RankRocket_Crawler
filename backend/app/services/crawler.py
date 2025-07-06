import aiohttp
import asyncio
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from datetime import datetime
from typing import List, Dict, Optional
import time

from app.models.schemas import CrawlResult, SEOMetrics, CrawlStatus
from app.core.config import settings
from app.services.ml_analyzer import MLAnalyzer
from bson import ObjectId


class CrawlerService:
    def __init__(self, db):
        self.db = db
        self.ml_analyzer = MLAnalyzer()

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
        
        # Create SSL context that doesn't verify certificates (for development)
        import ssl
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        connector = aiohttp.TCPConnector(ssl=ssl_context)
        
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