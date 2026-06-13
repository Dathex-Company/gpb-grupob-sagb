import React, { useState } from 'react';
import { useFocusStore } from '../stores/focusStore';
import type { FocusSessionClosePayload } from '../types';

interface SessionCloseModalProps {
  isOpen: boolean;
}

export const SessionCloseModal: React.FC<SessionCloseModalProps> = ({ isOpen }) => {
  const { currentSession, completeSession, cancelStopSession } = useFocusStore();

  const [resultSummary, setResultSummary] = useState('');
  const [progressScore, setProgressScore] = useState(70);
  const [blockers, setBlockers] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !currentSession) return null;

  const progressPercent = (() => {
    const totalSeconds = currentSession.durationMinutes * 60;
    const elapsed = totalSeconds - currentSession.timeRemainingSeconds;
    return Math.min(100, Math.max(0, Math.floor((elapsed / totalSeconds) * 100)));
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!resultSummary.trim()) {
      newErrors.resultSummary = 'Descreva o que foi realizado.';
    }
    if (progressScore < 0 || progressScore > 100) {
      newErrors.progressScore = 'Score deve estar entre 0 e 100.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: FocusSessionClosePayload = {
      resultSummary: resultSummary.trim(),
      progressScore,
      blockers: blockers.trim(),
      nextStep: nextStep.trim(),
      completedBy: 'user',
    };

    completeSession(payload);
    // Reset form
    setResultSummary('');
    setProgressScore(70);
    setBlockers('');
    setNextStep('');
    setErrors({});
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      cancelStopSession();
    }
  };

  return (
    <div
      className="dark fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="close-modal-title"
      aria-describedby="close-modal-desc"
    >
      <div className="w-full max-w-md bg-[#0a0f1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden text-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#121a2b]">
          <div>
            <h2 id="close-modal-title" className="text-lg font-semibold">
              Encerrar Sessão
            </h2>
            <p id="close-modal-desc" className="text-xs text-gray-400 mt-0.5">
              Registre o resultado antes de sair
            </p>
          </div>
          <button
            onClick={cancelStopSession}
            className="text-gray-400 hover:text-gray-300 transition-colors"
            aria-label="Cancelar fechamento"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Session info */}
        <div className="px-6 py-3 bg-[#121a2b]/50 border-b border-white/5">
          <p className="text-sm font-medium text-gray-200">{currentSession.task}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {currentSession.durationMinutes} min — {progressPercent}% do tempo decorrido
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Result Summary */}
          <div>
            <label htmlFor="close-result" className="block text-sm font-medium text-gray-300 mb-1">
              O que foi realizado? *
            </label>
            <textarea
              id="close-result"
              value={resultSummary}
              onChange={(e) => { setResultSummary(e.target.value); setErrors((prev) => ({ ...prev, resultSummary: '' })); }}
              placeholder="Descreva o progresso da sessão..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg bg-[#121a2b] text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 ${
                errors.resultSummary ? 'border-red-500' : 'border-white/10'
              }`}
            />
            {errors.resultSummary && (
              <p className="text-xs text-red-400 mt-1">{errors.resultSummary}</p>
            )}
          </div>

          {/* Progress Score */}
          <div>
            <label htmlFor="close-score" className="block text-sm font-medium text-gray-300 mb-1">
              Progresso (0-100%)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="close-score"
                type="range"
                value={progressScore}
                onChange={(e) => setProgressScore(Number(e.target.value))}
                min="0"
                max="100"
                className="flex-1 accent-indigo-500"
              />
              <span className="text-sm font-mono text-gray-300 w-10 text-right">{progressScore}%</span>
            </div>
            {errors.progressScore && (
              <p className="text-xs text-red-400 mt-1">{errors.progressScore}</p>
            )}
          </div>

          {/* Blockers */}
          <div>
            <label htmlFor="close-blockers" className="block text-sm font-medium text-gray-300 mb-1">
              Bloqueadores encontrados
            </label>
            <input
              id="close-blockers"
              type="text"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="O que atrapalhou? (opcional)"
              className="w-full px-3 py-2 border border-white/10 rounded-lg bg-[#121a2b] text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500"
            />
          </div>

          {/* Next Step */}
          <div>
            <label htmlFor="close-next" className="block text-sm font-medium text-gray-300 mb-1">
              Próximo passo
            </label>
            <input
              id="close-next"
              type="text"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="O que fazer depois? (opcional)"
              className="w-full px-3 py-2 border border-white/10 rounded-lg bg-[#121a2b] text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={cancelStopSession}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#1a2338] rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Concluir Sessão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
