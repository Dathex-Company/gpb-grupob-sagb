import React, { useState, useEffect } from 'react';
import { useFocusStore } from '../stores/focusStore';

interface SessionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (task: string, duration: number) => void;
}

const PRESET_DURATIONS = [25, 30, 50, 90];

export const SessionConfigModal: React.FC<SessionConfigModalProps> = ({ isOpen, onClose, onStart }) => {
  const [task, setTask] = useState('');
  const pendingTask = useFocusStore((state) => state.pendingTask);
  const setPendingTask = useFocusStore((state) => state.setPendingTask);

  useEffect(() => {
    if (isOpen && pendingTask) {
      setTask(pendingTask);
      setPendingTask(null);
    }
  }, [isOpen, pendingTask, setPendingTask]);

  const [duration, setDuration] = useState<number>(25);
  const [isCustom, setIsCustom] = useState(false);
  const [customDuration, setCustomDuration] = useState<number | ''>('');

  if (!isOpen) return null;

  const handleStart = () => {
    if (!task.trim()) {
      alert('Por favor, defina uma tarefa para a sessão.');
      return;
    }
    
    const finalDuration = isCustom && customDuration ? Number(customDuration) : duration;
    
    if (finalDuration <= 0) {
      alert('A duração deve ser maior que 0.');
      return;
    }
    
    onStart(task, finalDuration);
    onClose();
    // Reset form
    setTask('');
    setDuration(25);
    setIsCustom(false);
    setCustomDuration('');
  };

  return (
    <div className="dark fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0a0f1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-gray-100">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#121a2b]">
          <h2 className="text-lg font-semibold">Configurar Sessão de Foco</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Missão da Sessão
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="O que você vai focar agora?"
              className="w-full px-3 py-2 border border-white/10 rounded-lg bg-[#121a2b] text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duração (minutos)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_DURATIONS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setDuration(preset);
                    setIsCustom(false);
                  }}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    !isCustom && duration === preset
                      ? 'bg-indigo-900/30 border-indigo-500 text-indigo-300'
                      : 'border-white/10 bg-[#121a2b] text-gray-300 hover:bg-[#1a2338]'
                  }`}
                >
                  {preset} min
                </button>
              ))}
              <button
                onClick={() => setIsCustom(true)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  isCustom
                    ? 'bg-indigo-900/30 border-indigo-500 text-indigo-300'
                    : 'border-white/10 bg-[#121a2b] text-gray-300 hover:bg-[#1a2338]'
                }`}
              >
                Outro
              </button>
            </div>
            {isCustom && (
              <div className="mt-3">
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Number(e.target.value))}
                  placeholder="Ex: 45"
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-[#121a2b] text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-gray-500"
                  min="1"
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-[#121a2b] border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2338] rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleStart}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
          >
            Iniciar Foco
          </button>
        </div>
      </div>
    </div>
  );
};
