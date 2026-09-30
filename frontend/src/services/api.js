import axios from 'axios';

// Base API URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30s timeout for vision model inference
});

// Request Interceptor: Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ocular_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Graceful handling of session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if we are already on login or register
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        localStorage.removeItem('ocular_token');
        localStorage.removeItem('ocular_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Inspection & Visual Intelligence Endpoints
export const inspectAPI = {
  analyze: async (formData) => {
    const response = await api.post('/inspect/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getHistory: async (params = {}) => {
    const response = await api.get('/inspect/history', { params });
    return response.data;
  },
  getMetrics: async () => {
    const response = await api.get('/inspect/metrics');
    return response.data;
  },
  checkHealth: async () => {
    const baseURL = API_URL.replace(/\/api\/?$/, '');
    const response = await axios.get(`${baseURL}/health`);
    return response.data;
  },
};

export default api;
