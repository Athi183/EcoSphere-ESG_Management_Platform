import api from './api';
import { toast } from 'react-hot-toast';

export const getDepartments = async ({ skip = 0, limit = 100 } = {}) => {
  const response = await api.get('/departments', { params: { skip, limit } });
  return response.data;
};

export const getDepartmentById = async (id) => {
  const response = await api.get(`/departments/${id}`);
  return response.data;
};

export const createDepartment = async (data) => {
  try {
    const response = await api.post('/departments', data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Department created successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Failed to create department');
    throw error;
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const response = await api.put(`/departments/${id}`, data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Department updated successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Failed to update department');
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/departments/${id}`);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Department deleted successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Failed to delete department');
    throw error;
  }
};

export const departmentService = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

export default departmentService;
