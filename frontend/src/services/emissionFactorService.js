import api from './api';
import { toast } from 'react-hot-toast';

export const getEmissionFactors = async ({ skip = 0, limit = 100 } = {}) => {
  const response = await api.get('/emission-factors', { params: { skip, limit } });
  return response.data;
};

export const getEmissionFactorById = async (id) => {
  const response = await api.get(`/emission-factors/${id}`);
  return response.data;
};

export const createEmissionFactor = async (data) => {
  try {
    const response = await api.post('/emission-factors', data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Emission factor created successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Failed to create emission factor');
    throw error;
  }
};

export const updateEmissionFactor = async (id, data) => {
  try {
    const response = await api.put(`/emission-factors/${id}`, data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Emission factor updated successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Failed to update emission factor');
    throw error;
  }
};

export const deleteEmissionFactor = async (id) => {
  try {
    const response = await api.delete(`/emission-factors/${id}`);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Emission factor deleted successfully');
    return response.data;
  } catch (error) {
    let errorMessage = error.response?.data?.message;
    if (!errorMessage && error.message === 'Network Error') {
      errorMessage = 'Cannot delete this emission factor because it is used in existing carbon transactions.';
    }
    toast.error(errorMessage || error.message || 'Failed to delete emission factor');
    throw error;
  }
};
