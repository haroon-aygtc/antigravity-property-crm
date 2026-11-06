import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
};

export const propertiesAPI = {
  getAll: (params?: any) => api.get('/properties', { params }),
  getById: (id: string) => api.get(`/properties/${id}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
};

export const leadsAPI = {
  create: (data: any) => api.post('/leads', data),
  getAll: (params?: any) => api.get('/leads', { params }),
  update: (id: string, data: any) => api.put(`/leads/${id}`, data),
};

export const contactAPI = {
  submit: (data: any) => api.post('/contact', data),
};

export const subscriptionsAPI = {
  subscribe: (email: string) => api.post('/subscriptions', { email }),
};

export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
};

export default api;
