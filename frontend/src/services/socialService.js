import api from './api';

// CSR Activities
export const getCsrActivities = async ({ skip = 0, limit = 100 } = {}) => {
  const response = await api.get('/csr-activities', { params: { skip, limit } });
  return response.data;
};

export const createCsrActivity = async (data) => {
  const response = await api.post('/csr-activities', data);
  return response.data;
};

// Policies
export const getPolicies = async ({ skip = 0, limit = 100 } = {}) => {
  const response = await api.get('/policies', { params: { skip, limit } });
  return response.data;
};

export const createPolicy = async (data) => {
  const response = await api.post('/policies', data);
  return response.data;
};
