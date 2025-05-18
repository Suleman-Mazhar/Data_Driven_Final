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
  // Mock implementation that generates simulated store data with critical items
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock store locations near the user's location
      const stores = [
        {
          location_id: 'loc-001',
          store_name: 'Derby Pharmacy',
          business_name: 'PharmaPlus Inc.',
          address: '123 High Street',
          city: 'Derby',
          postal_code: 'DE1 2AB',
          lat: lat + 0.01,
          lng: lng - 0.01,
          distance: 1.2,
          items: [
            { item_id: '1', name: 'N95 Face Mask', category: 'Medical', quantity: 45 },
            { item_id: '2', name: 'Hand Sanitizer', category: 'Hygiene', quantity: 23 }
          ]
        },
        {
          location_id: 'loc-002',
          store_name: 'Central Healthcare',
          business_name: 'NHS Community Pharmacy',
          address: '78 Market Street',
          city: 'Derby',
          postal_code: 'DE1 1FE',
          lat: lat - 0.007,
          lng: lng + 0.008,
          distance: 1.8,
          items: [
            { item_id: '1', name: 'N95 Face Mask', category: 'Medical', quantity: 12 },
            { item_id: '3', name: 'COVID-19 Test Kit', category: 'Testing', quantity: 30 }
          ]
        },
        {
          location_id: 'loc-003',
          store_name: 'SuperValue Groceries',
          business_name: 'SuperValue Ltd',
          address: '45 Normanton Road',
          city: 'Derby',
          postal_code: 'DE23 6QR',
          lat: lat + 0.02,
          lng: lng + 0.02,
          distance: 3.2,
          items: [
            { item_id: '2', name: 'Hand Sanitizer', category: 'Hygiene', quantity: 56 },
            { item_id: '4', name: 'Milk 4L', category: 'Grocery', quantity: 24 }
          ]
        },
        {
          location_id: 'loc-004',
          store_name: 'MediMart',
          business_name: 'MediMart Healthcare Ltd',
          address: '12 Victoria Avenue',
          city: 'Burton',
          postal_code: 'DE14 2WE',
          lat: lat - 0.04,
          lng: lng - 0.03,
          distance: 6.5,
          items: [
            { item_id: '1', name: 'N95 Face Mask', category: 'Medical', quantity: 78 },
            { item_id: '2', name: 'Hand Sanitizer', category: 'Hygiene', quantity: 34 },
            { item_id: '3', name: 'COVID-19 Test Kit', category: 'Testing', quantity: 15 }
          ]
        }
      ];
      
      // Filter stores based on distance (using the radius parameter)
      const filteredStores = stores.filter(store => store.distance <= radius);
      
      resolve({ data: filteredStores });
    }, 1000); // Simulate network delay
  });
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