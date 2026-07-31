import api from './api.js';

export const labService = {
  getLabTests: async (params) => (await api.get('/lab', { params })).data,
  getLabTestById: async (id) => (await api.get(`/lab/${id}`)).data,
  createLabTest: async (data) => (await api.post('/lab', data)).data,
  updateLabTest: async (id, data) => (await api.put(`/lab/${id}`, data)).data,
  deleteLabTest: async (id) => (await api.delete(`/lab/${id}`)).data,
  uploadResult: async (id, file) => {
    const formData = new FormData();
    formData.append('resultFile', file);
    const { data } = await api.put(`/lab/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};