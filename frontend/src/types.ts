// Types for the application
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  views_count?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
