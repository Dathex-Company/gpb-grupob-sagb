import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { SectionPanel } from '../components/SectionPanel';
import { StandardTable } from '../components/StandardTable';
import { CentralPageShell } from '../components/CentralPageShell';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { centralPadroesApprovalService } from '../services/centralPadroesApprovalService';

const DashboardPage: React.FC = () => {
  const { snapshot, metrics, loading, error } = useCentralPadroes();
  const [pendingApprovals, setPendingApprovals] = React.useState(0);

  React.useEffect(() => {
    centralPadroesApprovalService.listPendingApprovals().then((items) => setPendingApprovals(items.filter((item) => item.status === 'pending').length)).catch(() => setPendingApprovals(0));
  }, []);
  return (
    <CentralPageShell title="Dashboard Normativo" subtitle="Visão geral da implantação V1 da Central de Padrões: padrões, documentos, módulos, agentes e riscos.">
      {loading && <div className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 text-[12px] text-sagb-muted">Carregando Central...</div>}
      {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-[12px] text-red-600">{error}</div>}
      {metrics && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-7">
          <MetricCard label="Padrões" value={metrics.standards} hint="Inclui fallback e rules legadas" />
          <MetricCard label="Documentos" value={metrics.documents} hint="Canônicos, revisão e legado" />
          <MetricCard label="Checklists" value={metrics.checklists} hint="Antes de construir" />
          <MetricCard label="Decisões" value={metrics.decisions} hint="ADRs e decisões" />
          <MetricCard label="Módulos vinculados" value={metrics.modulesLinked} hint="Padrão ↔ módulo" />
          <MetricCard label="Riscos altos" value={metrics.risks} hint="Alto ou crítico" />
          <MetricCard label="Aprovações pendentes" value={pendingApprovals} hint="Workflow ET-03" />
        </div>
      )}
      {snapshot && (
        <SectionPanel title="Padrões prioritários" eyebrow="Biblioteca V1" description="Itens que guiam a implantação inicial e preservam o embrião técnico existente.">
          <StandardTable standards={snapshot.standards.slice(0, 6)} />
        </SectionPanel>
      )}
    </CentralPageShell>
  );
};

export default DashboardPage;
