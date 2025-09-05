# LumenX Assessment - Deployment Guide

## 🚀 Quick Start (Docker Hub)

### Prerequisites
- Docker and Docker Compose installed
- Git (optional, for cloning)

### Option 1: Docker Hub (Recommended)
```bash
# Clone the repository
git clone https://github.com/arjunbhatheja/lumenx-assessment.git
cd lumenx-assessment

# Start all services
docker-compose up -d
```

**Access the application:**
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Documentation**: [SwaggerHub](https://app.swaggerhub.com/apis/arjun/lumenx-assessment-api/1.0.0)

### Option 2: Build from Source
```bash
# Clone and build
git clone https://github.com/arjunbhatheja/lumenx-assessment.git
cd lumenx-assessment
docker-compose build
docker-compose up -d
```

## 🏗️ Architecture

- **Frontend**: React 18 + Material-UI + TypeScript
- **Backend**: Lumen PHP + JWT Authentication  
- **Cache**: Node.js + Redis
- **WebSocket**: Real-time updates
- **Database**: MySQL 8.0

## 🔧 Configuration

### Environment Variables
Create `.env` files for each service:

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WEBSOCKET_URL=ws://localhost:8080
```

**Backend (lumen-api/.env)**
```
APP_ENV=local
APP_DEBUG=true
APP_KEY=your-app-key
DB_HOST=mysql
DB_DATABASE=lumenx
DB_USERNAME=lumenx
DB_PASSWORD=password
JWT_SECRET=your-jwt-secret
REDIS_HOST=redis
```

## 👥 User Accounts

### Creating Admin User
**Option 1: Registration with Admin Role**
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Option 2: Regular User (Default)**
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe", 
    "email": "user@example.com",
    "password": "password123"
  }'
```

## 🧪 Testing the Application

### 1. Using the Frontend
- Navigate to http://localhost:3000
- Register/Login with your account
- Create, view, and manage posts
- Test real-time updates (open multiple browser tabs)

### 2. Using SwaggerHub API Documentation
- Visit the [API Documentation](https://app.swaggerhub.com/apis/arjun/lumenx-assessment-api/1.0.0)
- Click "Try it out" on any endpoint
- Test with mock data or your local API
- Built-in authentication testing with JWT tokens

### 3. Using cURL Commands
```bash
# Register a new user
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'

# Login and get JWT token
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Use the returned token for authenticated requests
curl -X GET http://localhost:8000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Stop conflicting services or change ports in docker-compose.yml
```

**Database Connection Issues:**
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

**Frontend Not Loading:**
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

## 🌐 Production Deployment

### Cloud Platforms

**AWS ECS/Fargate:**
- Upload images to ECR
- Create ECS cluster and services
- Configure ALB for load balancing

**Google Cloud Run:**
- Deploy each service separately
- Configure Cloud SQL for database
- Use Cloud Memorystore for Redis

**DigitalOcean App Platform:**
- Connect GitHub repository
- Auto-deploy on push
- Managed database options

**Heroku (Alternative):**
- Deploy frontend to Netlify/Vercel
- Deploy backend to Heroku
- Use Heroku Redis and PostgreSQL

## 🎯 Key Features Demonstrated

- ✅ Full-stack application architecture
- ✅ Docker containerization
- ✅ JWT authentication with role-based access
- ✅ Real-time WebSocket integration  
- ✅ Redis caching for performance
- ✅ RESTful API design
- ✅ Responsive Material-UI design
- ✅ Professional code quality
- ✅ Comprehensive documentation

## 📚 API Documentation

Complete API documentation available at:
**[SwaggerHub - LumenX Assessment API](https://app.swaggerhub.com/apis/arjun/lumenx-assessment-api/1.0.0)**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or issues, please open a GitHub issue or contact the development team.
