import api from './api';

export const departmentService = {
  getDepartments: async () => {
    const response = await api.get('/departments/');
    return response.data.data;
  },
};
