import React from 'react';
import RAIHero from '../components/RAIHero';
import RAIStatsStrip from '../components/RAIStatsStrip';
import RAIAgentsPanel from '../components/RAIAgentsPanel';
import RAICapturesPanel from '../components/RAICapturesPanel';
import RAIReadingsPanel from '../components/RAIReadingsPanel';
import RAIAlertsPanel from '../components/RAIAlertsPanel';
import RAIFiltersBar from '../components/RAIFiltersBar';
import RAIHistoryPanel from '../components/RAIHistoryPanel';
import { useRAIAgents, useRAICaptures, useRAIInsights } from '../hooks/useRAI';
import { RAIFilters } from '../types';
import { raiSupabaseService } from '../services/raiSupabaseService';
import { auth } from '../../../../services/supabase';

const RAIPage: React.FC = () => {
  const [step, setStep] = React.useState<'configurar' | 'coletar' | 'revisar' | 'encaminhar'>('configurar');
  const [runningAgentId, setRunningAgentId] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<RAIFilters>({ minRelevance: 0 });

  const { agents } = useRAIAgents();
  const { captures, loading: capturesLoading, error: capturesError, setFilters: setCaptureFilters } = useRAICaptures(filters);
  const { readings, alerts, loading: insightsLoading } = useRAIInsights();

  React.useEffect(() => {
    setCaptureFilters(filters);
  }, [filters, setCaptureFilters]);

  const applyQuickFilter = (next: Partial<RAIFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const runAgentNow = async (agentId: string) => {
    const user = auth.currentUser;
    const workspaceId = user?.app_metadata?.workspaceId || user?.user_metadata?.workspaceId || 'default';
    setRunningAgentId(agentId);
    try {
      await raiSupabaseService.triggerAgentRun(agentId, workspaceId);
      setStep('coletar');
    } finally {
      setRunningAgentId(null);
    }
  };

  const isLoading = capturesLoading || insightsLoading;

  return (
    <div className="h-full bg-gray-50 dark:bg-[#0B0F19] overflow-y-auto custom-scrollbar">
      <div className="max-w-[1600px] mx-auto p-8">

        {/* Jornada operacional */}
        <div className="mb-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'configurar', label: '1. Configurar' },
              { id: 'coletar', label: '2. Coletar' },
              { id: 'revisar', label: '3. Revisar' },
              { id: 'encaminhar', label: '4. Encaminhar' },
            ] as const).map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider ${step === s.id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Header Section */}
        <RAIHero />
        
        {/* Quick Stats */}
        <RAIStatsStrip
          agents={agents}
          captures={captures}
          alerts={alerts}
          readings={readings}
          onQuickFilter={applyQuickFilter}
        />

        {/* Filters */}
        <RAIFiltersBar filters={filters} agents={agents} onChange={setFilters} />

        {isLoading && (
          <div className="mb-6 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs text-gray-500">
            Carregando inteligência do radar...
          </div>
        )}

        {capturesError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-700/30 text-xs text-rose-600">
            Erro ao carregar capturas: {capturesError}
          </div>
        )}

        {!isLoading && captures.length === 0 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 text-xs text-amber-700">
            Nenhuma captura encontrada com os filtros atuais.
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Agents & Captures */}
          <div className="xl:col-span-4 space-y-8">
            <RAIAgentsPanel agents={agents} onRunNow={runAgentNow} runningAgentId={runningAgentId} />
            <RAICapturesPanel captures={captures} />
          </div>

          {/* Middle Column: Readings & Insights */}
          <div className="xl:col-span-5 space-y-8">
            <RAIReadingsPanel readings={readings} />
            <RAIHistoryPanel />
          </div>

          {/* Right Column: Alerts & Opportunities */}
          <div className="xl:col-span-3 space-y-8">
            <RAIAlertsPanel alerts={alerts} />
            
            {/* Call to Action: Future Integration */}
            <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
               <h4 className="text-sm font-black uppercase mb-2 tracking-widest">Ação Direta</h4>
               <p className="text-[11px] text-blue-100 font-medium leading-relaxed mb-4">
                 Envie qualquer captura ou insight diretamente para o NIC (Inteligência Interna) ou NAGI (Governança).
               </p>
               <button className="w-full py-3 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">
                 Enviar para NIC
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RAIPage;
