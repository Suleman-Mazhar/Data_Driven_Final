import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const login = (prs_id, password) => {
  return api.post('/auth/login', { prs_id, password });
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

// Critical items services
export const getCriticalItems = () => {
  return api.get('/critical-items');
};

export const getAvailableItems = (lat, lng, radius) => {
  return api.get(`/critical-items/available?lat=${lat}&lng=${lng}&radius=${radius}`);
};

// Dashboard services
export const getDashboardStats = () => {
  return api.get('/dashboard/stats');
};

// Export other services
export default api;