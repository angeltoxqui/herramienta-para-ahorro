import { useState, useEffect } from 'react';
import { analysis } from '../../services/api'; // Asegúrate de importar bien
import { Sparkles, Check, X, Loader2 } from 'lucide-react';

interface DetectedExpense {
  id: number;
  name: string;
  amount: number;
  detected_day: number;
  confidence_score: number;
  is_confirmed: boolean;
  is_ignored: boolean;
}

export const AiDetective = () => {
  const [expenses, setExpenses] = useState<DetectedExpense[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Al cargar, preguntamos al cerebro si hay algo nuevo
  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Primero escaneamos (POST)
      await analysis.scan();
      // Luego leemos la lista actualizada (GET)
      const data = await analysis.getDetected();
      // Filtramos solo los que NO han sido respondidos aún
      const pending = data.filter((e: DetectedExpense) => !e.is_confirmed && !e.is_ignored);
      setExpenses(pending);
    } catch (error) {
      console.error("Error analizando:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar análisis automáticamente al entrar (o podrías ponerlo en un botón)
  useEffect(() => {
    runAnalysis();
  }, []);

  const handleResponse = async (id: number, action: 'confirm' | 'ignore') => {
    try {
      await analysis.respond(id, action);
      // Quitar de la lista visualmente
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error("Error al responder:", error);
    }
  };

  if (loading) return (
    <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center gap-3">
      <Loader2 className="animate-spin text-indigo-600" />
      <span className="text-indigo-700 font-medium">La IA está analizando tus gastos...</span>
    </div>
  );

  if (expenses.length === 0) return null; // Si no hay nada, no mostramos nada (silencioso)

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Sparkles className="w-6 h-6 text-yellow-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold">¡Copiloto Financiero Activado!</h3>
          <p className="text-indigo-100 text-sm">He detectado {expenses.length} gastos recurrentes que podrías haber olvidado.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg">{expense.name}</h4>
              <span className="bg-green-400/20 text-green-200 text-xs px-2 py-1 rounded-full border border-green-400/30">
                {(expense.confidence_score * 100).toFixed(0)}% Seguro
              </span>
            </div>
            
            <p className="text-3xl font-bold mb-1">${expense.amount}</p>
            <p className="text-sm text-indigo-200 mb-4">Se cobra aprox. el día {expense.detected_day} de cada mes</p>

            <div className="flex gap-2">
              <button 
                onClick={() => handleResponse(expense.id, 'confirm')}
                className="flex-1 bg-white text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} /> Es Real
              </button>
              <button 
                onClick={() => handleResponse(expense.id, 'ignore')}
                className="flex-1 bg-transparent border border-white/30 text-white py-2 rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} /> Ignorar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};