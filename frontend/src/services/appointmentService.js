import api from './api.js';

export const appointmentService = {
  getAppointments: async (params) => (await api.get('/appointments', { params })).data,
  getAppointmentById: async (id) => (await api.get(`/appointments/${id}`)).data,
  createAppointment: async (data) => (await api.post('/appointments', data)).data,
  updateAppointment: async (id, data) => (await api.put(`/appointments/${id}`, data)).data,
  deleteAppointment: async (id) => (await api.delete(`/appointments/${id}`)).data,
};