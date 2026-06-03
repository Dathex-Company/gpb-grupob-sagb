import React from 'react';
import { DomainStatus } from '../types/nide.types';

const statusConfig: Record<DomainStatus, { label: string; className: string }> = {
  'planned': {
    label: 'Planejado',
    className: 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  },
  'in-progress': {
    label: 'Em andamento',
    className: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30'
  },
  'active': {
    label: 'Ativo',
    className: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30'
  },
  'paused': {
    label: 'Pausado',
    className: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/30'
  },
  'archived': {
    label: 'Arquivado',
    className: 'bg-gray-100 dark:bg-gray-800/40 text-gray-500 dark:text-gray-500 border-gray-200 dark:border-gray-700'
  }
};

interface StatusBadgeProps {
  status: DomainStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig['planned'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
};
