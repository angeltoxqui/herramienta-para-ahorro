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
// 2. DEFINICIÓN DE TIPOS 📝
// ==========================================
export interface CreateTransactionDTO {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date?: string;
  debt_id?: number;
  saving_goal_id?: number; // 🟢 NUEVO: Campo para vincular meta
}

// ==========================================
// 3. FUNCIONES DE API 🛠️
// ==========================================

// Crear transacción (ahora soporta saving_goal_id)
export const createTransaction = async (transaction: CreateTransactionDTO) => {
  const response = await api.post('/transactions/', transaction);
  return response.data;
};

// ==========================================
// 4. FUNCIONES DEL DETECTIVE (Analysis) 🧠
// ==========================================
export const analysis = {
  scan: async () => {
    const response = await api.post('/analysis/scan-recurring');
    return response.data;
  },
  
  getDetected: async () => {
    const response = await api.get('/analysis/');
    return response.data;
  },
  
  respond: async (id: number, action: 'confirm' | 'ignore') => {
    const response = await api.patch(`/analysis/${id}?action=${action}`);
    return response.data;
  }
};

export default api;