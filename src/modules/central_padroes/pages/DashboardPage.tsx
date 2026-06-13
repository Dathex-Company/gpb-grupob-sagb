import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { SectionPanel } from '../components/SectionPanel';
import { StandardTable } from '../components/StandardTable';
import { CentralPageShell } from '../components/CentralPageShell';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { centralPadroesApprovalService } from '../services/centralPadroesApprovalService';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';

const groupCount = <T,>(items: T[], getKey: (item: T) => string) => items.reduce<Record<string, number>>((acc, item) => {
  const key = getKey(item) || 'indefinido';
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const BarChart: React.FC<{ title: string; data: Record<string, number>; limit?: number }> = ({ title, data, limit = 8 }) => {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, limit);
  const max = Math.max(1, ...rows.map(([, value]) => value));
  return (
    <section className="cp-docs-chart-card">
      <p className="cp-docs-kicker">{title}</p>
      <div className="cp-docs-bars">
        {rows.map(([label, value]) => (
          <div key={label} className="cp-docs-bar-row">
            <span>{label}</span>
            <div><i style={{ width: `${Math.max(8, (value / max) * 100)}%` }} /></div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

const DonutChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const rows = Object.entries(data).filter(([, value]) => value > 0);
  const total = rows.reduce((acc, [, value]) => acc + value, 0) || 1;
  let offset = 25;
  const colors = ['#5b5bd6', '#2f6fbd', '#2d8f67', '#c86b2c', '#7a4dd8', '#8c877f'];
  return (
    <section className="cp-docs-chart-card cp-docs-donut-card">
      <p className="cp-docs-kicker">Status dos padrões</p>
      <svg viewBox="0 0 42 42" className="cp-docs-donut" role="img" aria-label="Distribuição por status">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--cp-line)" strokeWidth="5" />
        {rows.map(([label, value], index) => {
          const dash = (value / total) * 100;
          const element = <circle key={label} cx="21" cy="21" r="15.915" fill="transparent" stroke={colors[index % colors.length]} strokeWidth="5" strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={offset} />;
          offset -= dash;
          return element;
        })}
      </svg>
      <div className="cp-docs-legend">
        {rows.map(([label, value], index) => <span key={label}><i style={{ background: colors[index % colors.length] }} />{label}: {value}</span>)}
      </div>
    </section>
  );
};

const DashboardPage: React.FC = () => {
  const { snapshot, metrics, loading, error } = useCentralPadroes();
  const [pendingApprovals, setPendingApprovals] = React.useState(0);
  const [documentGaps, setDocumentGaps] = React.useState({ total: 0, incomplete: 0, withoutOwner: 0, withoutTags: 0, withoutSummary: 0, withoutContent: 0 });

  React.useEffect(() => {
    centralPadroesApprovalService.listPendingApprovals().then((items) => setPendingApprovals(items.filter((item) => item.status === 'pending').length)).catch(() => setPendingApprovals(0));
    centralPadroesDocumentHubService.listDocuments().then((items) => setDocumentGaps(centralPadroesDocumentHubService.summarizeGaps(items))).catch(() => setDocumentGaps({ total: 0, incomplete: 0, withoutOwner: 0, withoutTags: 0, withoutSummary: 0, withoutContent: 0 }));
  }, []);

  const statusChart = snapshot ? groupCount(snapshot.standards, (standard) => standard.status) : {};
  const areaChart = snapshot ? groupCount(snapshot.standards, (standard) => standard.areaId) : {};
  const typeChart = snapshot ? groupCount(snapshot.standards, (standard) => standard.type) : {};
  const pendingCanonization = snapshot ? snapshot.standards.filter((standard) => !['publicado', 'aprovado'].includes(standard.status)).length : 0;
  const openDecisions = snapshot ? snapshot.decisions.filter((decision) => decision.status === 'proposta').length : 0;
  const transverseDependencies = snapshot ? snapshot.standards.filter((standard) => standard.dependencies.length >= 3).length : 0;
  const coverage = snapshot?.areas.length ? Math.round((new Set(snapshot.standards.map((standard) => standard.areaId)).size / snapshot.areas.length) * 100) : 0;

  return (
    <CentralPageShell title="Dashboard Normativo" subtitle="Visão geral da implantação V1 da Central de Padrões: padrões, documentos, módulos, agentes e riscos.">
      {loading && <div className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 text-[12px] text-sagb-muted">Carregando Central...</div>}
      {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-[12px] text-red-600">{error}</div>}
      {metrics && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-7">
          <MetricCard label="Padrões" value={metrics.standards} hint="Supabase + rules legadas" />
          <MetricCard label="Documentos" value={metrics.documents} hint="Canônicos, revisão e legado" />
          <MetricCard label="Checklists" value={metrics.checklists} hint="Antes de construir" />
          <MetricCard label="Decisões" value={metrics.decisions} hint="ADRs e decisões" />
          <MetricCard label="Módulos vinculados" value={metrics.modulesLinked} hint="Padrão ↔ módulo" />
          <MetricCard label="Riscos altos" value={metrics.risks} hint="Alto ou crítico" />
          <MetricCard label="Aprovações pendentes" value={pendingApprovals} hint="Workflow ET-03" />
        </div>
      )}
      {snapshot && (
        <div className="cp-docs-dashboard-grid">
          <DonutChart data={statusChart} />
          <BarChart title="Padrões por divisão" data={areaChart} />
          <BarChart title="Tipos normativos" data={typeChart} />
          <section className="cp-docs-chart-card">
            <p className="cp-docs-kicker">Saneamento e curadoria</p>
            <div className="cp-docs-insight-grid">
              <span><strong>{pendingCanonization}</strong> Pendentes de canonização</span>
              <span><strong>{openDecisions}</strong> Decisões abertas</span>
              <span><strong>{transverseDependencies}</strong> Dependências transversais</span>
              <span><strong>{coverage}%</strong> Cobertura por divisão</span>
            </div>
          </section>
          <section className="cp-docs-chart-card">
            <p className="cp-docs-kicker">Lacunas Document Hub</p>
            <div className="cp-docs-insight-grid">
              <span><strong>{documentGaps.total}</strong> Documentos no Hub</span>
              <span><strong>{documentGaps.incomplete}</strong> Incompletos</span>
              <span><strong>{documentGaps.withoutOwner}</strong> Sem owner</span>
              <span><strong>{documentGaps.withoutTags}</strong> Sem tags</span>
              <span><strong>{documentGaps.withoutSummary}</strong> Sem resumo</span>
              <span><strong>{documentGaps.withoutContent}</strong> Sem conteúdo</span>
            </div>
          </section>
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
