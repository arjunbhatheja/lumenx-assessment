"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const promise_1 = __importDefault(require("mysql2/promise"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Redis client setup
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379')
    }
});
// MySQL connection config
const dbConfig = {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'energex_db'
};
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to Redis
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().catch(console.error);
// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'EnergeX Node.js Cache Service is running!',
        timestamp: new Date().toISOString()
    });
});
// Cache endpoints
app.get('/cache/posts', async (req, res) => {
    try {
        console.log('Fetching all posts...');
        const cacheKey = 'posts:all';
        // Check cache first
        const cachedPosts = await redisClient.get(cacheKey);
        if (cachedPosts) {
            console.log('Found in cache');
            return res.json({
                source: 'cache',
                data: JSON.parse(cachedPosts)
            });
        }
        console.log('Cache miss, fetching from database...');
        // Fetch from database
        const connection = await promise_1.default.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT p.*, u.name as user_name, u.email as user_email 
            FROM posts p 
            LEFT JOIN users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC
        `);
        await connection.end();
        // Cache the results for 5 minutes
        await redisClient.setEx(cacheKey, 300, JSON.stringify(rows));
        res.json({
            source: 'database',
            data: rows
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/cache/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching post ${id}...`);
        const cacheKey = `posts:${id}`;
        // Check cache first
        const cachedPost = await redisClient.get(cacheKey);
        if (cachedPost) {
            console.log('Found in cache');
            return res.json({
                source: 'cache',
                data: JSON.parse(cachedPost)
            });
        }
        console.log('Cache miss, fetching from database...');
        // Fetch from database
        const connection = await promise_1.default.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT p.*, u.name as user_name, u.email as user_email 
            FROM posts p 
            LEFT JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?
        `, [id]);
        await connection.end();
        if (Array.isArray(rows) && rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const post = Array.isArray(rows) ? rows[0] : rows;
        // Cache the result for 5 minutes
        await redisClient.setEx(cacheKey, 300, JSON.stringify(post));
        res.json({
            source: 'database',
            data: post
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await redisClient.disconnect();
    process.exit(0);
});
app.listen(port, () => {
    console.log(`🚀 Cache service running on port ${port}`);
});
exports.default = app;
