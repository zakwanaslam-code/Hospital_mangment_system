import api from './api.js';

export const doctorService = {
  getDoctors: async (params) => (await api.get('/doctors', { params })).data,
  getDoctorById: async (id) => (await api.get(`/doctors/${id}`)).data,
  createDoctor: async (data) => (await api.post('/doctors', data)).data,
  updateDoctor: async (id, data) => (await api.put(`/doctors/${id}`, data)).data,
  deleteDoctor: async (id) => (await api.delete(`/doctors/${id}`)).data,
  getMyProfile: async () => (await api.get('/doctors/me/profile')).data,
  updateMyProfile: async (data) => (await api.put('/doctors/me/profile', data)).data,
};