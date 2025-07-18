from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPAuthorizationCredentials
from typing import Dict, Any
import httpx
import secrets
import urllib.parse

from app.services.auth_service import auth_service
from app.core.security import get_current_active_user, security
from app.core.config import settings
from app.models.schemas import (
    UserCreate, UserLogin, UserResponse, UserUpdate, Token, RefreshToken,
    PasswordReset, PasswordResetConfirm, EmailVerification, GoogleOAuthData,
    User
)

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_create: UserCreate):
    """Register a new user with email and password."""
    user = await auth_service.create_user(user_create)
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        auth_provider=user.auth_provider,
        profile_picture=user.profile_picture,
        created_at=user.created_at
    )

@router.post("/login", response_model=Token)
async def login(user_login: UserLogin):
    """Login with email and password."""
    return await auth_service.login_user(user_login)

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_data: RefreshToken):
    """Refresh access token using refresh token."""
    return await auth_service.refresh_access_token(refresh_data.refresh_token)

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile."""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        auth_provider=current_user.auth_provider,
        profile_picture=current_user.profile_picture,
        created_at=current_user.created_at
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update user profile."""
    update_data = user_update.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided for update"
        )
    
    updated_user = await auth_service.update_user(str(current_user.id), update_data)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update user"
        )
    
    return UserResponse(
        id=str(updated_user.id),
        email=updated_user.email,
        full_name=updated_user.full_name,
        is_active=updated_user.is_active,
        is_verified=updated_user.is_verified,
        auth_provider=updated_user.auth_provider,
        profile_picture=updated_user.profile_picture,
        created_at=updated_user.created_at
    )

@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Logout user (client should discard tokens)."""
    # In a production environment, you might want to blacklist the token
    # For now, we'll just return a success message
    return {"message": "Successfully logged out"}

# Google OAuth endpoints
@router.get("/google")
async def google_auth():
    """Initiate Google OAuth flow."""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    # Generate state parameter for security
    state = secrets.token_urlsafe(32)
    
    # Google OAuth URL
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={urllib.parse.quote(settings.GOOGLE_REDIRECT_URI)}&"
        "scope=openid+email+profile&"
        "response_type=code&"
        "access_type=offline&"
        f"state={state}"
    )
    
    return {
        "auth_url": google_auth_url,
        "state": state
    }

@router.get("/google/callback")
async def google_callback(code: str, state: str = None):
    """Handle Google OAuth callback."""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                }
            )
            
            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to exchange code for token"
                )
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No access token received"
                )
            
            # Get user info from Google
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to get user info from Google"
                )
            
            user_info = user_response.json()
            
            # Create GoogleOAuthData
            google_data = GoogleOAuthData(
                email=user_info["email"],
                name=user_info["name"],
                picture=user_info.get("picture"),
                google_id=user_info["id"]
            )
            
            # Login or create user
            tokens = await auth_service.login_google_user(google_data)
            
            # Redirect to frontend with tokens
            from fastapi.responses import RedirectResponse
            import urllib.parse
            
            # Create redirect URL with tokens
            frontend_url = "https://rank-rocket-crawler.vercel.app/auth"
            redirect_url = f"{frontend_url}?success=true&access_token={tokens.access_token}&refresh_token={tokens.refresh_token}&expires_in={tokens.expires_in}"
            
            return RedirectResponse(url=redirect_url, status_code=302)
            
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Network error during Google OAuth: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during Google OAuth: {str(e)}"
        )

# Email verification endpoints
@router.post("/verify-email")
async def verify_email(verification: EmailVerification):
    """Verify email address with token."""
    # TODO: Implement email verification logic
    # This would involve:
    # 1. Validating the verification token
    # 2. Updating user's is_verified status
    # 3. Returning success response
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Email verification not yet implemented"
    )

@router.post("/resend-verification")
async def resend_verification(current_user: User = Depends(get_current_active_user)):
    """Resend email verification."""
    if current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # TODO: Implement email sending logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Email verification not yet implemented"
    )

# Password reset endpoints
@router.post("/forgot-password")
async def forgot_password(password_reset: PasswordReset):
    """Request password reset."""
    # TODO: Implement password reset email logic
    # This would involve:
    # 1. Generating a reset token
    # 2. Sending reset email
    # 3. Storing token in database
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Password reset not yet implemented"
    )

@router.post("/reset-password")
async def reset_password(reset_data: PasswordResetConfirm):
    """Reset password with token."""
    # TODO: Implement password reset logic
    # This would involve:
    # 1. Validating the reset token
    # 2. Updating user's password
    # 3. Invalidating the reset token
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Password reset not yet implemented"
    )

@router.get("/health")
async def auth_health_check():
    """Health check for auth service."""
    return {
        "status": "healthy",
        "service": "authentication",
        "google_oauth_configured": bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET)
    }