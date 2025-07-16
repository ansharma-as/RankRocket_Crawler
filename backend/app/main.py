from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.core.database import init_db
from app.routers import crawl, reports, advanced, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database with error handling
    try:
        await init_db()
    except Exception as e:
        print(f"⚠️ Warning: Database initialization failed: {e}")
        print("📡 Server will start but database features may not work")
    
    yield
    
    # Cleanup on shutdown
    try:
        from app.core.database import close_db
        await close_db()
        print("🔄 Database connections closed")
    except Exception as e:
        print(f"⚠️ Warning during cleanup: {e}")


app = FastAPI(
    title="RankRocket API",
    description="Web app that enhances website indexing on search engines",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=settings.ALLOWED_ORIGINS,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(crawl.router, prefix="/api/v1", tags=["crawl"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])
app.include_router(advanced.router, prefix="/api/v1/advanced", tags=["advanced"])


@app.get("/")
async def root():
    return {"message": "RankRocket API is running"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )