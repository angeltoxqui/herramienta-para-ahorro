import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import api from '../services/api';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onSuccess: () => void; // Para recargar la lista al guardar
}

const TransactionModal = ({ isOpen, onClose, type, onSuccess }: TransactionModalProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Enviamos los datos al Backend
      await api.post('/transactions/', {
        amount: parseFloat(amount),
        description: description,
        category: category || 'General',
        type: type,
        user_id: 1 // Por ahora seguimos con el usuario 1 fijo
      });
      
      onSuccess(); // Avisamos al Dashboard que recargue
      onClose();   // Cerramos el modal
      setAmount('');
      setDescription('');
      setCategory('');
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
              placeholder="Ej. Tacos al pastor"
            />
          </div>

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