import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusStore } from '../../../foco_total/stores/focusStore';
import { useFocusWidgetStore } from '../../store/focusWidgetStore';

// ============================================================================
// Helpers
// ============================================================================

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const PRESET_DURATIONS = [25, 30, 50, 90];

// ============================================================================
// Drag Hook for PiP
// ============================================================================

interface DragState {
  isDragging: boolean;
  offsetX: number;
  offsetY: number;
}

function usePipDrag(deps: { enabled: boolean }) {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: window.innerWidth - 320,
    y: window.innerHeight - 200,
  });
  const dragRef = useRef<DragState>({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
  });
  const pipRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!deps.enabled || !pipRef.current) return;
      e.preventDefault();
      const rect = pipRef.current.getBoundingClientRect();
      dragRef.current = {
        isDragging: true,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };
    },
    [deps.enabled]
  );

  useEffect(() => {
    if (!deps.enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      setPosition({
        x: Math.max(0, e.clientX - dragRef.current.offsetX),
        y: Math.max(0, e.clientY - dragRef.current.offsetY),
      });
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [deps.enabled]);

  return { pipRef, position, handleMouseDown };
}

// ============================================================================
// Config Mode — Modal de Configuração de Sessão
// ============================================================================

const FocusConfigModal: React.FC = () => {
  const { taskTitle, close } = useFocusWidgetStore();
  const startSession = useFocusStore((state) => state.startSession);

  const [task, setTask] = useState(taskTitle);
  const [duration, setDuration] = useState<number>(25);
  const [isCustom, setIsCustom] = useState(false);
  const [customDuration, setCustomDuration] = useState<number | ''>('');

  useEffect(() => {
    setTask(taskTitle);
  }, [taskTitle]);

  const handleStart = () => {
    const trimmed = task.trim();
    if (!trimmed) return;

    const finalDuration = isCustom && customDuration ? Number(customDuration) : duration;
    if (finalDuration <= 0) return;

    startSession(trimmed, finalDuration);
    // Transition to active_modal after starting session
    useFocusWidgetStore.getState().setMode('active_modal');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderColor: 'var(--sagb-line)',
          backgroundColor: 'var(--sagb-surface)',
          color: 'var(--sagb-text)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--sagb-line)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--sagb-text)' }}>
            Configurar Sessão de Foco
          </h2>
          <button
            onClick={close}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--sagb-muted)' }}
            >
              Missão da Sessão
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="O que você vai focar agora?"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all"
              style={{
                borderColor: 'var(--sagb-line)',
                backgroundColor: 'var(--sagb-bg)',
                color: 'var(--sagb-text)',
              }}
              autoFocus
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--sagb-muted)' }}
            >
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
                  className="py-2 px-3 rounded-lg border text-sm font-medium transition-colors"
                  style={{
                    borderColor: !isCustom && duration === preset
                      ? 'var(--sagb-primary)'
                      : 'var(--sagb-line)',
                    backgroundColor: !isCustom && duration === preset
                      ? 'color-mix(in srgb, var(--sagb-primary) 12%, transparent)'
                      : 'var(--sagb-bg)',
                    color: !isCustom && duration === preset
                      ? 'var(--sagb-primary)'
                      : 'var(--sagb-text)',
                  }}
                >
                  {preset} min
                </button>
              ))}
              <button
                onClick={() => setIsCustom(true)}
                className="py-2 px-3 rounded-lg border text-sm font-medium transition-colors"
                style={{
                  borderColor: isCustom
                    ? 'var(--sagb-primary)'
                    : 'var(--sagb-line)',
                  backgroundColor: isCustom
                    ? 'color-mix(in srgb, var(--sagb-primary) 12%, transparent)'
                    : 'var(--sagb-bg)',
                  color: isCustom
                    ? 'var(--sagb-primary)'
                    : 'var(--sagb-text)',
                }}
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
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{
                    borderColor: 'var(--sagb-line)',
                    backgroundColor: 'var(--sagb-bg)',
                    color: 'var(--sagb-text)',
                  }}
                  min="1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-6 py-4 border-t"
          style={{ borderColor: 'var(--sagb-line)', backgroundColor: 'var(--sagb-bg)' }}
        >
          <button
            onClick={close}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleStart}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm text-white"
            style={{ backgroundColor: 'var(--sagb-primary)' }}
            disabled={!task.trim()}
          >
            Iniciar Foco
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Active Modal Mode — Timer Centralizado
// ============================================================================

