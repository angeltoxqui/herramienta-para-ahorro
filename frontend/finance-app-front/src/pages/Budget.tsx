import React, { useState } from 'react';
import { Wallet, Zap, Plus, AlertTriangle, Leaf, TrendingUp } from 'lucide-react';
import PremiumLock from '../components/premium/PremiumLock';

const Budget = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'subscriptions'>('categories');

  // Datos dummy con "Huella de Carbono" (NUEVO)
  const categories = [
    { id: 1, name: 'Vivienda', limit: 1200, spent: 1200, icon: '🏠', color: 'bg-blue-500', eco: 'low' },
    { id: 2, name: 'Comida', limit: 600, spent: 450, icon: '🍔', color: 'bg-green-500', eco: 'high' }, 
    { id: 3, name: 'Transporte', limit: 200, spent: 180, icon: '🚌', color: 'bg-yellow-500', eco: 'med' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Alerta de Inflación / IA (NUEVO - SE QUEDA) */}
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 items-start">
        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
          <TrendingUp size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-orange-800 text-sm">Alerta de Precios</h4>
          <p className="text-orange-700 text-xs mt-1">
            El gasto en <strong>Comida</strong> subió 5%. Sugerimos ajustar tu límite.
          </p>
        </div>
        <button className="bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-orange-700">Ajustar</button>
      </div>

      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Presupuesto Mensual</h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
            <span>Restante: <span className="font-bold text-green-600">$450</span></span>
            <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
              <Leaf size={10} /> Eco-Score: A+
            </span>
          </div>
        </div>
        
        {/* Gráfico circular */}
        <div className="flex items-center gap-6">
          <div className="relative w-16 h-16 rounded-full" style={{ background: 'conic-gradient(#4F46E5 75%, #E5E7EB 0)' }}>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600">75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 text-sm font-medium transition-all ${activeTab === 'categories' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Categorías
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'subscriptions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Suscripciones <Zap size={14} className="text-yellow-500 fill-yellow-500" />
        </button>
      </div>

      {/* Categorías (Visual Eco mantenido) */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {categories.map((cat) => {
            const percentage = Math.min((cat.spent / cat.limit) * 100, 100);
            return (
              <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-700 text-sm">{cat.name}</h3>
                      {cat.eco === 'high' && <span className="text-[10px] text-orange-500 flex items-center gap-0.5"><Leaf size={8} /> Alta huella</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">${cat.spent}</span>
                    <span className="text-xs text-gray-400"> / ${cat.limit}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suscripciones (CONTENIDO ORIGINAL RECUPERADO DENTRO DEL LOCK) */}
      {activeTab === 'subscriptions' && (
        <PremiumLock title="Gestor de Suscripciones">
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Tus Gastos Recurrentes</h3>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">Mensual: $45 USD</span>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Netflix Premium', price: 15, date: 'Día 12' },
                { name: 'Spotify Duo', price: 10, date: 'Día 24' },
                { name: 'Gimnasio', price: 20, date: 'Día 01' }
              ].map((sub, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      {sub.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{sub.name}</p>
                      <p className="text-xs text-gray-500">Próximo cobro: {sub.date}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-800">-${sub.price}</p>
                </div>
              ))}
            </div>
          </div>
        </PremiumLock>
      )}
    </div>
  );
};

export default Budget;