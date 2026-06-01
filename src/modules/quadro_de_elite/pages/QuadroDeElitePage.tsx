import React from 'react';
import AgentFactory from '../components/AgentFactory';
import { ModuleHeader } from '../../../../components/ui/ModuleHeader';
import { getQuadroDeEliteRuntimeContext } from '../store';

const QuadroDeElitePage: React.FC = () => {
  const runtime = getQuadroDeEliteRuntimeContext();

  const {
    agents = [],
    businessUnits = [],
    ventures = [],
    activeBU,
    activeWorkspaceId,
    authUsersByEmail = {},
    activeSessionEmail,
    onNavigateToEcosystem,
    onActivate,
    onRemove,
    onManageIntelligence
  } = runtime;

  if (!activeBU) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Carregando dados do Núcleo de Identidades...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-sagb-bg font-nunito text-[12px]">
      <ModuleHeader
        moduleName="Núcleo de Identidades"
        ownerName="Helen Dravet"
        moduleDocPath="../module-doc.ts"
      />
      <div className="flex-1 overflow-hidden">
        <AgentFactory
          onNavigateToEcosystem={onNavigateToEcosystem || (() => console.log('Navegar para ecossistema'))}
          onActivate={onActivate || ((agentData) => console.log('Agente ativado:', agentData))}
          onRemove={onRemove || ((agentId) => console.log('Remover agente:', agentId))}
          activeBU={activeBU}
          activeWorkspaceId={activeWorkspaceId}
          businessUnits={businessUnits}
          ventures={ventures}
          agents={agents}
          onManageIntelligence={onManageIntelligence || ((agent) => console.log('Gerenciar inteligência:', agent))}
          authUsersByEmail={authUsersByEmail}
          activeSessionEmail={activeSessionEmail}
        />
      </div>
    </div>
  );
};

export default QuadroDeElitePage;
