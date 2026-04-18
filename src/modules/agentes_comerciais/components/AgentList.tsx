import React, { useState, useEffect } from 'react';
import AgentCard from './AgentCard';
import AgentStats from './AgentStats';
import AgentFilters from './AgentFilters';
import { Agente, AgenteStatus, AgenteTipo } from '../types';
import { agenteService } from '../services';

interface AgentListProps {
  agentes?: Agente[];
  onSelectAgent?: (agente: Agente) => void;
  onEditAgent?: (agente: Agente) => void;
  onCloneAgent?: (agente: Agente) => void;
  onSuperviseAgent?: (agente: Agente) => void;
  onNewAgent?: () => void;
  className?: string;
  showFilters?: boolean;
  showStats?: boolean;
}

const AgentList: React.FC<AgentListProps> = ({
  agentes: propAgentes,
  onSelectAgent,
  onEditAgent,
  onCloneAgent,
  onSuperviseAgent,
  onNewAgent,
  className = '',
  showFilters = true,
  showStats = true
}) => {
  const [agentes, setAgentes] = useState<Agente[]>(propAgentes || []);
  const [filteredAgentes, setFilteredAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(!propAgentes);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgenteStatus | 'TODOS'>('TODOS');
  const [tipoFilter, setTipoFilter] = useState<AgenteTipo | 'TODOS'>('TODOS');
  const [stats, setStats] = useState<any>(null);

  const statusOptions: Array<AgenteStatus | 'TODOS'> = ['TODOS', 'ATIVO', 'INATIVO', 'EM_TREINAMENTO', 'EM_FERIAS', 'AUSENTE'];
  const tipoOptions: Array<AgenteTipo | 'TODOS'> = ['TODOS', 'HUMANO', 'IA_HIBRIDO', 'AUTOMATICO', 'OUTRO'];

  useEffect(() => {
    if (!propAgentes) {
      loadAgentes();
      loadStats();
    } else {
      setAgentes(propAgentes);
      setFilteredAgentes(propAgentes);
      setLoading(false);
    }
  }, [propAgentes]);

  useEffect(() => {
    let result = agentes;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(agente =>
        agente.nome.toLowerCase().includes(term) ||
        agente.email.toLowerCase().includes(term) ||
        agente.nome_exibicao?.toLowerCase().includes(term) ||
        agente.especialidades?.some(e => e.toLowerCase().includes(term))
      );
    }
    if (statusFilter !== 'TODOS') result = result.filter(a => a.status === statusFilter);
    if (tipoFilter !== 'TODOS') result = result.filter(a => a.tipo === tipoFilter);
    setFilteredAgentes(result);
  }, [agentes, search, statusFilter, tipoFilter]);

  const loadAgentes = async () => {
    setLoading(true);
    try {
      const data = await agenteService.buscarAgentes();
      setAgentes(data);
      setFilteredAgentes(data);
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const estatisticas = await agenteService.obterEstatisticas();
      setStats(estatisticas);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('TODOS');
    setTipoFilter('TODOS');
  };

  const hasActiveFilters = search !== '' || statusFilter !== 'TODOS' || tipoFilter !== 'TODOS';

  return (
    <div className={`space-y-6 ${className}`}>
      {showStats && stats && <AgentStats stats={stats} />}

      <AgentFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        tipoFilter={tipoFilter}
        setTipoFilter={setTipoFilter}
        clearFilters={clearFilters}
        onNewAgent={onNewAgent}
        getStatusCount={(status) => agentes.filter(a => a.status === status).length}
        getTipoCount={(tipo) => agentes.filter(a => a.tipo === tipo).length}
        hasActiveFilters={hasActiveFilters}
        statusOptions={statusOptions}
        tipoOptions={tipoOptions}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-500">Carregando agentes...</p>
          </div>
        </div>
      ) : filteredAgentes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {hasActiveFilters ? 'Nenhum agente encontrado' : 'Nenhum agente cadastrado'}
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {hasActiveFilters
              ? 'Tente ajustar seus filtros de busca ou limpar todos os filtros.'
              : 'Comece cadastrando seu primeiro agente.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Limpar filtros
            </button>
          ) : onNewAgent && (
            <button
              onClick={onNewAgent}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Cadastrar primeiro agente
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Mostrando <span className="font-bold text-slate-700">{filteredAgentes.length}</span> de{' '}
              <span className="font-bold text-slate-700">{agentes.length}</span> agentes
            </div>
            <div className="text-xs text-slate-500">
              {filteredAgentes.length === 1 ? '1 agente encontrado' : `${filteredAgentes.length} agentes encontrados`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgentes.map((agente) => (
              <AgentCard
                key={agente.id}
                agente={agente}
                onSelect={onSelectAgent}
                onEdit={onEditAgent}
                onClone={onCloneAgent}
                onSupervise={onSuperviseAgent}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentList;