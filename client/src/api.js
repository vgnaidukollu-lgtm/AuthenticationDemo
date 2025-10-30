import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api'
});

// Request interceptor
API.interceptors.request.use(async config => {
  // Add auth token if present
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/demo') {
        window.location.href = '/demo';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
