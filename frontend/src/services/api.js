import axios from 'axios';

// Backend base URL — apne .env me VITE_API_URL set karein (e.g. http://localhost:5000/api)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — token attach karega (jab auth backend ready hoga)
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('medicore-user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: auto-logout / redirect to login (Step 2/3 me wire karenge)
    }
    return Promise.reject(error);
  }
);

export default api;