const FocusActiveModal: React.FC = () => {
  const { currentSession, pauseSession, resumeSession, stopSession, tick } = useFocusStore();
  const { minimize, close } = useFocusWidgetStore();

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
    // If session ended, go back to config
    close();
    return null;
  }

  const progress =
    ((currentSession.durationMinutes * 60 - currentSession.timeRemainingSeconds) /
      (currentSession.durationMinutes * 60)) *
    100;

  const handleStop = () => {
    stopSession();
    close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderColor: 'var(--sagb-line)',
          backgroundColor: 'var(--sagb-surface)',
          color: 'var(--sagb-text)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--sagb-line)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--sagb-text)' }}>
            Sessão de Foco
          </h2>
          <div className="flex items-center gap-1">
            {/* Minimize to PiP */}
            <button
              onClick={minimize}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ color: 'var(--sagb-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              title="Minimizar para widget"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="15" width="18" height="6" rx="2"></rect>
                <path d="M12 3v12"></path>
                <path d="m8 9 4-4 4 4"></path>
              </svg>
            </button>
            {/* Close */}
            <button
              onClick={handleStop}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ color: 'var(--sagb-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              title="Encerrar sessão"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Body — Timer */}
        <div className="p-8 flex flex-col items-center space-y-6">
          {/* Task title */}
          <p
            className="text-lg font-medium text-center truncate max-w-full"
            style={{ color: 'var(--sagb-text)' }}
          >
            {currentSession.task}
          </p>

          {/* Circular Progress */}
          <div className="relative flex items-center justify-center w-56 h-56">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                strokeWidth="4"
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
                style={{ stroke: 'var(--sagb-line)' }}
              ></circle>
              <circle
                strokeWidth="4"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
                strokeDasharray="289.03"
                strokeDashoffset={289.03 - (progress / 100) * 289.03}
                style={{ stroke: 'var(--sagb-primary)', transition: 'stroke-dashoffset 1s linear' }}
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span
                className="text-4xl font-bold font-mono tracking-tighter"
                style={{ color: 'var(--sagb-text)' }}
              >
                {formatTime(currentSession.timeRemainingSeconds)}
              </span>
              <span
                className="text-sm mt-1"
                style={{ color: 'var(--sagb-muted)' }}
              >
                {currentSession.status === 'paused'
                  ? 'Pausado'
                  : currentSession.status === 'completed'
                  ? 'Finalizado'
                  : 'Em progresso'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {currentSession.status === 'running' && (
              <button
                onClick={pauseSession}
                className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 15%, transparent)',
                  color: 'var(--sagb-primary)',
                }}
                title="Pausar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </button>
            )}

            {currentSession.status === 'paused' && (
              <button
                onClick={resumeSession}
                className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 15%, transparent)',
                  color: 'var(--sagb-primary)',
                }}
                title="Retomar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={currentSession.status === 'completed'}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
              style={{
                backgroundColor: currentSession.status === 'completed'
                  ? 'var(--sagb-bg)'
                  : 'color-mix(in srgb, var(--sagb-red) 15%, transparent)',
                color: currentSession.status === 'completed'
                  ? 'var(--sagb-muted)'
                  : 'var(--sagb-red)',
                cursor: currentSession.status === 'completed' ? 'not-allowed' : 'pointer',
              }}
              title="Encerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PiP Mode — Widget Flutuante Compacto
// ============================================================================

const FocusPipWidget: React.FC = () => {
  const { currentSession, pauseSession, resumeSession, tick } = useFocusStore();
  const { expand, close } = useFocusWidgetStore();

  const { pipRef, position, handleMouseDown } = usePipDrag({ enabled: true });

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
    close();
    return null;
  }

  const progress =
    ((currentSession.durationMinutes * 60 - currentSession.timeRemainingSeconds) /
      (currentSession.durationMinutes * 60)) *
    100;

  const handleStop = () => {
    useFocusStore.getState().stopSession();
    close();
  };

  return (
    <div
      ref={pipRef}
      className="fixed z-[9999] w-72 rounded-xl border shadow-lg overflow-hidden select-none"
      style={{
        left: position.x,
        top: position.y,
        borderColor: 'var(--sagb-line)',
        backgroundColor: 'var(--sagb-surface)',
        color: 'var(--sagb-text)',
      }}
    >
      {/* Drag Handle Header */}
      <div
        className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b"
        style={{
          borderColor: 'var(--sagb-line)',
          backgroundColor: 'var(--sagb-bg)',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Spinning/Idle indicator */}
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor:
                currentSession.status === 'running'
                  ? 'var(--sagb-primary)'
                  : currentSession.status === 'paused'
                  ? 'var(--sagb-muted)'
                  : 'var(--sagb-red)',
            }}
          ></span>
          <span
            className="text-xs font-medium truncate"
            style={{ color: 'var(--sagb-muted)' }}
          >
            Hiperfoco
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {/* Expand to full modal */}
          <button
            onClick={expand}
            className="flex items-center justify-center w-6 h-6 rounded transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            title="Expandir"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
          {/* Close */}
          <button
            onClick={handleStop}
            className="flex items-center justify-center w-6 h-6 rounded transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            title="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Body — Compact Timer */}
      <div className="p-3 flex items-center gap-3">
        {/* Mini Circular Progress */}
        <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              strokeWidth="6"
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
              style={{ stroke: 'var(--sagb-line)' }}
            ></circle>
            <circle
              strokeWidth="6"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (progress / 100) * 276.46}
              style={{ stroke: 'var(--sagb-primary)', transition: 'stroke-dashoffset 1s linear' }}
            ></circle>
          </svg>
          <span
            className="absolute text-xs font-mono font-bold"
            style={{ color: 'var(--sagb-text)' }}
          >
            {formatTime(currentSession.timeRemainingSeconds)}
          </span>
        </div>

        {/* Info + Controls */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--sagb-text)' }}>
            {currentSession.task}
          </p>
          <div className="flex items-center gap-1.5">
            {currentSession.status === 'running' && (
              <button
                onClick={pauseSession}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 12%, transparent)',
                  color: 'var(--sagb-primary)',
                }}
                title="Pausar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </button>
            )}
            {currentSession.status === 'paused' && (
              <button
                onClick={resumeSession}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 12%, transparent)',
                  color: 'var(--sagb-primary)',
                }}
                title="Retomar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            )}
            <span
              className="text-[10px]"
              style={{ color: 'var(--sagb-muted)' }}
            >
              {currentSession.status === 'paused' ? 'Pausado' : 'Focando'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main FocusWidget — Orchestrator
// ============================================================================

export const FocusWidget: React.FC = () => {
  const mode = useFocusWidgetStore((state) => state.mode);

  switch (mode) {
    case 'config':
      return <FocusConfigModal />;
    case 'active_modal':
      return <FocusActiveModal />;
    case 'pip':
      return <FocusPipWidget />;
    case 'hidden':
    default:
      return null;
  }
};
