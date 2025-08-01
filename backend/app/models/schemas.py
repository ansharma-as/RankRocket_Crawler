from pydantic import BaseModel, Field, HttpUrl, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from enum import Enum


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.no_info_before_validator_function(
            cls.validate,
            core_schema.str_schema(),
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return str(v)  # Convert ObjectId to string
        if isinstance(v, str):
            if ObjectId.is_valid(v):
                return v  # Return string as-is if valid ObjectId string
            else:
                raise ValueError("Invalid ObjectId string")
        raise ValueError("Invalid ObjectId")


class CrawlStatus(str, Enum):
    PENDING = "pending"
    CRAWLING = "crawling"
    COMPLETED = "completed"
    FAILED = "failed"


class URLSubmission(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    url: str
    user_id: str
    status: CrawlStatus = CrawlStatus.PENDING
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    
    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str},
        "arbitrary_types_allowed": True
    }


class SEOMetrics(BaseModel):
    title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    h1_tags: List[str] = []
    h2_tags: List[str] = []
    h3_tags: List[str] = []
    internal_links: List[str] = []
    external_links: List[str] = []
    images: List[Dict[str, str]] = []
    page_size: Optional[int] = None
    load_time: Optional[float] = None
    status_code: Optional[int] = None
    structured_data: List[Dict[str, Any]] = []
    og_tags: Dict[str, str] = {}
    twitter_cards: Dict[str, str] = {}
    performance_metrics: Dict[str, Any] = {}
    accessibility_score: Optional[float] = None
    mobile_friendly: Optional[bool] = None
    core_web_vitals: Dict[str, float] = {}
    content_analysis: Dict[str, Any] = {}
    keyword_density: Dict[str, float] = {}
    readability_score: Optional[float] = None
    ssl_info: Dict[str, Any] = {}
    robots_txt_info: Dict[str, Any] = {}
    sitemap_info: Dict[str, Any] = {}


class CrawlResult(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    url_submission_id: str
    user_id: str
    url: str
    seo_metrics: SEOMetrics
    raw_html: Optional[str] = None
    crawled_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str},
        "arbitrary_types_allowed": True
    }


class RecommendationType(str, Enum):
    TITLE = "title"
    META_DESCRIPTION = "meta_description"
    HEADINGS = "headings"
    LINKS = "links"
    IMAGES = "images"
    PERFORMANCE = "performance"


class Recommendation(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    crawl_result_id: str
    user_id: str
    type: RecommendationType
    priority: str  # high, medium, low
    title: str
    description: str
    current_value: Optional[str] = None
    suggested_value: Optional[str] = None
    impact_score: Optional[float] = None
    
    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str},
        "arbitrary_types_allowed": True
    }


class URLSubmissionCreate(BaseModel):
    url: HttpUrl


class CrawlResponse(BaseModel):
    submission_id: str
    url: str
    status: CrawlStatus
    message: str


# Authentication Models
class AuthProvider(str, Enum):
    EMAIL = "email"
    GOOGLE = "google"


class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    hashed_password: Optional[str] = None
    full_name: str
    is_active: bool = True
    is_verified: bool = False
    auth_provider: AuthProvider = AuthProvider.EMAIL
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str},
        "arbitrary_types_allowed": True
    }


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    is_active: bool
    is_verified: bool
    auth_provider: AuthProvider
    profile_picture: Optional[str] = None
    created_at: datetime


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None


class RefreshToken(BaseModel):
    refresh_token: str


class PasswordReset(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class EmailVerification(BaseModel):
    token: str


class GoogleOAuthData(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = None
    google_id: str