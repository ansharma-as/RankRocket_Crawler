import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from enum import Enum
import json
from bson import ObjectId

from app.models.schemas import CrawlStatus
from app.services.crawler import CrawlerService
from app.core.config import settings


class CrawlPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class CrawlFrequency(str, Enum):
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"


class CrawlScheduler:
    def __init__(self, db):
        self.db = db
        self.crawler_service = CrawlerService(db)
        self.running = False
        self.scheduled_tasks = {}
        self.priority_queue = asyncio.PriorityQueue()
        
    async def start(self):
        """Start the scheduler"""
        self.running = True
        await asyncio.gather(
            self._schedule_worker(),
            self._queue_processor()
        )
    
    async def stop(self):
        """Stop the scheduler"""
        self.running = False
        for task in self.scheduled_tasks.values():
            task.cancel()
    
    async def _schedule_worker(self):
        """Main scheduling worker that checks for scheduled crawls"""
        while self.running:
            try:
                # Check for scheduled crawls
                await self._check_scheduled_crawls()
                
                # Check for recurring crawls
                await self._check_recurring_crawls()
                
                # Wait before next check
                await asyncio.sleep(60)  # Check every minute
                
            except Exception as e:
                logging.error(f"Error in schedule worker: {e}")
                await asyncio.sleep(60)
    
    async def _queue_processor(self):
        """Process crawl queue based on priority"""
        while self.running:
            try:
                # Get next item from priority queue
                priority, timestamp, crawl_data = await self.priority_queue.get()
                
                # Process the crawl
                await self._process_crawl(crawl_data)
                
                # Mark task as done
                self.priority_queue.task_done()
                
            except Exception as e:
                logging.error(f"Error in queue processor: {e}")
                await asyncio.sleep(5)
    
    async def schedule_crawl(self, url: str, priority: CrawlPriority = CrawlPriority.MEDIUM, 
                           scheduled_time: Optional[datetime] = None, 
                           frequency: Optional[CrawlFrequency] = None,
                           custom_interval: Optional[int] = None) -> str:
        """Schedule a crawl with priority and timing"""
        
        # Create scheduled crawl record
        scheduled_crawl = {
            "url": url,
            "priority": priority,
            "scheduled_time": scheduled_time or datetime.utcnow(),
            "frequency": frequency,
            "custom_interval": custom_interval,
            "status": "scheduled",
            "created_at": datetime.utcnow(),
            "last_crawled": None,
            "next_crawl": scheduled_time or datetime.utcnow()
        }
        
        result = await self.db.scheduled_crawls.insert_one(scheduled_crawl)
        schedule_id = str(result.inserted_id)
        
        # Add to priority queue if immediate
        if not scheduled_time or scheduled_time <= datetime.utcnow():
            await self._add_to_queue(schedule_id, priority, url)
        
        return schedule_id
    
    async def _add_to_queue(self, schedule_id: str, priority: CrawlPriority, url: str):
        """Add crawl to priority queue"""
        # Priority mapping (lower number = higher priority)
        priority_map = {
            CrawlPriority.URGENT: 1,
            CrawlPriority.HIGH: 2,
            CrawlPriority.MEDIUM: 3,
            CrawlPriority.LOW: 4
        }
        
        crawl_data = {
            "schedule_id": schedule_id,
            "url": url,
            "priority": priority
        }
        
        await self.priority_queue.put((
            priority_map[priority],
            datetime.utcnow().timestamp(),
            crawl_data
        ))
    
    async def _check_scheduled_crawls(self):
        """Check for scheduled crawls that are due"""
        current_time = datetime.utcnow()
        
        # Find scheduled crawls that are due
        due_crawls = await self.db.scheduled_crawls.find({
            "next_crawl": {"$lte": current_time},
            "status": "scheduled"
        }).to_list(length=None)
        
        for crawl in due_crawls:
            await self._add_to_queue(
                str(crawl["_id"]),
                CrawlPriority(crawl["priority"]),
                crawl["url"]
            )
    
    async def _check_recurring_crawls(self):
        """Check for recurring crawls that need to be scheduled"""
        current_time = datetime.utcnow()
        
        # Find recurring crawls
        recurring_crawls = await self.db.scheduled_crawls.find({
            "frequency": {"$ne": None},
            "next_crawl": {"$lte": current_time}
        }).to_list(length=None)
        
        for crawl in recurring_crawls:
            # Calculate next crawl time
            next_crawl_time = self._calculate_next_crawl_time(
                crawl["frequency"],
                crawl.get("custom_interval"),
                current_time
            )
            
            # Update next crawl time
            await self.db.scheduled_crawls.update_one(
                {"_id": crawl["_id"]},
                {"$set": {"next_crawl": next_crawl_time}}
            )
    
    def _calculate_next_crawl_time(self, frequency: str, custom_interval: Optional[int], 
                                 current_time: datetime) -> datetime:
        """Calculate next crawl time based on frequency"""
        if frequency == CrawlFrequency.HOURLY:
            return current_time + timedelta(hours=1)
        elif frequency == CrawlFrequency.DAILY:
            return current_time + timedelta(days=1)
        elif frequency == CrawlFrequency.WEEKLY:
            return current_time + timedelta(weeks=1)
        elif frequency == CrawlFrequency.MONTHLY:
            return current_time + timedelta(days=30)
        elif frequency == CrawlFrequency.CUSTOM and custom_interval:
            return current_time + timedelta(minutes=custom_interval)
        else:
            return current_time + timedelta(hours=1)  # Default to hourly
    
    async def _process_crawl(self, crawl_data: Dict):
        """Process a single crawl"""
        try:
            schedule_id = crawl_data["schedule_id"]
            url = crawl_data["url"]
            
            # Update status to processing
            await self.db.scheduled_crawls.update_one(
                {"_id": ObjectId(schedule_id)},
                {"$set": {"status": "processing", "last_crawled": datetime.utcnow()}}
            )
            
            # Create URL submission for tracking
            from app.models.schemas import URLSubmission
            submission = URLSubmission(url=url)
            
            result = await self.db.url_submissions.insert_one(submission.dict(by_alias=True))
            submission_id = str(result.inserted_id)
            
            # Perform the crawl
            await self.crawler_service.crawl_url(submission_id, url)
            
            # Update scheduled crawl status
            await self.db.scheduled_crawls.update_one(
                {"_id": ObjectId(schedule_id)},
                {"$set": {"status": "completed"}}
            )
            
        except Exception as e:
            # Update status to failed
            await self.db.scheduled_crawls.update_one(
                {"_id": ObjectId(schedule_id)},
                {"$set": {"status": "failed", "error": str(e)}}
            )
            logging.error(f"Error processing crawl {schedule_id}: {e}")
    
    async def get_scheduled_crawls(self, status: Optional[str] = None) -> List[Dict]:
        """Get scheduled crawls with optional status filter"""
        query = {}
        if status:
            query["status"] = status
        
        crawls = await self.db.scheduled_crawls.find(query).sort(
            "next_crawl", 1
        ).to_list(length=None)
        
        # Convert ObjectIds to strings
        for crawl in crawls:
            crawl["_id"] = str(crawl["_id"])
        
        return crawls
    
    async def update_crawl_priority(self, schedule_id: str, priority: CrawlPriority):
        """Update crawl priority"""
        await self.db.scheduled_crawls.update_one(
            {"_id": ObjectId(schedule_id)},
            {"$set": {"priority": priority}}
        )
    
    async def cancel_scheduled_crawl(self, schedule_id: str):
        """Cancel a scheduled crawl"""
        await self.db.scheduled_crawls.update_one(
            {"_id": ObjectId(schedule_id)},
            {"$set": {"status": "cancelled"}}
        )
    
    async def get_crawl_statistics(self) -> Dict:
        """Get crawl statistics"""
        pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        stats = await self.db.scheduled_crawls.aggregate(pipeline).to_list(length=None)
        
        # Convert to dict
        statistics = {stat["_id"]: stat["count"] for stat in stats}
        
        # Add queue size
        statistics["queue_size"] = self.priority_queue.qsize()
        
        return statistics
    
    async def bulk_schedule_crawls(self, urls: List[str], 
                                 priority: CrawlPriority = CrawlPriority.MEDIUM,
                                 frequency: Optional[CrawlFrequency] = None) -> List[str]:
        """Schedule multiple crawls in bulk"""
        schedule_ids = []
        
        for url in urls:
            schedule_id = await self.schedule_crawl(
                url=url,
                priority=priority,
                frequency=frequency
            )
            schedule_ids.append(schedule_id)
        
        return schedule_ids
    
    async def adaptive_scheduling(self, url: str) -> CrawlPriority:
        """Determine optimal crawl priority based on historical data"""
        # Get recent crawl results for this URL
        recent_crawls = await self.db.crawl_results.find({
            "url": url
        }).sort("crawled_at", -1).limit(5).to_list(length=None)
        
        if not recent_crawls:
            return CrawlPriority.MEDIUM
        
        # Analyze patterns
        changes_detected = 0
        total_crawls = len(recent_crawls)
        
        for i in range(1, total_crawls):
            prev_crawl = recent_crawls[i]
            curr_crawl = recent_crawls[i-1]
            
            # Simple change detection (compare title and meta description)
            if (prev_crawl["seo_metrics"].get("title") != curr_crawl["seo_metrics"].get("title") or
                prev_crawl["seo_metrics"].get("meta_description") != curr_crawl["seo_metrics"].get("meta_description")):
                changes_detected += 1
        
        # Determine priority based on change frequency
        change_rate = changes_detected / total_crawls if total_crawls > 0 else 0
        
        if change_rate > 0.6:
            return CrawlPriority.HIGH
        elif change_rate > 0.3:
            return CrawlPriority.MEDIUM
        else:
            return CrawlPriority.LOW