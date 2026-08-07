import api from './api.js';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/auth/profile'); // backend route /auth/profile hai, /auth/me nahi
    return data;
  },
  updateProfile: async (payload) => {
    const { data } = await api.put('/auth/update-profile', payload);
    return data;
  },
  updatePassword: async (payload) => {
    const { data } = await api.put('/auth/change-password', payload);
    return data;
  },
};