import api from './api.js';

export const wardService = {
  getWards: async () => (await api.get('/wards')).data,
  getWardById: async (id) => (await api.get(`/wards/${id}`)).data,
  createWard: async (data) => (await api.post('/wards', data)).data,

  // 👇 ADD THIS
  updateWard: async (id, data) =>
    (await api.put(`/wards/${id}`, data)).data,

  updateBedStatus: async (id, data) =>
    (await api.put(`/wards/${id}/bed`, data)).data,

  deleteWard: async (id) =>
    (await api.delete(`/wards/${id}`)).data,
};