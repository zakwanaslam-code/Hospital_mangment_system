import api from './api.js';

export const staffService = {
  getStaff: async (params) => (await api.get('/staff', { params })).data,
  createStaff: async (data) => (await api.post('/staff', data)).data,
  updateStaff: async (id, data) => (await api.put(`/staff/${id}`, data)).data,
  deleteStaff: async (id) => (await api.delete(`/staff/${id}`)).data,
};