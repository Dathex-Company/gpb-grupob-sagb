import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StandardTable } from '../components/StandardTable';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const StandardsPage: React.FC = () => {
  const { snapshot, loading } = useCentralPadroes();
  return (
    <CentralPageShell title="Biblioteca de Padrões" subtitle="Padrões, regras, políticas, protocolos e contratos que formam o sistema nervoso normativo do SagB.">
      {loading && <p className="text-[12px] text-sagb-muted">Carregando padrões...</p>}
      {snapshot && <SectionPanel title="Todos os padrões registrados"><StandardTable standards={snapshot.standards} /></SectionPanel>}
    </CentralPageShell>
  );
};

export default StandardsPage;

