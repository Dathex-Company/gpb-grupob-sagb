import React from 'react';
import { AgentCatalogEntity, RecommendedAgentEntity, RunAgentEntity } from '../types/salaDev.domain';
import { getStatusView } from '../utils/salaDevStatusView';

type AgentCardMode = 'summoned' | 'available' | 'recommended';

interface AgentRunCardProps {
  mode: AgentCardMode;
  agent: RunAgentEntity | AgentCatalogEntity;
  recommendation?: RecommendedAgentEntity;
  macroLayerName?: string;
  onSummon?: (agentId: string) => void;
  onSetStatus?: (agentId: string, status: RunAgentEntity['status']) => void;
  onDeactivate?: (agentId: string) => void;
}

export const AgentRunCard: React.FC<AgentRunCardProps> = ({
  mode,
  agent,
  recommendation,
  macroLayerName,
  onSummon,
  onSetStatus,
  onDeactivate
}) => {
  const isRunAgent = 'status' in agent && 'layer' in agent;
  const runStatusView = isRunAgent ? getStatusView(agent.status) : null;

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-white">{agent.name}</p>
          <p className="text-[10px] text-slate-400">{agent.role}</p>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
          {'isOfficialAgentReference' in agent && agent.isOfficialAgentReference ? 'ref. núcleo oficial' : 'mock'}
        </span>
      </div>

      <p className="text-[10px] text-slate-400">Macrocamada: {macroLayerName || ('layer' in agent ? agent.layer : 'Não vinculada')}</p>

      {isRunAgent && (
        <>
          <p className="text-[10px] text-slate-200">Status: <span className={`inline-block ml-1 px-1.5 py-0.5 rounded font-bold ${runStatusView?.className}`}>{runStatusView?.label}</span></p>
          <p className="text-[10px] text-slate-200">Motivo: {agent.activationReason || agent.recommendationReason || agent.technicalNeed || 'Sem motivo informado'}</p>
          <p className="text-[10px] text-slate-300">Skills: {agent.skills.join(' • ')}</p>
          <div className="grid grid-cols-2 gap-1">
            <button className="text-[10px] py-1 rounded bg-cyan-700/50" onClick={() => onSetStatus?.(agent.agentId, 'active')}>Ativar</button>
            <button className="text-[10px] py-1 rounded bg-slate-700" onClick={() => onSetStatus?.(agent.agentId, 'waiting')}>Aguardar</button>
            <button className="text-[10px] py-1 rounded bg-emerald-700/50" onClick={() => onSetStatus?.(agent.agentId, 'completed')}>Concluir</button>
            <button className="text-[10px] py-1 rounded bg-red-700/50" onClick={() => onDeactivate?.(agent.agentId)}>Desativar</button>
          </div>
        </>
      )}

      {!isRunAgent && mode !== 'recommended' && (
        <>
          <p className="text-[10px] text-slate-200">Especialidade: {agent.specialty}</p>
          <p className="text-[10px] text-slate-200">Disponibilidade: {getStatusView(agent.availability).label}</p>
          <button className="w-full text-[10px] py-1 rounded bg-emerald-700/50" onClick={() => onSummon?.(agent.agentId)}>Convocar</button>
        </>
      )}

      {mode === 'recommended' && recommendation && (
        <>
          <p className="text-[10px] text-amber-200">Prioridade: {getStatusView(recommendation.priority).label} • Risco: {getStatusView(recommendation.associatedRiskLevel).label}</p>
          <p className="text-[10px] text-slate-200">Motivo: {recommendation.reasons.join(' | ')}</p>
          <button className="w-full text-[10px] py-1 rounded bg-emerald-700/50" onClick={() => onSummon?.(recommendation.agentId)}>Convocar recomendado</button>
        </>
      )}
    </div>
  );
};
