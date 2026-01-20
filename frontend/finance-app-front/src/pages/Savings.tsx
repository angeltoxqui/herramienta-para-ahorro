import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Trophy } from 'lucide-react';
import PremiumLock from '../components/premium/PremiumLock';
// Importamos la API y el helper de transacción
import api, { createTransaction } from '../services/api'; 
// Importamos el nuevo componente
import TransferModal from '../components/TransferModal';

// Definimos la estructura de datos
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

  // 🟢 ESTADOS PARA EL MODAL DE TRANSFERENCIA
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);

  // Función para cargar metas (la sacamos fuera del useEffect para reusarla)
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/savings/');
      setGoals(response.data);
    } catch (error) {
      console.error("Error cargando metas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalSaved = goals.reduce((acc, g) => acc + g.current_amount, 0);

  // 🟢 1. ABRIR EL MODAL
  const handleOpenTransfer = (goal: SavingGoal) => {
    setSelectedGoal(goal);
    setTransferModalOpen(true);
  };

  // 🟢 2. PROCESAR LA TRANSFERENCIA
  const handleConfirmTransfer = async (amount: number) => {
    if (!selectedGoal) return;

    try {
      // Enviamos la transacción con saving_goal_id
      await createTransaction({
        amount: amount,
        type: 'expense', // Sale de tu bolsillo
        category: 'Ahorro',
        description: `Abono a meta: ${selectedGoal.name}`,
        saving_goal_id: selectedGoal.id // 👈 El vínculo mágico
      });

      // Cerramos modal
      setTransferModalOpen(false);
      
      // Opción A: Recargar todo desde el backend (Más seguro)
      // await fetchGoals(); 

      // Opción B: Actualizar localmente para feedback instantáneo (Más rápido)
      setGoals(prevGoals => prevGoals.map(g => 
        g.id === selectedGoal.id 
          ? { ...g, current_amount: g.current_amount + amount }
          : g
      ));

      // Feedback simple (puedes usar un toast aquí)
      // alert("¡Ahorro registrado!"); 

    } catch (error) {
      console.error("Error al transferir:", error);
      alert("Hubo un error al procesar la transferencia.");
    }
  };

  return (
    <div className="space-y-6">
      
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

      {/* GRID DE METAS */}
      {activeTab === 'my-goals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta Nueva Meta */}
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
                      <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-800">${goal.current_amount.toLocaleString()}</span>
                      <span className="text-gray-400">de ${goal.target_amount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* 🟢 3. BOTÓN CONECTADO */}
                  <button 
                    onClick={() => handleOpenTransfer(goal)}
                    className="w-full mt-4 py-2 border border-emerald-100 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <span>💰</span> Agregar Fondos
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Retos */}
      {activeTab === 'challenges' && (
        <PremiumLock title="Retos de Ahorro">
           <div className="p-10 text-center text-gray-500">Contenido Premium</div>
        </PremiumLock>
      )}

      {/* 🟢 4. EL MODAL */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onConfirm={handleConfirmTransfer}
        goalName={selectedGoal?.name || ''}
      />
    </div>
  );
};

export default Savings;