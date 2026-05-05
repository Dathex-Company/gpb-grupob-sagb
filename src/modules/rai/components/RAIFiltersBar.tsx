import React from 'react';
import { RAIAgent, RAIFilters } from '../types';

interface RAIFiltersBarProps {
  filters: RAIFilters;
  agents: RAIAgent[];
  onChange: (next: RAIFilters) => void;
}

const RAIFiltersBar: React.FC<RAIFiltersBarProps> = ({ filters, agents, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl mb-8">
      <div className="flex-1 min-w-[200px] relative">
        <input 
          type="text" 
          placeholder="Filtrar inteligência..." 
          value={filters.query || ''}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-blue-500/50 rounded-xl px-4 py-2 text-xs outline-none transition-all"
        />
      </div>
      <select
        value={filters.agentId || ''}
        onChange={(e) => onChange({ ...filters, agentId: e.target.value || undefined })}
        className="bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2 text-xs outline-none cursor-pointer"
      >
        <option value="">Todos os Agentes</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>{agent.name}</option>
        ))}
      </select>
      <select
        value={filters.category || ''}
        onChange={(e) => onChange({ ...filters, category: e.target.value || undefined })}
        className="bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2 text-xs outline-none cursor-pointer"
      >
        <option value="">Todas as Categorias</option>
        <option value="Tecnologia">Tecnologia</option>
        <option value="Financeiro">Financeiro</option>
        <option value="Concorrência">Concorrência</option>
      </select>
      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: (e.target.value || undefined) as RAIFilters['status'] })}
        className="bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2 text-xs outline-none cursor-pointer"
      >
        <option value="">Todos os Status</option>
        <option value="new">Novo</option>
        <option value="read">Lido</option>
        <option value="archived">Arquivado</option>
        <option value="converted">Convertido</option>
      </select>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-gray-400 uppercase">Relevância:</span>
        <input
          type="range"
          min={0}
          max={100}
          value={filters.minRelevance || 0}
          onChange={(e) => onChange({ ...filters, minRelevance: Number(e.target.value) })}
          className="w-24 accent-blue-500"
        />
        <span className="text-[10px] font-bold text-gray-500 w-8">{filters.minRelevance || 0}</span>
      </div>
    </div>
  );
};

export default RAIFiltersBar;
