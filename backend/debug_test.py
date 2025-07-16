#!/usr/bin/env python3
"""
Direct test of auth service to debug ObjectId issue
"""

import asyncio
from app.services.auth_service import auth_service
from app.models.schemas import UserCreate
from app.core.database import init_db

async def test_auth_direct():
    print("🔍 Testing auth service directly...")
    
    # Initialize database first
    try:
        await init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Database init failed: {e}")
        return
    
    # Create a test user
    user_create = UserCreate(
        email="test@gmail.com",
        password="testpassword123", 
        full_name="Test User"
    )
    
    try:
        print("📝 Creating user...")
        user = await auth_service.create_user(user_create)
        print(f"✅ User created: {user}")
        print(f"   ID: {user.id} (type: {type(user.id)})")
        print(f"   Email: {user.email}")
        
        print("\n🔍 Testing get_user_by_email...")
        retrieved_user = await auth_service.get_user_by_email("test@gmail.com")
        if retrieved_user:
            print(f"✅ User retrieved: {retrieved_user}")
            print(f"   ID: {retrieved_user.id} (type: {type(retrieved_user.id)})")
        else:
            print("❌ User not found")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_auth_direct())