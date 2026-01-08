import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, revisamos si ya hay un token guardado
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      // Aquí podríamos verificar con el backend si el token sigue vivo
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 1. Pedimos el token al backend (form-data)
      const formData = new FormData();
      formData.append('username', email); // FastAPI espera 'username' aunque sea email
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      
      // 2. Guardamos los datos que nos dio el backend
      const { access_token, user_name, is_premium } = response.data;
      
      const userData = { name: user_name, email };

      // 3. Guardar en localStorage (Persistencia)
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      // 4. Actualizar estado de la App
      setUser(userData);
      setIsPremium(is_premium);
      setIsAuthenticated(true);

    } catch (error) {
      console.error("Error de login:", error);
      throw new Error("Email o contraseña incorrectos");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const upgradeToPremium = () => setIsPremium(true);

  if (loading) return <div>Cargando...</div>;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isPremium, login, logout, upgradeToPremium }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};