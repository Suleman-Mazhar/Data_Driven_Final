import axios from 'axios';

// Using proxy setting in package.json - API requests will be forwarded to the backend
const API_URL = '/api';

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

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

// Critical items services
export const getCriticalItems = () => {
  return api.get('/critical-items');
};

export const getCriticalItem = (itemId) => {
  return api.get(`/critical-items/${itemId}`);
};

export const getAvailableItems = (lat, lng, radius) => {
  return api.get(`/critical-items/available?lat=${lat}&lng=${lng}&radius=${radius}`);
};

// Dashboard services
export const getDashboardStats = () => {
  return api.get('/dashboard/stats');
};

export const getVaccinationStats = () => {
  return api.get('/dashboard/vaccination-stats');
};

export const getStockStats = () => {
  return api.get('/dashboard/stock-stats');
};

export const getAlerts = (status, severity) => {
  let queryParams = '';
  if (status) queryParams += `status=${status}&`;
  if (severity) queryParams += `severity=${severity}&`;
  return api.get(`/dashboard/alerts?${queryParams}`);
};

// Export other services
export default api;