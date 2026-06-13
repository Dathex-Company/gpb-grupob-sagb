import React, { useState } from 'react';
import { ModuleHeader } from '../../../../components/ui/ModuleHeader';
import { auth } from '../../../../services/supabase';
import { FocusTimer } from '../components/FocusTimer';
import { SessionConfigModal } from '../components/SessionConfigModal';
import { SessionCloseModal } from '../components/SessionCloseModal';
import { SessionHistoryPanel } from '../components/SessionHistoryPanel';
import { useFocusStore } from '../stores/focusStore';

const FocoTotalPage: React.FC = () => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const {
    currentSession,
    startSession,
    pendingTask,
    isVoiceMuted,
    toggleVoiceMute,
    isCloseModalOpen,
  } = useFocusStore();

  React.useEffect(() => {
    if (pendingTask && (!currentSession || currentSession.status === 'completed')) {
      setIsConfigModalOpen(true);
    }
  }, [pendingTask, currentSession]);

  const handleStartSession = (task: string, duration: number) => {
    const currentUser = (auth as any)?.currentUser;
    const resolvedName =
      currentUser?.user_metadata?.display_name ||
      currentUser?.user_metadata?.full_name ||
      currentUser?.user_metadata?.name ||
      currentUser?.display_name ||
      currentUser?.full_name ||
      currentUser?.name ||
      (typeof currentUser?.email === 'string' ? currentUser.email.split('@')[0] : null) ||
      'Usuário';

    startSession(task, duration, resolvedName);
  };

  return (
    <div className="dark h-full">
      <div className="h-full overflow-y-auto bg-[#0a0f1c] text-gray-100 p-6 font-sans">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <ModuleHeader
            moduleName="Zen Folk | Foco AI"
            ownerName="Zen Folk"
            moduleDocPath="../module-doc.ts"
            className="border-none mb-0 pb-0"
          />
          <button
            onClick={toggleVoiceMute}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121a2b] border border-white/10 text-sm hover:bg-[#1a2338] transition-colors"
            title={isVoiceMuted ? 'Ativar Voz' : 'Mutar Voz'}
            aria-label={isVoiceMuted ? 'Ativar Voz' : 'Mutar Voz'}
          >
            {isVoiceMuted ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                <span>Voz Mutada</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                <span>Voz Ativa</span>
              </>
            )}
          </button>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Timer Area */}
            <div className="lg:col-span-2 space-y-6">
              {!currentSession || currentSession.status === 'completed' ? (
                <div className="bg-[#121a2b] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-900/30 text-indigo-400 flex items-center justify-center rounded-full mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">Pronto para focar?</h3>
                  <p className="text-gray-400 max-w-md">
                    Defina uma missão clara e um tempo limite. O Zen Folk te acompanhará durante toda a jornada para garantir sua concentração.
                  </p>
                  <button
                    onClick={() => setIsConfigModalOpen(true)}
                    className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                    Nova Sessão de Foco
                  </button>
                </div>
              ) : (
                <FocusTimer />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Zen Folk Coach Logs */}
              <section className="rounded-2xl border border-white/10 bg-[#121a2b] overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 bg-[#0a0f1c]/70">
                  <h2 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Zen Folk Coach
                  </h2>
                </div>
                <div className="p-5 h-64 overflow-y-auto flex flex-col justify-end space-y-4">
                  {currentSession && currentSession.logs
                    .filter((l) =>
                      l.type === 'agent_message' ||
                      l.type === 'start' ||
                      l.type === 'stop' ||
                      l.type === 'pause' ||
                      l.type === 'resume' ||
                      l.type === 'checkpoint'
                    )
                    .map((log) => (
                      <div key={log.id} className="bg-[#0a0f1c] p-3 rounded-lg text-sm text-gray-300 border border-white/5">
                        <span className="text-xs text-gray-400 block mb-1">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {log.message}
                      </div>
                    ))}

                  {(!currentSession || currentSession.logs.length === 0) && (
                    <div className="text-center text-sm text-gray-500 italic py-4">
                      Estou aqui para acompanhar seu foco. Inicie uma sessão quando estiver pronto.
                    </div>
                  )}
                </div>
              </section>

              {/* Session History */}
              <SessionHistoryPanel />
            </div>
          </div>

          {/* Vision Section */}
          <div className="space-y-6 text-[12px] opacity-70">
            <section className="rounded-xl border border-white/10 bg-[#121a2b] p-5">
              <h2 className="text-sm font-semibold text-gray-100">Visão do Produto</h2>
              <p className="mt-2 text-gray-300 leading-relaxed">
                O Foco AI é um copiloto de execução pessoal guiado por IA. O agente Zen Folk acompanha cada sprint,
                sustenta concentração, provoca retomada quando houver desvio e fecha cada sessão com registro objetivo
                de progresso.
              </p>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#121a2b] p-5">
              <h2 className="text-sm font-semibold text-gray-100">Pilar Operacional do MVP</h2>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-300">
                <li>Definir missão da sessão (tarefa + duração).</li>
                <li>Executar cronômetro com checkpoints estratégicos.</li>
                <li>Emitir mensagens curtas de foco no tom do Zen Folk.</li>
                <li>Realizar fechamento obrigatório da sessão com histórico.</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Modals */}
        <SessionConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onStart={handleStartSession}
        />

        <SessionCloseModal isOpen={isCloseModalOpen} />
      </div>
    </div>
  );
};

export default FocoTotalPage;
