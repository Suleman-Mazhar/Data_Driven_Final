import api from './api';

// Get all individuals (for government officials)
export const getAllIndividuals = (filters = {}) => {
  let queryParams = '';
  if (filters.name) queryParams += `name=${filters.name}&`;
  if (filters.minAge) queryParams += `min_age=${filters.minAge}&`;
  if (filters.maxAge) queryParams += `max_age=${filters.maxAge}&`;
  
  return api.get(`/individuals/?${queryParams}`);
};

// Get a specific individual
export const getIndividual = (prsId) => {
  return api.get(`/individuals/${prsId}`);
};

// Update an individual's information
export const updateIndividual = (prsId, data) => {
  return api.put(`/individuals/${prsId}`, data);
};

// Add a national identifier for the current user
export const addNationalIdentifier = (data) => {
  return api.post('/individuals/identifiers', data);
};

// Delete a national identifier
export const deleteNationalIdentifier = (identifierId) => {
  return api.delete(`/individuals/identifiers/${identifierId}`);
};

export default {
  getAllIndividuals,
  getIndividual,
  updateIndividual,
  addNationalIdentifier,
  deleteNationalIdentifier
}; 