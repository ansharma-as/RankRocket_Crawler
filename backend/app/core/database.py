from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = None
database = None


async def init_db():
    global client, database
    try:
        print(f"🔗 Connecting to MongoDB at {settings.MONGODB_URL}")
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        database = client[settings.DATABASE_NAME]
        
        # Test the connection
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB database: {settings.DATABASE_NAME}")
        
        # Create indexes for optimal performance
        await create_indexes()
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("💡 Make sure MongoDB is running and the connection URL is correct")
        # Don't fail completely, let the app start but warn about DB issues


async def get_database():
    return database


async def create_indexes():
    """Create database indexes for optimal performance."""
    if database is None:
        return
    
    try:
        # User collection indexes
        await database.users.create_index("email", unique=True)
        await database.users.create_index("google_id", unique=True, sparse=True)
        
        # URL submission indexes
        await database.url_submissions.create_index([("user_id", 1), ("submitted_at", -1)])
        await database.url_submissions.create_index("url")
        
        # Crawl results indexes
        await database.crawl_results.create_index([("user_id", 1), ("crawled_at", -1)])
        await database.crawl_results.create_index("url_submission_id")
        await database.crawl_results.create_index("url")
        
        # Recommendations indexes
        await database.recommendations.create_index([("user_id", 1), ("crawl_result_id", 1)])
        await database.recommendations.create_index("priority")
        
        print("✅ Database indexes created successfully")
        
    except Exception as e:
        print(f"⚠️ Warning: Could not create some database indexes: {e}")
        # Don't fail startup if indexes can't be created


async def close_db():
    if client:
        client.close()