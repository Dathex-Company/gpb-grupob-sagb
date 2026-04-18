import React from 'react';
import { SearchIcon, XIcon, FilterIcon, PlusIcon, ChevronDownIcon } from '../../../../components/Icon';
import { AgenteStatus, AgenteTipo } from '../types';

interface AgentFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: AgenteStatus | 'TODOS';
  setStatusFilter: (value: AgenteStatus | 'TODOS') => void;
  tipoFilter: AgenteTipo | 'TODOS';
  setTipoFilter: (value: AgenteTipo | 'TODOS') => void;
  clearFilters: () => void;
  onNewAgent?: () => void;
  getStatusCount: (status: AgenteStatus) => number;
  getTipoCount: (tipo: AgenteTipo) => number;
  hasActiveFilters: boolean;
  statusOptions: Array<AgenteStatus | 'TODOS'>;
  tipoOptions: Array<AgenteTipo | 'TODOS'>;
}

const AgentFilters: React.FC<AgentFiltersProps> = ({
  search, setSearch, statusFilter, setStatusFilter, tipoFilter, setTipoFilter,
  clearFilters, onNewAgent, getStatusCount, getTipoCount, hasActiveFilters,
  statusOptions, tipoOptions
}) => {
  return (
    <div className="space-y-4">
      {/* Barra de controles */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou especialidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XIcon className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AgenteStatus | 'TODOS')}
              className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'TODOS' ? 'Todos status' : option.toLowerCase().replace('_', ' ')}
                  {option !== 'TODOS' && ` (${getStatusCount(option as AgenteStatus)})`}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value as AgenteTipo | 'TODOS')}
              className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {tipoOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'TODOS' ? 'Todos tipos' : option.toLowerCase().replace('_', ' ')}
                  {option !== 'TODOS' && ` (${getTipoCount(option as AgenteTipo)})`}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <XIcon className="w-4 h-4" />
              Limpar
            </button>
          )}

          {onNewAgent && (
            <button
              onClick={onNewAgent}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Agente
            </button>
          )}
        </div>
      </div>

      {/* Indicadores de filtro ativo */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-slate-600 mt-4 mb-2">
          <FilterIcon className="w-4 h-4" />
          <span className="font-medium">Filtros aplicados:</span>
          {search && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Busca: "{search}"
            </span>
          )}
          {statusFilter !== 'TODOS' && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
              Status: {statusFilter.toLowerCase().replace('_', ' ')}
            </span>
          )}
          {tipoFilter !== 'TODOS' && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              Tipo: {tipoFilter.toLowerCase().replace('_', ' ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentFilters;
