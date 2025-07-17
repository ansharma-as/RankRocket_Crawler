from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

from app.services.auth_service import auth_service
from app.models.schemas import User, TokenData

# HTTP Bearer token security scheme
security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> User:
    """
    Get the current authenticated user from JWT token.
    Raises 401 if not authenticated.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    print(f"🔍 Debug: get_current_user called with credentials: {credentials}")
    
    if not credentials:
        print(f"🔍 Debug: No credentials provided")
        raise credentials_exception
    
    print(f"🔍 Debug: Verifying token: {credentials.credentials[:50]}...")
    token_data = auth_service.verify_token(credentials.credentials)
    if token_data is None:
        print(f"🔍 Debug: Token verification failed")
        raise credentials_exception
    
    print(f"🔍 Debug: Token verified, getting user by ID: {token_data.user_id}")
    user = await auth_service.get_user_by_id(token_data.user_id)
    if user is None:
        print(f"🔍 Debug: User not found for ID: {token_data.user_id}")
        raise credentials_exception
    
    print(f"🔍 Debug: Authentication successful for user: {user.email}")
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Get the current authenticated and active user.
    Raises 400 if user is inactive.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )
    return current_user

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[User]:
    """
    Get the current user if authenticated, otherwise return None.
    This is for endpoints that work both with and without authentication.
    """
    if not credentials:
        return None
    
    token_data = auth_service.verify_token(credentials.credentials)
    if token_data is None:
        return None
    
    user = await auth_service.get_user_by_id(token_data.user_id)
    return user

async def get_current_verified_user(current_user: User = Depends(get_current_active_user)) -> User:
    """
    Get the current authenticated, active, and verified user.
    Raises 400 if user is not verified.
    """
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not verified"
        )
    return current_user