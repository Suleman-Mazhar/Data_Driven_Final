import api from './api';

// Get all critical items
export const getCriticalItems = () => {
  return api.get('/critical-items');
};

// Get a specific critical item
export const getCriticalItem = (itemId) => {
  return api.get(`/critical-items/${itemId}`);
};

// Create a new critical item (government officials only)
export const createCriticalItem = (data) => {
  return api.post('/critical-items', data);
};

// Update a critical item (government officials only)
export const updateCriticalItem = (itemId, data) => {
  return api.put(`/critical-items/${itemId}`, data);
};

// Get available critical items at stores near a location
export const getAvailableItems = (lat, lng, radius = 10) => {
  return api.get(`/critical-items/available?lat=${lat}&lng=${lng}&radius=${radius}`);
};

export default {
  getCriticalItems,
  getCriticalItem,
  createCriticalItem,
  updateCriticalItem,
  getAvailableItems
}; 