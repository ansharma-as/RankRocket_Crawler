from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from email_validator import validate_email, EmailNotValidError

from app.core.config import settings
from app.models.schemas import User, UserCreate, UserLogin, Token, TokenData, AuthProvider, GoogleOAuthData
from app.core.database import get_database

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def convert_objectid_for_pydantic(data):
    """Prepare MongoDB data for Pydantic model creation."""
    if data is None:
        return None
    
    # Make a copy to avoid modifying original data
    data = data.copy()
    
    # The PyObjectId field can handle ObjectId directly, no conversion needed
    # Just ensure the data is properly formatted for Pydantic
    print(f"🔍 Debug: Raw data from MongoDB: {data}")
    print(f"🔍 Debug: _id field type: {type(data.get('_id'))}, value: {data.get('_id')}")
    
    return data

class AuthService:
    def __init__(self):
        self.db = None
    
    async def get_db(self) -> AsyncIOMotorDatabase:
        if self.db is None:
            self.db = await get_database()
        return self.db
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against a hashed password."""
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Generate password hash."""
        return pwd_context.hash(password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt
    
    def create_refresh_token(self, data: dict) -> str:
        """Create JWT refresh token."""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str, token_type: str = "access") -> Optional[TokenData]:
        """Verify JWT token and return token data."""
        try:
            print(f"🔍 Debug: Verifying token: {token[:50]}...")
            print(f"🔍 Debug: Expected token type: {token_type}")
            print(f"🔍 Debug: JWT Secret Key: {settings.JWT_SECRET_KEY}")
            print(f"🔍 Debug: JWT Algorithm: {settings.JWT_ALGORITHM}")
            
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            print(f"🔍 Debug: Decoded payload: {payload}")
            
            # Check token type
            if payload.get("type") != token_type:
                print(f"🔍 Debug: Token type mismatch. Got: {payload.get('type')}, Expected: {token_type}")
                return None
            
            email: str = payload.get("sub")
            user_id: str = payload.get("user_id")
            
            print(f"🔍 Debug: Extracted email: {email}")
            print(f"🔍 Debug: Extracted user_id: {user_id}")
            
            if email is None or user_id is None:
                print(f"🔍 Debug: Missing email or user_id in token")
                return None
            
            token_data = TokenData(email=email, user_id=user_id)
            print(f"🔍 Debug: Token verification successful")
            return token_data
        except JWTError as e:
            print(f"🔍 Debug: JWT Error: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        db = await self.get_db()
        user_data = await db.users.find_one({"email": email})
        if user_data:
            user_data = convert_objectid_for_pydantic(user_data)
            return User(**user_data)
        return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        from bson import ObjectId
        db = await self.get_db()
        
        try:
            print(f"🔍 Debug: Looking for user with ID: {user_id}")
            user_data = await db.users.find_one({"_id": ObjectId(user_id)})
            print(f"🔍 Debug: Found user data: {user_data}")
            
            if user_data:
                user_data = convert_objectid_for_pydantic(user_data)
                user = User(**user_data)
                print(f"🔍 Debug: Created User object: {user}")
                return user
        except Exception as e:
            print(f"🔍 Debug: Error in get_user_by_id: {e}")
        return None
    
    async def get_user_by_google_id(self, google_id: str) -> Optional[User]:
        """Get user by Google ID."""
        db = await self.get_db()
        user_data = await db.users.find_one({"google_id": google_id})
        if user_data:
            user_data = convert_objectid_for_pydantic(user_data)
            return User(**user_data)
        return None
    
    async def create_user(self, user_create: UserCreate) -> User:
        """Create a new user."""
        # Validate email
        try:
            validate_email(user_create.email)
        except EmailNotValidError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email address"
            )
        
        # Check if user already exists
        existing_user = await self.get_user_by_email(user_create.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Validate password strength
        if len(user_create.password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters long"
            )
        
        # Create user
        hashed_password = self.get_password_hash(user_create.password)
        user = User(
            email=user_create.email,
            hashed_password=hashed_password,
            full_name=user_create.full_name,
            auth_provider=AuthProvider.EMAIL
        )
        
        db = await self.get_db()
        # Exclude None values to prevent issues with sparse indexes
        user_data = user.model_dump(by_alias=True, exclude={"id"}, exclude_none=True)
        result = await db.users.insert_one(user_data)
        user.id = str(result.inserted_id)  # Convert ObjectId to string
        
        return user
    
    async def create_google_user(self, google_data: GoogleOAuthData) -> User:
        """Create a new user from Google OAuth data."""
        # Check if user already exists by email
        existing_user = await self.get_user_by_email(google_data.email)
        if existing_user:
            # Link Google account to existing user
            if existing_user.auth_provider == AuthProvider.EMAIL:
                from bson import ObjectId
                db = await self.get_db()
                await db.users.update_one(
                    {"_id": ObjectId(existing_user.id)},
                    {
                        "$set": {
                            "google_id": google_data.google_id,
                            "profile_picture": google_data.picture,
                            "is_verified": True,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                existing_user.google_id = google_data.google_id
                existing_user.profile_picture = google_data.picture
                existing_user.is_verified = True
            return existing_user
        
        # Check if Google user already exists
        existing_google_user = await self.get_user_by_google_id(google_data.google_id)
        if existing_google_user:
            return existing_google_user
        
        # Create new Google user
        user = User(
            email=google_data.email,
            full_name=google_data.name,
            auth_provider=AuthProvider.GOOGLE,
            google_id=google_data.google_id,
            profile_picture=google_data.picture,
            is_verified=True
        )
        
        db = await self.get_db()
        result = await db.users.insert_one(user.model_dump(by_alias=True, exclude={"id"}))
        user.id = str(result.inserted_id)  # Convert ObjectId to string
        
        return user
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password."""
        user = await self.get_user_by_email(email)
        if not user:
            return None
        
        if not user.hashed_password:
            return None
        
        if not self.verify_password(password, user.hashed_password):
            return None
        
        return user
    
    async def login_user(self, user_login: UserLogin) -> Token:
        """Login user and return tokens."""
        user = await self.authenticate_user(user_login.email, user_login.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        # Create tokens
        token_data = {"sub": user.email, "user_id": str(user.id)}
        access_token = self.create_access_token(token_data)
        refresh_token = self.create_refresh_token(token_data)
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    
    async def login_google_user(self, google_data: GoogleOAuthData) -> Token:
        """Login or create user from Google OAuth and return tokens."""
        user = await self.create_google_user(google_data)
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        # Create tokens
        token_data = {"sub": user.email, "user_id": str(user.id)}
        access_token = self.create_access_token(token_data)
        refresh_token = self.create_refresh_token(token_data)
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    
    async def refresh_access_token(self, refresh_token: str) -> Token:
        """Refresh access token using refresh token."""
        token_data = self.verify_token(refresh_token, token_type="refresh")
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify user still exists and is active
        user = await self.get_user_by_id(token_data.user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create new tokens
        new_token_data = {"sub": user.email, "user_id": str(user.id)}
        access_token = self.create_access_token(new_token_data)
        new_refresh_token = self.create_refresh_token(new_token_data)
        
        return Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    
    async def update_user(self, user_id: str, update_data: dict) -> Optional[User]:
        """Update user data."""
        from bson import ObjectId
        db = await self.get_db()
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return await self.get_user_by_id(user_id)
        
        return None

# Create global auth service instance
auth_service = AuthService()