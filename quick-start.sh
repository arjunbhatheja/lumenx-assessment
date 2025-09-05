#!/bin/bash

echo "🚀 LumenX Assessment - Quick Deploy"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

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
    echo "   WebSocket: http://localhost:8080"
    echo "   API Docs:  https://app.swaggerhub.com/apis/arjun/lumenx-assessment-api/1.0.0"
    echo ""
    echo "📋 To view logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "🛑 To stop: docker-compose -f docker-compose.prod.yml down"
    echo ""
    echo "🔐 Create an admin user:"
    echo '   curl -X POST http://localhost:8000/register \'
    echo '     -H "Content-Type: application/json" \'
    echo '     -d '"'"'{"name":"Admin","email":"admin@test.com","password":"admin123","role":"admin"}'"'"
else
    echo "❌ Failed to start services"
    exit 1
fi
