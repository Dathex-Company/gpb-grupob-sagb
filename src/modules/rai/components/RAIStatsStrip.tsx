import React from 'react';
import { RAIAgent, RAIAlert, RAICapture, RAIFilters, RAIReading } from '../types';

interface RAIStatsStripProps {
  agents: RAIAgent[];
  captures: RAICapture[];
  alerts: RAIAlert[];
  readings: RAIReading[];
  onQuickFilter: (next: Partial<RAIFilters>) => void;
}

const RAIStatsStrip: React.FC<RAIStatsStripProps> = ({ agents, captures, alerts, readings, onQuickFilter }) => {
  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const criticalAlerts = alerts.filter((a) => a.type === 'critical' || a.severity === 'high').length;
  const highRelevance = captures.filter((c) => c.relevance >= 70).length;
  const trendsUp = readings.filter((r) => r.trend === 'up').length;

  const stats = [
    { label: 'Agentes Ativos', value: String(activeAgents), color: 'text-emerald-500', action: () => onQuickFilter({}) },
    { label: 'Capturas Relevantes', value: String(highRelevance), color: 'text-blue-500', action: () => onQuickFilter({ minRelevance: 70 }) },
    { label: 'Sinais Críticos', value: String(criticalAlerts).padStart(2, '0'), color: 'text-rose-500', action: () => onQuickFilter({ status: 'new' }) },
    { label: 'Tendências em Alta', value: String(trendsUp).padStart(2, '0'), color: 'text-amber-500', action: () => onQuickFilter({ category: 'Tecnologia' }) }
  ];

  return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
        <button
          key={idx}
          onClick={stat.action}
          className="text-left bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 rounded-2xl shadow-sm hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{stat.label}</p>
          <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
        </button>
      ))}
    </div>
  );
};

export default RAIStatsStrip;
