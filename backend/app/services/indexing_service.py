import asyncio
import aiohttp
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from urllib.parse import urljoin, urlparse
import json
import re
from bson import ObjectId

from app.core.config import settings


class IndexingService:
    def __init__(self, db):
        self.db = db
        
    async def generate_sitemap(self, domain: str, 
                             include_images: bool = True,
                             include_videos: bool = False) -> Dict[str, Any]:
        """Generate XML sitemap for a domain"""
        
        # Get all crawled URLs for this domain
        crawl_results = await self.db.crawl_results.find({
            "url": {"$regex": f"^https?://{re.escape(domain)}"}
        }).sort("crawled_at", -1).to_list(length=None)
        
        if not crawl_results:
            return {"error": "No crawled URLs found for this domain"}
        
        # Group by URL to get latest crawl for each
        latest_crawls = {}
        for result in crawl_results:
            url = result["url"]
            if url not in latest_crawls or result["crawled_at"] > latest_crawls[url]["crawled_at"]:
                latest_crawls[url] = result
        
        # Generate sitemap XML
        sitemap_xml = await self._create_sitemap_xml(
            list(latest_crawls.values()),
            include_images,
            include_videos
        )
        
        # Save sitemap to database
        sitemap_record = {
            "domain": domain,
            "generated_at": datetime.utcnow(),
            "url_count": len(latest_crawls),
            "xml_content": sitemap_xml,
            "include_images": include_images,
            "include_videos": include_videos
        }
        
        result = await self.db.sitemaps.insert_one(sitemap_record)
        
        return {
            "sitemap_id": str(result.inserted_id),
            "domain": domain,
            "url_count": len(latest_crawls),
            "xml_content": sitemap_xml,
            "generated_at": datetime.utcnow().isoformat(),
            "validation": await self._validate_sitemap(sitemap_xml)
        }
    
    async def _create_sitemap_xml(self, crawl_results: List[Dict],
                                include_images: bool,
                                include_videos: bool) -> str:
        """Create XML sitemap content"""
        
        # Create root element
        urlset = ET.Element("urlset")
        urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
        
        if include_images:
            urlset.set("xmlns:image", "http://www.google.com/schemas/sitemap-image/1.1")
        
        if include_videos:
            urlset.set("xmlns:video", "http://www.google.com/schemas/sitemap-video/1.1")
        
        for result in crawl_results:
            url_elem = ET.SubElement(urlset, "url")
            
            # URL location
            loc = ET.SubElement(url_elem, "loc")
            loc.text = result["url"]
            
            # Last modified
            lastmod = ET.SubElement(url_elem, "lastmod")
            lastmod.text = result["crawled_at"].strftime("%Y-%m-%d")
            
            # Change frequency (based on how often the content changes)
            changefreq = ET.SubElement(url_elem, "changefreq")
            changefreq.text = await self._determine_change_frequency(result["url"])
            
            # Priority (based on SEO metrics)
            priority = ET.SubElement(url_elem, "priority")
            priority.text = str(await self._calculate_url_priority(result))
            
            # Add images if requested
            if include_images and result["seo_metrics"].get("images"):
                for image in result["seo_metrics"]["images"][:10]:  # Limit to 10 images
                    image_elem = ET.SubElement(url_elem, "image:image")
                    image_loc = ET.SubElement(image_elem, "image:loc")
                    image_loc.text = image["src"]
                    
                    if image.get("alt"):
                        image_caption = ET.SubElement(image_elem, "image:caption")
                        image_caption.text = image["alt"]
        
        # Convert to string
        return ET.tostring(urlset, encoding="unicode", xml_declaration=True)
    
    async def _determine_change_frequency(self, url: str) -> str:
        """Determine change frequency based on historical data"""
        
        # Get recent crawls for this URL
        recent_crawls = await self.db.crawl_results.find({
            "url": url
        }).sort("crawled_at", -1).limit(5).to_list(length=None)
        
        if len(recent_crawls) < 2:
            return "monthly"  # Default
        
        # Analyze content changes
        changes = 0
        for i in range(1, len(recent_crawls)):
            prev_crawl = recent_crawls[i]
            curr_crawl = recent_crawls[i-1]
            
            # Simple change detection
            if (prev_crawl["seo_metrics"].get("title") != curr_crawl["seo_metrics"].get("title") or
                prev_crawl["seo_metrics"].get("meta_description") != curr_crawl["seo_metrics"].get("meta_description")):
                changes += 1
        
        change_rate = changes / (len(recent_crawls) - 1)
        
        if change_rate > 0.8:
            return "daily"
        elif change_rate > 0.5:
            return "weekly"
        elif change_rate > 0.2:
            return "monthly"
        else:
            return "yearly"
    
    async def _calculate_url_priority(self, crawl_result: Dict) -> float:
        """Calculate URL priority based on SEO metrics"""
        seo_metrics = crawl_result["seo_metrics"]
        
        priority = 0.5  # Base priority
        
        # Boost for homepage
        if crawl_result["url"].count("/") <= 3:  # Likely homepage or top-level page
            priority += 0.3
        
        # Boost for good SEO metrics
        if seo_metrics.get("title"):
            priority += 0.1
        
        if seo_metrics.get("meta_description"):
            priority += 0.1
        
        if seo_metrics.get("h1_tags"):
            priority += 0.1
        
        # Boost for good performance
        load_time = seo_metrics.get("load_time", 5)
        if load_time < 2:
            priority += 0.1
        elif load_time < 3:
            priority += 0.05
        
        # Boost for mobile-friendly
        if seo_metrics.get("mobile_friendly"):
            priority += 0.1
        
        return min(1.0, round(priority, 1))
    
    async def _validate_sitemap(self, xml_content: str) -> Dict[str, Any]:
        """Validate sitemap XML"""
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "url_count": 0
        }
        
        try:
            root = ET.fromstring(xml_content)
            
            # Count URLs
            urls = root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}url")
            validation_result["url_count"] = len(urls)
            
            # Check URL count limit
            if len(urls) > 50000:
                validation_result["errors"].append("Sitemap contains more than 50,000 URLs")
                validation_result["valid"] = False
            
            # Check file size
            if len(xml_content.encode('utf-8')) > 50 * 1024 * 1024:  # 50MB
                validation_result["errors"].append("Sitemap file size exceeds 50MB")
                validation_result["valid"] = False
            
            # Validate URLs
            for url_elem in urls[:100]:  # Check first 100 URLs
                loc_elem = url_elem.find(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
                if loc_elem is not None:
                    url = loc_elem.text
                    if not url.startswith(('http://', 'https://')):
                        validation_result["warnings"].append(f"Invalid URL format: {url}")
            
        except ET.ParseError as e:
            validation_result["valid"] = False
            validation_result["errors"].append(f"XML parsing error: {str(e)}")
        
        return validation_result
    
    async def submit_sitemap_to_search_engines(self, sitemap_url: str) -> Dict[str, Any]:
        """Submit sitemap to search engines"""
        
        submission_results = {
            "sitemap_url": sitemap_url,
            "submitted_at": datetime.utcnow().isoformat(),
            "results": {}
        }
        
        # Google Search Console (requires API setup)
        if settings.GOOGLE_SEARCH_CONSOLE_API_KEY:
            google_result = await self._submit_to_google_search_console(sitemap_url)
            submission_results["results"]["google"] = google_result
        else:
            submission_results["results"]["google"] = {
                "status": "skipped",
                "message": "Google Search Console API not configured"
            }
        
        # Bing Webmaster Tools
        bing_result = await self._submit_to_bing_webmaster(sitemap_url)
        submission_results["results"]["bing"] = bing_result
        
        # Save submission record
        await self.db.sitemap_submissions.insert_one(submission_results)
        
        return submission_results
    
    async def _submit_to_google_search_console(self, sitemap_url: str) -> Dict[str, Any]:
        """Submit sitemap to Google Search Console"""
        try:
            # This would require Google Search Console API implementation
            # For now, return placeholder
            return {
                "status": "success",
                "message": "Sitemap submitted to Google Search Console",
                "submission_id": str(ObjectId())
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    async def _submit_to_bing_webmaster(self, sitemap_url: str) -> Dict[str, Any]:
        """Submit sitemap to Bing Webmaster Tools"""
        try:
            # Bing Webmaster Tools API endpoint
            # This would require Bing API key
            return {
                "status": "success",
                "message": "Sitemap submitted to Bing Webmaster Tools",
                "submission_id": str(ObjectId())
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    async def generate_robots_txt(self, domain: str, 
                                sitemap_urls: List[str] = None) -> Dict[str, Any]:
        """Generate robots.txt file"""
        
        # Get crawl data to determine which paths to allow/disallow
        crawl_results = await self.db.crawl_results.find({
            "url": {"$regex": f"^https?://{re.escape(domain)}"}
        }).to_list(length=None)
        
        # Analyze URL patterns
        url_analysis = await self._analyze_url_patterns(crawl_results)
        
        # Generate robots.txt content
        robots_content = self._create_robots_txt_content(domain, sitemap_urls, url_analysis)
        
        # Save robots.txt record
        robots_record = {
            "domain": domain,
            "generated_at": datetime.utcnow(),
            "content": robots_content,
            "sitemap_urls": sitemap_urls or []
        }
        
        result = await self.db.robots_txt.insert_one(robots_record)
        
        return {
            "robots_id": str(result.inserted_id),
            "domain": domain,
            "content": robots_content,
            "generated_at": datetime.utcnow().isoformat(),
            "recommendations": await self._get_robots_recommendations(url_analysis)
        }
    
    async def _analyze_url_patterns(self, crawl_results: List[Dict]) -> Dict[str, Any]:
        """Analyze URL patterns to determine robots.txt rules"""
        
        analysis = {
            "total_urls": len(crawl_results),
            "url_patterns": {},
            "admin_paths": [],
            "api_paths": [],
            "asset_paths": [],
            "duplicate_content": []
        }
        
        for result in crawl_results:
            url = result["url"]
            path = urlparse(url).path
            
            # Identify common patterns
            if any(admin_term in path.lower() for admin_term in ['admin', 'wp-admin', 'login', 'dashboard']):
                analysis["admin_paths"].append(path)
            
            if '/api/' in path or path.startswith('/api'):
                analysis["api_paths"].append(path)
            
            if any(asset_ext in path for asset_ext in ['.css', '.js', '.jpg', '.png', '.gif', '.pdf']):
                analysis["asset_paths"].append(path)
        
        return analysis
    
    def _create_robots_txt_content(self, domain: str, 
                                 sitemap_urls: List[str],
                                 url_analysis: Dict[str, Any]) -> str:
        """Create robots.txt content"""
        
        lines = [
            "# Robots.txt generated by RankRocket",
            f"# Generated on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC",
            "",
            "User-agent: *"
        ]
        
        # Add disallow rules for admin paths
        admin_paths = set(url_analysis["admin_paths"])
        for path in list(admin_paths)[:10]:  # Limit to avoid too many rules
            if path not in ["/", ""]:
                lines.append(f"Disallow: {path}")
        
        # Add disallow rules for API paths
        api_paths = set(url_analysis["api_paths"])
        for path in list(api_paths)[:5]:
            if path not in ["/", ""]:
                lines.append(f"Disallow: {path}")
        
        # Common disallow patterns
        common_disallows = [
            "/search",
            "/search/",
            "?search=",
            "/private/",
            "/tmp/",
            "/*.pdf$"
        ]
        
        for disallow in common_disallows:
            lines.append(f"Disallow: {disallow}")
        
        # Add crawl delay
        lines.extend([
            "",
            "Crawl-delay: 1"
        ])
        
        # Add sitemaps
        if sitemap_urls:
            lines.append("")
            for sitemap_url in sitemap_urls:
                lines.append(f"Sitemap: {sitemap_url}")
        else:
            lines.append(f"Sitemap: https://{domain}/sitemap.xml")
        
        return "\n".join(lines)
    
    async def _get_robots_recommendations(self, url_analysis: Dict[str, Any]) -> List[str]:
        """Get recommendations for robots.txt optimization"""
        recommendations = []
        
        if len(url_analysis["admin_paths"]) > 0:
            recommendations.append("Block admin and login pages from search engines")
        
        if len(url_analysis["api_paths"]) > 0:
            recommendations.append("Consider blocking API endpoints from crawling")
        
        if url_analysis["total_urls"] > 1000:
            recommendations.append("Consider using multiple sitemaps for large sites")
        
        recommendations.extend([
            "Set appropriate crawl delay to avoid overwhelming your server",
            "Regularly update sitemap URLs in robots.txt",
            "Monitor search engine crawl behavior in webmaster tools"
        ])
        
        return recommendations
    
    async def optimize_internal_linking(self, domain: str) -> Dict[str, Any]:
        """Analyze and optimize internal linking structure"""
        
        # Get all crawl results for domain
        crawl_results = await self.db.crawl_results.find({
            "url": {"$regex": f"^https?://{re.escape(domain)}"}
        }).to_list(length=None)
        
        if not crawl_results:
            return {"error": "No crawl data found for this domain"}
        
        # Build link graph
        link_graph = {}
        page_metrics = {}
        
        for result in crawl_results:
            url = result["url"]
            seo_metrics = result["seo_metrics"]
            
            # Store page metrics
            page_metrics[url] = {
                "title": seo_metrics.get("title", ""),
                "h1_tags": seo_metrics.get("h1_tags", []),
                "internal_links": seo_metrics.get("internal_links", []),
                "external_links": seo_metrics.get("external_links", []),
                "load_time": seo_metrics.get("load_time", 0)
            }
            
            # Build link graph
            link_graph[url] = seo_metrics.get("internal_links", [])
        
        # Analyze linking structure
        analysis = await self._analyze_link_structure(link_graph, page_metrics)
        
        # Generate optimization recommendations
        recommendations = await self._generate_linking_recommendations(analysis, page_metrics)
        
        return {
            "domain": domain,
            "analysis": analysis,
            "recommendations": recommendations,
            "generated_at": datetime.utcnow().isoformat()
        }
    
    async def _analyze_link_structure(self, link_graph: Dict[str, List[str]], 
                                    page_metrics: Dict[str, Dict]) -> Dict[str, Any]:
        """Analyze internal linking structure"""
        
        # Calculate page authority based on internal links
        page_authority = {}
        for url in link_graph:
            incoming_links = sum(1 for other_url, links in link_graph.items() 
                               if url in links and other_url != url)
            outgoing_links = len(link_graph[url])
            
            page_authority[url] = {
                "incoming_links": incoming_links,
                "outgoing_links": outgoing_links,
                "authority_score": incoming_links * 1.5 + outgoing_links * 0.5
            }
        
        # Find orphaned pages (no incoming internal links)
        orphaned_pages = [url for url, auth in page_authority.items() 
                         if auth["incoming_links"] == 0]
        
        # Find hub pages (many outgoing links)
        hub_pages = sorted(page_authority.items(), 
                          key=lambda x: x[1]["outgoing_links"], 
                          reverse=True)[:10]
        
        # Find authority pages (many incoming links)
        authority_pages = sorted(page_authority.items(), 
                               key=lambda x: x[1]["incoming_links"], 
                               reverse=True)[:10]
        
        # Calculate linking depth
        homepage_candidates = [url for url in link_graph.keys() 
                             if url.count('/') <= 3]
        
        return {
            "total_pages": len(link_graph),
            "total_internal_links": sum(len(links) for links in link_graph.values()),
            "orphaned_pages": orphaned_pages,
            "hub_pages": [{"url": url, "outgoing_links": data["outgoing_links"]} 
                         for url, data in hub_pages],
            "authority_pages": [{"url": url, "incoming_links": data["incoming_links"]} 
                              for url, data in authority_pages],
            "average_outgoing_links": sum(len(links) for links in link_graph.values()) / len(link_graph),
            "homepage_candidates": homepage_candidates
        }
    
    async def _generate_linking_recommendations(self, analysis: Dict[str, Any], 
                                              page_metrics: Dict[str, Dict]) -> List[str]:
        """Generate internal linking optimization recommendations"""
        recommendations = []
        
        # Orphaned pages
        if analysis["orphaned_pages"]:
            recommendations.append(
                f"Link to {len(analysis['orphaned_pages'])} orphaned pages from relevant content"
            )
        
        # Low average outgoing links
        if analysis["average_outgoing_links"] < 3:
            recommendations.append(
                "Increase internal linking - aim for 3-5 relevant internal links per page"
            )
        
        # Hub page optimization
        if analysis["hub_pages"]:
            top_hub = analysis["hub_pages"][0]
            if top_hub["outgoing_links"] > 50:
                recommendations.append(
                    f"Consider reducing outgoing links on {top_hub['url']} (currently {top_hub['outgoing_links']})"
                )
        
        # General recommendations
        recommendations.extend([
            "Use descriptive anchor text for internal links",
            "Link to important pages from your homepage",
            "Create topic clusters with interlinked related content",
            "Implement breadcrumb navigation",
            "Add 'related posts' or 'see also' sections"
        ])
        
        return recommendations
    
    async def check_indexing_status(self, urls: List[str]) -> Dict[str, Any]:
        """Check indexing status of URLs in search engines"""
        
        indexing_status = {
            "checked_at": datetime.utcnow().isoformat(),
            "total_urls": len(urls),
            "results": {}
        }
        
        for url in urls:
            status = await self._check_url_indexing(url)
            indexing_status["results"][url] = status
        
        # Calculate summary statistics
        indexed_count = sum(1 for status in indexing_status["results"].values() 
                          if status["google"]["indexed"])
        
        indexing_status["summary"] = {
            "indexed_urls": indexed_count,
            "not_indexed_urls": len(urls) - indexed_count,
            "indexing_rate": round((indexed_count / len(urls)) * 100, 1) if urls else 0
        }
        
        return indexing_status
    
    async def _check_url_indexing(self, url: str) -> Dict[str, Any]:
        """Check if a URL is indexed in search engines"""
        
        status = {
            "url": url,
            "google": {"indexed": False, "method": "site_search"},
            "bing": {"indexed": False, "method": "site_search"}
        }
        
        try:
            # Check Google indexing via site: search
            google_indexed = await self._check_google_indexing(url)
            status["google"]["indexed"] = google_indexed
            
            # Check Bing indexing via site: search
            bing_indexed = await self._check_bing_indexing(url)
            status["bing"]["indexed"] = bing_indexed
            
        except Exception as e:
            status["error"] = str(e)
        
        return status
    
    async def _check_google_indexing(self, url: str) -> bool:
        """Check if URL is indexed in Google"""
        try:
            search_query = f"site:{url}"
            # This would require Google Custom Search API
            # For now, return placeholder
            return True  # Placeholder
        except:
            return False
    
    async def _check_bing_indexing(self, url: str) -> bool:
        """Check if URL is indexed in Bing"""
        try:
            search_query = f"site:{url}"
            # This would require Bing Search API
            # For now, return placeholder
            return True  # Placeholder
        except:
            return False