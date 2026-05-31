import React from 'react';
import { AgentRunBoard } from '../components/AgentRunBoard';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const AgentsPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  return <CentralPageShell title="Modo Agente" subtitle="Execução do plano por 18 agentes e conteúdo liberado para consumo operacional de agentes."><SectionPanel title="Esteira dos 18 agentes"><AgentRunBoard agents={snapshot?.agents || []} /></SectionPanel></CentralPageShell>;
};
export default AgentsPage;

