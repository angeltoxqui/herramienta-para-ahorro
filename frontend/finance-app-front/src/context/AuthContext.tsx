import React, { createContext, useContext, useState } from 'react';

// Definimos qué datos tendrá nuestro contexto
interface AuthContextType {
  user: { name: string; email: string } | null;
  isPremium: boolean; // ¡Esta es la clave!
  login: () => void;
  logout: () => void;
  upgradeToPremium: () => void; // Función para simular el pago
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado inicial: Usuario logueado pero GRATIS (false)
  const [user, setUser] = useState({ name: "Usuario Demo", email: "test@app.com" });
  const [isPremium, setIsPremium] = useState(false); 

  const login = () => setUser({ name: "Usuario Demo", email: "test@app.com" });
  const logout = () => setUser(null);
  
  // Simular que pagó
  const upgradeToPremium = () => setIsPremium(true);

  return (
    <AuthContext.Provider value={{ user, isPremium, login, logout, upgradeToPremium }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};