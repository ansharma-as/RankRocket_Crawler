from fastapi import APIRouter, HTTPException, Depends
from app.core.database import get_database
from app.services.ml_analyzer import MLAnalyzer
from bson import ObjectId
from typing import Optional

router = APIRouter()


@router.get("/report/{submission_id}")
async def get_report(submission_id: str, db=Depends(get_database)):
    try:
        if not ObjectId.is_valid(submission_id):
            raise HTTPException(status_code=400, detail="Invalid submission ID")
        
        # Get crawl result
        crawl_result = await db.crawl_results.find_one(
            {"url_submission_id": submission_id}
        )
        
        if not crawl_result:
            raise HTTPException(status_code=404, detail="Crawl result not found")
        
        # Get recommendations
        recommendations = await db.recommendations.find(
            {"crawl_result_id": str(crawl_result["_id"])}
        ).to_list(length=None)
        
        # Convert ObjectIds to strings for JSON serialization
        def convert_objectids(obj):
            if isinstance(obj, ObjectId):
                return str(obj)
            elif isinstance(obj, dict):
                return {k: convert_objectids(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_objectids(item) for item in obj]
            return obj
        
        return {
            "submission_id": submission_id,
            "url": crawl_result["url"],
            "seo_metrics": convert_objectids(crawl_result["seo_metrics"]),
            "recommendations": convert_objectids(recommendations),
            "crawled_at": crawl_result["crawled_at"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reports")
async def get_all_reports(
    skip: int = 0,
    limit: int = 10,
    db=Depends(get_database)
):
    try:
        # Get recent crawl results
        crawl_results = await db.crawl_results.find().sort(
            "crawled_at", -1
        ).skip(skip).limit(limit).to_list(length=None)
        
        # Convert ObjectIds to strings for JSON serialization
        def convert_objectids(obj):
            if isinstance(obj, ObjectId):
                return str(obj)
            elif isinstance(obj, dict):
                return {k: convert_objectids(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_objectids(item) for item in obj]
            return obj
        
        reports = []
        for result in crawl_results:
            recommendations_count = await db.recommendations.count_documents(
                {"crawl_result_id": str(result["_id"])}
            )
            
            reports.append({
                "submission_id": result["url_submission_id"],
                "url": result["url"],
                "crawled_at": result["crawled_at"],
                "recommendations_count": recommendations_count,
                "seo_score": result["seo_metrics"].get("seo_score", 0)
            })
        
        return {
            "reports": reports,
            "total": len(reports)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))