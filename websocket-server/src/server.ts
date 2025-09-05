import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);

// Configure Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Configure Redis client
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || '6379'}`,
  socket: {
    reconnectStrategy: (retries: number) => Math.min(retries * 50, 500)
  }
});

// Redis event handlers
redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redisClient.on('error', (err: Error) => {
  console.error('❌ Redis error:', err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('📡 WebSocket server connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount 
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  // Join a room for authenticated users
  socket.on('join', (data) => {
    const { userId, role } = data;
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);
    console.log(`🏠 User ${userId} (${role}) joined rooms`);
  });

  // Handle post creation broadcasts
  socket.on('post:created', async (postData) => {
    try {
      // Cache the new post
      await redisClient.setEx(
        `post:${postData.id}`, 
        3600, // 1 hour TTL
        JSON.stringify(postData)
      );

      // Broadcast to all connected clients
      io.emit('post:new', postData);
      console.log(`📝 New post broadcast: ${postData.title}`);
    } catch (error) {
      console.error('Error handling post creation:', error);
    }
  });

  // Handle post updates
  socket.on('post:updated', async (postData) => {
    try {
      // Update cache
      await redisClient.setEx(
        `post:${postData.id}`, 
        3600,
        JSON.stringify(postData)
      );

      // Broadcast to all connected clients
      io.emit('post:updated', postData);
      console.log(`✏️ Post update broadcast: ${postData.title}`);
    } catch (error) {
      console.error('Error handling post update:', error);
    }
  });

  // Handle post deletion
  socket.on('post:deleted', async (postId) => {
    try {
      // Remove from cache
      await redisClient.del(`post:${postId}`);

      // Broadcast to all connected clients
      io.emit('post:deleted', { id: postId });
      console.log(`🗑️ Post deletion broadcast: ${postId}`);
    } catch (error) {
      console.error('Error handling post deletion:', error);
    }
  });

  // Handle admin notifications
  socket.on('admin:notify', (data) => {
    // Send notification only to admin role
    socket.to('role:admin').emit('admin:notification', data);
    console.log(`👑 Admin notification sent: ${data.message}`);
  });

  // Handle user activity tracking
  socket.on('user:activity', async (data) => {
    try {
      const { userId, action, timestamp } = data;
      
      // Store user activity in Redis with TTL
      await redisClient.setEx(
        `activity:${userId}`, 
        300, // 5 minutes TTL
        JSON.stringify({ action, timestamp, socketId: socket.id })
      );

      // Broadcast user activity to admins only
      socket.to('role:admin').emit('user:activity', data);
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`👋 User disconnected: ${socket.id}`);
  });
});

// Redis pub/sub for external triggers
const subscriber = redisClient.duplicate();

(async () => {
  try {
    await subscriber.connect();
    
    // Subscribe to post events from PHP backend
    await subscriber.subscribe('post:created', (message: string) => {
      const postData = JSON.parse(message);
      io.emit('post:new', postData);
      console.log(`📡 Redis pub: New post - ${postData.title}`);
    });

    await subscriber.subscribe('post:updated', (message: string) => {
      const postData = JSON.parse(message);
      io.emit('post:updated', postData);
      console.log(`📡 Redis pub: Updated post - ${postData.title}`);
    });

    await subscriber.subscribe('post:deleted', (message: string) => {
      const data = JSON.parse(message);
      io.emit('post:deleted', data);
      console.log(`📡 Redis pub: Deleted post - ${data.id}`);
    });

    console.log('📻 Subscribed to Redis pub/sub channels');
  } catch (error) {
    console.error('Error setting up Redis pub/sub:', error);
  }
})();

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`📡 Socket.IO endpoint: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  
  try {
    await redisClient.quit();
    await subscriber.quit();
    server.close(() => {
      console.log('✅ WebSocket server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});
