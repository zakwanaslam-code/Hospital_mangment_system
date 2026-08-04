import api from './api.js';

export const reportService = {
  getOverview: async (params) => (await api.get('/reports/overview', { params })).data,
};