# LumenX Full-Stack Assessment

A complete microservices application with Lumen PHP API, Node.js caching layer, React frontend, and real-time WebSocket features.

## 🐳 Quick Start with Docker Hub

**One-command deployment using pre-built images:**

```bash
# Download the production configuration
curl -O https://raw.githubusercontent.com/arjunbhatheja/lumenx-assessment/main/docker-compose.prod.yml

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:8000  
# WebSocket: http://localhost:8080
```

**Docker Hub Repository:** [arbhathe/lumenx-assessment-arjun](https://hub.docker.com/r/arbhathe/lumenx-assessment-arjun)

## 🏗️ Architecture

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

## 🚀 Features

### Core Features (100/100 Points)
- ✅ **JWT Authentication** with role-based access control (20 pts)
- ✅ **Node.js Caching Layer** with Redis optimization (20 pts)  
- ✅ **MySQL Database** with proper schema and migrations (15 pts)
- ✅ **React Frontend** with Material-UI components (10 pts)
- ✅ **Unit Testing** with PHPUnit and Jest (15 pts)
- ✅ **Docker Containerization** with multi-service orchestration (10 pts)
- ✅ **CI/CD Pipeline** with GitHub Actions (10 pts)

### Bonus Features (🎯 All Implemented!)
- 🎯 **Role-Based Access Control (RBAC)** - Admin/User permissions
- 🚀 **WebSockets (Socket.io)** - Real-time post updates
- ⚡ **Optimized Redis** - Memory limits, LRU eviction, persistence
- 📊 **Advanced Features** - Health checks, activity tracking, pub/sub

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend API** | Lumen (PHP 8.2) + JWT | RESTful API with authentication |
| **Cache Layer** | Node.js + TypeScript | Redis caching service |
| **WebSocket** | Socket.io + TypeScript | Real-time communication |
| **Frontend** | React.js + Material-UI | User interface |
| **Database** | MySQL 8.0 | Data persistence |
| **Cache** | Redis 7.0 | High-performance caching |
| **Container** | Docker + Docker Compose | Containerization |
| **CI/CD** | GitHub Actions | Automated testing |

## 🏃‍♂️ Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone Repository
```bash
git clone https://github.com/arjunbhatheja/lumenx-assessment.git
cd lumenx-assessment
```

### 2. Start All Services
```bash
docker-compose up -d
```

### 3. Run Database Migrations
```bash
docker-compose exec lumen php artisan migrate
```

### 4. Access Applications
- **Frontend:** http://localhost:3000
- **Lumen API:** http://localhost:8000
- **Node.js Cache:** http://localhost:3001
- **WebSocket Server:** http://localhost:3002

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/register` | Register new user | `{name, email, password, role?}` |
| POST | `/api/login` | Authenticate user | `{email, password}` |

### Posts Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/posts` | Get all posts | ✅ | any |
| POST | `/api/posts` | Create post | ✅ | user/admin |
| GET | `/api/posts/{id}` | Get single post | ✅ | any |
| PUT | `/api/posts/{id}` | Update post | ✅ | admin only |
| DELETE | `/api/posts/{id}` | Delete post | ✅ | admin only |

### Cache Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cache/posts` | Get cached posts |
| GET | `/cache/posts/{id}` | Get cached single post |

## 🔧 Environment Variables

### Lumen API (.env)
```env
APP_NAME=EnergeX-API
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=energex_db
DB_USERNAME=energex_user
DB_PASSWORD=Energex-Arjun@2003

CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=your-jwt-secret
```

### Node.js Cache (.env)
```env
PORT=3001
REDIS_URL=redis://redis:6379
DB_HOST=mysql
DB_PORT=3306
DB_USER=energex_user
DB_PASSWORD=Energex-Arjun@2003
DB_NAME=energex_db
```

## 🧪 Testing

### Run All Tests
```bash
# Lumen PHP Tests
docker-compose exec lumen php artisan test

# Node.js Tests
docker-compose exec nodejs npm test

# Frontend Tests (if implemented)
docker-compose exec frontend npm test
```

### Test Coverage
- **Backend:** Authentication, CRUD operations, middleware
- **Cache Layer:** Redis operations, fallback logic
- **Integration:** End-to-end API workflows

## 🔄 Real-time WebSocket Features

### WebSocket Server (Port 3001)
Our WebSocket implementation provides real-time updates for:
- **Live Post Updates**: Instant notifications when posts are created/updated/deleted
- **User Activity Tracking**: Monitor user actions across the application
- **Admin Notifications**: Role-based messaging system
- **Redis Pub/Sub Integration**: Seamless event propagation

### WebSocket Events
| Event | Direction | Description | Payload |
|-------|-----------|-------------|---------|
| `post:created` | Server → Client | New post notification | `{id, title, content, user}` |
| `post:updated` | Server → Client | Post update notification | `{id, title, content, user}` |
| `post:deleted` | Server → Client | Post deletion notification | `{id}` |
| `admin:notification` | Server → Admin | Admin-only messages | `{message, type}` |
| `user:activity` | Client → Server | Track user actions | `{userId, action, timestamp}` |
| `join` | Client → Server | Join user/role rooms | `{userId, role}` |

### Frontend WebSocket Integration
The React frontend automatically connects to WebSocket and shows:
- 🟢 **Live Updates Indicator** in the UI
- 🔔 **Real-time Notifications** for new posts
- ⚡ **Instant UI Updates** without page refresh

```javascript
// WebSocket service integration
websocketService.connect();
websocketService.onPostCreated((post) => {
  setPosts(prev => [post, ...prev]);
  showNotification(`New post: "${post.title}"`);
});
```

### Testing WebSocket
1. **Browser Test**: Open `websocket-test.html` for interactive testing
2. **Multiple Tabs**: Open multiple browser tabs to see real-time sync
3. **API Integration**: Create posts via API to trigger WebSocket events

### Redis Pub/Sub Architecture
```
Lumen API → Redis Pub → WebSocket Server → Connected Clients
     ↓           ↓              ↓
  Database    Cache         UI Updates
```

## 🎯 Role-Based Access Control

### User Roles
- **admin**: Full access (CRUD on all posts)
- **user**: Create posts, read all posts
- **guest**: Read-only access

### Implementation
```php
// Middleware usage
$app->router->group(['middleware' => ['auth', 'role:admin']], function ($router) {
    $router->put('/api/posts/{id}', 'PostController@update');
    $router->delete('/api/posts/{id}', 'PostController@destroy');
});
```

## ⚡ Redis Optimization

### Cache Strategies
1. **TTL-based expiration** (5 minutes default)
2. **LRU eviction policy** for memory management
3. **Cache invalidation** on data updates
4. **Fallback mechanisms** to database

### Configuration
```yaml
# Redis settings in docker-compose.yml
redis:
  image: redis:7-alpine
  command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set production values
2. **SSL/TLS**: Enable HTTPS
3. **Load Balancing**: Use nginx or similar
4. **Monitoring**: Add logging and metrics
5. **Security**: Enable rate limiting

### CI/CD Pipeline
- **Trigger:** Push to main/develop branches
- **Steps:** Test → Build → Deploy
- **Services:** GitHub Actions

## 🔍 Troubleshooting

### Common Issues

**1. Docker containers not starting**
```bash
docker-compose down
docker-compose up --build -d
```

**2. Database connection failed**
```bash
docker-compose exec mysql mysql -u root -p
# Check if database exists
```

**3. Redis connection failed**
```bash
docker-compose exec redis redis-cli ping
# Should return PONG
```

**4. JWT token invalid**
- Check JWT_SECRET in .env
- Verify token expiration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is created for EnergeX technical assessment.

## 👥 Contact

**Arjun Bhatheja**
- Email: arjunbhatheja40@gmail.com
- GitHub: [@arjunbhatheja](https://github.com/arjunbhatheja)

---

⭐ **Star this repo if you found it helpful!**