import React, { useState } from 'react';
import { PiggyBank, Calendar, Users, Camera, ArrowRight, Heart, Sparkles } from 'lucide-react';
import PremiumLock from '../components/premium/PremiumLock';

const Savings = () => {
  // Ahora tenemos 3 estados para que NADA se quede fuera
  const [activeTab, setActiveTab] = useState<'free' | 'template' | 'shared'>('free');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Metas</h1>
          <p className="text-gray-500">Visualiza, planifica y alcanza tus sueños.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
          + Nueva Meta
        </button>
      </div>

      {/* Selector de 3 Pestañas (Para que todo esté visible) */}
      <div className="bg-gray-100 p-1.5 rounded-xl flex flex-col md:flex-row gap-1">
        <button
          onClick={() => setActiveTab('free')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'free' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <PiggyBank size={18} /> Modo Libre
        </button>
        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'template' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar size={18} /> Plantilla <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase">Pro</span>
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'shared' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} /> Compartido <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded uppercase">Pro</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* 1. MODO LIBRE (Tradicional) */}
        {activeTab === 'free' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500 relative flex items-center justify-center">
               <div className="text-white text-center">
                 <PiggyBank size={40} className="mx-auto mb-2 opacity-90" />
                 <p className="font-bold opacity-90">Ahorro Flexible</p>
               </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-6">
                Guarda dinero a tu ritmo, sin fechas límite ni presiones. Ideal para fondos de emergencia o "gustitos".
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la meta</label>
                  <input type="text" placeholder="Ej. Computadora Nueva" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Monto Objetivo</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">$</span>
                    <input type="number" placeholder="0.00" className="w-full border border-gray-300 rounded-lg p-3 pl-7 outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-transform active:scale-95">
                  Crear Meta Flexible
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. MODO PLANTILLA (Automático) */}
        {activeTab === 'template' && (
          <PremiumLock title="Generador de Plantillas">
            <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
              <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-900">Asistente Inteligente</h3>
                  <p className="text-xs text-indigo-600">Calculamos el plan perfecto para ti.</p>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Necesito</label>
                    <input type="number" defaultValue="2000" className="w-full border-2 border-indigo-50 rounded-lg p-2.5 font-bold text-gray-700 focus:border-indigo-500 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Para el</label>
                    <input type="date" className="w-full border-2 border-indigo-50 rounded-lg p-2.5 font-bold text-gray-700 focus:border-indigo-500 outline-none transition-colors" />
                  </div>
                </div>

                {/* Resultado Preliminar */}
                <div className="bg-indigo-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg shadow-indigo-200">
                  <div>
                    <p className="text-indigo-200 text-xs">Cuota sugerida:</p>
                    <p className="text-2xl font-bold">$125<span className="text-sm font-normal opacity-70">/sem</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-200 text-xs">Duración:</p>
                    <p className="font-bold">4 Meses</p>
                  </div>
                </div>
                
                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  Generar Calendario <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </PremiumLock>
        )}

        {/* 3. MODO COMPARTIDO (Parejas/Grupos) - ¡RECUPERADO! */}
        {activeTab === 'shared' && (
          <PremiumLock title="Metas Compartidas">
             <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden group">
               {/* Visualización Inspiradora (La foto del viaje) */}
               <div className="h-40 relative">
                  <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80" alt="Viaje" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                          Viaje a Bali <Heart size={16} className="text-pink-500 fill-pink-500" />
                        </h3>
                        <p className="text-pink-100 text-xs">Meta en Pareja</p>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">Yo</div>
                        <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">A</div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400 text-xs">+</div>
                      </div>
                    </div>
                  </div>
                  <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                    <Camera size={16} />
                  </button>
               </div>

               <div className="p-6">
                 {/* Barra de progreso compartida */}
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-bold text-gray-700">$2,450</span>
                   <span className="text-gray-400">de $5,000</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden flex">
                   <div className="bg-blue-500 h-full w-[30%]"></div> {/* Mi parte */}
                   <div className="bg-pink-500 h-full w-[19%]"></div> {/* Su parte */}
                 </div>
                 
                 <p className="text-xs text-center text-gray-400 mb-6">
                   Tú has aportado el 60% del total acumulado.
                 </p>

                 <button className="w-full border-2 border-dashed border-pink-200 text-pink-600 font-bold py-3 rounded-xl hover:bg-pink-50 transition-colors flex items-center justify-center gap-2">
                   <Users size={18} />
                   Invitar Colaborador
                 </button>
               </div>
             </div>
          </PremiumLock>
        )}

      </div>
    </div>
  );
};

export default Savings;