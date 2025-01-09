// src/axiosConfig.js

import axios from 'axios';

// Crea la instancia de Axios con tu URL base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api', // Asegúrate de que tu backend Flask está corriendo en este puerto
  // Ajusta si tu backend corre en otro lugar
});

// Interceptor para agregar el token si existe
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
