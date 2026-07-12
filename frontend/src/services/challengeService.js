import api from './api';

export const getChallenges = async ({ skip = 0, limit = 100 } = {}) => {
  const response = await api.get('/challenges', { params: { skip, limit } });
  return response.data;
};

export const getChallengeById = async (id) => {
  const response = await api.get(`/challenges/${id}`);
  return response.data;
};

export const createChallenge = async (data) => {
  const response = await api.post('/challenges', data);
  return response.data;
};

export const updateChallenge = async (id, data) => {
  const response = await api.put(`/challenges/${id}`, data);
  return response.data;
};

export const deleteChallenge = async (id) => {
  const response = await api.delete(`/challenges/${id}`);
  return response.data;
};
