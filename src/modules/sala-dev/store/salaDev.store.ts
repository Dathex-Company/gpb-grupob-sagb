import { AgentFlowEvent, DevAgent, DevFileNode, DevRun, SalaDevDomainSnapshot } from '../types/salaDev.types';
import { DomainDecision, GateStatus } from '../types/salaDev.status';
import { RunAgentEntity } from '../types/salaDev.domain';

export interface SalaDevState {
  run: DevRun;
  agents: DevAgent[];
  events: AgentFlowEvent[];
  files: DevFileNode[];
  domain: SalaDevDomainSnapshot;
}

export function createSalaDevState(input: SalaDevState): SalaDevState {
  return input;
}

export function updateHandoffStatus(state: SalaDevState, handoffId: string, status: SalaDevState['domain']['handoffs'][number]['status']): SalaDevState {
  return {
    ...state,
    domain: {
      ...state.domain,
      handoffs: state.domain.handoffs.map(h => h.id === handoffId ? { ...h, status, completedAt: status === 'completed' ? new Date() : h.completedAt } : h)
    }
  };
}

export function updateGateStatus(
  state: SalaDevState,
  gateId: string,
  status: SalaDevState['domain']['gates'][number]['status'],
  decision?: DomainDecision
): SalaDevState {
  return {
    ...state,
    domain: {
      ...state.domain,
      gates: state.domain.gates.map(g => {
        if (g.id !== gateId) return g;
        return {
          ...g,
          status,
          decision: decision ?? g.decision,
          approvedAt: status === 'approved' ? new Date() : g.approvedAt,
          rejectedAt: status === 'rejected' ? new Date() : g.rejectedAt
        };
      })
    }
  };
}

export function advanceBlock(state: SalaDevState, blockId: string): SalaDevState {
  const block = state.domain.blocks.find(b => b.id === blockId);
  if (!block) return state;

  const nextBlock = state.domain.blocks.find(b => b.block === block.block + 1);

  return {
    ...state,
    domain: {
      ...state.domain,
      run: {
        ...state.domain.run,
        currentMacroLayerId: nextBlock?.id || state.domain.run.currentMacroLayerId,
        progress: Math.max(state.domain.run.progress, Math.min(100, block.block * 20)),
        updatedAt: new Date()
      },
      blocks: state.domain.blocks.map(b => {
        if (b.id === blockId) {
          return { ...b, status: 'completed' as const, progress: 100, gateStatus: 'approved' as const };
        }
        if (nextBlock && b.id === nextBlock.id && b.status === 'pending') {
          return { ...b, status: 'running' as const, progress: Math.max(b.progress, 10) };
        }
        return b;
      })
    },
    run: {
      ...state.run,
      currentStage: nextBlock?.name || 'Auditoria Final',
      progressPercent: Math.max(state.run.progressPercent, Math.min(100, block.block * 20))
    }
  };
}

export function updateBlockGateStatus(
  state: SalaDevState,
  blockId: string,
  status: GateStatus,
  decision?: DomainDecision
): SalaDevState {
  const blockGate = state.domain.gates.find(g => g.macroLayerId === blockId);

  const stateWithGate = blockGate
    ? updateGateStatus(state, blockGate.id, status, decision)
    : state;

  return {
    ...stateWithGate,
    domain: {
      ...stateWithGate.domain,
      blocks: stateWithGate.domain.blocks.map(b => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          gateStatus: status,
          status: status === 'approved' ? 'completed' : status === 'blocked' || status === 'rejected' ? 'blocked' : b.status,
          progress: status === 'approved' ? 100 : b.progress
        };
      })
    }
  };
}

export function summonAgentToRun(state: SalaDevState, agentId: string, macroLayerId?: string): SalaDevState {
  const catalogAgent = state.domain.availableAgents.find(a => a.agentId === agentId);
  if (!catalogAgent) return state;

  const alreadyInRun = state.domain.runAgents.some(a => a.agentId === agentId);
  const nextRunAgents = alreadyInRun
    ? state.domain.runAgents.map(a => a.agentId === agentId ? { ...a, status: 'summoned' as const } : a)
    : [
        ...state.domain.runAgents,
        {
          agentId: catalogAgent.agentId,
          name: catalogAgent.name,
          role: catalogAgent.role,
          layer: catalogAgent.specialty,
          macroLayerId: macroLayerId || catalogAgent.suggestedMacroLayerId,
          status: 'summoned' as const,
          activationReason: 'Convocação simulada pela Sala Dev',
          technicalNeed: catalogAgent.technicalNeeds.join(' • '),
          complexityLevel: catalogAgent.complexityFit,
          skills: catalogAgent.skills,
          dnaVersionId: catalogAgent.dnaVersionId,
          isOfficialAgentReference: catalogAgent.isOfficialAgentReference
        }
      ];

  return {
    ...state,
    domain: {
      ...state.domain,
      runAgents: nextRunAgents,
      availableAgents: state.domain.availableAgents.filter(a => a.agentId !== agentId),
      recommendedAgents: state.domain.recommendedAgents.filter(r => r.agentId !== agentId)
    }
  };
}

export function updateRunAgentStatus(state: SalaDevState, agentId: string, status: RunAgentEntity['status']): SalaDevState {
  return {
    ...state,
    domain: {
      ...state.domain,
      runAgents: state.domain.runAgents.map(a => a.agentId === agentId ? { ...a, status } : a)
    }
  };
}

export function deactivateRunAgent(state: SalaDevState, agentId: string): SalaDevState {
  const target = state.domain.runAgents.find(a => a.agentId === agentId);
  if (!target) return state;

  return {
    ...state,
    domain: {
      ...state.domain,
      runAgents: state.domain.runAgents.map(a => a.agentId === agentId ? { ...a, status: 'blocked' as const } : a),
      availableAgents: state.domain.availableAgents.some(a => a.agentId === agentId)
        ? state.domain.availableAgents
        : [
            ...state.domain.availableAgents,
            {
              agentId: target.agentId,
              name: target.name,
              role: target.role,
              specialty: target.layer,
              suggestedMacroLayerId: target.macroLayerId,
              availability: 'available',
              technicalNeeds: target.technicalNeed ? [target.technicalNeed] : [],
              skills: target.skills,
              complexityFit: target.complexityLevel || 'medium',
              isOfficialAgentReference: target.isOfficialAgentReference,
              dnaVersionId: target.dnaVersionId
            }
          ]
    }
  };
}
