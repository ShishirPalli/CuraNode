import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Patient endpoints
export const patients = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
};

// Action endpoints
export const actions = {
  create: (data) => api.post('/actions', data),
  getAll: () => api.get('/actions'),
  getForPatient: (patientId) => api.get(`/actions/patient/${patientId}`),
  getById: (id) => api.get(`/actions/${id}`),
  updateStatus: (id, status, completionNotes) =>
    api.put(`/actions/${id}/status`, { status, completionNotes }),
  addNote: (id, note) => api.post(`/actions/${id}/notes`, { note }),
};

export default api;
