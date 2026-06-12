import React from 'react';
import CentralGovernanceRecordsPage from './CentralGovernanceRecordsPage';

const CuradoriaPage: React.FC = () => (
  <CentralGovernanceRecordsPage
    table="central_padroes_curadoria"
    title="Curadoria Documental"
    subtitle="Materiais em curadoria: legado, duplicados, documentos fora do padrão, sobras úteis e itens que precisam de decisão futura."
    icon="📦"
    recordType="curadoria"
    defaultCategory="99-curadoria"
    guidance="A Curadoria guarda materiais úteis que não devem ficar soltos na estrutura principal: legado, duplicados, documentos fora do padrão, sobras úteis e itens que precisam de decisão futura. Use esta tela para organizar sem apagar conhecimento importante."
  />
);

export default CuradoriaPage;
