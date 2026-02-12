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
  console.log('API Request to:', config.url, 'Token present:', !!token, 'Token:', token ? token.substring(0, 20) + '...' : 'null');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('⚠️ NO TOKEN FOUND IN LOCALSTORAGE!');
  }
  return config;
});

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✓ Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

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
