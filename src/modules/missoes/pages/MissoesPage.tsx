import React from 'react';
import AgentMissionsView from '../../../../components/AgentMissionsView';
import { Agent } from '../../../../types';
import { getMissoesRuntimeContext } from '../store';

export interface MissoesPageProps {
  workspaceId?: string | null;
  ownerUserId?: string | null;
  agents: Agent[];
  onBack?: () => void;
}

const MissoesPage: React.FC<Partial<MissoesPageProps>> = (props) => {
  const runtime = getMissoesRuntimeContext();
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

export default MissoesPage;
