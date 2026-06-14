import React from 'react';
import { CENTRAL_STATUS_LABELS } from '../types';

const colorMap: Record<string, string> = {
  publicado: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  aprovado: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  revisao: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  curadoria: 'bg-purple-500/15 text-purple-700 border-purple-500/30',
  em_curadoria: 'bg-purple-500/15 text-purple-700 border-purple-500/30',
  rascunho: 'bg-slate-500/15 text-slate-700 border-slate-500/30',
  deprecado: 'bg-red-500/15 text-red-700 border-red-500/30',
  substituido: 'bg-red-500/15 text-red-700 border-red-500/30',
  canonico: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  bruto: 'bg-orange-500/15 text-orange-700 border-orange-500/30',
  legado: 'bg-zinc-500/15 text-zinc-700 border-zinc-500/30',
  conforme: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  parcial: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  sem_vinculo: 'bg-red-500/15 text-red-700 border-red-500/30',
  revisar: 'bg-purple-500/15 text-purple-700 border-purple-500/30',
  critico: 'bg-red-500/15 text-red-700 border-red-500/30',
  alto: 'bg-orange-500/15 text-orange-700 border-orange-500/30',
  medio: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  baixo: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  homologado: 'bg-green-500/15 text-green-700 border-green-500/30',
  canonico_operacional: 'bg-emerald-600/15 text-emerald-800 border-emerald-600/30',
  canonico_oficial: 'bg-blue-700/15 text-blue-900 border-blue-700/30',
  obsoleto: 'bg-gray-500/15 text-gray-700 border-gray-500/30',
  arquivado: 'bg-zinc-600/15 text-zinc-800 border-zinc-600/30',
  bloqueado: 'bg-red-600/15 text-red-800 border-red-600/30',
  previsto: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  registro: 'bg-cyan-500/15 text-cyan-700 border-cyan-500/30'
};

export const StatusBadge: React.FC<{ value: string }> = ({ value }) => {
  const classes = colorMap[value] || 'bg-sagb-bg-2 text-sagb-muted border-sagb-line';
  const label = CENTRAL_STATUS_LABELS[value as keyof typeof CENTRAL_STATUS_LABELS] || value.replace(/_/g, ' ');
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${classes}`}>{label}</span>;
};

