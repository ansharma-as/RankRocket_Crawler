import asyncio
import aiohttp
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from urllib.parse import quote_plus
import base64
from bson import ObjectId

from app.core.config import settings


class SearchEngineService:
    def __init__(self, db):
        self.db = db
        
    async def submit_url_to_google(self, url: str, api_key: Optional[str] = None) -> Dict[str, Any]:
        """Submit URL to Google Search Console for indexing"""
        
        if not api_key and not settings.GOOGLE_SEARCH_CONSOLE_API_KEY:
            return {
                "status": "error",
                "message": "Google Search Console API key not configured"
            }
        
        api_key = api_key or settings.GOOGLE_SEARCH_CONSOLE_API_KEY
        
        try:
            # Google Indexing API endpoint
            endpoint = "https://indexing.googleapis.com/v3/urlNotifications:publish"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            
            payload = {
                "url": url,
                "type": "URL_UPDATED"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(endpoint, headers=headers, json=payload) as response:
                    result = await response.json()
                    
                    if response.status == 200:
                        # Save submission record
                        submission_record = {
                            "url": url,
                            "search_engine": "google",
                            "submitted_at": datetime.utcnow(),
                            "status": "success",
                            "response": result
                        }
                        
                        await self.db.search_engine_submissions.insert_one(submission_record)
                        
                        return {
                            "status": "success",
                            "message": "URL submitted to Google for indexing",
                            "response": result
                        }
                    else:
                        return {
                            "status": "error",
                            "message": f"Google API error: {result.get('error', {}).get('message', 'Unknown error')}"
                        }
        
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to submit to Google: {str(e)}"
            }
    
    async def submit_url_to_bing(self, url: str, api_key: Optional[str] = None) -> Dict[str, Any]:
        """Submit URL to Bing Webmaster Tools for indexing"""
        
        if not api_key and not settings.BING_WEBMASTER_API_KEY:
            return {
                "status": "error",
                "message": "Bing Webmaster API key not configured"
            }
        
        api_key = api_key or settings.BING_WEBMASTER_API_KEY
        
        try:
            # Bing Webmaster Tools API endpoint
            endpoint = "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            
            payload = {
                "siteUrl": self._extract_domain(url),
                "url": url
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(endpoint, headers=headers, json=payload) as response:
                    
                    if response.status == 200:
                        result = await response.json()
                        
                        # Save submission record
                        submission_record = {
                            "url": url,
                            "search_engine": "bing",
                            "submitted_at": datetime.utcnow(),
                            "status": "success",
                            "response": result
                        }
                        
                        await self.db.search_engine_submissions.insert_one(submission_record)
                        
                        return {
                            "status": "success",
                            "message": "URL submitted to Bing for indexing",
                            "response": result
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "status": "error",
                            "message": f"Bing API error: {error_text}"
                        }
        
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to submit to Bing: {str(e)}"
            }
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        from urllib.parse import urlparse
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"
    
    async def submit_sitemap_to_google(self, sitemap_url: str, site_url: str, 
                                     api_key: Optional[str] = None) -> Dict[str, Any]:
        """Submit sitemap to Google Search Console"""
        
        if not api_key and not settings.GOOGLE_SEARCH_CONSOLE_API_KEY:
            return {
                "status": "error",
                "message": "Google Search Console API key not configured"
            }
        
        api_key = api_key or settings.GOOGLE_SEARCH_CONSOLE_API_KEY
        
        try:
            # Google Search Console API endpoint for sitemaps
            site_encoded = quote_plus(site_url)
            sitemap_encoded = quote_plus(sitemap_url)
            endpoint = f"https://www.googleapis.com/webmasters/v3/sites/{site_encoded}/sitemaps/{sitemap_encoded}"
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.put(endpoint, headers=headers) as response:
                    
                    if response.status in [200, 204]:
                        # Save submission record
                        submission_record = {
                            "sitemap_url": sitemap_url,
                            "site_url": site_url,
                            "search_engine": "google",
                            "submitted_at": datetime.utcnow(),
                            "status": "success",
                            "type": "sitemap"
                        }
                        
                        await self.db.search_engine_submissions.insert_one(submission_record)
                        
                        return {
                            "status": "success",
                            "message": "Sitemap submitted to Google Search Console"
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "status": "error",
                            "message": f"Google API error: {error_text}"
                        }
        
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to submit sitemap to Google: {str(e)}"
            }
    
    async def submit_sitemap_to_bing(self, sitemap_url: str, site_url: str,
                                   api_key: Optional[str] = None) -> Dict[str, Any]:
        """Submit sitemap to Bing Webmaster Tools"""
        
        if not api_key and not settings.BING_WEBMASTER_API_KEY:
            return {
                "status": "error",
                "message": "Bing Webmaster API key not configured"
            }
        
        api_key = api_key or settings.BING_WEBMASTER_API_KEY
        
        try:
            # Bing Webmaster Tools API endpoint for sitemaps
            endpoint = "https://ssl.bing.com/webmaster/api.svc/json/SubmitSitemap"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            
            payload = {
                "siteUrl": site_url,
                "sitemapUrl": sitemap_url
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(endpoint, headers=headers, json=payload) as response:
                    
                    if response.status == 200:
                        result = await response.json()
                        
                        # Save submission record
                        submission_record = {
                            "sitemap_url": sitemap_url,
                            "site_url": site_url,
                            "search_engine": "bing",
                            "submitted_at": datetime.utcnow(),
                            "status": "success",
                            "response": result,
                            "type": "sitemap"
                        }
                        
                        await self.db.search_engine_submissions.insert_one(submission_record)
                        
                        return {
                            "status": "success",
                            "message": "Sitemap submitted to Bing Webmaster Tools",
                            "response": result
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "status": "error",
                            "message": f"Bing API error: {error_text}"
                        }
        
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to submit sitemap to Bing: {str(e)}"
            }
    
    async def check_indexing_status_google(self, url: str, 
                                         api_key: Optional[str] = None) -> Dict[str, Any]:
        """Check indexing status in Google"""
        
        if not api_key and not settings.GOOGLE_SEARCH_CONSOLE_API_KEY:
            return {
                "status": "error",
                "message": "Google Search Console API key not configured"
            }
        
        api_key = api_key or settings.GOOGLE_SEARCH_CONSOLE_API_KEY
        
        try:
            # Google Search Console URL Inspection API
            site_url = self._extract_domain(url)
            site_encoded = quote_plus(site_url)
            endpoint = f"https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "inspectionUrl": url,
                "siteUrl": site_url
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(endpoint, headers=headers, json=payload) as response:
                    
                    if response.status == 200:
                        result = await response.json()
                        
                        indexing_result = result.get("inspectionResult", {})
                        index_status = indexing_result.get("indexStatusResult", {})
                        
                        return {
                            "status": "success",
                            "indexed": index_status.get("coverageState") == "Submitted and indexed",
                            "crawl_status": index_status.get("crawledAs"),
                            "last_crawl_time": index_status.get("lastCrawlTime"),
                            "indexing_state": index_status.get("indexingState"),
                            "page_fetch_state": index_status.get("pageFetchState"),
                            "details": result
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "status": "error",
                            "message": f"Google API error: {error_text}"
                        }
        
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to check Google indexing status: {str(e)}"
            }
    
    async def get_search_performance_data(self, site_url: str, 
                                        start_date: datetime = None,
                                        end_date: datetime = None,
                                        api_key: Optional[str] = None) -> Dict[str, Any]:
        """Get search performance data from Google Search Console"""
        
        if not api_key and not settings.GOOGLE_SEARCH_CONSOLE_API_KEY:
            return {
                "status": "error",
                "message": "Google Search Console API key not configured"
            }
        
        api_key = api_key or settings.GOOGLE_SEARCH_CONSOLE_API_KEY
        
        # Default to last 30 days
        if not end_date:
            end_date = datetime.utcnow()
        if not start_date:
            start_date = end_date - timedelta(days=30)
        
        try:
            site_encoded = quote_plus(site_url)
            endpoint = f"https://www.googleapis.com/webmasters/v3/sites/{site_encoded}/searchAnalytics/query"
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "startDate": start_date.strftime("%Y-%m-%d"),
                "endDate": end_date.strftime("%Y-%m-%d"),
                "dimensions": ["query", "page", "country", "device"],
                "rowLimit": 1000
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(endpoint, headers=headers, json=payload) as response:
                    
                    if response.status == 200:
                        result = await response.json()
                        
                        # Process and analyze the data
                        analysis = await self._analyze_search_performance(result)
                        
                        # Save performance data
                        performance_record = {
                            "site_url": site_url,
                            "start_date": start_date,
                            "end_date": end_date,
                            "retrieved_at": datetime.utcnow(),
                            "data": result,
                            "analysis": analysis
                        }
                        
                        await self.db.search_performance.insert_one(performance_record)
                        
                        return {
                            "status": "success",
                            "data": result,
                            "analysis": analysis
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "status": "error",
                            "message": f"Google API error: {error_text}"
                        }
        
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to get search performance data: {str(e)}"
            }
    
    async def _analyze_search_performance(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze search performance data"""
        
        rows = data.get("rows", [])
        
        if not rows:
            return {"message": "No search performance data available"}
        
        # Calculate totals
        total_clicks = sum(row.get("clicks", 0) for row in rows)
        total_impressions = sum(row.get("impressions", 0) for row in rows)
        
        # Calculate averages
        avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
        avg_position = sum(row.get("position", 0) for row in rows) / len(rows) if rows else 0
        
        # Top performing queries
        top_queries = sorted(
            [row for row in rows if row.get("keys", [])],
            key=lambda x: x.get("clicks", 0),
            reverse=True
        )[:10]
        
        # Top performing pages
        page_performance = {}
        for row in rows:
            keys = row.get("keys", [])
            if len(keys) >= 2:  # Has page dimension
                page = keys[1]
                if page not in page_performance:
                    page_performance[page] = {
                        "clicks": 0,
                        "impressions": 0,
                        "queries": set()
                    }
                
                page_performance[page]["clicks"] += row.get("clicks", 0)
                page_performance[page]["impressions"] += row.get("impressions", 0)
                page_performance[page]["queries"].add(keys[0])
        
        top_pages = sorted(
            page_performance.items(),
            key=lambda x: x[1]["clicks"],
            reverse=True
        )[:10]
        
        # Device performance
        device_performance = {}
        for row in rows:
            keys = row.get("keys", [])
            if len(keys) >= 4:  # Has device dimension
                device = keys[3]
                if device not in device_performance:
                    device_performance[device] = {
                        "clicks": 0,
                        "impressions": 0
                    }
                
                device_performance[device]["clicks"] += row.get("clicks", 0)
                device_performance[device]["impressions"] += row.get("impressions", 0)
        
        return {
            "totals": {
                "clicks": total_clicks,
                "impressions": total_impressions,
                "ctr": round(avg_ctr, 2),
                "average_position": round(avg_position, 1)
            },
            "top_queries": [
                {
                    "query": row["keys"][0] if row.get("keys") else "Unknown",
                    "clicks": row.get("clicks", 0),
                    "impressions": row.get("impressions", 0),
                    "ctr": round((row.get("clicks", 0) / row.get("impressions", 1)) * 100, 2),
                    "position": round(row.get("position", 0), 1)
                }
                for row in top_queries
            ],
            "top_pages": [
                {
                    "page": page,
                    "clicks": data["clicks"],
                    "impressions": data["impressions"],
                    "ctr": round((data["clicks"] / data["impressions"]) * 100, 2) if data["impressions"] > 0 else 0,
                    "unique_queries": len(data["queries"])
                }
                for page, data in top_pages
            ],
            "device_performance": device_performance
        }
    
    async def bulk_submit_urls(self, urls: List[str], 
                             search_engines: List[str] = None) -> Dict[str, Any]:
        """Submit multiple URLs to search engines"""
        
        if not search_engines:
            search_engines = ["google", "bing"]
        
        results = {
            "total_urls": len(urls),
            "submitted_at": datetime.utcnow().isoformat(),
            "results": {}
        }
        
        for search_engine in search_engines:
            results["results"][search_engine] = {
                "success": 0,
                "failed": 0,
                "details": []
            }
        
        for url in urls:
            for search_engine in search_engines:
                try:
                    if search_engine == "google":
                        result = await self.submit_url_to_google(url)
                    elif search_engine == "bing":
                        result = await self.submit_url_to_bing(url)
                    else:
                        result = {"status": "error", "message": "Unsupported search engine"}
                    
                    if result["status"] == "success":
                        results["results"][search_engine]["success"] += 1
                    else:
                        results["results"][search_engine]["failed"] += 1
                    
                    results["results"][search_engine]["details"].append({
                        "url": url,
                        "status": result["status"],
                        "message": result.get("message", "")
                    })
                    
                    # Rate limiting - wait between submissions
                    await asyncio.sleep(1)
                
                except Exception as e:
                    results["results"][search_engine]["failed"] += 1
                    results["results"][search_engine]["details"].append({
                        "url": url,
                        "status": "error",
                        "message": str(e)
                    })
        
        return results
    
    async def get_submission_history(self, search_engine: Optional[str] = None,
                                   days: int = 30) -> Dict[str, Any]:
        """Get submission history"""
        
        query = {
            "submitted_at": {
                "$gte": datetime.utcnow() - timedelta(days=days)
            }
        }
        
        if search_engine:
            query["search_engine"] = search_engine
        
        submissions = await self.db.search_engine_submissions.find(query).sort(
            "submitted_at", -1
        ).to_list(length=None)
        
        # Calculate statistics
        total_submissions = len(submissions)
        successful_submissions = len([s for s in submissions if s.get("status") == "success"])
        
        # Group by search engine
        by_search_engine = {}
        for submission in submissions:
            engine = submission.get("search_engine", "unknown")
            if engine not in by_search_engine:
                by_search_engine[engine] = {"total": 0, "success": 0}
            
            by_search_engine[engine]["total"] += 1
            if submission.get("status") == "success":
                by_search_engine[engine]["success"] += 1
        
        # Group by date
        by_date = {}
        for submission in submissions:
            date_str = submission["submitted_at"].strftime("%Y-%m-%d")
            if date_str not in by_date:
                by_date[date_str] = {"total": 0, "success": 0}
            
            by_date[date_str]["total"] += 1
            if submission.get("status") == "success":
                by_date[date_str]["success"] += 1
        
        return {
            "period": f"Last {days} days",
            "summary": {
                "total_submissions": total_submissions,
                "successful_submissions": successful_submissions,
                "success_rate": round((successful_submissions / total_submissions) * 100, 1) if total_submissions > 0 else 0
            },
            "by_search_engine": by_search_engine,
            "daily_breakdown": dict(sorted(by_date.items())),
            "recent_submissions": [
                {
                    "url": s.get("url", s.get("sitemap_url", "")),
                    "search_engine": s.get("search_engine"),
                    "status": s.get("status"),
                    "submitted_at": s["submitted_at"].isoformat(),
                    "type": s.get("type", "url")
                }
                for s in submissions[:20]  # Last 20 submissions
            ]
        }