#!/bin/bash

echo "🚀 LumenX Assessment - Quick Deploy"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Clean up any existing containers to avoid conflicts
echo "🧹 Cleaning up existing Docker containers..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker container prune -f 2>/dev/null || true

# Stop containers on specific ports that might conflict
echo "🔄 Stopping containers on conflicting ports..."
docker ps -q --filter "publish=3000" | xargs -r docker stop 2>/dev/null || true
docker ps -q --filter "publish=3001" | xargs -r docker stop 2>/dev/null || true  
docker ps -q --filter "publish=3002" | xargs -r docker stop 2>/dev/null || true
docker ps -q --filter "publish=8000" | xargs -r docker stop 2>/dev/null || true
docker ps -q --filter "publish=3306" | xargs -r docker stop 2>/dev/null || true
docker ps -q --filter "publish=6379" | xargs -r docker stop 2>/dev/null || true

echo "✅ Docker cleanup completed"

# Download production docker-compose file if it doesn't exist
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "📥 Downloading production configuration..."
    curl -s -O https://raw.githubusercontent.com/arjunbhatheja/lumenx-assessment/main/docker-compose.prod.yml
    if [ $? -eq 0 ]; then
        echo "✅ Configuration downloaded"
    else
        echo "❌ Failed to download configuration"
        exit 1
    fi
fi

# Pull and start services
echo "🐳 Pulling images and starting services..."
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Application is running:"
    echo "   Frontend:  http://localhost:3000"
    echo "   API:       http://localhost:8000"
    echo "   Cache:     http://localhost:3002"
    echo "   WebSocket: http://localhost:3001"
    echo "   API Docs:  https://app.swaggerhub.com/apis/arjun-9c5/lumenx-assessment-api/1.0.0"
    echo ""
    echo "📋 Test Credentials:"
    echo "   Admin: admin@lumenx.com / admin123"
    echo "   User:  user@lumenx.com / user123"
    echo ""
    echo "� To view logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "� To stop: docker-compose -f docker-compose.prod.yml down"
else
    echo "❌ Failed to start services"
    exit 1
fi
