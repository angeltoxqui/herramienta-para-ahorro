import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Leaf, 
  Wallet, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  AlertOctagon,
  ArrowRight // 👈 Nuevo icono para el botón de cerrar mes
} from 'lucide-react';
import PremiumLock from '../components/premium/PremiumLock';
import api from '../services/api';

// Definimos la estructura de lo que viene del backend
interface Category {
  id: number;
  name: string;
  limit_amount: number;
  spent_amount: number;
  rollover_amount: number; // 👈 Campo nuevo para el ahorro acumulado
  icon: string;
  eco_score: 'low' | 'med' | 'high';
}

const Budget = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'subscriptions'>('categories');
  const [categories, setCategories] = useState<Category[]>([]); 
  const [loading, setLoading] = useState(true);

  // Cargar datos
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

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🟢 Lógica de Cierre de Mes (Rollover)
  const handleRollover = async () => {
    if(!window.confirm("¿Cerrar el mes actual? \n\nEsto pondrá tus gastos en 0 y sumará lo que te sobró al presupuesto del siguiente mes.")) return;
    try {
      const res = await api.post('/budget/reset-month');
      alert(`✅ ¡Mes cerrado! Se transfirieron ahorros en ${res.data.details.length} categorías.`);
      fetchCategories(); // Recargar para ver los cambios
    } catch (error) {
      alert("Error cerrando el mes.");
    }
  };

  // --- 🧠 LÓGICA DE ALERTAS ---
  const getBudgetStatus = (spent: number, limit: number) => {
    if (limit === 0) return { status: 'normal', message: '' };
    const percentage = (spent / limit) * 100;
    
    if (percentage >= 100) return { status: 'critical', message: '¡Has excedido tu límite!' };
    if (percentage >= 85) return { status: 'warning', message: 'Cuidado, estás cerca del límite.' };
    return { status: 'normal', message: 'Todo bajo control.' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertOctagon size={18} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={18} className="text-yellow-500" />;
      default: return <CheckCircle size={18} className="text-green-500" />;
    }
  };
  // ------------------------------------------------------------

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Alerta de Inflación (IA Simulada) */}
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 items-start">
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
            <span>Total Base: <span className="font-bold text-indigo-600">
              ${categories.reduce((acc, cat) => acc + cat.limit_amount, 0)}
            </span></span>
            
            {/* 🟢 Mostrar total acumulado de Rollover si existe */}
            {categories.some(c => c.rollover_amount > 0) && (
               <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                 <TrendingUp size={10} />
                 + ${categories.reduce((acc, cat) => acc + cat.rollover_amount, 0)} Ahorros
               </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* 🟢 Botón Cerrar Mes */}
          <button 
            onClick={handleRollover}
            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-200 transition-colors text-sm font-bold"
          >
            <ArrowRight size={18} />
            <span>Cerrar Mes</span>
          </button>
          
          <button 
            onClick={() => alert("Próximamente: Modal para crear categoría")} 
            className="bg-gray-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors text-sm font-bold"
          >
            <Plus size={18} />
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button onClick={() => setActiveTab('categories')} className={`pb-3 text-sm font-medium transition-all ${activeTab === 'categories' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>Categorías</button>
        <button onClick={() => setActiveTab('subscriptions')} className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'subscriptions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>Suscripciones <Zap size={14} className="text-yellow-500 fill-yellow-500" /></button>
      </div>

      {/* LISTA DE CATEGORÍAS REALES + LÓGICA VISUAL MEJORADA */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Cargando presupuesto...</p>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Wallet className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No tienes categorías configuradas.</p>
              <p className="text-xs text-gray-400 mt-1">Ve a Swagger para crear algunas por ahora.</p>
            </div>
          ) : (
            categories.map((cat) => {
              // 🟢 Cálculos ajustados para incluir Rollover
              const totalLimit = cat.limit_amount + cat.rollover_amount;
              // Evitar división por cero
              const percentage = totalLimit > 0 ? Math.min((cat.spent_amount / totalLimit) * 100, 100) : 0;
              
              const { status, message } = getBudgetStatus(cat.spent_amount, totalLimit);
              
              // Color de barra (Prioridad: Alerta > Eco-Score)
              let barColor = 'bg-blue-500';
              if (status === 'critical') barColor = 'bg-red-500';
              else if (status === 'warning') barColor = 'bg-yellow-500';
              else if (cat.eco_score === 'high') barColor = 'bg-orange-400';
              else if (cat.eco_score === 'low') barColor = 'bg-green-500';

              return (
                <div key={cat.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm animate-fade-in hover:shadow-md transition-shadow">
                  
                  {/* Fila Superior */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-gray-50 p-2 rounded-lg">{cat.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{cat.name}</h3>
                        <div className="flex items-center gap-2">
                           <p className={`text-xs font-medium ${status === 'critical' ? 'text-red-500' : status === 'warning' ? 'text-yellow-600' : 'text-gray-400'}`}>
                             {message || (cat.eco_score === 'high' ? 'Alta huella de carbono' : 'Consumo normal')}
                           </p>
                        </div>
                      </div>
                    </div>
                    {getStatusIcon(status)}
                  </div>

                  {/* Fila Números */}
                  <div className="flex justify-between items-end mb-2">
                     <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${status === 'critical' ? 'text-red-500' : 'text-gray-800'}`}>
                          ${cat.spent_amount}
                        </span>
                        <span className="text-xs text-gray-400"> / ${cat.limit_amount}</span>
                        
                        {/* 🟢 Visualización del Rollover (Bono Verde) */}
                        {cat.rollover_amount > 0 && (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-1 border border-green-100">
                            +{cat.rollover_amount} extra
                          </span>
                        )}
                     </div>
                     <span className={`text-xs font-bold ${status === 'critical' ? 'text-red-500' : 'text-gray-600'}`}>
                       {percentage.toFixed(0)}%
                     </span>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${percentage}%` }}></div>
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