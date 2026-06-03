import React from 'react';
import AgentMissionsView from '../../../../../components/AgentMissionsView';
import { Agent } from '../../../../../types';
import { getNideRuntimeContext } from '../../store/runtimeBridge';

export interface MissionsCorePageProps {
  workspaceId?: string | null;
  ownerUserId?: string | null;
  agents: Agent[];
  onBack?: () => void;
}

/**
 * Página core do NIDE, originada do antigo módulo Missões.
 * 
 * Histórico:
 * - O módulo Missões foi reposicionado como core funcional do NIDE (ET 03/08).
 * - Esta página é uma adaptação da antiga MissoesPage, que wrappava AgentMissionsView.
 * - O service global `services/missionService.ts` não foi movido.
 * - O módulo Missões original permanece intacto como fallback/compatibilidade.
 */
export const MissionsCorePage: React.FC<Partial<MissionsCorePageProps>> = (props) => {
  const runtime = getNideRuntimeContext();
  const workspaceId = props.workspaceId ?? runtime.workspaceId ?? null;
  const ownerUserId = props.ownerUserId ?? runtime.ownerUserId ?? null;
  const agents = Array.isArray(props.agents) ? props.agents : runtime.agents;
  const onBack = props.onBack ?? runtime.onBack;

  return (
    <AgentMissionsView
      workspaceId={workspaceId}
      ownerUserId={ownerUserId}
      agents={agents}
      onBack={onBack}
    />
  );
};
