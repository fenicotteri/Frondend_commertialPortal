// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5083',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен авторизации автоматически ко всем запросам
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
