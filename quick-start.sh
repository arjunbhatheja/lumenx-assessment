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

# Clean up any orphaned volumes
echo "🗑️  Cleaning up Docker volumes..."
docker volume prune -f 2>/dev/null || true

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
    echo "🎉 Containers started successfully!"
    echo "⏳ Waiting for services to initialize (database, migrations, seeders)..."
    
    # Wait for backend API to be ready
    echo "🔄 Checking API readiness (this may take 30-60 seconds)..."
    for i in {1..60}; do
        if curl -s http://localhost:8000/ >/dev/null 2>&1; then
            echo "✅ API is ready!"
            break
        fi
        # Show progress every 10 seconds
        if [ $((i % 10)) -eq 0 ]; then
            echo "   ⏳ Still waiting... ($i/60 seconds)"
        fi
        if [ $i -eq 60 ]; then
            echo "⚠️  API took longer than expected, but continuing..."
        fi
        sleep 1
    done
    
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
    echo "🌐 Opening application in your default browser..."

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost:3000 2>/dev/null || true
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:3000 2>/dev/null || true
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        # Windows
        start http://localhost:3000 2>/dev/null || true
    fi
    
    echo "🎯 If browser didn't open automatically, visit: http://localhost:3000"
    echo ""
    echo "� To view logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "� To stop: docker-compose -f docker-compose.prod.yml down"
else
    echo "❌ Failed to start services"
    exit 1
fi
