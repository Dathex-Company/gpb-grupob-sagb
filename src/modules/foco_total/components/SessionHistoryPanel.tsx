import React from 'react';
import { useFocusStore } from '../stores/focusStore';

export const SessionHistoryPanel: React.FC = () => {
  const { sessionsHistory, loadHistory, clearHistory } = useFocusStore();

  // Carrega histórico ao montar
  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (sessionsHistory.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#121a2b] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 bg-[#0a0f1c]/70">
          <h2 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
            Histórico de Sessões
          </h2>
        </div>
        <div className="p-5 text-center text-sm text-gray-500 italic py-8">
          Nenhuma sessão concluída ainda. Inicie seu primeiro foco!
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#121a2b] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 bg-[#0a0f1c]/70 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Histórico ({sessionsHistory.length})
        </h2>
        <button
          onClick={clearHistory}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          title="Limpar histórico"
        >
          Limpar
        </button>
      </div>
      <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
        {[...sessionsHistory].reverse().map((session) => (
          <div key={session.id} className="p-4 hover:bg-[#0a0f1c]/50 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-200 truncate">{session.task}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {session.closePayload.resultSummary}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-mono px-2 py-0.5 rounded-full ${
                  session.closePayload.progressScore >= 70
                    ? 'bg-emerald-900/30 text-emerald-400'
                    : session.closePayload.progressScore >= 40
                    ? 'bg-amber-900/30 text-amber-400'
                    : 'bg-red-900/30 text-red-400'
                }`}
              >
                {session.closePayload.progressScore}%
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{session.durationMinutes} min</span>
              <span>•</span>
              <span>
                {new Date(session.createdAt).toLocaleDateString('pt-BR')}
              </span>
              <span>•</span>
              <span>
                {session.closePayload.completedBy === 'auto' ? 'Auto' : 'Manual'}
              </span>
            </div>
            {session.closePayload.nextStep && (
              <p className="text-xs text-indigo-400 mt-1.5">
                Próximo: {session.closePayload.nextStep}
              </p>
            )}
            {session.closePayload.blockers && (
              <p className="text-xs text-amber-400/70 mt-1">
                Bloqueios: {session.closePayload.blockers}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
