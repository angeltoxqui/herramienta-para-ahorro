import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Wallet } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (Visible en Desktop) */}
      <Sidebar />

      {/* Contenido Principal */}
      <main className="flex-1 md:ml-64 transition-all duration-300">
        
        {/* Header Móvil (Solo visible en pantallas pequeñas) */}
        <header className="bg-white p-4 flex items-center justify-between border-b border-gray-200 md:hidden sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Wallet className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg text-gray-800">FinanzasApp</span>
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        {/* Área de Contenido Dinámico */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* AQUÍ se renderizan tus páginas (Dashboard, Ahorros, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;