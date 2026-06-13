import React, { useEffect } from 'react';
import { useFocusStore } from '../stores/focusStore';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const FocusTimer: React.FC = () => {
  const { currentSession, pauseSession, resumeSession, requestStopSession, tick } = useFocusStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (currentSession?.status === 'running') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession?.status, tick]);

  if (!currentSession) {
    return null;
  }

  const progress = ((currentSession.durationMinutes * 60 - currentSession.timeRemainingSeconds) / (currentSession.durationMinutes * 60)) * 100;

  return (
    <div className="bg-[#121a2b] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-8 shadow-sm">
      <div className="text-center space-y-2">
        <h3 className="text-sm font-medium text-indigo-400 tracking-wider uppercase">Missão Atual</h3>
        <p className="text-xl font-semibold text-gray-100">{currentSession.task}</p>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            className="text-gray-800 stroke-current"
            strokeWidth="4"
            cx="50"
            cy="50"
            r="48"
            fill="transparent"
          ></circle>
          <circle
            className="text-indigo-500 stroke-current transition-all duration-1000 ease-linear"
            strokeWidth="4"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="48"
            fill="transparent"
            strokeDasharray="301.59"
            strokeDashoffset={301.59 - (progress / 100) * 301.59}
          ></circle>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-bold font-mono tracking-tighter text-sagb-text">
            {formatTime(currentSession.timeRemainingSeconds)}
          </span>
          <span className="text-sm text-gray-400 mt-2">
            {currentSession.status === 'paused' ? 'Pausado' : currentSession.status === 'completed' ? 'Finalizado' : 'Em progresso'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentSession.status === 'running' && (
          <button
            onClick={pauseSession}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 transition-colors"
            title="Pausar"
            aria-label="Pausar sessão"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          </button>
        )}

        {currentSession.status === 'paused' && (
          <button
            onClick={resumeSession}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 transition-colors"
            title="Retomar"
            aria-label="Retomar sessão"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        )}

        <button
          onClick={requestStopSession}
          disabled={currentSession.status === 'completed'}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors ${
            currentSession.status === 'completed'
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
          }`}
          title="Encerrar"
          aria-label="Encerrar sessão"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
        </button>
      </div>
    </div>
  );
};
