# WebSocket Server

WebSocket server for real-time post updates using Socket.IO and Redis pub/sub.

## Features

- Real-time post creation/update/deletion notifications
- Redis caching and pub/sub integration  
- Role-based event handling (admin notifications)
- User activity tracking
- Health check endpoint

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Environment Variables

- `REDIS_HOST`: Redis server host (default: redis)
- `REDIS_PORT`: Redis server port (default: 6379)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `PORT`: Server port (default: 3001)

## Endpoints

- `GET /health`: Health check endpoint
- WebSocket connection: `ws://localhost:3001`

## Socket Events

### Client → Server
- `join`: Join user/role rooms
- `post:created`: Broadcast new post
- `post:updated`: Broadcast post update
- `post:deleted`: Broadcast post deletion
- `admin:notify`: Send admin notification
- `user:activity`: Track user activity

### Server → Client
- `post:new`: New post created
- `post:updated`: Post updated
- `post:deleted`: Post deleted
- `admin:notification`: Admin-only notification
- `user:activity`: User activity update
