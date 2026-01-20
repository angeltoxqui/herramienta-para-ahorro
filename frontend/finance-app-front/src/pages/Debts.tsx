import React, { useState, useEffect } from 'react';
import { CreditCard, Zap, RefreshCw, Plus } from 'lucide-react';
import api from '../services/api';

// Definimos la interfaz basada en tu Backend
interface Debt {
  id: number;
  name: string;
  total_amount: number;
  current_balance: number;
  interest_rate: number;
  min_payment: number;
  color: string;
}

const Debts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball');
  const [extraPayment, setExtraPayment] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DEUDAS REALES
  const fetchDebts = async () => {
    try {
      const response = await api.get('/debts/');
      setDebts(response.data);
    } catch (error) {
      console.error("Error cargando deudas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  // 2. DISPARADOR MANUAL DE INTERESES (Background Job simulado)
  const applyInterests = async () => {
    if (!window.confirm("¿Seguro que deseas aplicar los intereses del mes a todas las deudas?")) return;
    try {
      const res = await api.post('/debts/apply-interests');
      alert(`✅ Intereses aplicados: ${res.data.details.length} deudas actualizadas.`);
      fetchDebts(); // Recargamos para ver los nuevos saldos
    } catch (error) {
      alert("Error aplicando intereses");
    }
  };

  // Ordenar deudas
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'snowball') return a.current_balance - b.current_balance;
    return b.interest_rate - a.interest_rate;
  });

  if (loading) return <div className="p-8 text-center">Cargando tus deudas...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Deudas</h1>
          <p className="text-gray-500">Tu plan para la libertad financiera.</p>
        </div>
        
        <div className="flex gap-2">
          {/* Botón Mágico de Intereses */}
          <button 
            onClick={applyInterests}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium text-sm"
          >
            <RefreshCw size={16} />
            Aplicar Interés Mensual
          </button>

          {/* Selector Estrategia */}
          <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium">
            <button 
              onClick={() => setStrategy('snowball')}
              className={`px-3 py-1.5 rounded-md transition-all ${strategy === 'snowball' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              Bola de Nieve
            </button>
            <button 
              onClick={() => setStrategy('avalanche')}
              className={`px-3 py-1.5 rounded-md transition-all ${strategy === 'avalanche' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              Avalancha
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Deudas */}
      {debts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
          <p className="text-gray-500">¡Felicidades! No tienes deudas registradas (o aún no las has agregado).</p>
          <p className="text-xs text-gray-400 mt-2">Usa Swagger o Postman para crear una deuda por ahora.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedDebts.map((debt) => {
            const progress = ((debt.total_amount - debt.current_balance) / debt.total_amount) * 100;
            const safeProgress = progress < 0 ? 0 : progress; // Evitar negativos si el interés supera el total original
            const simulatedProgress = extraPayment > 0 ? safeProgress + 5 : safeProgress; 

            return (
              <div key={debt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${debt.color || 'bg-gray-200'} bg-opacity-20`}>
                      <CreditCard className="text-gray-700" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{debt.name}</h3>
                      <div className="flex gap-2 text-xs font-medium text-gray-400">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">APR: {debt.interest_rate}%</span>
                        {strategy === 'snowball' && debt.id === sortedDebts[0].id && (
                          <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">¡Prioridad!</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 text-lg">-${debt.current_balance.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Min: ${debt.min_payment}</p>
                  </div>
                </div>

                {/* Barra de Progreso */}
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 relative overflow-hidden">
                  <div className={`h-full rounded-full ${debt.color || 'bg-blue-500'} absolute top-0 left-0 z-10 transition-all duration-1000`} style={{ width: `${safeProgress}%` }}></div>
                  {extraPayment > 0 && (
                    <div className="h-full rounded-full bg-green-400 absolute top-0 left-0 opacity-50 animate-pulse" style={{ width: `${simulatedProgress}%` }}></div>
                  )}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{safeProgress.toFixed(1)}% Pagado</span>
                  <span>Meta: ${debt.total_amount.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Simulador Simplificado */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="text-yellow-300 fill-yellow-300" size={20} />
          <h3 className="font-bold">Simulador de Aceleración</h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-indigo-100">Si pagaras un extra de: <b>${extraPayment}</b></span>
          <input 
            type="range" min="0" max="1000" step="50" value={extraPayment} 
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-48 h-2 bg-indigo-900/50 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Debts;