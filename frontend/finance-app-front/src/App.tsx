import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

// Componentes temporales (luego los haremos reales)
const Dashboard = () => <h1 className="text-2xl font-bold text-gray-800">Resumen Financiero</h1>;
const Budget = () => <h1 className="text-2xl font-bold text-gray-800">Control de Presupuesto</h1>;
const Savings = () => <h1 className="text-2xl font-bold text-gray-800">Mis Ahorros</h1>;
const Debts = () => <h1 className="text-2xl font-bold text-gray-800">Mis Deudas</h1>;
const Settings = () => <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="budget" element={<Budget />} />
            <Route path="savings" element={<Savings />} />
            <Route path="debts" element={<Debts />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;