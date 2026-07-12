import api from './api';

export const getBadges = async () => {
  const response = await api.get('/gamification/badges');
  return response.data; // array of badges
};

export const getLeaderboard = async () => {
  const response = await api.get('/gamification/leaderboard');
  return response.data; // array of leaderboard entries
};

export const joinActivity = async (data) => {
  const response = await api.post('/gamification/participate', data);
  return response.data;
};

export const getParticipations = async () => {
  const response = await api.get('/gamification/participations');
  return response.data;
};

export const approveParticipation = async (partId, points = 50) => {
  const response = await api.post(`/gamification/participations/${partId}/approve?points=${points}`);
  return response.data;
};

export const joinChallenge = async (data) => {
  const response = await api.post('/gamification/challenges/participate', data);
  return response.data;
};
