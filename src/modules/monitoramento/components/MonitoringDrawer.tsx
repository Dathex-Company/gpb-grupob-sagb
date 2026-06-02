import React from 'react';
import { MonitoringDashboardCard } from '../types';

interface MonitoringDrawerProps {
  card: MonitoringDashboardCard | null;
  onClose: () => void;
}

export const MonitoringDrawer: React.FC<MonitoringDrawerProps> = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l border-sky-500/20 bg-white/95 dark:bg-slate-950/95 shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur-xl overflow-y-auto">
      <div className="p-6 space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Detalhe Operacional</span>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{card.title}</h2>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{card.description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-black text-slate-500 hover:text-red-500">Fechar</button>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-sky-500/15 bg-sky-500/10 p-4">
            <p className="text-[10px] font-black uppercase text-sky-500">Status</p>
            <strong className="text-lg font-black text-slate-950 dark:text-white">{card.status.replace('_', ' ')}</strong>
          </div>
          <div className="rounded-3xl border border-sky-500/15 bg-sky-500/10 p-4">
            <p className="text-[10px] font-black uppercase text-sky-500">Severidade</p>
            <strong className="text-lg font-black text-slate-950 dark:text-white">{card.severity}</strong>
          </div>
          <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-4 col-span-2">
            <p className="text-[10px] font-black uppercase text-blue-500">Integração</p>
            <strong className="text-lg font-black text-slate-950 dark:text-white">{card.integration.integrationStatus}</strong>
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Diagnóstico rápido</h3>
          <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">{card.description}</p>
        </section>

        <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Métricas principais</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[card.mainMetric, ...card.secondaryMetrics].map((metric) => (
              <div key={metric.label} className="rounded-2xl bg-slate-50 dark:bg-white/5 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-400">{metric.label}</p>
                <strong className="text-sm font-black text-slate-900 dark:text-white">{metric.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Alertas recentes</h3>
          <div className="mt-3 space-y-2">
            {(card.alerts.length ? card.alerts : [{ id: 'empty', label: 'Sem alertas recentes', severity: 'info' as const }]).map((alert) => (
              <div key={alert.id} className="rounded-2xl bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300">{alert.label}</div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Responsabilidade</h3>
          <div className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300 space-y-1">
            <p>Área: {card.responsible.area}</p>
            <p>Agente: {card.responsible.agent}</p>
            <p>Backup: {card.responsible.backup || 'não definido'}</p>
            <p>Última resposta: {card.responsible.lastResponse || 'sem leitura'}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Origem dos dados</h3>
          <div className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300 space-y-1">
            <p>Módulo fonte: {card.integration.dataSourceModule || 'pendente'}</p>
            <p>Tipo: {card.integration.dataSourceType}</p>
            <p>Conector: {card.integration.requiredConnector}</p>
            <p>Validação: {card.integration.requiredValidationOwner}</p>
            <p>TaskZei: {card.integration.canTriggerTaskzei ? 'preparado' : 'não previsto'}</p>
            <p>Notificação: {card.integration.canNotifyAgent ? 'preparado' : 'não previsto'}</p>
            <p>Incidente: {card.integration.canOpenIncident ? 'preparado' : 'não previsto'}</p>
          </div>
        </section>

        {card.notificationDetail && (
          <section className="rounded-3xl border border-orange-300/30 bg-orange-500/10 p-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Central de Notificações</h3>
            <div className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300 space-y-1">
              <p>Para: {card.notificationDetail.recipient}</p>
              <p>Canal: {card.notificationDetail.channel}</p>
              <p>Status: {card.notificationDetail.status}</p>
              <p>Tempo desde envio: {card.notificationDetail.elapsedTime}</p>
              <p>Precisa escalar: {card.notificationDetail.shouldEscalate ? 'sim' : 'não'}</p>
            </div>
          </section>
        )}

        {card.actionFlow && (
          <section className="rounded-3xl border border-cyan-300/30 bg-cyan-500/10 p-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-500">Responsáveis e Ação Inteligente</h3>
            <div className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300 space-y-1">
              <p>Problema: {card.actionFlow.problem}</p>
              <p>Responsável: {card.actionFlow.responsible}</p>
              <p>BO: {card.actionFlow.boStatus}</p>
              <p>TaskZei: {card.actionFlow.taskZeiStatus}</p>
              <p>Retorno: {card.actionFlow.returnStatus}</p>
              <p>Tempo médio: {card.actionFlow.averageResponseTime}</p>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 dark:border-white/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Histórico curto</h3>
          <div className="mt-3 space-y-2">
            {card.history.map((item) => <div key={item} className="rounded-2xl bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300">{item}</div>)}
          </div>
        </section>

        <section className="rounded-3xl border border-sky-300/30 bg-sky-500/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-sky-500">Próximo passo sugerido</h3>
          <p className="mt-3 text-sm font-black text-slate-700 dark:text-slate-100">{card.nextStepSuggestion}</p>
        </section>

        {card.relatedSubmoduleSlug && <a href={`/monitoramento/${card.relatedSubmoduleSlug}`} className="block rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">Abrir submódulo relacionado</a>}

        <section className="grid grid-cols-2 gap-2">
          {card.actions.map((action) => (
            <button key={action.id} type="button" className="rounded-2xl border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-black text-slate-600 dark:text-slate-300">
              {action.label}
            </button>
          ))}
        </section>
      </div>
    </aside>
  );
};
