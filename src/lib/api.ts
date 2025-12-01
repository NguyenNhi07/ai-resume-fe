import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL;

// Mock users database (in-memory for testing)
const mockUsers: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
}> = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: '123456',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
  },
];

// Mock API delay
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (USE_MOCK_API) {
      // Simulate API delay
      await mockDelay(800);
      
      // Find user in mock database
      const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
      
      if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
      
      // Generate mock token
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (USE_MOCK_API) {
      // Simulate API delay
      await mockDelay(800);
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('Email này đã được sử dụng');
      }
      
      // Create new user
      const newUser = {
        id: String(mockUsers.length + 1),
        name: data.name,
        email: data.email,
        password: data.password,
      };
      
      mockUsers.push(newUser);
      
      // Generate mock token
      const token = `mock_token_${newUser.id}_${Date.now()}`;
      
      return {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};

export default api;

