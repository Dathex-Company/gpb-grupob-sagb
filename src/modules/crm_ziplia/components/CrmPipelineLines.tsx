import React from 'react';
import { CrmLead, CrmStageConfig } from '../types';

type CrmPipelineLinesProps = {
  leads: CrmLead[];
  stages: CrmStageConfig[];
  loading?: boolean;
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((value || 0) / 100);
};

const probable = (lead: CrmLead, stageMap: Map<string, number>) => {
  return lead.projectedCommission * (stageMap.get(lead.status) ?? 0);
};

export const CrmPipelineLines: React.FC<CrmPipelineLinesProps> = ({ leads, stages, loading = false }) => {
  if (loading) {
    return <div className="rounded-2xl border border-gray-200 dark:border-sagb-border bg-white dark:bg-sagb-card p-8 text-center text-sm text-gray-500">Carregando visualização em linhas...</div>;
  }

  const stageMap = new Map(stages.map((s) => [s.status, s.probability]));

  return (
    <div className="space-y-2">
      {leads.map((lead) => (
        <article key={lead.id} className="rounded-2xl border border-gray-200 dark:border-sagb-border bg-white dark:bg-sagb-card p-4 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-black text-gray-900 dark:text-sagb-text truncate">{lead.name}</p>
            <p className="text-xs text-gray-500 truncate">{lead.company}</p>
          </div>

          <div className="hidden md:block text-right min-w-[140px]">
            <p className="text-[10px] uppercase text-gray-400 font-black">Status</p>
            <p className="text-xs font-bold text-gray-700 dark:text-sagb-text">{lead.status}</p>
          </div>

          <div className="text-right min-w-[120px]">
            <p className="text-[10px] uppercase text-gray-400 font-black">Projetado</p>
            <p className="text-xs font-bold text-gray-800 dark:text-sagb-text">{formatMoney(lead.projectedCommission)}</p>
          </div>

          <div className="text-right min-w-[120px]">
            <p className="text-[10px] uppercase text-indigo-400 font-black">Provável</p>
            <p className="text-xs font-bold text-indigo-700">{formatMoney(probable(lead, stageMap))}</p>
          </div>
        </article>
      ))}

      {leads.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">Nenhum lead encontrado</div>
      )}
    </div>
  );
};

export default CrmPipelineLines;

