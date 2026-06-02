import React from 'react';
import { MonitoringAlertPreview, MonitoringDashboardCard, MonitoringMetric } from '../types';

const toneByStatus: Record<string, 'ok' | 'warn' | 'bad' | 'info'> = {
  online: 'ok',
  saudável: 'ok',
  atenção: 'warn',
  alerta: 'warn',
  crítico: 'bad',
  offline: 'bad',
  desconhecido: 'info',
  pausado: 'info',
  em_verificacao: 'info'
};

const severityClass = (severity: string) => {
  if (severity === 'crítico' || severity === 'alto') return 'red';
  if (severity === 'médio') return 'orange';
  if (severity === 'baixo') return 'yellow';
  return 'green';
};

const deltaClass = (metric: MonitoringMetric) => {
  if (metric.trend === 'down') return 'down';
  if (metric.trend === 'stable') return 'warn';
  return '';
};

const meterWidth = (value: string, index: number) => {
  const numeric = Number(String(value).replace(/[^0-9]/g, ''));
  if (Number.isFinite(numeric) && numeric > 0) return Math.max(8, Math.min(96, numeric));
  if (/ok|online|ativo|pronto|seguro/i.test(value)) return 92;
  return Math.min(94, 44 + index * 9);
};

interface MonitoringCardProps {
  card: MonitoringDashboardCard;
  onOpen: (cardId: string) => void;
  onDragStart: (cardId: string) => void;
  onDropCard: (cardId: string) => void;
  onResize: (cardId: string) => void;
  compact?: boolean;
}

export const MonitoringCard: React.FC<MonitoringCardProps> = ({ card, onOpen, onDragStart, onDropCard, onResize, compact }) => {
  const metrics = [card.mainMetric, ...card.secondaryMetrics].slice(0, 3);
  const sideMetrics = card.secondaryMetrics.slice(0, 3);
  const alerts: MonitoringAlertPreview[] = card.alerts.length > 0
    ? card.alerts.slice(0, 3)
    : [{ id: `${card.id}-ok`, label: 'Sem alertas críticos', severity: 'baixo' }];

  return (
    <article
      draggable
      onDragStart={() => onDragStart(card.id)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDropCard(card.id)}
      className="lis-v4-card group cursor-grab active:cursor-grabbing"
    >
      <button type="button" onClick={() => onOpen(card.id)} className="contents text-left">
        <header className="lis-v4-card-head">
          <div className="lis-v4-num">{card.id === 'saude-geral' ? '★' : card.shortTitle.slice(0, 1)}</div>
          <div className="lis-v4-card-title">{card.title}</div>
          <div className={`lis-v4-status ${toneByStatus[card.status] || 'info'}`}>{card.status.replace('_', ' ')}</div>
        </header>

        <div className="lis-v4-metric-row">
          {metrics.map((metric) => (
            <div key={`${card.id}-${metric.label}`} className="lis-v4-metric">
              <div className="lis-v4-label">{metric.label}</div>
              <div className="lis-v4-value">
                {metric.value}
                {metric.trend && <span className={`lis-v4-delta ${deltaClass(metric)}`}>{metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '•'}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="lis-v4-visual">
          <div className="lis-v4-chart">
            {[34, 52, 45, 70, 58, 82, 64, 74, 54, 68].map((height, index) => (
              <span key={index} className={`lis-v4-bar ${index % 3 === 0 ? 'alt' : ''}`} style={{ height: `${Math.max(12, height)}%` }} />
            ))}
          </div>
          <div className="lis-v4-side">
            {sideMetrics.map((metric, index) => (
              <div key={`${card.id}-side-${metric.label}`}>
                <div className="lis-v4-mini"><span>{metric.label}</span><strong>{metric.value}</strong></div>
                <div className="lis-v4-meter"><span style={{ width: `${meterWidth(metric.value, index)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="lis-v4-alerts">
          <div className="lis-v4-alert-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="lis-v4-alert-line"><span className={`lis-v4-severity ${severityClass(alert.severity)}`} /><span>{alert.label}</span></div>
            ))}
            <div className="lis-v4-alert-line"><span className="lis-v4-severity" /><span>{card.integration.integrationStatus}</span></div>
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); onOpen(card.id); }} className="lis-v4-detail">Detalhes ›</button>
        </div>
      </button>

      <button type="button" onClick={() => onResize(card.id)} className="absolute left-3 bottom-3 z-10 border-0 bg-transparent text-[10px] font-bold text-[#78aefe] opacity-0 transition-opacity group-hover:opacity-100">
        tamanho
      </button>
    </article>
  );
};
