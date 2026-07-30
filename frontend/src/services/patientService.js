import api from './api.js';

export const patientService = {
  getPatients: async (params) => (await api.get('/patients', { params })).data,
  getPatientById: async (id) => (await api.get(`/patients/${id}`)).data,
  createPatient: async (data) => (await api.post('/patients', data)).data,
  updatePatient: async (id, data) => (await api.put(`/patients/${id}`, data)).data,
  deletePatient: async (id) => (await api.delete(`/patients/${id}`)).data,
};