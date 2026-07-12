import api from './api';

export const reportService = {
  getEnvironmental: async () => {
    const response = await api.get('/reports/environmental');
    return response.data.data;
  },
  getSocial: async () => {
    const response = await api.get('/reports/social');
    return response.data.data;
  },
  getGovernance: async () => {
    const response = await api.get('/reports/governance');
    return response.data.data;
  },
  getEsgSummary: async () => {
    const response = await api.get('/reports/esg-summary');
    return response.data.data;
  }
};
