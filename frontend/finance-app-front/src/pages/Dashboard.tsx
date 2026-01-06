import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  MoreHorizontal, 
  TrendingUp, 
  LineChart, 
  Zap, 
  BrainCircuit,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'cashflow' | 'networth'>('cashflow');
  const [showTip, setShowTip] = useState(true);

  return (
    <div className="space-y-6">
      
      {/* 0. Saludo y Selector de Visión (Diferenciador 2026) */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hola, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 text-sm">Aquí está tu copiloto financiero de hoy.</p>
        </div>
        
        {/* Toggle: Flujo vs Patrimonio */}
        <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
          <button 
            onClick={() => setViewMode('cashflow')}
            className={`px-4 py-2 rounded-md transition-all ${viewMode === 'cashflow' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Día a Día
          </button>
          <button 
            onClick={() => setViewMode('networth')}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${viewMode === 'networth' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Patrimonio <LineChart size={14} />
          </button>
        </div>
      </div>

      {/* 1. Tarjeta "Smart Insight" (Hiper-personalización IA) */}
      {showTip && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-4 relative animate-fade-in">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <BrainCircuit className="text-indigo-600" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-indigo-900 text-sm mb-1">Consejo Inteligente</h4>
            <p className="text-indigo-700 text-sm leading-relaxed">
              Noté que te sobraron <strong>$200</strong> el mes pasado. Si los mueves a tu meta "Viaje", podrías alcanzarla 2 semanas antes. ¿Lo hacemos?
            </p>
          </div>
          <button onClick={() => setShowTip(false)} className="text-indigo-300 hover:text-indigo-500">
            <X size={18} />
          </button>
        </div>
      )}

      {/* 2. Área Principal Dinámica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (2/3): Gráficos y Números */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tarjeta Principal (Cambia según el modo) */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    {viewMode === 'cashflow' ? 'Saldo Disponible' : 'Patrimonio Neto Total'}
                  </p>
                  <h1 className="text-4xl font-bold">
                    {viewMode === 'cashflow' ? '$4,250.00' : '$18,400.00'}
                  </h1>
                  {viewMode === 'networth' && (
                    <span className="text-green-400 text-xs font-bold flex items-center gap-1 mt-1">
                      <TrendingUp size={12} /> +12% vs año pasado
                    </span>
                  )}
                </div>
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  {viewMode === 'cashflow' ? <Wallet className="text-white" size={24} /> : <LineChart className="text-white" size={24} />}
                </div>
              </div>
              
              {/* Botones de Acción Rápida (Solo en modo Cashflow) */}
              {viewMode === 'cashflow' ? (
                <div className="flex gap-4">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 transition-colors text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2">
                    <ArrowUpCircle size={20} />
                    Ingreso
                  </button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 transition-colors text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2">
                    <ArrowDownCircle size={20} />
                    Gasto
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-gray-400">Activos</p>
                    <p className="font-bold text-lg text-green-400">$35,400</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-gray-400">Pasivos (Deudas)</p>
                    <p className="font-bold text-lg text-red-400">-$17,000</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Últimos Movimientos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Actividad Reciente</h3>
              <button className="text-indigo-600 text-sm font-medium hover:underline">Ver todo</button>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: 'Supermercado Éxito', date: 'Hoy, 10:42 AM', amount: -120.50, type: 'expense', category: 'Comida' },
                { name: 'Pago de Nómina', date: 'Ayer, 5:00 PM', amount: 1500.00, type: 'income', category: 'Salario' },
                { name: 'Netflix', date: '12 Oct, 9:00 AM', amount: -15.00, type: 'expense', category: 'Suscripción' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${item.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                    {item.type === 'income' ? '+' : ''}{item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha (1/3): Gamification y Widgets */}
        <div className="space-y-6">
          
          {/* Widget: Salud Financiera (Gamification) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
             {/* Score Ring */}
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-green-500 drop-shadow-md"
                  strokeDasharray="85, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">85</span>
                <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Excelente</span>
              </div>
            </div>
            
            <h3 className="font-bold text-gray-800 mb-1">Salud Financiera</h3>
            <p className="text-xs text-gray-500 mb-4">¡Estás en el top 10% de usuarios!</p>
            <button className="text-indigo-600 text-xs font-bold hover:underline">Ver cómo mejorar</button>
          </div>

          {/* Widget: Huella de Carbono (Sostenibilidad) */}
          <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-200 p-1.5 rounded-lg">
                <Zap size={16} className="text-green-700" />
              </div>
              <h3 className="font-bold text-green-800 text-sm">Impacto Ambiental</h3>
            </div>
            <p className="text-xs text-green-700 mb-3">Tus gastos de este mes han generado aprox. <strong>120kg CO2</strong>.</p>
            <div className="w-full bg-green-200 h-1.5 rounded-full mb-1">
              <div className="bg-green-600 h-1.5 rounded-full w-1/3"></div>
            </div>
            <p className="text-[10px] text-green-600 text-right">Bajo (¡Bien hecho!)</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;