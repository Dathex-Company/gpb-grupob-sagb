import React from 'react';

interface AgentStatsProps {
  stats: {
    total: number;
    ativos: number;
    humanos: number;
    ia_hibrido: number;
    automaticos: number;
    capacidade_total: number;
  };
}

const AgentStats: React.FC<AgentStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.ativos}</div>
          <div className="text-xs text-slate-500">Ativos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.humanos}</div>
          <div className="text-xs text-slate-500">Humanos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.ia_hibrido}</div>
          <div className="text-xs text-slate-500">IA Híbrido</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.automaticos}</div>
          <div className="text-xs text-slate-500">Automáticos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.capacidade_total}</div>
          <div className="text-xs text-slate-500">Capacidade Total</div>
        </div>
      </div>
    </div>
  );
};

export default AgentStats;
