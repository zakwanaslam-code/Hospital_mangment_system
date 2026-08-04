import api from './api.js';

export const pharmacyService = {
  getMedicines: async (params) => (await api.get('/pharmacy/medicines', { params })).data,
  getMedicineById: async (id) => (await api.get(`/pharmacy/medicines/${id}`)).data,
  addMedicine: async (data) => (await api.post('/pharmacy/medicines', data)).data,
  updateMedicine: async (id, data) => (await api.put(`/pharmacy/medicines/${id}`, data)).data,
  deleteMedicine: async (id) => (await api.delete(`/pharmacy/medicines/${id}`)).data,
  createSale: async (data) => (await api.post('/pharmacy/sales', data)).data,
  getStats: async () => (await api.get('/pharmacy/stats')).data,
};