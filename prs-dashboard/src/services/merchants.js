import api from './api';

// Get all merchants
export const getMerchants = () => {
  return api.get('/merchants');
};

// Get a specific merchant
export const getMerchant = (merchantId) => {
  return api.get(`/merchants/${merchantId}`);
};

// Create a new merchant (government officials only)
export const createMerchant = (data) => {
  return api.post('/merchants', data);
};

// Add a store location for a merchant
export const addStoreLocation = (data) => {
  return api.post('/merchants/locations', data);
};

// Get store locations for the current merchant
export const getStoreLocations = () => {
  return api.get('/merchants/locations');
};

// Update stock level for a critical item at a store location
export const updateStockLevel = (data) => {
  return api.post('/merchants/stock', data);
};

// Get stock levels for a specific location
export const getStockLevels = (locationId) => {
  return api.get(`/merchants/stock?location_id=${locationId}`);
};

export default {
  getMerchants,
  getMerchant,
  createMerchant,
  addStoreLocation,
  getStoreLocations,
  updateStockLevel,
  getStockLevels
}; 