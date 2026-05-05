import React, { useEffect, useState } from 'react';
import { useTaskzeiStore } from '../../store/taskzei.store';
import { useMeetingStore } from '../../store/meeting.store';
import { useInboxStore } from '../../store/inbox.store';
import { taskzeiFacade } from '../../services/taskzei.facade';
import { metricsService } from '../../services/taskzei.metrics';
import { monitorService } from '../../services/taskzei.monitor';
import type { OverallMetrics } from '../../services/taskzei.metrics';
import type { HealthStatus } from '../../services/taskzei.monitor';

export const AgendaInteligenteMonitorPage: React.FC = () => {
  const tasks = useTaskzeiStore(s => s.tasks);
  const meetings = useMeetingStore(s => s.meetings);
  const inboxItems = useInboxStore(s => s.inboxItems);

  const [metrics, setMetrics] = useState<OverallMetrics | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      // Recarrega dados dos providers
      await taskzeiFacade.loadTasks();
      await taskzeiFacade.loadMeetings();
      await taskzeiFacade.loadInboxItems();
    } catch (err) {
      console.error('[MonitorPage] Erro ao refresh:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Calcula métricas e saúde
    setMetrics(metricsService.computeOverall(tasks, meetings, inboxItems));
    setHealth(monitorService.getHealthStatus());
  }, [tasks, meetings, inboxItems]);

  const healthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical':
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const healthBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-50 border-green-200';
      case 'degraded': return 'bg-yellow-50 border-yellow-200';
      case 'critical':
      case 'disconnected': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (!metrics || !health) {
    return (
      <div className="flex items-center justify-center h-full text-[13px] text-[#95a0b1]">
        Calculando métricas...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto">
      {/* Header */}
      <div className="border-b border-[#e8ecf1] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#414854] tracking-tight">Monitoramento</h1>
            <p className="text-[12px] text-[#6f7887] mt-0.5">
              Última atualização: {new Date(metrics.lastUpdated).toLocaleString('pt-BR')}
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="rounded-lg border border-[#d9dee5] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6f7887] hover:bg-[#f5f6f7] disabled:opacity-40 transition-colors"
          >
            {refreshing ? 'Atualizando...' : '↻ Atualizar'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Health status */}
        <div className={`rounded-xl border p-4 ${healthBg(health.overall)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-[#414854]">Status do Módulo</h2>
              <p className={`text-[11px] font-medium mt-0.5 ${healthColor(health.overall)}`}>
                {health.overall === 'healthy' ? 'Saudável' :
                 health.overall === 'degraded' ? 'Degradado' : 'Crítico'}
              </p>
            </div>
            <div className="text-right text-[11px] text-[#6f7887]">
              <p>Provider: <span className={healthColor(health.providerStatus)}>
                {health.providerStatus === 'connected' ? 'Conectado' :
                 health.providerStatus === 'degraded' ? 'Degradado' : 'Desconectado'}
              </span></p>
              {health.lastSyncTimestamp && (
                <p>Último sync: {new Date(health.lastSyncTimestamp).toLocaleString('pt-BR')}</p>
              )}
            </div>
          </div>
          {(health.errorCount > 0 || health.warningCount > 0) && (
            <div className="mt-2 flex gap-3 text-[11px]">
              <span className="text-red-600">{health.errorCount} erro(s)</span>
              <span className="text-yellow-600">{health.warningCount} aviso(s)</span>
            </div>
          )}
        </div>

        {/* Task Metrics */}
        <div className="rounded-xl border border-[#e8ecf1] p-4">
          <h2 className="text-[13px] font-semibold text-[#414854] mb-3">Tarefas</h2>
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label="Total" value={metrics.tasks.total} />
            <MetricCard label="Abertas" value={metrics.tasks.byStatus.aberta} />
            <MetricCard label="Em Andamento" value={metrics.tasks.byStatus.em_andamento} />
            <MetricCard label="Concluídas" value={metrics.tasks.byStatus.concluida} />
            <MetricCard label="Taxa de Conclusão" value={`${(metrics.tasks.completionRate * 100).toFixed(0)}%`} />
            <MetricCard label="Dias Médio" value={metrics.tasks.averageCompletionDays.toFixed(1)} />
            <MetricCard label="Atrasadas" value={metrics.tasks.overdueCount} />
            <MetricCard label="Com Checklist" value={metrics.tasks.withChecklist} />
          </div>
        </div>

        {/* Meeting Metrics */}
        <div className="rounded-xl border border-[#e8ecf1] p-4">
          <h2 className="text-[13px] font-semibold text-[#414854] mb-3">Reuniões</h2>
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label="Total" value={metrics.meetings.total} />
            <MetricCard
              label="Agendadas"
              value={metrics.meetings.byStatus['agendada'] || 0}
            />
            <MetricCard
              label="Concluídas"
              value={metrics.meetings.byStatus['concluida'] || 0}
            />
            <MetricCard
              label="Duração Média"
              value={`${metrics.meetings.averageDurationMinutes.toFixed(0)}min`}
            />
            <MetricCard label="Decisões" value={metrics.meetings.totalDecisions} />
            <MetricCard
              label="Itens/Pauta"
              value={metrics.meetings.averageAgendaItemsPerMeeting.toFixed(1)}
            />
          </div>
        </div>

        {/* Inbox Metrics */}
        <div className="rounded-xl border border-[#e8ecf1] p-4">
          <h2 className="text-[13px] font-semibold text-[#414854] mb-3">Inbox</h2>
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label="Total" value={metrics.inbox.total} />
            <MetricCard
              label="Pendentes"
              value={metrics.inbox.byStatus['pending'] || 0}
            />
            <MetricCard
              label="Convertidos"
              value={metrics.inbox.byStatus['converted'] || 0}
            />
            <MetricCard
              label="Taxa de Conversão"
              value={`${(metrics.inbox.conversionRate * 100).toFixed(0)}%`}
            />
          </div>
        </div>

        {/* Active Alerts */}
        {health.activeAlerts.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <h2 className="text-[13px] font-semibold text-red-700 mb-2">
              Alertas Ativos ({health.activeAlerts.length})
            </h2>
            <div className="space-y-1">
              {health.activeAlerts.slice(-5).map((alert, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-red-600">
                  <span className="font-medium uppercase shrink-0">[{alert.severity}]</span>
                  <span className="flex-1">{alert.message}</span>
                  <span className="text-red-400 shrink-0">{new Date(alert.timestamp).toLocaleTimeString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Monitor Events */}
        <div className="rounded-xl border border-[#e8ecf1] p-4">
          <h2 className="text-[13px] font-semibold text-[#414854] mb-2">Eventos Recentes</h2>
          <div className="space-y-1">
            {monitorService.getRecentEvents(undefined, 10).map((event, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-[#6f7887] py-0.5">
                <span className={`font-medium uppercase shrink-0 ${
                  event.severity === 'critical' ? 'text-red-500' :
                  event.severity === 'error' ? 'text-red-400' :
                  event.severity === 'warning' ? 'text-yellow-500' :
                  'text-[#95a0b1]'
                }`}>
                  [{event.severity}]
                </span>
                <span className="flex-1">{event.message}</span>
                <span className="text-[#95a0b1] shrink-0">{new Date(event.timestamp).toLocaleTimeString('pt-BR')}</span>
              </div>
            ))}
            {monitorService.getRecentEvents().length === 0 && (
              <p className="text-[11px] text-[#95a0b1] italic">Nenhum evento registrado</p>
            )}
          </div>
        </div>

        {/* Audit Events Count */}
        <div className="rounded-xl border border-[#e8ecf1] p-4">
          <h2 className="text-[13px] font-semibold text-[#414854] mb-2">Auditoria</h2>
          <p className="text-[11px] text-[#6f7887]">
            Total de eventos de auditoria registrados: <strong>{metrics.totalAuditEvents}</strong>
          </p>
          <p className="text-[11px] text-[#95a0b1] mt-1">
            A auditoria detalhada pode ser consultada via collection `taskzei_audit_log` no Firestore.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── MetricCard ──────────────────────────────────────────────────────

const MetricCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="rounded-lg border border-[#e8ecf1] bg-[#fcfcfd] px-3 py-2">
    <p className="text-[18px] font-bold text-[#414854]">{value}</p>
    <p className="text-[10px] font-medium text-[#95a0b1] uppercase tracking-wide">{label}</p>
  </div>
);
