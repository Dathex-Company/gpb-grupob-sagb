import React, { useState, useEffect, useRef } from 'react';
import { useFocusStore } from '../stores/focusStore';

interface SessionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (task: string, duration: number) => void;
}

const PRESET_DURATIONS = [25, 30, 50, 90];
const MIN_DURATION = 5;
const MAX_DURATION = 240;

export const SessionConfigModal: React.FC<SessionConfigModalProps> = ({ isOpen, onClose, onStart }) => {
  const [task, setTask] = useState('');
  const [taskError, setTaskError] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  const pendingTask = useFocusStore((state) => state.pendingTask);
  const setPendingTask = useFocusStore((state) => state.setPendingTask);

  const [duration, setDuration] = useState<number>(25);
  const [isCustom, setIsCustom] = useState(false);
  const [customDuration, setCustomDuration] = useState<number | ''>('');

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // Carrega pendingTask ao abrir
  useEffect(() => {
    if (isOpen && pendingTask) {
      setTask(pendingTask);
      setPendingTask(null);
    }
  }, [isOpen, pendingTask, setPendingTask]);

  // Focus trap + Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Foco inicial
    firstFocusableRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape fecha
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'input, button, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateAndStart = () => {
    let valid = true;

    // Validação inline (FT-010)
    if (!task.trim()) {
      setTaskError('Defina uma missão para a sessão.');
      valid = false;
    } else {
      setTaskError(null);
    }

    const finalDuration = isCustom && customDuration ? Number(customDuration) : duration;

    if (finalDuration < MIN_DURATION || finalDuration > MAX_DURATION) {
      setDurationError(`Duração deve ser entre ${MIN_DURATION} e ${MAX_DURATION} minutos.`);
      valid = false;
    } else {
      setDurationError(null);
    }

    if (!valid) return;

    onStart(task.trim(), finalDuration);
    // Reset form
    setTask('');
    setDuration(25);
    setIsCustom(false);
    setCustomDuration('');
    setTaskError(null);
    setDurationError(null);
    onClose();
  };

  return (
    <div
      className="dark fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="config-modal-title"
        aria-describedby="config-modal-desc"
        className="w-full max-w-md bg-[#0a0f1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-gray-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#121a2b]">
          <h2 id="config-modal-title" className="text-lg font-semibold">
            Configurar Sessão de Foco
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
            aria-label="Fechar configuração"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label htmlFor="config-task" className="block text-sm font-medium text-gray-300 mb-1">
              Missão da Sessão
            </label>
            <input
              ref={firstFocusableRef}
              id="config-task"
              type="text"
              value={task}
              onChange={(e) => { setTask(e.target.value); setTaskError(null); }}
              placeholder="O que você vai focar agora?"
              className={`w-full px-3 py-2 border rounded-lg bg-[#121a2b] text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 ${
                taskError ? 'border-red-500' : 'border-white/10'
              }`}
              autoFocus
            />
            {taskError && (
              <p className="text-xs text-red-400 mt-1" role="alert">{taskError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duração (minutos)
            </label>
            <p id="config-modal-desc" className="text-xs text-gray-400 mb-2">
              Entre {MIN_DURATION} e {MAX_DURATION} minutos
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_DURATIONS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => { setDuration(preset); setIsCustom(false); setDurationError(null); }}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    !isCustom && duration === preset
                      ? 'bg-indigo-900/30 border-indigo-500 text-indigo-300'
                      : 'border-white/10 bg-[#121a2b] text-gray-300 hover:bg-[#1a2338]'
                  }`}
                  aria-pressed={!isCustom && duration === preset}
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
                aria-pressed={isCustom}
              >
                Outro
              </button>
            </div>
            {isCustom && (
              <div className="mt-3">
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => { setCustomDuration(Number(e.target.value)); setDurationError(null); }}
                  placeholder={`Ex: 45 (${MIN_DURATION}-${MAX_DURATION})`}
                  className={`w-full px-3 py-2 border rounded-lg bg-[#121a2b] text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-gray-500 ${
                    durationError ? 'border-red-500' : 'border-white/10'
                  }`}
                  min={MIN_DURATION}
                  max={MAX_DURATION}
                  aria-describedby={durationError ? 'duration-error' : undefined}
                />
              </div>
            )}
            {durationError && (
              <p id="duration-error" className="text-xs text-red-400 mt-1" role="alert">{durationError}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#121a2b] border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onClose}
            ref={lastFocusableRef}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2338] rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={validateAndStart}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
          >
            Iniciar Foco
          </button>
        </div>
      </div>
    </div>
  );
};
