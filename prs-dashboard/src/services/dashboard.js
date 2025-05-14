import api from './api';

// Get statistical data for the government dashboard
export const getDashboardStats = () => {
  return api.get('/dashboard/stats');
};

// Get alerts for the government dashboard
export const getAlerts = (status, severity, limit = 20) => {
  let queryParams = '';
  if (status) queryParams += `status=${status}&`;
  if (severity) queryParams += `severity=${severity}&`;
  if (limit) queryParams += `limit=${limit}&`;
  
  return api.get(`/dashboard/alerts?${queryParams}`);
};

// Get vaccination statistics for the government dashboard
export const getVaccinationStats = () => {
  return api.get('/dashboard/vaccination-stats');
};

// Get stock statistics for the government dashboard
export const getStockStats = () => {
  return api.get('/dashboard/stock-stats');
};

export default {
  getDashboardStats,
  getAlerts,
  getVaccinationStats,
  getStockStats
}; 