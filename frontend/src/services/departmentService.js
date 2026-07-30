import api from './api.js';

export const departmentService = {
  getDepartments: async () => (await api.get('/departments')).data,
};