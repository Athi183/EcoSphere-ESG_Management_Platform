import api from './api';

export const transactionService = {
  getTransactions: async () => {
    const response = await api.get('/carbon-transactions');
    return response.data.data;
  },
  createTransaction: async (data) => {
    const response = await api.post('/carbon-transactions', data);
    return response.data.data;
  },
  deleteTransaction: async (id) => {
    const response = await api.delete(`/carbon-transactions/${id}`);
    return response.data;
  },
};

export default transactionService;
