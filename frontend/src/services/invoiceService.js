import api from './api.js';

export const invoiceService = {
  getInvoices: async (params) => (await api.get('/invoices', { params })).data,
  getInvoiceById: async (id) => (await api.get(`/invoices/${id}`)).data,
  createInvoice: async (data) => (await api.post('/invoices', data)).data,
  updateInvoice: async (id, data) => (await api.put(`/invoices/${id}`, data)).data,
  deleteInvoice: async (id) => (await api.delete(`/invoices/${id}`)).data,
  downloadPDF: (id) => {
    const token = localStorage.getItem('medicore-token') || sessionStorage.getItem('medicore-token');
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    window.open(`${baseURL}/invoices/${id}/pdf?token=${token}`, '_blank');
  },
};