import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Trophy } from 'lucide-react';
import PremiumLock from '../components/premium/PremiumLock';
import api from '../services/api';

// Definimos la estructura de datos que viene del backend
interface SavingGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  image_url?: string;
  type: string;
}

const Savings = () => {
  const [activeTab, setActiveTab] = useState<'my-goals' | 'challenges'>('my-goals');
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get('/savings/');
        setGoals(response.data);
      } catch (error) {
        console.error("Error cargando metas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const totalSaved = goals.reduce((acc, g) => acc + g.current_amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Resumen */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Ahorro Total Acumulado</p>
            <h1 className="text-4xl font-bold">${totalSaved.toLocaleString()}</h1>
          </div>
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Trophy size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button onClick={() => setActiveTab('my-goals')} className={`pb-3 text-sm font-medium transition-all ${activeTab === 'my-goals' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}>Mis Metas</button>
        <button onClick={() => setActiveTab('challenges')} className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'challenges' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}>Retos Comunitarios <TrendingUp size={14} className="text-orange-500" /></button>
      </div>

      {/* GRID DE METAS REALES */}
      {activeTab === 'my-goals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta para crear nueva (Visual por ahora) */}
          <button className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all group h-full min-h-[200px]">
            <div className="bg-gray-100 p-4 rounded-full mb-3 group-hover:bg-white transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-bold">Nueva Meta</span>
          </button>

          {loading ? (
             <p className="text-gray-400 p-10 col-span-1">Cargando metas...</p>
          ) : goals.map((goal) => {
            const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
            
            return (
              <div key={goal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-32 bg-gray-200 relative">
                  {/* Si tuviéramos imagen real la pondríamos aquí */}
                  <img src={goal.image_url || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800"} alt={goal.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white font-bold text-lg">{goal.name}</h3>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Progreso</span>
                      <span className="font-bold text-emerald-600">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                      <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-800">${goal.current_amount.toLocaleString()}</span>
                      <span className="text-gray-400">de ${goal.target_amount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 py-2 border border-emerald-100 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-colors text-sm">
                    + Agregar Fondos
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Retos (Premium) - Se queda igual */}
      {activeTab === 'challenges' && (
        <PremiumLock title="Retos de Ahorro">
           <div className="p-10 text-center text-gray-500">Contenido Premium</div>
        </PremiumLock>
      )}
    </div>
  );
};

export default Savings;