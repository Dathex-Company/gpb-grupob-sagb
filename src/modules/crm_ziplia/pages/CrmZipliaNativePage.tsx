import React, { useEffect, useMemo, useState } from 'react';
import { crmZipliaService } from '../services/crmZipliaService';
import { CrmLead, CrmStageConfig } from '../types';
import CrmKpiCard from '../components/CrmKpiCard';
import CrmPipelineBoard from '../components/CrmPipelineBoard';
import CrmPipelineGrid from '../components/CrmPipelineGrid';
import CrmPipelineLines from '../components/CrmPipelineLines';

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format((value || 0) / 100);
};

export const CrmZipliaNativePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'whatsapp' | 'daily' | 'dashboard-colab' | 'dashboard-gestor' | 'inbox' | 'integrations' | 'simulator' | 'differences' | 'settings'>('pipeline');
  const [viewVariant, setViewVariant] = useState<'classic' | 'modern' | 'lines'>('classic');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [stages, setStages] = useState<CrmStageConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const [nextLeads, nextStages] = await Promise.all([
        crmZipliaService.getLeads(),
        crmZipliaService.getStages()
      ]);

      setLeads(nextLeads);
      setStages(nextStages);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar CRM Ziplia';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const kpis = useMemo(() => {
    const stageProb = new Map(stages.map((s) => [s.status, s.probability]));
    const projected = leads.reduce((acc, lead) => acc + lead.projectedCommission, 0);
    const probable = leads.reduce((acc, lead) => {
      return acc + lead.projectedCommission * (stageProb.get(lead.status) ?? 0);
    }, 0);
    const openLeads = leads.filter((lead) => lead.status !== 'Fechado ganho' && lead.status !== 'Fechado perdido').length;

    return { projected, probable, openLeads };
  }, [leads, stages]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((lead) =>
      lead.name.toLowerCase().includes(q) || lead.company.toLowerCase().includes(q)
    );
  }, [leads, searchQuery]);

  const tabItems: Array<{ id: typeof activeTab; label: string }> = [
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'daily', label: 'Lista do Dia' },
    { id: 'dashboard-colab', label: 'Dashboard Colab' },
    { id: 'dashboard-gestor', label: 'Dashboard Gestor' },
    { id: 'inbox', label: 'Inbox Unificada' },
    { id: 'integrations', label: 'Integrações' },
    { id: 'simulator', label: 'Simulador' },
    { id: 'differences', label: 'Diferenças' },
    { id: 'settings', label: 'Configurações' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-sagb-bg text-gray-900 dark:text-sagb-text overflow-hidden">
      <div className="h-full w-full flex">
        <aside className="w-72 bg-white dark:bg-sagb-card border-r border-slate-200 dark:border-sagb-border flex flex-col p-5">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400">Ziplia CRM</p>
            <h1 className="text-2xl font-black tracking-tight">Performance AI</h1>
          </div>

          <nav className="flex-1 overflow-auto space-y-1">
            {tabItems.map((item) => {
              const active = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-sagb-bg'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-sagb-border hover:bg-white dark:hover:bg-sagb-bg text-sm font-semibold"
          >
            Voltar ao SagB
          </button>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-20 shrink-0 px-6 bg-white/90 dark:bg-sagb-card/90 backdrop-blur border-b border-slate-200 dark:border-sagb-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black">{tabItems.find((t) => t.id === activeTab)?.label || 'CRM Ziplia'}</h2>
              {activeTab === 'pipeline' && (
                <div className="flex rounded-xl bg-slate-100 dark:bg-sagb-bg p-1">
                  <button
                    onClick={() => setViewVariant('classic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewVariant === 'classic' ? 'bg-white dark:bg-sagb-card text-indigo-700' : 'text-slate-500'}`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setViewVariant('modern')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewVariant === 'modern' ? 'bg-white dark:bg-sagb-card text-indigo-700' : 'text-slate-500'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewVariant('lines')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewVariant === 'lines' ? 'bg-white dark:bg-sagb-card text-indigo-700' : 'text-slate-500'}`}
                  >
                    Linhas
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar leads, empresas..."
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-sagb-border bg-slate-50 dark:bg-sagb-bg text-sm w-72"
              />
              <button
                onClick={load}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-sagb-border text-xs font-bold hover:bg-white dark:hover:bg-sagb-bg"
              >
                Recarregar
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 mb-6">
                <p className="text-sm font-bold text-red-700">Falha ao carregar CRM nativo</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button
                  onClick={load}
                  className="mt-3 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                >
                  Tentar novamente
                </button>
              </div>
            ) : null}

            {(activeTab === 'pipeline' || activeTab === 'dashboard-colab' || activeTab === 'dashboard-gestor') && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <CrmKpiCard label="Projetado" value={formatMoney(kpis.projected)} helper="Soma da comissão projetada" />
                <CrmKpiCard label="Provável" value={formatMoney(kpis.probable)} helper="Aplicando probabilidade por estágio" />
                <CrmKpiCard label="Leads em aberto" value={String(kpis.openLeads)} helper="Exclui ganhos e perdas" />
              </section>
            )}

            {activeTab === 'pipeline' && (
              <section>
                {viewVariant === 'classic' && <CrmPipelineBoard leads={filteredLeads} stages={stages} loading={loading} />}
                {viewVariant === 'modern' && <CrmPipelineGrid leads={filteredLeads} stages={stages} loading={loading} />}
                {viewVariant === 'lines' && <CrmPipelineLines leads={filteredLeads} stages={stages} loading={loading} />}
              </section>
            )}

            {activeTab !== 'pipeline' && (
              <section className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white dark:bg-sagb-card">
                <p className="text-sm text-slate-500">
                  Aba <span className="font-bold">{tabItems.find((t) => t.id === activeTab)?.label}</span> mapeada para paridade real e próxima da implementação.
                </p>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CrmZipliaNativePage;
