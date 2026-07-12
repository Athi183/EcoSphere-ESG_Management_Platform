import api from './api';
import { toast } from 'react-hot-toast';

export const getCategories = async ({ skip = 0, limit = 100 } = {}) => {
  const response = await api.get('/categories', { params: { skip, limit } });
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data) => {
  try {
    const response = await api.post('/categories', data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Category created successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Failed to create category');
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Category updated successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Failed to update category');
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Category deleted successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Failed to delete category');
    throw error;
  }
};

export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
