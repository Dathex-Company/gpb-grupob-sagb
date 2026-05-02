import React from 'react';
import { AgentCatalogEntity, RecommendedAgentEntity, RunAgentEntity } from '../types/salaDev.domain';
import { AgentRunCard } from './AgentRunCard';

interface AgentGroupPanelProps {
  runAgents: RunAgentEntity[];
  availableAgents: AgentCatalogEntity[];
  recommendedAgents: RecommendedAgentEntity[];
  macroLayerNameById: Record<string, string>;
  currentMacroLayerId?: string;
  onSummonAgent: (agentId: string) => void;
  onSetRunAgentStatus: (agentId: string, status: RunAgentEntity['status']) => void;
  onDeactivateRunAgent: (agentId: string) => void;
}

export const AgentGroupPanel: React.FC<AgentGroupPanelProps> = ({
  runAgents,
  availableAgents,
  recommendedAgents,
  macroLayerNameById,
  currentMacroLayerId,
  onSummonAgent,
  onSetRunAgentStatus,
  onDeactivateRunAgent
}) => {
  const summonedAgents = runAgents.filter((a) => a.status !== 'available' && a.status !== 'recommended');
  const contextualRecommendations = recommendedAgents.filter((r) => r.macroLayerId === currentMacroLayerId);

  return (
    <div className="p-4 border-t border-slate-800 bg-[#0B1121] space-y-4">
      <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/20 p-3 text-[10px] text-cyan-100">
        Sala Dev organiza agentes da run em modo cockpit. Fonte oficial futura: núcleo de agentes do SagB.
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black mb-2">Agentes convocados</p>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
          {summonedAgents.map((agent) => (
            <AgentRunCard
              key={agent.agentId}
              mode="summoned"
              agent={agent}
              macroLayerName={agent.macroLayerId ? macroLayerNameById[agent.macroLayerId] : agent.layer}
              onSetStatus={onSetRunAgentStatus}
              onDeactivate={onDeactivateRunAgent}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black mb-2">Agentes disponíveis</p>
        <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
          {availableAgents.map((agent) => (
            <AgentRunCard
              key={agent.agentId}
              mode="available"
              agent={agent}
              macroLayerName={agent.suggestedMacroLayerId ? macroLayerNameById[agent.suggestedMacroLayerId] : undefined}
              onSummon={onSummonAgent}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black mb-2">Agentes recomendados</p>
        <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
          {contextualRecommendations.map((rec) => {
            const agent = availableAgents.find((a) => a.agentId === rec.agentId) || runAgents.find((a) => a.agentId === rec.agentId);
            if (!agent) return null;
            return (
              <AgentRunCard
                key={rec.recommendationId}
                mode="recommended"
                agent={agent}
                recommendation={rec}
                macroLayerName={macroLayerNameById[rec.macroLayerId]}
                onSummon={onSummonAgent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

