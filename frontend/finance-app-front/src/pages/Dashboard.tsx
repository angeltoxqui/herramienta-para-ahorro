import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, TrendingUp, LineChart, BrainCircuit, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// 👇 COMPONENTES IMPORTADOS
import MainLayout from '../components/layout/MainLayout';
import { AiDetective } from '../components/dashboard/AiDetective';
import TransactionModal from '../components/TransactionModal';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'cashflow' | 'networth'>('cashflow');
  const [showTip, setShowTip] = useState(true);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  // --- 🆕 ESTADOS PARA EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');

  // --- FUNCIÓN DE CARGA ---
  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/transactions/');
      // Invertimos el array para que el más nuevo salga arriba
      const sortedData = response.data.reverse(); 
      setTransactions(sortedData);
      
      const balance = sortedData.reduce((acc: number, curr: Transaction) => {
        return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
      }, 0);
      setTotalBalance(balance);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HANDLERS ---
  const openModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        
        {/* 0. CEREBRO DE IA (Copiloto) */}
        {/* 👇 Aquí se inserta el componente que detecta gastos silenciosos */}
        <AiDetective />

        {/* 1. Saludo y Selector de Vista */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hola, {user?.full_name?.split(' ')[0] || 'Usuario'} 👋</h1>
            <p className="text-gray-500 text-sm">Aquí está tu resumen financiero de hoy.</p>
          </div>
          <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
            <button onClick={() => setViewMode('cashflow')} className={`px-4 py-2 rounded-md transition-all ${viewMode === 'cashflow' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Día a Día</button>
            <button onClick={() => setViewMode('networth')} className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${viewMode === 'networth' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>Patrimonio <LineChart size={14} /></button>
          </div>
        </div>

        {/* 2. Tarjeta Smart Insight (Consejo) */}
        {showTip && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-4 relative animate-fade-in">
            <div className="bg-white p-2 rounded-full shadow-sm"><BrainCircuit className="text-indigo-600" size={20} /></div>
            <div className="flex-1">
              <h4 className="font-bold text-indigo-900 text-sm mb-1">Consejo Inteligente</h4>
              <p className="text-indigo-700 text-sm leading-relaxed">Noté que te sobraron <strong>$200</strong> el mes pasado. ¿Los invertimos?</p>
            </div>
            <button onClick={() => setShowTip(false)} className="text-indigo-300 hover:text-indigo-500"><X size={18} /></button>
          </div>
        )}

        {/* 3. Área Principal (Tarjetas y Tablas) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tarjeta Negra Grande */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{viewMode === 'cashflow' ? 'Saldo Disponible' : 'Patrimonio Neto Total'}</p>
                    <h1 className="text-4xl font-bold">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm"><Wallet className="text-white" size={24} /></div>
                </div>
                
                {/* Botones de Acción Rápida */}
                {viewMode === 'cashflow' ? (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => openModal('income')}
                      className="flex-1 bg-green-500 hover:bg-green-600 transition-colors text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-95 transform duration-150"
                    >
                      <ArrowUpCircle size={20} /> Ingreso
                    </button>
                    <button 
                      onClick={() => openModal('expense')}
                      className="flex-1 bg-red-500 hover:bg-red-600 transition-colors text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 active:scale-95 transform duration-150"
                    >
                      <ArrowDownCircle size={20} /> Gasto
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/10 p-3 rounded-lg"><p className="text-gray-400">Activos</p><p className="font-bold text-lg text-green-400">$35,400</p></div>
                    <div className="bg-white/10 p-3 rounded-lg"><p className="text-gray-400">Pasivos</p><p className="font-bold text-lg text-red-400">-$17,000</p></div>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Transacciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100"><h3 className="font-bold text-gray-800">Actividad Reciente</h3></div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <p>No hay movimientos aún 🍃</p>
                    <p className="text-xs mt-2">¡Prueba los botones de arriba!</p>
                  </div>
                ) : (
                  transactions.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {item.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm capitalize">{item.description}</p>
                          <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-bold text-sm ${item.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                        {item.type === 'income' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Columna Derecha (Score Financiero) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-green-500" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">85</span>
                  <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Excelente</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Salud Financiera</h3>
              <p className="text-xs text-gray-500 mb-4">Basado en tus ahorros y deudas</p>
              <button className="text-indigo-600 text-xs font-bold hover:underline">Ver detalles</button>
            </div>
          </div>
        </div>

        {/* MODAL PARA AGREGAR TRANSACCIONES */}
        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          type={modalType}
          onSuccess={fetchData} // Recargamos datos al guardar
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;