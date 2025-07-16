#!/usr/bin/env python3
"""
Clean test - delete existing user and create new one
"""

import asyncio
from app.services.auth_service import auth_service
from app.models.schemas import UserCreate, UserLogin
from app.core.database import init_db, get_database

async def clean_and_test():
    print("🔍 Clean auth test...")
    
    # Initialize database first
    try:
        await init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Database init failed: {e}")
        return
    
    # Clean up existing user
    try:
        db = await get_database()
        result = await db.users.delete_one({"email": "test@gmail.com"})
        print(f"🗑️ Deleted {result.deleted_count} existing users")
    except Exception as e:
        print(f"⚠️ Error cleaning: {e}")
    
    # Create a test user
    user_create = UserCreate(
        email="test@gmail.com",
        password="testpassword123", 
        full_name="Test User"
    )
    
    try:
        print("📝 Creating user...")
        user = await auth_service.create_user(user_create)
        print(f"✅ User created: {user.email}")
        print(f"   ID: {user.id} (type: {type(user.id)})")
        
        print("\n🔍 Testing get_user_by_email...")
        retrieved_user = await auth_service.get_user_by_email("test@gmail.com")
        if retrieved_user:
            print(f"✅ User retrieved: {retrieved_user.email}")
            print(f"   ID: {retrieved_user.id} (type: {type(retrieved_user.id)})")
        else:
            print("❌ User not found")
        
        print("\n🔐 Testing authentication...")
        user_login = UserLogin(email="test@gmail.com", password="testpassword123")
        token = await auth_service.login_user(user_login)
        print(f"✅ Login successful!")
        print(f"   Access token: {token.access_token[:50]}...")
        print(f"   Token type: {token.token_type}")
        print(f"   Expires in: {token.expires_in} seconds")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(clean_and_test())