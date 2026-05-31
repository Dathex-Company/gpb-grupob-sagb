import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { ChecklistPanel } from '../components/ChecklistPanel';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const ChecklistsPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  return <CentralPageShell title="Matrizes e Checklists" subtitle="Checklists obrigatórios antes de criar módulo, tabela, API, integração, agente ou deploy."><SectionPanel title="Checklists V1"><ChecklistPanel checklists={snapshot?.checklists || []} /></SectionPanel></CentralPageShell>;
};
export default ChecklistsPage;

