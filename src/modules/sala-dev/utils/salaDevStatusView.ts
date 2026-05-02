export interface StatusViewConfig {
  label: string;
  className: string;
}

const STATUS_LABELS: Record<string, StatusViewConfig> = {
  pending: { label: 'Pendente', className: 'bg-slate-700/70 text-slate-100' },
  running: { label: 'Em execução', className: 'bg-cyan-700/60 text-cyan-50' },
  review: { label: 'Em revisão', className: 'bg-amber-700/60 text-amber-50' },
  approved: { label: 'Aprovado', className: 'bg-emerald-700/60 text-emerald-50' },
  rejected: { label: 'Rejeitado', className: 'bg-rose-700/60 text-rose-50' },
  blocked: { label: 'Bloqueado', className: 'bg-red-800/70 text-red-50' },
  completed: { label: 'Concluído', className: 'bg-emerald-800/70 text-emerald-50' },
  available: { label: 'Disponível', className: 'bg-teal-700/60 text-teal-50' },
  recommended: { label: 'Recomendado', className: 'bg-violet-700/60 text-violet-50' },
  summoned: { label: 'Convocado', className: 'bg-blue-700/60 text-blue-50' },
  waiting: { label: 'Aguardando', className: 'bg-slate-700/70 text-slate-100' },
  draft: { label: 'Rascunho', className: 'bg-slate-700/70 text-slate-100' },
  generated: { label: 'Gerado', className: 'bg-cyan-700/60 text-cyan-50' },
  official: { label: 'Oficial', className: 'bg-emerald-700/60 text-emerald-50' },
  info: { label: 'Info', className: 'bg-slate-700/70 text-slate-100' },
  warning: { label: 'Alerta', className: 'bg-amber-700/60 text-amber-50' },
  error: { label: 'Erro', className: 'bg-rose-700/60 text-rose-50' },
  critical: { label: 'Crítico', className: 'bg-red-800/80 text-red-50' },
  open: { label: 'Aberta', className: 'bg-slate-700/70 text-slate-100' },
  validated: { label: 'Validada', className: 'bg-emerald-700/60 text-emerald-50' },
  superseded: { label: 'Substituída', className: 'bg-zinc-700/70 text-zinc-50' }
};

export function getStatusView(status?: string): StatusViewConfig {
  if (!status) return { label: 'N/D', className: 'bg-slate-700/70 text-slate-100' };
  return STATUS_LABELS[status] || { label: status, className: 'bg-slate-700/70 text-slate-100' };
}

