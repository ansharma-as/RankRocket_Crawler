#!/usr/bin/env python3
"""
Test script for RankRocket authentication system
Run this after installing dependencies and setting up the database
"""

import asyncio
import sys
from app.services.auth_service import auth_service
from app.models.schemas import UserCreate, UserLogin
from app.core.database import init_db

async def test_auth_system():
    """Test the authentication system"""
    print("🚀 Testing RankRocket Authentication System")
    print("=" * 50)
    
    try:
        # Initialize database
        print("📊 Initializing database...")
        await init_db()
        print("✅ Database initialized successfully")
        
        # Test user creation
        print("\n👤 Testing user creation...")
        test_user = UserCreate(
            email="test@rankrocket.com",
            password="testpassword123",
            full_name="Test User"
        )
        
        try:
            user = await auth_service.create_user(test_user)
            print(f"✅ User created: {user.email}")
        except Exception as e:
            if "Email already registered" in str(e):
                print("⚠️ User already exists, continuing with login test...")
            else:
                print(f"❌ User creation failed: {e}")
                return
        
        # Test user login
        print("\n🔐 Testing user login...")
        login_data = UserLogin(
            email="test@rankrocket.com",
            password="testpassword123"
        )
        
        tokens = await auth_service.login_user(login_data)
        print("✅ Login successful!")
        print(f"📝 Access token: {tokens.access_token[:50]}...")
        print(f"📝 Refresh token: {tokens.refresh_token[:50]}...")
        
        # Test token verification
        print("\n🔍 Testing token verification...")
        token_data = auth_service.verify_token(tokens.access_token)
        if token_data:
            print(f"✅ Token verification successful for user: {token_data.email}")
        else:
            print("❌ Token verification failed")
            return
        
        # Test token refresh
        print("\n🔄 Testing token refresh...")
        new_tokens = await auth_service.refresh_access_token(tokens.refresh_token)
        print("✅ Token refresh successful!")
        print(f"📝 New access token: {new_tokens.access_token[:50]}...")
        
        print("\n🎉 All authentication tests passed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        sys.exit(1)

async def test_password_hashing():
    """Test password hashing functionality"""
    print("\n🔒 Testing password hashing...")
    
    password = "testpassword123"
    hashed = auth_service.get_password_hash(password)
    
    # Test correct password
    if auth_service.verify_password(password, hashed):
        print("✅ Password hashing and verification works correctly")
    else:
        print("❌ Password verification failed")
        return
    
    # Test incorrect password
    if not auth_service.verify_password("wrongpassword", hashed):
        print("✅ Password verification correctly rejects wrong passwords")
    else:
        print("❌ Password verification incorrectly accepted wrong password")

async def main():
    """Main test function"""
    print("🧪 Starting authentication system tests...\n")
    
    # Test password hashing (doesn't require database)
    await test_password_hashing()
    
    # Test full auth system (requires database)
    try:
        await test_auth_system()
    except Exception as e:
        print(f"\n⚠️ Database tests skipped: {e}")
        print("💡 Make sure MongoDB is running and configured correctly")
    
    print("\n✨ Test completed!")

if __name__ == "__main__":
    asyncio.run(main())