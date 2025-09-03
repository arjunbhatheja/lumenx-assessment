import axios from 'axios';

const LUMEN_API_BASE = 'http://localhost:8000/api';
const CACHE_API_BASE = 'http://localhost:3001/cache';

// Lumen API instance
const lumenAPI = axios.create({
  baseURL: LUMEN_API_BASE,
});

// Cache API instance  
const cacheAPI = axios.create({
  baseURL: CACHE_API_BASE,
});

// Add token to Lumen API requests
lumenAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData: any) => lumenAPI.post('/register', userData),
  login: (credentials: any) => lumenAPI.post('/login', credentials),
};

// Posts API (using Lumen for CRUD operations)
export const postsAPI = {
  getAllPosts: () => lumenAPI.get('/posts'),
  createPost: (postData: any) => lumenAPI.post('/posts', postData),
  getPost: (id: string) => lumenAPI.get(`/posts/${id}`),
};

// Cache API (using Node.js cache service)
export const cacheAPI_service = {
  getAllPosts: () => cacheAPI.get('/posts'),
  getPost: (id: string) => cacheAPI.get(`/posts/${id}`),
};

export default lumenAPI;