import api from './api';

// Get purchase history for the current user or all purchases for government officials
export const getPurchaseHistory = (params = {}) => {
  let queryParams = '';
  if (params.itemId) queryParams += `item_id=${params.itemId}&`;
  if (params.days) queryParams += `days=${params.days}&`;
  if (params.individualPrsId) queryParams += `individual_PRS_ID=${params.individualPrsId}&`;
  if (params.locationId) queryParams += `location_id=${params.locationId}&`;
  if (params.limit) queryParams += `limit=${params.limit}&`;
  
  return api.get(`/purchases?${queryParams}`);
};

// Record a purchase of a critical item
export const createPurchase = (data) => {
  return api.post('/purchases', data);
};

// Get recent purchases for a specific location (for merchant dashboard)
export const getLocationPurchases = (locationId, limit = 10) => {
  return api.get(`/purchases?location_id=${locationId}&limit=${limit}`);
};

export default {
  getPurchaseHistory,
  createPurchase,
  getLocationPurchases
}; 