import React, { useState } from 'react';
import { User, CreditCard, Bell, Shield, LogOut, ChevronRight, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, isPremium, upgradeToPremium, logout } = useAuth();
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>

      {/* 1. Tarjeta de Perfil */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 border-4 border-white shadow-sm">
            {user?.name.charAt(0)}
          </div>
          {isPremium && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-1.5 rounded-full shadow-md">
              <Crown size={16} fill="currentColor" />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            {isPremium ? 'Plan Premium 🌟' : 'Plan Gratuito'}
          </div>
        </div>

        {!isPremium && (
          <button 
            onClick={upgradeToPremium}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Mejorar Cuenta
          </button>
        )}
      </div>

      {/* 2. Preferencias Generales */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-700">Preferencias</div>
        
        {/* Moneda */}
        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CreditCard size={20} /></div>
            <div>
              <p className="font-medium text-gray-800">Moneda Principal</p>
              <p className="text-xs text-gray-500">Elige en qué divisa ver tus balances</p>
            </div>
          </div>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-100 border-none text-gray-700 text-sm font-bold py-2 px-3 rounded-lg focus:ring-0 cursor-pointer"
          >
            <option value="USD">USD ($)</option>
            <option value="COP">COP ($)</option>
            <option value="MXN">MXN ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* Notificaciones */}
        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Bell size={20} /></div>
            <div>
              <p className="font-medium text-gray-800">Notificaciones</p>
              <p className="text-xs text-gray-500">Alertas de pagos y límites de presupuesto</p>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>

      {/* 3. Seguridad y Zona de Peligro */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-700">Cuenta</div>

        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><Shield size={20} /></div>
            <p className="font-medium text-gray-800">Cambiar Contraseña</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-red-600 font-bold py-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;