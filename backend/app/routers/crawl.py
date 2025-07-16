from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from app.models.schemas import URLSubmissionCreate, CrawlResponse, URLSubmission, User
from app.services.crawler import CrawlerService
from app.core.database import get_database
from app.core.security import get_current_active_user
from bson import ObjectId

router = APIRouter()


@router.post("/submit-url", response_model=CrawlResponse)
async def submit_url(
    url_data: URLSubmissionCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db=Depends(get_database)
):
    try:
        # Validate and convert URL to string
        url_str = str(url_data.url)
        
        # Create URL submission with user_id
        submission = URLSubmission(url=url_str, user_id=str(current_user.id))
        
        # Insert into database
        result = await db.url_submissions.insert_one(submission.model_dump(by_alias=True, exclude={"id"}))
        submission_id = str(result.inserted_id)
        
        # Start background crawl task
        crawler_service = CrawlerService(db)
        background_tasks.add_task(
            crawler_service.crawl_url,
            submission_id,
            url_str
        )
        
        return CrawlResponse(
            submission_id=submission_id,
            url=url_str,
            status="pending",
            message="URL submitted for crawling"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/crawl-status/{submission_id}")
async def get_crawl_status(
    submission_id: str,
    current_user: User = Depends(get_current_active_user),
    db=Depends(get_database)
):
    try:
        if not ObjectId.is_valid(submission_id):
            raise HTTPException(status_code=400, detail="Invalid submission ID")
        
        submission = await db.url_submissions.find_one(
            {"_id": ObjectId(submission_id), "user_id": str(current_user.id)}
        )
        
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        return {
            "submission_id": submission_id,
            "url": submission["url"],
            "status": submission["status"],
            "submitted_at": submission["submitted_at"],
            "completed_at": submission.get("completed_at"),
            "error_message": submission.get("error_message")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))