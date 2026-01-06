import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  PiggyBank, 
  CreditCard, 
  Settings, 
  LogOut,
  Crown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isPremium, upgradeToPremium } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Resumen', path: '/' },
    { icon: <Wallet size={20} />, label: 'Presupuesto', path: '/budget' },
    { icon: <PiggyBank size={20} />, label: 'Ahorros', path: '/savings' },
    { icon: <CreditCard size={20} />, label: 'Deudas', path: '/debts' },
    { icon: <Settings size={20} />, label: 'Configuración', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 hidden md:flex">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Wallet className="text-white" size={24} />
        </div>
        <span className="font-bold text-xl text-gray-800">FinanzasApp</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sección Premium (Solo visible si es GRATIS) */}
      {!isPremium && (
        <div className="p-4 m-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={20} className="text-yellow-300" />
            <h3 className="font-bold text-sm">Plan Premium</h3>
          </div>
          <p className="text-xs text-indigo-100 mb-3">
            Desbloquea plantillas automáticas y elimina anuncios.
          </p>
          <button 
            onClick={upgradeToPremium}
            className="w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Mejorar por $1 USD
          </button>
        </div>
      )}

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition-colors w-full px-4">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;