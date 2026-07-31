import api from './api.js';

export const departmentService = {
  getDepartments: async () => (await api.get('/departments')).data,
  getDepartmentById: async (id) => (await api.get(`/departments/${id}`)).data,
  createDepartment: async (data) => (await api.post('/departments', data)).data,
  updateDepartment: async (id, data) => (await api.put(`/departments/${id}`, data)).data,
  deleteDepartment: async (id) => (await api.delete(`/departments/${id}`)).data,
};