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
    setMetrics(metricsService.computeOverall(tasks, meetings, inboxItems));
    setHealth(monitorService.getHealthStatus());
  }, [tasks, meetings, inboxItems]);

  const healthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'var(--sagb-primary)';
      case 'degraded': return 'var(--sagb-amber)';
      case 'critical':
      case 'disconnected': return 'var(--sagb-red)';
      default: return 'var(--sagb-muted)';
    }
  };

  const healthBg = (status: string): React.CSSProperties => {
    switch (status) {
      case 'healthy': return { borderColor: 'var(--sagb-primary)', backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 6%, transparent)' };
      case 'degraded': return { borderColor: 'var(--sagb-amber)', backgroundColor: 'color-mix(in srgb, var(--sagb-amber) 6%, transparent)' };
      case 'critical':
      case 'disconnected': return { borderColor: 'var(--sagb-red)', backgroundColor: 'color-mix(in srgb, var(--sagb-red) 6%, transparent)' };
      default: return { borderColor: 'var(--sagb-line)', backgroundColor: 'var(--sagb-bg)' };
    }
  };

  if (!metrics || !health) {
    return (
      <div className="flex items-center justify-center h-full text-[13px]" style={{ color: 'var(--sagb-muted)' }}>
        Calculando métricas...
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-auto"
      style={{
        backgroundColor: 'var(--sagb-surface)',
        borderRadius: 'var(--sagb-radius-xl)',
        border: '1px solid var(--sagb-line)',
        boxShadow: 'var(--sagb-shadow)',
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--sagb-line)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--sagb-text)' }}>
              Monitoramento
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--sagb-muted)' }}>
              Última atualização: {new Date(metrics.lastUpdated).toLocaleString('pt-BR')}
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="rounded-lg px-3 py-1.5 text-[12px] font-medium disabled:opacity-40 transition-colors"
            style={{
              border: '1px solid var(--sagb-line)',
              backgroundColor: 'var(--sagb-surface)',
              color: 'var(--sagb-muted)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-surface)'; }}
          >
            {refreshing ? 'Atualizando...' : '↻ Atualizar'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Health status */}
        <div
          className="rounded-xl border p-4"
          style={healthBg(health.overall)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold" style={{ color: 'var(--sagb-text)' }}>
                Status do Módulo
              </h2>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: healthColor(health.overall) }}>
                {health.overall === 'healthy' ? 'Saudável' :
                 health.overall === 'degraded' ? 'Degradado' : 'Crítico'}
              </p>
            </div>
            <div className="text-right text-[11px]" style={{ color: 'var(--sagb-muted)' }}>
              <p>
                Provider:{' '}
                <span style={{ color: healthColor(health.providerStatus) }}>
                  {health.providerStatus === 'connected' ? 'Conectado' :
                   health.providerStatus === 'degraded' ? 'Degradado' : 'Desconectado'}
                </span>
              </p>
              {health.lastSyncTimestamp && (
                <p>Último sync: {new Date(health.lastSyncTimestamp).toLocaleString('pt-BR')}</p>
              )}
            </div>
          </div>
          {(health.errorCount > 0 || health.warningCount > 0) && (
            <div className="mt-2 flex gap-3 text-[11px]">
              <span style={{ color: 'var(--sagb-red)' }}>{health.errorCount} erro(s)</span>
              <span style={{ color: 'var(--sagb-amber)' }}>{health.warningCount} aviso(s)</span>
            </div>
          )}
        </div>

        {/* Task Metrics */}
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--sagb-line)' }}>
          <h2 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--sagb-text)' }}>
            Tarefas
          </h2>
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
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--sagb-line)' }}>
          <h2 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--sagb-text)' }}>
            Reuniões
          </h2>
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
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--sagb-line)' }}>
          <h2 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--sagb-text)' }}>
            Inbox
          </h2>
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
          <div
            className="rounded-xl p-4"
            style={{
              border: '1px solid var(--sagb-red)',
              backgroundColor: 'color-mix(in srgb, var(--sagb-red) 6%, transparent)',
            }}
          >
            <h2 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--sagb-red)' }}>
              Alertas Ativos ({health.activeAlerts.length})
            </h2>
            <div className="space-y-1">
              {health.activeAlerts.slice(-5).map((alert, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]" style={{ color: 'var(--sagb-red)' }}>
                  <span className="font-medium uppercase shrink-0">[{alert.severity}]</span>
                  <span className="flex-1">{alert.message}</span>
                  <span className="shrink-0" style={{ color: 'color-mix(in srgb, var(--sagb-red) 70%, transparent)' }}>
                    {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Monitor Events */}
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--sagb-line)' }}>
          <h2 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--sagb-text)' }}>
            Eventos Recentes
          </h2>
          <div className="space-y-1">
            {monitorService.getRecentEvents(undefined, 10).map((event, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] py-0.5" style={{ color: 'var(--sagb-muted)' }}>
                <span
                  className="font-medium uppercase shrink-0"
                  style={{
                    color: event.severity === 'critical' ? 'var(--sagb-red)' :
                           event.severity === 'error' ? 'var(--sagb-red)' :
                           event.severity === 'warning' ? 'var(--sagb-amber)' :
                           'var(--sagb-muted)',
                  }}
                >
                  [{event.severity}]
                </span>
                <span className="flex-1">{event.message}</span>
                <span className="shrink-0" style={{ color: 'var(--sagb-muted)' }}>
                  {new Date(event.timestamp).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            ))}
            {monitorService.getRecentEvents().length === 0 && (
              <p className="text-[11px] italic" style={{ color: 'var(--sagb-muted)' }}>
                Nenhum evento registrado
              </p>
            )}
          </div>
        </div>

        {/* Audit Events Count */}
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--sagb-line)' }}>
          <h2 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--sagb-text)' }}>
            Auditoria
          </h2>
          <p className="text-[11px]" style={{ color: 'var(--sagb-muted)' }}>
            Total de eventos de auditoria registrados:{' '}
            <strong style={{ color: 'var(--sagb-text)' }}>{metrics.totalAuditEvents}</strong>
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--sagb-muted)' }}>
            A auditoria detalhada pode ser consultada via collection `taskzei_audit_log` no Firestore.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── MetricCard ──────────────────────────────────────────────────────

const MetricCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div
    className="rounded-lg px-3 py-2"
    style={{
      border: '1px solid var(--sagb-line)',
      backgroundColor: 'var(--sagb-bg)',
    }}
  >
    <p className="text-[18px] font-bold" style={{ color: 'var(--sagb-text)' }}>
      {value}
    </p>
    <p
      className="text-[10px] font-medium uppercase tracking-wide"
      style={{ color: 'var(--sagb-muted)' }}
    >
      {label}
    </p>
  </div>
);
