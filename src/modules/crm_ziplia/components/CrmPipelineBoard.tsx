import React from 'react';
import { CrmLead, CrmStageConfig } from '../types';

type CrmPipelineBoardProps = {
  leads: CrmLead[];
  stages: CrmStageConfig[];
  loading?: boolean;
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format((value || 0) / 100);
};

export const CrmPipelineBoard: React.FC<CrmPipelineBoardProps> = ({ leads, stages, loading = false }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-sagb-border bg-white dark:bg-sagb-card p-8 text-center">
        <p className="text-sm text-gray-500">Carregando pipeline...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {stages.map((stage) => {
        const stageLeads = leads.filter((lead) => lead.status === stage.status);
        const totalProjected = stageLeads.reduce((acc, lead) => acc + lead.projectedCommission, 0);

        return (
          <section
            key={stage.status}
            className="min-w-[280px] max-w-[280px] rounded-2xl border border-gray-200 dark:border-sagb-border bg-white dark:bg-sagb-card p-3"
          >
            <header className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">{stage.status}</p>
                <p className="text-xs text-gray-500">{stageLeads.length} lead(s)</p>
              </div>
              <p className="text-xs font-bold text-gray-700 dark:text-sagb-text">{formatMoney(totalProjected)}</p>
            </header>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {stageLeads.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-3 text-xs text-gray-400">Sem leads</div>
              ) : (
                stageLeads.map((lead) => (
                  <article key={lead.id} className="rounded-xl border border-gray-100 dark:border-sagb-border p-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-sagb-text">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.company}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Projetado</span>
                      <span className="font-semibold text-gray-700 dark:text-sagb-text">{formatMoney(lead.projectedCommission)}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default CrmPipelineBoard;

