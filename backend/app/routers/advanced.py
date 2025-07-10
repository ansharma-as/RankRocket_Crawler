from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Optional
from app.core.database import get_database
from app.services.scheduler import CrawlScheduler, CrawlPriority, CrawlFrequency
from app.services.report_generator import ReportGenerator
from app.services.analytics_service import AnalyticsService
from app.services.indexing_service import IndexingService
from app.services.search_engine_service import SearchEngineService
from pydantic import BaseModel

router = APIRouter()


class ScheduleCrawlRequest(BaseModel):
    url: str
    priority: CrawlPriority = CrawlPriority.MEDIUM
    frequency: Optional[CrawlFrequency] = None
    custom_interval: Optional[int] = None


class BulkScheduleRequest(BaseModel):
    urls: List[str]
    priority: CrawlPriority = CrawlPriority.MEDIUM
    frequency: Optional[CrawlFrequency] = None


class ReportRequest(BaseModel):
    submission_id: str
    format_type: str = "json"  # json, pdf, excel, html


class SitemapRequest(BaseModel):
    domain: str
    include_images: bool = True
    include_videos: bool = False


class SearchEngineSubmissionRequest(BaseModel):
    urls: List[str]
    search_engines: List[str] = ["google", "bing"]


# Crawl Scheduling Endpoints
@router.post("/schedule-crawl")
async def schedule_crawl(
    request: ScheduleCrawlRequest,
    db=Depends(get_database)
):
    """Schedule a crawl with priority and frequency"""
    try:
        scheduler = CrawlScheduler(db)
        schedule_id = await scheduler.schedule_crawl(
            url=request.url,
            priority=request.priority,
            frequency=request.frequency,
            custom_interval=request.custom_interval
        )
        
        return {
            "schedule_id": schedule_id,
            "message": "Crawl scheduled successfully",
            "url": request.url,
            "priority": request.priority
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/bulk-schedule")
async def bulk_schedule_crawls(
    request: BulkScheduleRequest,
    db=Depends(get_database)
):
    """Schedule multiple crawls in bulk"""
    try:
        scheduler = CrawlScheduler(db)
        schedule_ids = await scheduler.bulk_schedule_crawls(
            urls=request.urls,
            priority=request.priority,
            frequency=request.frequency
        )
        
        return {
            "schedule_ids": schedule_ids,
            "total_scheduled": len(schedule_ids),
            "message": "Crawls scheduled successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/scheduled-crawls")
async def get_scheduled_crawls(
    status: Optional[str] = None,
    db=Depends(get_database)
):
    """Get scheduled crawls with optional status filter"""
    try:
        scheduler = CrawlScheduler(db)
        crawls = await scheduler.get_scheduled_crawls(status)
        
        return {
            "scheduled_crawls": crawls,
            "total": len(crawls)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/crawl-statistics")
async def get_crawl_statistics(db=Depends(get_database)):
    """Get crawl queue and processing statistics"""
    try:
        scheduler = CrawlScheduler(db)
        stats = await scheduler.get_crawl_statistics()
        
        return stats
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Advanced Reporting Endpoints
@router.post("/generate-report")
async def generate_comprehensive_report(
    request: ReportRequest,
    db=Depends(get_database)
):
    """Generate comprehensive SEO report in various formats"""
    try:
        report_generator = ReportGenerator(db)
        report = await report_generator.generate_comprehensive_report(
            submission_id=request.submission_id,
            format_type=request.format_type
        )
        
        return report
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Analytics Endpoints
@router.get("/analytics/trends")
async def get_seo_trends(
    url: Optional[str] = None,
    days: int = 30,
    db=Depends(get_database)
):
    """Get SEO performance trends"""
    try:
        analytics = AnalyticsService(db)
        trends = await analytics.generate_seo_trends(url=url, days=days)
        
        return trends
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class DomainComparisonRequest(BaseModel):
    urls: List[str]

@router.post("/analytics/compare")
async def compare_domains(
    request: DomainComparisonRequest,
    db=Depends(get_database)
):
    """Compare SEO performance across multiple domains"""
    try:
        analytics = AnalyticsService(db)
        comparison = await analytics.generate_domain_comparison(request.urls)
        
        return comparison
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/keywords/{url:path}")
async def analyze_keywords(
    url: str,
    db=Depends(get_database)
):
    """Analyze keyword performance for a URL"""
    try:
        analytics = AnalyticsService(db)
        keyword_analysis = await analytics.generate_keyword_analysis(url)
        
        return keyword_analysis
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/dashboard")
async def get_performance_dashboard(db=Depends(get_database)):
    """Get overall performance dashboard"""
    try:
        analytics = AnalyticsService(db)
        dashboard = await analytics.generate_performance_dashboard()
        
        return dashboard
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Indexing Support Endpoints
@router.post("/generate-sitemap")
async def generate_sitemap(
    request: SitemapRequest,
    db=Depends(get_database)
):
    """Generate XML sitemap for a domain"""
    try:
        indexing_service = IndexingService(db)
        sitemap = await indexing_service.generate_sitemap(
            domain=request.domain,
            include_images=request.include_images,
            include_videos=request.include_videos
        )
        
        return sitemap
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-robots-txt")
async def generate_robots_txt(
    domain: str,
    sitemap_urls: Optional[List[str]] = None,
    db=Depends(get_database)
):
    """Generate robots.txt file for a domain"""
    try:
        indexing_service = IndexingService(db)
        robots = await indexing_service.generate_robots_txt(
            domain=domain,
            sitemap_urls=sitemap_urls
        )
        
        return robots
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/internal-linking/{domain}")
async def analyze_internal_linking(
    domain: str,
    db=Depends(get_database)
):
    """Analyze and optimize internal linking structure"""
    try:
        indexing_service = IndexingService(db)
        analysis = await indexing_service.optimize_internal_linking(domain)
        
        return analysis
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/check-indexing-status")
async def check_indexing_status(
    urls: List[str],
    db=Depends(get_database)
):
    """Check indexing status of URLs in search engines"""
    try:
        indexing_service = IndexingService(db)
        status = await indexing_service.check_indexing_status(urls)
        
        return status
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Search Engine Submission Endpoints
@router.post("/submit-to-search-engines")
async def submit_urls_to_search_engines(
    request: SearchEngineSubmissionRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_database)
):
    """Submit URLs to search engines for indexing"""
    try:
        search_engine_service = SearchEngineService(db)
        
        # Run bulk submission in background
        background_tasks.add_task(
            search_engine_service.bulk_submit_urls,
            request.urls,
            request.search_engines
        )
        
        return {
            "message": "URL submission started",
            "urls_count": len(request.urls),
            "search_engines": request.search_engines
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/submit-sitemap")
async def submit_sitemap_to_search_engines(
    sitemap_url: str,
    site_url: str,
    search_engines: List[str] = ["google", "bing"],
    db=Depends(get_database)
):
    """Submit sitemap to search engines"""
    try:
        search_engine_service = SearchEngineService(db)
        results = {}
        
        for engine in search_engines:
            if engine == "google":
                result = await search_engine_service.submit_sitemap_to_google(
                    sitemap_url, site_url
                )
            elif engine == "bing":
                result = await search_engine_service.submit_sitemap_to_bing(
                    sitemap_url, site_url
                )
            else:
                result = {"status": "error", "message": "Unsupported search engine"}
            
            results[engine] = result
        
        return {
            "sitemap_url": sitemap_url,
            "site_url": site_url,
            "results": results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search-performance/{site_url:path}")
async def get_search_performance(
    site_url: str,
    days: int = 30,
    db=Depends(get_database)
):
    """Get search performance data from Google Search Console"""
    try:
        search_engine_service = SearchEngineService(db)
        performance = await search_engine_service.get_search_performance_data(
            site_url=site_url,
            start_date=None,
            end_date=None
        )
        
        return performance
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/submission-history")
async def get_submission_history(
    search_engine: Optional[str] = None,
    days: int = 30,
    db=Depends(get_database)
):
    """Get search engine submission history"""
    try:
        search_engine_service = SearchEngineService(db)
        history = await search_engine_service.get_submission_history(
            search_engine=search_engine,
            days=days
        )
        
        return history
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/indexing-status/{url:path}")
async def check_google_indexing_status(
    url: str,
    db=Depends(get_database)
):
    """Check indexing status in Google Search Console"""
    try:
        search_engine_service = SearchEngineService(db)
        status = await search_engine_service.check_indexing_status_google(url)
        
        return status
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))