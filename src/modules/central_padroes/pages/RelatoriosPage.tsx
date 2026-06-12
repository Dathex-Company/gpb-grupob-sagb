import React from 'react';
import CentralGovernanceRecordsPage from './CentralGovernanceRecordsPage';

const RelatoriosPage: React.FC = () => (
  <CentralGovernanceRecordsPage
    table="central_padroes_reports"
    title="Relatórios e LOZE-TRACE"
    subtitle="Relatórios técnicos, curadoria e rastreabilidade de execução da Central de Documentos e Padrões."
    icon="📊"
    recordType="relatorio"
    defaultCategory="governanca"
    guidance="Use esta tela para consultar relatórios e evidências de execução. Relatórios LOZE-TRACE devem sempre mostrar comando, pasta, risco, resultado, erro e evidência."
  />
);

export default RelatoriosPage;
