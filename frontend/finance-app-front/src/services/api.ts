import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// ==========================================
// 1. INTERCEPTORES (Seguridad) 🛡️
// ==========================================

// Request: Pega el token en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Si el token venció (401), nos manda al Login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Sesión expirada. Redirigiendo al login...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 2. FUNCIONES DEL DETECTIVE (Analysis) 🧠
// ==========================================
// 👇 Esto es lo que faltaba y causaba el error
export const analysis = {
  // Escanear gastos (Llamar al detective)
  scan: async () => {
    const response = await api.post('/analysis/scan-recurring');
    return response.data;
  },
  
  // Obtener los detectados (Para mostrar la lista)
  getDetected: async () => {
    const response = await api.get('/analysis/');
    return response.data;
  },
  
  // Responder (Confirmar o Ignorar)
  respond: async (id: number, action: 'confirm' | 'ignore') => {
    // Nota: action debe enviarse como query param: ?action=confirm
    const response = await api.patch(`/analysis/${id}?action=${action}`);
    return response.data;
  }
};

export default api;