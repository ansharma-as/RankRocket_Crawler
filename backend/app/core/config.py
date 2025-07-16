from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "RankRocket"
    API_V1_STR: str = "/api/v1"
    
    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "rankrocket"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # Crawler settings
    MAX_CONCURRENT_CRAWLS: int = 10
    CRAWL_TIMEOUT: int = 30
    USER_AGENT: str = "RankRocket/1.0 (+https://rankrocket.com)"
    
    # Background tasks
    REDIS_URL: str = "redis://localhost:6379"
    
    # Authentication
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"
    
    # Email settings
    EMAIL_HOST: str = "smtp.gmail.com"
    EMAIL_PORT: int = 587
    EMAIL_USERNAME: str = ""
    EMAIL_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@rankrocket.com"
    
    # API Keys
    GOOGLE_ANALYTICS_API_KEY: str = ""
    GOOGLE_SEARCH_CONSOLE_API_KEY: str = ""
    BING_WEBMASTER_API_KEY: str = ""
    PROXY_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()