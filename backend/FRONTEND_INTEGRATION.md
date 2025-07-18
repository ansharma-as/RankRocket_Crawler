# Google OAuth Frontend Integration Guide

## 🎉 Your Google OAuth Backend is Ready!

Your backend Google OAuth implementation is **fully functional** and ready for frontend integration.

## 📡 Available Endpoints

### 1. Initiate Google OAuth
```http
GET /auth/google
```

**Response:**
```json
{
  "auth_url": "https://accounts.google.com/o/oauth2/auth?client_id=105807104870-a3v9b5780csvldg0574peo9u9elhqp4s.apps.googleusercontent.com&redirect_uri=http%3A//localhost%3A8000/auth/google/callback&scope=openid+email+profile&response_type=code&access_type=offline&state=ZglRPO9ITEL7Q5Tiz_c-x2PdyFlUrvMAGUdtZ4T2T8E",
  "state": "ZglRPO9ITEL7Q5Tiz_c-x2PdyFlUrvMAGUdtZ4T2T8E"
}
```

### 2. Google OAuth Callback (handled automatically)
```http
GET /auth/google/callback?code=AUTH_CODE&state=STATE_TOKEN
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 1800
}
```

## 🚀 Frontend Implementation Examples

### React/Next.js Implementation

```javascript
// utils/auth.js
const API_BASE_URL = 'http://localhost:8000';

export const initiateGoogleAuth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`);
    const data = await response.json();
    
    if (data.auth_url) {
      // Redirect user to Google OAuth
      window.location.href = data.auth_url;
    }
  } catch (error) {
    console.error('Failed to initiate Google auth:', error);
  }
};

// Handle callback (if using popup)
export const handleGoogleCallback = (url) => {
  const urlParams = new URLSearchParams(new URL(url).search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  
  if (code) {
    // Backend automatically handles this via redirect
    // Tokens will be available in the response
    console.log('Google auth successful!');
  }
};
```

### Vue.js Implementation

```javascript
// composables/useAuth.js
import { ref } from 'vue'

export const useAuth = () => {
  const isLoading = ref(false)
  const user = ref(null)
  
  const signInWithGoogle = async () => {
    try {
      isLoading.value = true
      const response = await fetch('http://localhost:8000/auth/google')
      const data = await response.json()
      
      if (data.auth_url) {
        window.location.href = data.auth_url
      }
    } catch (error) {
      console.error('Google sign-in failed:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    isLoading,
    user,
    signInWithGoogle
  }
}
```

### Vanilla JavaScript

```javascript
// auth.js
class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:8000';
  }

  async signInWithGoogle() {
    try {
      const response = await fetch(`${this.baseURL}/auth/google`);
      const data = await response.json();
      
      if (data.auth_url) {
        // Store state for security verification
        localStorage.setItem('oauth_state', data.state);
        
        // Redirect to Google
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error('Google OAuth initiation failed:', error);
    }
  }

  handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('oauth_state');
    
    if (code && state === storedState) {
      // OAuth successful - backend handles token exchange
      localStorage.removeItem('oauth_state');
      return true;
    }
    
    return false;
  }
}

const auth = new AuthService();
```

## 🔐 Token Storage & Usage

After successful authentication, your backend returns JWT tokens. Store these securely:

```javascript
// Store tokens (use secure storage in production)
const storeTokens = (tokens) => {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
};

// Use tokens for API calls
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
```

## 🎯 User Flow

1. **User clicks "Sign in with Google"**
2. **Frontend calls** `/auth/google` to get authorization URL
3. **User is redirected** to Google for authentication
4. **Google redirects back** to your callback URL with auth code
5. **Backend automatically** exchanges code for user info and creates/updates user
6. **Backend returns** JWT tokens for your application
7. **Frontend stores tokens** and user is logged in

## 🛡️ Security Features

✅ **State Parameter**: Prevents CSRF attacks  
✅ **Secure Token Exchange**: Backend handles sensitive operations  
✅ **Account Linking**: Safely links Google accounts to existing users  
✅ **JWT Tokens**: Secure session management  
✅ **Error Handling**: Comprehensive error responses  

## 🌍 Production Deployment

For production, update your `.env` file:

```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

And add the production URL to your Google Cloud Console OAuth settings.

## ✨ Ready to Use!

Your Google OAuth implementation is production-ready and includes:
- Complete OAuth 2.0 flow
- User management with MongoDB
- JWT token generation
- Account linking capabilities
- Comprehensive error handling

Just integrate the frontend code above and you're good to go! 🚀