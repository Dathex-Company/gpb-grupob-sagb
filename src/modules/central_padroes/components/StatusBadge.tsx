import React from 'react';

const colorMap: Record<string, string> = {
  publicado: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  aprovado: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  revisao: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  curadoria: 'bg-purple-500/15 text-purple-700 border-purple-500/30',
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
  baixo: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
};

export const StatusBadge: React.FC<{ value: string }> = ({ value }) => {
  const classes = colorMap[value] || 'bg-sagb-bg-2 text-sagb-muted border-sagb-line';
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${classes}`}>{value.replace(/_/g, ' ')}</span>;
};

