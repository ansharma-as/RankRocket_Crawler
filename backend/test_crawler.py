import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.services.crawler import CrawlerService

async def test_crawler():
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        db = client['rankrocket']
        
        # Create crawler service
        crawler = CrawlerService(db)
        
        # Test crawl
        print("Starting test crawl...")
        await crawler.crawl_url("test_id", "https://example.com")
        print("Test crawl completed!")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_crawler())