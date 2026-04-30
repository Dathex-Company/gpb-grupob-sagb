import React from 'react';
import { CrmLead, CrmStageConfig } from '../types';

type CrmPipelineGridProps = {
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

export const CrmPipelineGrid: React.FC<CrmPipelineGridProps> = ({ leads, stages, loading = false }) => {
  if (loading) {
    return <div className="rounded-2xl border border-gray-200 dark:border-sagb-border bg-white dark:bg-sagb-card p-8 text-center text-sm text-gray-500">Carregando visualização em grade...</div>;
  }

  const stageMap = new Map(stages.map((s) => [s.status, s.probability]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {leads.map((lead) => (
        <article key={lead.id} className="rounded-2xl border border-gray-200 dark:border-sagb-border bg-white dark:bg-sagb-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-black text-gray-900 dark:text-sagb-text truncate">{lead.name}</p>
            <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold">{lead.status}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4 truncate">{lead.company}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-gray-50 dark:bg-sagb-bg p-2">
              <p className="text-gray-400 uppercase font-black text-[10px]">Projetado</p>
              <p className="font-bold text-gray-800 dark:text-sagb-text">{formatMoney(lead.projectedCommission)}</p>
            </div>
            <div className="rounded-xl bg-indigo-50 dark:bg-sagb-bg p-2">
              <p className="text-indigo-400 uppercase font-black text-[10px]">Provável</p>
              <p className="font-bold text-indigo-700">{formatMoney(probable(lead, stageMap))}</p>
            </div>
          </div>
        </article>
      ))}
      {leads.length === 0 && (
        <div className="col-span-full rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">Nenhum lead encontrado</div>
      )}
    </div>
  );
};

export default CrmPipelineGrid;

