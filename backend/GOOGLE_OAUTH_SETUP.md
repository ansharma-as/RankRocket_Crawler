# Google OAuth Setup Guide

## Overview
Your RankRocket backend already has a complete Google OAuth implementation! This guide will help you configure it.

## 🏗️ Current Implementation Features

✅ **Complete OAuth Flow**: Login initiation and callback handling  
✅ **User Management**: Google user creation and account linking  
✅ **Security**: State parameter validation, proper error handling  
✅ **Token Management**: JWT access and refresh tokens  
✅ **Account Linking**: Existing email users can link Google accounts  

## 🔧 Setup Steps

### 1. Google Cloud Console Setup

1. **Create/Select a Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable APIs**
   - Go to "APIs & Services" → "Library"
   - Enable "Google+ API" or "People API"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Set authorized redirect URIs:
     - Development: `http://localhost:8000/auth/google/callback`
     - Production: `https://yourdomain.com/auth/google/callback`

4. **Copy Credentials**
   - Copy the Client ID and Client Secret

### 2. Environment Configuration

Update your `.env` file with the actual Google OAuth credentials:

```env
# Replace these placeholder values with your actual credentials
GOOGLE_CLIENT_ID=your-actual-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### 3. Testing the Implementation

## 📡 API Endpoints

### Initiate Google OAuth Login
```http
GET /auth/google
```

**Response:**
```json
{
  "auth_url": "https://accounts.google.com/o/oauth2/auth?client_id=...",
  "state": "secure-random-state-token"
}
```

### Google OAuth Callback (handled automatically)
```http
GET /auth/google/callback?code=...&state=...
```

**Response:**
```json
{
  "access_token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token",
  "user": {
    "id": "user-id",
    "email": "user@gmail.com",
    "full_name": "User Name",
    "auth_provider": "google",
    "google_id": "google-user-id"
  }
}
```

## 🔐 Security Features

- **State Parameter**: Prevents CSRF attacks
- **Secure Token Storage**: JWT tokens with proper expiration
- **Account Linking**: Safely links Google accounts to existing email users
- **Error Handling**: Comprehensive error responses
- **Scope Limitation**: Only requests necessary permissions (email, profile)

## 🧪 Test Commands

Once configured, test with:

```bash
# Test login initiation
curl -X GET "http://localhost:8000/auth/google"

# Response should contain auth_url and state
```

## 🔄 OAuth Flow

1. **Client** calls `/auth/google` to get authorization URL
2. **User** visits the authorization URL and grants permissions
3. **Google** redirects to `/auth/google/callback` with authorization code
4. **Backend** exchanges code for user info and creates/finds user
5. **Backend** returns JWT tokens for authenticated session

## 🚀 Frontend Integration

Your frontend should:

1. Call `/auth/google` to get the authorization URL
2. Redirect user to the authorization URL
3. Handle the callback (automatic if using popup/redirect)
4. Store the returned JWT tokens
5. Use tokens for authenticated API calls

## 🔧 Production Considerations

- Set `GOOGLE_REDIRECT_URI` to your production domain
- Use strong `JWT_SECRET_KEY`
- Configure proper CORS settings
- Enable HTTPS for production
- Consider rate limiting for OAuth endpoints