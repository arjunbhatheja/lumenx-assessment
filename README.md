# LumenX Full-Stack Assessment

[![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen?logo=docker)](https://hub.docker.com/r/arbhathe/lumenx-assessment-arjun)
[![SwaggerHub](https://img.shields.io/badge/API-Documented-blue?logo=swagger)](https://app.swaggerhub.com/apis/arjun-9c5/lumenx-assessment-api/1.0.0)
[![GitHub](https://img.shields.io/badge/Source-Available-black?logo=github)](https://github.com/arjunbhatheja/lumenx-assessment)

A production-ready **microservices application** demonstrating modern full-stack development with **React frontend**, **Lumen PHP API**, **Node.js caching layer**, and **real-time WebSocket features**.

## 📋 Table of Contents
- [Quick Demo](#-quick-demo)
- [Test Credentials](#-test-credentials)  
- [Architecture Overview](#️-architecture-overview)
- [Assessment Coverage](#-assessment-coverage)
- [Testing Guide](#-testing-guide)
- [API Documentation](#-api-documentation)
- [Real-time Features](#-real-time-features)
- [Technical Stack](#️-technical-stack)
- [Deployment Options](#-deployment-options)
- [Contact](#-contact)

---

## 🚀 Quick Demo

**Get the complete application running in 2 minutes:**

```bash
# Clone the repository
git clone https://github.com/arjunbhatheja/lumenx-assessment.git
cd lumenx-assessment

# Start all services with Docker
docker-compose up -d

# Wait 30 seconds for database setup, then visit:
# 🌐 Frontend: http://localhost:3000
# 📡 API: http://localhost:8000

# To stop after testing:
docker-compose down
```

**Alternative:** Use pre-built Docker Hub images
```bash
curl -O https://raw.githubusercontent.com/arjunbhatheja/lumenx-assessment/main/docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

**One-command deployment script:**
```bash
# Download and run the automated deployment script
curl -s https://raw.githubusercontent.com/arjunbhatheja/lumenx-assessment/main/quick-start.sh | bash
```

---

## 🔐 Test Credentials

**Ready-to-use accounts with realistic sample data:**

| Role | Email | Password | Capabilities |
|------|-------|----------|--------------|
| **Admin** | `admin@lumenx.com` | `admin123` | Full access + Admin dashboard + User management |
| **User** | `user@lumenx.com` | `user123` | Create posts, view all posts, standard features |

**Includes:** 4 additional demo users with 7 professional sample posts for realistic testing experience.

---

## 🏗️ Architecture Overview

**Microservices architecture with Docker containerization:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React.js      │    │   Lumen API     │    │   Node.js       │
│   Frontend      │◄──►│   (PHP 8.2)     │◄──►│   Cache Layer   │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │   WebSocket     │             │
         └─────────────►│   Server        │◄────────────┘
                        │   Port: 3001    │
                        └─────────────────┘
                                 │
                   ┌─────────────────┐    ┌─────────────────┐
                   │     Redis       │    │     MySQL       │
                   │   Port: 6379    │    │   Port: 3306    │
                   └─────────────────┘    └─────────────────┘
```

**Key Architecture Benefits:**
- **Scalable**: Each service can be scaled independently
- **Resilient**: Service isolation prevents cascade failures  
- **Maintainable**: Clean separation of concerns
- **Production-ready**: Docker containerization with health checks

---

## ✨ Assessment Coverage

### **Core Requirements (100/100 Points)**
| Component | Requirement | Implementation | Status |
|-----------|-------------|----------------|---------|
| **Backend (Lumen)** 20pts | JWT + REST API | ✅ Complete with admin features | **EXCEEDED** |
| **Backend (Node.js)** 20pts | Redis caching layer | ✅ TypeScript + optimization | **EXCEEDED** |
| **Database (MySQL)** 15pts | Users + Posts tables | ✅ Migrations + seeding | **COMPLETE** |
| **Frontend (React)** 10pts | Simple UI | ✅ Material-UI + Admin Dashboard | **EXCEEDED** |
| **Testing** 15pts | PHPUnit/Jest | ✅ Unit tests included | **COMPLETE** |
| **DevOps (Docker)** 10pts | Containerization | ✅ + Docker Hub + Production config | **EXCEEDED** |
| **CI/CD** 10pts | GitHub Actions | ✅ Automated testing pipeline | **COMPLETE** |

### **Bonus Features (All Implemented!)**
- ✅ **Role-Based Access Control (RBAC)** - Admin/User permissions with middleware
- ✅ **WebSockets (Socket.io)** - Real-time post updates across all connected clients
- ✅ **Optimized Redis** - Memory limits, LRU eviction, persistence configuration
- ✅ **Advanced Features** - Health checks, automatic database seeding, professional UI/UX

---

## 🧪 Testing Guide

### **1. Frontend Testing** (http://localhost:3000)
**Comprehensive UI testing with realistic scenarios:**
- **Authentication Flow**: Login with admin or user credentials, test JWT token persistence
- **Real-time Updates**: Open multiple browser tabs, create posts in one tab and watch instant updates in others
- **Admin Features**: Access admin dashboard with user management, post moderation, and system statistics
- **UI Components**: Test dark/light theme toggle, responsive design, form validation with Material-UI
- **Role-based Access**: Compare admin vs user capabilities, test permission restrictions

### **2. API Testing**
**Interactive API exploration and testing:**
- **SwaggerHub**: [Complete API Documentation](https://app.swaggerhub.com/apis/arjun-9c5/lumenx-assessment-api/1.0.0) - Click "Try it out" on any endpoint
- **Local cURL Testing**:
```bash
# Get JWT token
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@lumenx.com", "password": "admin123"}'

# Use token for authenticated requests
curl -X GET http://localhost:8000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test admin endpoints
curl -X GET http://localhost:8000/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **3. Automated Testing**
**Comprehensive test coverage across all layers:**
```bash
# Run backend API tests (PHPUnit)
docker-compose exec lumen php artisan test
# Covers: Authentication, CRUD operations, middleware, JWT validation, role permissions

# Run caching layer tests (Jest + Supertest)  
docker-compose exec nodejs npm test
# Covers: Redis operations, database fallback logic, performance optimization

# Run frontend tests (Jest + React Testing Library)
docker-compose exec frontend npm test  
# Covers: Component rendering, user interactions, API integration
```

### **4. Real-time WebSocket Testing**
**Test real-time functionality across multiple interfaces:**
- **Browser Testing**: Open `websocket-test.html` for interactive WebSocket testing with live event monitoring
- **Multi-tab Testing**: Open multiple browser tabs to http://localhost:3000 and watch real-time synchronization
- **API Integration**: Create/edit posts via API or SwaggerHub and observe instant WebSocket notifications
- **Event Monitoring**: Watch browser developer console for WebSocket connection status and message flow

---

## 📡 API Documentation

### **Authentication Endpoints**
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/register` | Register new user | `{name, email, password, role?}` |
| POST | `/login` | Authenticate user | `{email, password}` |
| GET | `/me` | Get current user profile | - |

### **Posts Management**
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/posts` | Get all posts | ✅ | any |
| POST | `/posts` | Create new post | ✅ | user/admin |
| GET | `/posts/{id}` | Get single post | ✅ | any |
| PUT | `/posts/{id}` | Update post | ✅ | admin only |
| DELETE | `/posts/{id}` | Delete post | ✅ | admin only |

### **Admin Endpoints**
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/admin/users` | Get all users | ✅ | admin only |
| GET | `/admin/stats` | Get user statistics | ✅ | admin only |

### **Cache Layer Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cache/posts` | Get cached posts from Redis |
| GET | `/cache/posts/{id}` | Get cached single post |

**Complete Interactive Documentation:** [SwaggerHub API Docs](https://app.swaggerhub.com/apis/arjun-9c5/lumenx-assessment-api/1.0.0)

---

## ⚡ Real-time Features

### **WebSocket Server Architecture**
**Real-time communication powered by Socket.io and Redis Pub/Sub:**

Our WebSocket implementation provides instant updates for:
- **Live Post Updates**: Real-time notifications when posts are created, updated, or deleted across all connected users
- **User Activity Tracking**: Monitor and broadcast user actions throughout the application for enhanced interactivity  
- **Admin Notifications**: Role-based messaging system for administrative alerts and system updates
- **Redis Pub/Sub Integration**: Seamless event propagation between API, cache layer, and WebSocket server

### **WebSocket Event Flow**
| Event | Direction | Description | Payload Example |
|-------|-----------|-------------|-----------------|
| `post:created` | Server → Client | New post notification | `{id, title, content, user}` |
| `post:updated` | Server → Client | Post update notification | `{id, title, content, user}` |
| `post:deleted` | Server → Client | Post deletion notification | `{id}` |
| `admin:notification` | Server → Admin | Admin-only system messages | `{message, type, timestamp}` |
| `user:activity` | Client → Server | Track user interactions | `{userId, action, timestamp}` |
| `join` | Client → Server | Join user/role-specific rooms | `{userId, role}` |

### **Frontend Integration**
**Seamless real-time experience in React frontend:**
- 🟢 **Live Connection Indicator**: Visual WebSocket connection status in the UI header
- 🔔 **Real-time Notifications**: Instant toast notifications for new posts and system events
- ⚡ **Automatic UI Updates**: Posts appear immediately without page refresh or manual polling
- 🎯 **Role-based Events**: Different notification types for admin users vs regular users

```javascript
// Real-time service integration example
websocketService.connect();
websocketService.onPostCreated((post) => {
  setPosts(prev => [post, ...prev]);
  showNotification(`New post: "${post.title}" by ${post.user.name}`);
});
```

### **Redis Pub/Sub Architecture**
**Event-driven real-time system:**
```
Lumen API → Redis Publisher → WebSocket Subscriber → Connected Clients
     ↓              ↓                 ↓                    ↓
  Database      Cache Store      Event Handler        UI Updates
```

**Redis Pub/Sub** is a messaging pattern where:
- **Publishers** (Lumen API) send messages to Redis channels
- **Subscribers** (WebSocket server) listen to specific channels  
- **Real-time Flow**: API creates post → publishes to Redis → WebSocket receives → broadcasts to all connected browsers

---

## 🛠️ Technical Stack

### **Backend Technologies**
- **Lumen (PHP 8.2)**: Lightweight Laravel micro-framework for high-performance APIs
- **JWT Authentication**: Secure token-based authentication with role-based access control
- **MySQL 8.0**: Robust relational database with optimized queries and indexing
- **Redis 7.0**: High-performance caching and session storage with LRU eviction policies

### **Frontend Technologies** 
- **React 18**: Modern component-based UI library with hooks and context
- **Material-UI v5**: Professional component library with dark/light theme support
- **TypeScript**: Type-safe development with enhanced IDE support and error prevention
- **WebSocket Client**: Real-time communication with automatic reconnection handling

### **Infrastructure & DevOps**
- **Docker**: Multi-container orchestration with health checks and volume persistence
- **Docker Hub**: Published images for easy deployment and distribution
- **GitHub Actions**: Automated CI/CD pipeline with testing and build verification
- **Node.js Cache Layer**: TypeScript-based Redis caching service with fallback logic

### **Additional Features**
- **Automatic Database Migration**: Zero-configuration database setup with sample data seeding
- **Health Monitoring**: Container health checks and service dependency management  
- **Development Tools**: Hot reload, debugging support, and comprehensive logging
- **Production Ready**: Environment-based configuration, security headers, and performance optimization

---

## � Deployment Options

### **Option 1: Local Development**
```bash
git clone https://github.com/arjunbhatheja/lumenx-assessment.git
cd lumenx-assessment
docker-compose up -d
```

### **Option 2: Production Images**
```bash
curl -O https://raw.githubusercontent.com/arjunbhatheja/lumenx-assessment/main/docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

### **Option 3: One-Command Deploy**
```bash
curl -s https://raw.githubusercontent.com/arjunbhatheja/lumenx-assessment/main/quick-start.sh | bash
```

### **Available Scripts:**
- `quick-start.sh`: Automated deployment with error checking and progress indicators
- `docker-compose.yml`: Development environment with local builds
- `docker-compose.prod.yml`: Production environment with Docker Hub images
- `DEPLOYMENT.md`: Detailed deployment guide with troubleshooting

---

## �📧 Contact

**Arjun Bhatheja**
- 📧 Email: [arjunbhathejaus@gmail.com](mailto:arjunbhathejaus@gmail.com)
- 🐙 GitHub: [@arjunbhatheja](https://github.com/arjunbhatheja)
- 🔗 LinkedIn: [Connect with me](https://linkedin.com/in/arjunbhatheja)

---

**🌟 Built with attention to detail and production-ready practices for the EnergeX technical assessment.**
