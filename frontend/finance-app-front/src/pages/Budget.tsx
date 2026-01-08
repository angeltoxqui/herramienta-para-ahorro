import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Leaf } from 'lucide-react';
import PremiumLock from '../components/premium/PremiumLock';
import api from '../services/api'; // 👈 Importamos la conexión

// Definimos la estructura de lo que viene del backend
interface Category {
  id: number;
  name: string;
  limit_amount: number;
  spent_amount: number;
  icon: string;
  eco_score: 'low' | 'med' | 'high';
}

const Budget = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'subscriptions'>('categories');
  const [categories, setCategories] = useState<Category[]>([]); // 👈 Estado para datos reales
  const [loading, setLoading] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/budget/');
        setCategories(response.data);
      } catch (error) {
        console.error("Error cargando presupuesto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Alerta de Inflación (Se queda estática por ahora como "simulación IA") */}
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 items-start animate-fade-in">
        <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><TrendingUp size={20} /></div>
        <div className="flex-1">
          <h4 className="font-bold text-orange-800 text-sm">Alerta de Precios</h4>
          <p className="text-orange-700 text-xs mt-1">El gasto en Comida subió 5%. Sugerimos ajustar tu límite.</p>
        </div>
        <button className="bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-orange-700">Ajustar</button>
      </div>

      {/* Encabezado Dinámico */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Presupuesto Mensual</h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
            {/* Calculamos el restante real */}
            <span>Total Presupuestado: <span className="font-bold text-indigo-600">
              ${categories.reduce((acc, cat) => acc + cat.limit_amount, 0)}
            </span></span>
            <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
              <Leaf size={10} /> Eco-Score: A+
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button onClick={() => setActiveTab('categories')} className={`pb-3 text-sm font-medium transition-all ${activeTab === 'categories' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>Categorías</button>
        <button onClick={() => setActiveTab('subscriptions')} className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'subscriptions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>Suscripciones <Zap size={14} className="text-yellow-500 fill-yellow-500" /></button>
      </div>

      {/* LISTA DE CATEGORÍAS REALES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Cargando presupuesto...</p>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No tienes categorías configuradas.</p>
              <p className="text-xs text-gray-400 mt-1">Ve a Swagger para crear algunas por ahora.</p>
            </div>
          ) : (
            categories.map((cat) => {
              const percentage = Math.min((cat.spent_amount / cat.limit_amount) * 100, 100);
              const isOverLimit = cat.spent_amount > cat.limit_amount;
              
              // Asignar color según el Eco-Score (Lógica de frontend)
              let barColor = 'bg-blue-500';
              if (cat.eco_score === 'high') barColor = 'bg-red-400';
              if (cat.eco_score === 'med') barColor = 'bg-yellow-400';
              if (cat.eco_score === 'low') barColor = 'bg-green-500';

              return (
                <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-700 text-sm">{cat.name}</h3>
                        {cat.eco_score === 'high' && <span className="text-[10px] text-orange-500 flex items-center gap-0.5"><Leaf size={8} /> Alta huella</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${isOverLimit ? 'text-red-500' : 'text-gray-800'}`}>${cat.spent_amount}</span>
                      <span className="text-xs text-gray-400"> / ${cat.limit_amount}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${isOverLimit ? 'bg-red-500' : barColor}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Suscripciones (Se mantiene igual) */}
      {activeTab === 'subscriptions' && (
        <PremiumLock title="Gestor de Suscripciones">
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Tus Gastos Recurrentes</h3>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">Mensual: $45 USD</span>
            </div>
            {/* Lista estática por ahora */}
            <div className="space-y-4">
              {[{ name: 'Netflix Premium', price: 15, date: 'Día 12' }].map((sub, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">{sub.name.substring(0,2).toUpperCase()}</div>
                    <div><p className="font-bold text-gray-800">{sub.name}</p><p className="text-xs text-gray-500">Próximo: {sub.date}</p></div>
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