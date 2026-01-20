import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import api from '../services/api';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onSuccess: () => void;
}

const TransactionModal = ({ isOpen, onClose, type, onSuccess }: TransactionModalProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Nuevo: Manejo de Deudas
  const [debts, setDebts] = useState<any[]>([]);
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');

  // Cargar deudas al abrir el modal (solo si es gasto)
  useEffect(() => {
    if (isOpen && type === 'expense') {
      api.get('/debts/').then(res => setDebts(res.data)).catch(console.error);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        amount: parseFloat(amount),
        description: description,
        category: category || 'General',
        type: type,
      };

      // Si seleccionó una deuda, la adjuntamos
      if (selectedDebtId) {
        payload.debt_id = parseInt(selectedDebtId);
        payload.description = `Pago deuda: ${description}`; // Opcional: aclarar descripción
      }

      await api.post('/transactions/', payload);
      
      onSuccess();
      onClose();
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setSelectedDebtId('');
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Hubo un error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Encabezado */}
        <div className={`p-4 flex justify-between items-center text-white ${type === 'income' ? 'bg-green-600' : 'bg-red-600'}`}>
          <h2 className="font-bold text-lg">
            {type === 'income' ? 'Nuevo Ingreso 💰' : 'Nuevo Gasto 💸'}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Monto ($)</label>
            <input 
              type="number" 
              required
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-2xl font-bold p-2 border-b-2 border-gray-200 focus:border-indigo-500 outline-none transition-colors placeholder-gray-300"
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <input 
              type="text" 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none"
              placeholder={selectedDebtId ? "Ej. Abono mensual" : "Ej. Tacos al pastor"}
            />
          </div>

          {/* Selector de Deuda (SOLO GASTOS) */}
          {type === 'expense' && debts.length > 0 && (
             <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
               <label className="block text-xs font-bold text-indigo-800 mb-1">¿Es un abono a deuda? (Opcional)</label>
               <select 
                 value={selectedDebtId}
                 onChange={(e) => {
                   setSelectedDebtId(e.target.value);
                   // Si elige deuda, podemos auto-setear la categoría
                   if(e.target.value) setCategory('Deudas');
                 }}
                 className="w-full p-2 border border-indigo-200 rounded-lg bg-white text-sm outline-none"
               >
                 <option value="">No, es un gasto normal</option>
                 {debts.map(d => (
                   <option key={d.id} value={d.id}>{d.name} (Saldo: ${d.current_balance})</option>
                 ))}
               </select>
             </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
            >
              <option value="">Seleccionar...</option>
              <option value="Comida">🍔 Comida</option>
              <option value="Transporte">🚌 Transporte</option>
              <option value="Vivienda">🏠 Vivienda</option>
              <option value="Deudas">💳 Deudas / Pagos</option>
              <option value="Ocio">🎉 Ocio</option>
              <option value="Salario">💰 Salario</option>
              <option value="Otros">📦 Otros</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4
              ${type === 'income' 
                ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-200'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Guardando...' : <><Check size={20} /> Guardar Movimiento</>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default TransactionModal;