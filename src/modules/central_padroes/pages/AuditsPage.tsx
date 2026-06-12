import React from 'react';
import CentralGovernanceRecordsPage from './CentralGovernanceRecordsPage';

const AuditsPage: React.FC = () => (
  <CentralGovernanceRecordsPage
    table="central_padroes_audits"
    title="Auditorias e Evidências"
    subtitle="Achados, evidências, severidade, risco e planos de ação da Central de Documentos e Padrões."
    icon="🧾"
    recordType="auditoria"
    defaultCategory="governanca"
    guidance="Use esta tela para registrar o que foi auditado, qual evidência existe, qual risco foi encontrado e qual próximo passo resolve o problema. Não use auditoria para esconder falha: registre a falha com clareza."
  />
);

export default AuditsPage;
