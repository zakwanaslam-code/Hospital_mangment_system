import api from './api.js';

// Har module ke stats endpoints ek jagah se call karte hain
export const dashboardService = {
  getPatientStats: async () => (await api.get('/patients/stats/count')).data,
  getDoctorStats: async () => (await api.get('/doctors/stats/count')).data,
  getAppointmentStats: async () => (await api.get('/appointments/stats/today')).data,
  getRevenueStats: async () => (await api.get('/invoices/stats/revenue')).data,
  getPharmacyStats: async () => (await api.get('/pharmacy/stats')).data,
  getLabStats: async () => (await api.get('/lab/stats')).data,
};