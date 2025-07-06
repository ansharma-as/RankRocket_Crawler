import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_database():
    try:
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        db = client['rankrocket']
        
        # Check submissions
        submissions = await db.url_submissions.find().to_list(length=None)
        print(f"Found {len(submissions)} submissions:")
        for sub in submissions:
            print(f"  - ID: {sub['_id']}, URL: {sub['url']}, Status: {sub['status']}")
        
        # Check crawl results
        results = await db.crawl_results.find().to_list(length=None)
        print(f"Found {len(results)} crawl results:")
        for result in results:
            print(f"  - ID: {result['_id']}, URL: {result['url']}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_database())