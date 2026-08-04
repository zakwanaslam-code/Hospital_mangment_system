import api from './api.js';

export const inventoryService = {
  getItems: async (params) => (await api.get('/inventory', { params })).data,
  createItem: async (data) => (await api.post('/inventory', data)).data,
  updateItem: async (id, data) => (await api.put(`/inventory/${id}`, data)).data,
  deleteItem: async (id) => (await api.delete(`/inventory/${id}`)).data,
};