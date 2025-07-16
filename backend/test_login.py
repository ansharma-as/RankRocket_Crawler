#!/usr/bin/env python3
"""
Quick test script for login functionality
"""

import asyncio
import requests
import json

async def test_login():
    base_url = "http://localhost:8000"
    
    # Test data
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }
    
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    print("🧪 Testing Authentication API")
    print("=" * 40)
    
    try:
        # Test registration
        print("1. Testing registration...")
        response = requests.post(f"{base_url}/auth/register", json=user_data)
        
        if response.status_code == 201:
            print("✅ Registration successful")
        elif response.status_code == 400 and "already registered" in response.text:
            print("⚠️ User already exists, proceeding to login test")
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"Response: {response.text}")
            return
        
        # Test login
        print("\n2. Testing login...")
        response = requests.post(f"{base_url}/auth/login", json=login_data)
        
        if response.status_code == 200:
            print("✅ Login successful!")
            tokens = response.json()
            print(f"Access token: {tokens['access_token'][:50]}...")
            print(f"Token type: {tokens['token_type']}")
            print(f"Expires in: {tokens['expires_in']} seconds")
            
            # Test authenticated endpoint
            print("\n3. Testing authenticated endpoint...")
            headers = {"Authorization": f"Bearer {tokens['access_token']}"}
            response = requests.get(f"{base_url}/auth/me", headers=headers)
            
            if response.status_code == 200:
                print("✅ Authenticated request successful!")
                user_info = response.json()
                print(f"User: {user_info['full_name']} ({user_info['email']})")
            else:
                print(f"❌ Authenticated request failed: {response.status_code}")
                print(f"Response: {response.text}")
                
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_login())