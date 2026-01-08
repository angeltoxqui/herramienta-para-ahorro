import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// INTERCEPTOR: Antes de enviar cualquier petición...
api.interceptors.request.use((config) => {
  // Busca el token en la caja fuerte del navegador (localStorage)
  const token = localStorage.getItem('token');
  
  // Si existe, lo pega en el encabezado como un sello
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;