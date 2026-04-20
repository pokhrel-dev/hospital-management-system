import axios from 'axios';

// Professional Base Configuration
const api = axios.create({
  // This bridges the gap between local Maryland development and your future AWS URL
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
});

// Request Interceptor: Automatically attaches the JWT 'Passport'
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Handshake for AWS RDS
  }
  return config;
});

export default api;