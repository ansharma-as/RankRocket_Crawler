#!/usr/bin/env python3
"""
RankRocket Server Startup Script
Checks dependencies and starts the server with proper error handling
"""

import sys
import os
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 11):
        print("❌ Python 3.11 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'motor',
        'pydantic',
        'python-jose',
        'passlib',
        'google-auth',
        'email-validator'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package}")
    
    if missing_packages:
        print(f"\n💡 Install missing packages with:")
        print(f"   pip install {' '.join(missing_packages)}")
        print(f"   OR pip install -r requirements.txt")
        return False
    
    return True

def check_environment():
    """Check environment configuration"""
    env_file = Path(".env")
    
    if not env_file.exists():
        print("⚠️  .env file not found")
        print("💡 Copy .env.example to .env and configure your settings")
        
        # Create a basic .env file
        with open(".env", "w") as f:
            f.write("# RankRocket Configuration\n")
            f.write("MONGODB_URL=mongodb://localhost:27017\n")
            f.write("DATABASE_NAME=rankrocket\n")
            f.write("JWT_SECRET_KEY=your-secret-key-change-in-production\n")
            f.write("JWT_ALGORITHM=HS256\n")
            f.write("ACCESS_TOKEN_EXPIRE_MINUTES=30\n")
            f.write("REFRESH_TOKEN_EXPIRE_DAYS=7\n")
        
        print("📝 Created basic .env file - please review and update")
        return False
    
    print("✅ .env file found")
    return True

def check_mongodb():
    """Check if MongoDB is accessible"""
    try:
        import pymongo
        client = pymongo.MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=3000)
        client.admin.command('ping')
        print("✅ MongoDB connection successful")
        client.close()
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("💡 Make sure MongoDB is running:")
        print("   - Install: brew install mongodb-community (macOS)")
        print("   - Start: brew services start mongodb-community")
        print("   - Or use MongoDB Atlas (cloud)")
        return False

def start_server():
    """Start the FastAPI server"""
    print("\n🚀 Starting RankRocket server...")
    print("=" * 50)
    
    try:
        # Start with uvicorn
        subprocess.run([
            "uvicorn", 
            "app.main:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "8000"
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except FileNotFoundError:
        print("❌ uvicorn not found")
        print("💡 Install with: pip install uvicorn[standard]")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

def main():
    """Main startup function"""
    print("🚀 RankRocket Backend Startup")
    print("=" * 40)
    
    # Check all prerequisites
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Environment", check_environment),
        ("MongoDB", check_mongodb),
    ]
    
    all_passed = True
    for name, check_func in checks:
        print(f"\n📋 Checking {name}...")
        if not check_func():
            all_passed = False
    
    if not all_passed:
        print("\n❌ Some checks failed. Please fix the issues above.")
        print("💡 Run this script again after fixing the issues.")
        sys.exit(1)
    
    print("\n✅ All checks passed!")
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()