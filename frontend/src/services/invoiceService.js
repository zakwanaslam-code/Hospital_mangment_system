import api from './api.js';

export const invoiceService = {
  getInvoices: async (params) => (await api.get('/invoices', { params })).data,
  getInvoiceById: async (id) => (await api.get(`/invoices/${id}`)).data,
  createInvoice: async (data) => (await api.post('/invoices', data)).data,
  updateInvoice: async (id, data) => (await api.put(`/invoices/${id}`, data)).data,
  deleteInvoice: async (id) => (await api.delete(`/invoices/${id}`)).data,

  // fetch + blob approach — popup blocker se bachne ke liye, aur reliable download trigger karta hai
  downloadPDF: async (id, invoiceNumber) => {
    try {
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob', // PDF binary data ke liye zaroori
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceNumber || 'invoice'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
      throw err;
    }
  },
};