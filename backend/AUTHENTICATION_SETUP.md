# RankRocket Authentication System Setup Guide

## 🚀 Overview

RankRocket now includes a comprehensive authentication system with JWT tokens, user registration/login, and Google OAuth integration. All SEO analysis data is now user-specific and secure.

## 📋 Prerequisites

1. **Python 3.11+** installed
2. **MongoDB** running (local or cloud)
3. **Redis** running (for background tasks)
4. **Google Cloud Console** account (for OAuth)

## ⚙️ Installation Steps

### 1. Install Dependencies

```bash
cd /Users/strontium/Desktop/RankRocket/backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configurations:

**Required Settings:**
```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=rankrocket

# JWT Authentication
JWT_SECRET_KEY=your-super-secret-key-at-least-32-characters-long
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Optional Settings:**
```env
# Google OAuth (optional but recommended)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Email (for verification and password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@rankrocket.com
```

### 3. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:8000/auth/google/callback`
5. Copy Client ID and Client Secret to your `.env` file

### 4. Database Setup

Start MongoDB and Redis:
```bash
# MongoDB (if using local installation)
mongod

# Redis (if using local installation)
redis-server
```

The application will automatically create database indexes on startup.

## 🧪 Testing the Setup

Run the authentication test script:
```bash
python test_auth.py
```

This will test:
- Password hashing
- User creation
- User login
- Token generation and verification
- Token refresh

## 🚀 Starting the Server

```bash
# Development mode
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/profile` | Update user profile |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Handle OAuth callback |
| POST | `/auth/logout` | User logout |

### Protected Endpoints

All existing SEO endpoints now require authentication:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/submit-url` | Submit URL for analysis |
| GET | `/api/v1/crawl-status/{id}` | Check crawl status |
| GET | `/api/v1/report/{id}` | Get SEO report |
| GET | `/api/v1/reports` | List user's reports |

## 🔐 Security Features

- **JWT Tokens**: Secure access and refresh tokens
- **Password Hashing**: Bcrypt with salt
- **Input Validation**: Pydantic models with validation
- **Rate Limiting**: Built-in protection
- **User Isolation**: All data filtered by user ID
- **OAuth Integration**: Secure Google authentication

## 📊 Data Migration

Existing data without user IDs will need to be migrated. The system now requires:
- All `url_submissions` to have a `user_id`
- All `crawl_results` to have a `user_id`
- All `recommendations` to have a `user_id`

## 🔧 Frontend Integration

Update your frontend to:

1. **Add authentication headers**:
```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

2. **Handle token refresh**:
```javascript
if (response.status === 401) {
  // Refresh token and retry
}
```

3. **Implement login/signup forms**
4. **Add Google OAuth button**
5. **Protect authenticated routes**

## 🐛 Troubleshooting

### Common Issues

1. **ModuleNotFoundError**: Install dependencies with `pip install -r requirements.txt`
2. **Database connection**: Ensure MongoDB is running on correct port
3. **JWT errors**: Check JWT_SECRET_KEY is set and secure
4. **Google OAuth errors**: Verify client ID/secret and redirect URI

### Debug Mode

Set environment variable for debug logging:
```bash
export LOG_LEVEL=DEBUG
```

## 📈 Performance Considerations

- Database indexes are automatically created for optimal performance
- JWT tokens are stateless for scalability
- User data is efficiently filtered with MongoDB indexes
- Background crawling maintains separation per user

## 🔒 Security Best Practices

1. **Strong JWT Secret**: Use at least 32 characters
2. **HTTPS in Production**: Never use HTTP for authentication
3. **Token Expiration**: Keep access tokens short-lived
4. **Regular Updates**: Keep dependencies updated
5. **Input Validation**: All inputs are validated server-side

## 📞 Support

For issues or questions:
1. Check the error logs
2. Run the test script to verify setup
3. Ensure all environment variables are set correctly
4. Check database connectivity

---

🎉 **Your RankRocket backend is now secured with enterprise-grade authentication!**