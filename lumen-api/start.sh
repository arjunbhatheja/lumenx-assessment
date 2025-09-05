#!/bin/bash

echo "🚀 Starting Lumen API..."

# Wait for MySQL to be ready (simpler approach)
echo "⏳ Waiting for MySQL..."
sleep 30

echo "✅ MySQL should be ready!"

# Run migrations
echo "📦 Running database migrations..."
php artisan migrate --force

# Run seeders
echo "🌱 Seeding database with default data..."
php artisan db:seed --force

# Start the application
echo "🎉 Starting API server..."
php -S 0.0.0.0:8000 -t public
