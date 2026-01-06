import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PremiumLockProps {
  children: React.ReactNode;
  title?: string;
}

const PremiumLock = ({ children, title = "Función Premium" }: PremiumLockProps) => {
  const { isPremium, upgradeToPremium } = useAuth();

  // Si es premium, mostramos el contenido normal
  if (isPremium) {
    return <>{children}</>;
  }

  // Si es GRATIS, mostramos el candado y el contenido borroso de fondo
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200">
      {/* Contenido borroso y no clicable */}
      <div className="filter blur-sm select-none pointer-events-none opacity-50 p-4">
        {children}
      </div>

      {/* Capa de bloqueo (Overlay) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-sm mx-4 border border-indigo-100">
          <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="text-indigo-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Desbloquea esta herramienta avanzada y toma el control total.
          </p>
          <button 
            onClick={upgradeToPremium}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2.5 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Crown size={18} />
            Desbloquear por $1
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumLock;