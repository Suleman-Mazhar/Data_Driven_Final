import api from './api';

// Get vaccination records for the current user or a specific individual
export const getVaccinationRecords = (individualPrsId = null) => {
  let url = '/vaccinations';
  if (individualPrsId) {
    url += `?individual_PRS_ID=${individualPrsId}`;
  }
  return api.get(url);
};

// Get details of a specific vaccination record
export const getVaccinationRecord = (vaccinationId) => {
  return api.get(`/vaccinations/${vaccinationId}`);
};

// Create a new vaccination record
export const createVaccinationRecord = (data) => {
  return api.post('/vaccinations', data);
};

// Upload a document for a vaccination record
export const uploadVaccinationDocument = (vaccinationId, file) => {
  const formData = new FormData();
  formData.append('vaccination_id', vaccinationId);
  formData.append('file', file);
  
  return api.post(`/vaccinations/${vaccinationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Process and store FHIR vaccination data
export const processFHIRData = (fhirData) => {
  return api.post('/vaccinations/fhir', fhirData);
};

// Verify a vaccination record (government officials only)
export const verifyVaccination = (vaccinationId, status) => {
  return api.put(`/vaccinations/${vaccinationId}/verify`, { status });
};

export default {
  getVaccinationRecords,
  getVaccinationRecord,
  createVaccinationRecord,
  uploadVaccinationDocument,
  processFHIRData,
  verifyVaccination
}; 