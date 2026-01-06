import React, { useState } from 'react';
import { CreditCard, TrendingDown, DollarSign, Zap, ArrowRight, ArrowUpRight } from 'lucide-react';

const Debts = () => {
  // Estado para la estrategia (RECUPERADO)
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball');
  // Estado para el simulador (NUEVO)
  const [extraPayment, setExtraPayment] = useState(0);

  // Datos dummy
  const debts = [
    { id: 1, name: 'Visa Oro', total: 5000, current: 3500, apr: 24, minPayment: 150, color: 'bg-blue-500' },
    { id: 2, name: 'Préstamo Auto', total: 12000, current: 8900, apr: 12, minPayment: 300, color: 'bg-purple-500' },
  ];

  // Ordenar deudas según estrategia (LÓGICA RECUPERADA)
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'snowball') return a.current - b.current; // Menor saldo primero
    return b.apr - a.apr; // Mayor interés primero
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Deudas</h1>
          <p className="text-gray-500">Plan de libertad financiera.</p>
        </div>
        
        {/* Selector de Estrategia (RECUPERADO) */}
        <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
          <button 
            onClick={() => setStrategy('snowball')}
            className={`px-3 py-1.5 rounded-md transition-all ${strategy === 'snowball' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Bola de Nieve
          </button>
          <button 
            onClick={() => setStrategy('avalanche')}
            className={`px-3 py-1.5 rounded-md transition-all ${strategy === 'avalanche' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Avalancha
          </button>
        </div>
      </div>

      {/* Simulador "Turbo" (NUEVO - SE MANTIENE PORQUE APORTA VALOR) */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Zap className="text-yellow-300 fill-yellow-300" size={20} />
          </div>
          <h3 className="font-bold">Simulador "Pago Turbo"</h3>
        </div>
        <p className="text-sm text-indigo-100 mb-4">
          Desliza para ver cuánto tiempo ahorras pagando un extra mensual.
        </p>
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-bold">
            <span>Pago Extra: ${extraPayment}</span>
            <span className="text-green-300">Ahorras intereses y tiempo</span>
          </div>
          <input 
            type="range" min="0" max="500" step="10" value={extraPayment} 
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-full h-2 bg-indigo-900/50 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Lista de Deudas (FUSIONADA: Orden del viejo + Barras del nuevo) */}
      <div className="grid gap-4">
        {sortedDebts.map((debt) => {
          const progress = ((debt.total - debt.current) / debt.total) * 100;
          const simulatedProgress = extraPayment > 0 ? progress + 8 : progress; 

          return (
            <div key={debt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${debt.color} bg-opacity-10`}>
                    <CreditCard className={`${debt.color.replace('bg-', 'text-')}`} size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{debt.name}</h3>
                    <div className="flex gap-2 text-xs font-medium text-gray-400">
                      <span>APR: {debt.apr}%</span>
                      {strategy === 'snowball' && debt.id === sortedDebts[0].id && (
                        <span className="text-green-600 font-bold bg-green-50 px-1.5 rounded">¡Pagar primero!</span>
                      )}
                      {strategy === 'avalanche' && debt.id === sortedDebts[0].id && (
                        <span className="text-green-600 font-bold bg-green-50 px-1.5 rounded">¡Pagar primero!</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-lg">${debt.current.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Min: ${debt.minPayment}</p>
                </div>
              </div>

              {/* Barra de Progreso Híbrida */}
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2 relative overflow-hidden">
                <div className={`h-full rounded-full ${debt.color} absolute top-0 left-0 z-10`} style={{ width: `${progress}%` }}></div>
                {extraPayment > 0 && (
                  <div className="h-full rounded-full bg-green-400 absolute top-0 left-0 opacity-50 animate-pulse" style={{ width: `${simulatedProgress}%` }}></div>
                )}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{progress.toFixed(0)}% Pagado</span>
                {extraPayment > 0 && <span className="text-green-600 font-bold">Terminarías antes 🚀</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Debts;