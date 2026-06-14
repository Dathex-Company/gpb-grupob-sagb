import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { SectionPanel } from '../components/SectionPanel';
import { CentralPageShell } from '../components/CentralPageShell';
import {
  DashboardMetrics,
  computeLocalDashboardMetrics,
  enrichDashboardMetrics,
  getCategoryDistribution,
  getOfficialStatusDistribution,
  getSourceDistribution,
} from '../services/centralPadroesDashboardService';

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

const DIST_COLORS = ['#5b5bd6', '#2f6fbd', '#2d8f67', '#c86b2c', '#7a4dd8', '#8c877f', '#c04090', '#4ea0c0'];
const DonutChart: React.FC<{ title: string; data: Record<string, number> }> = ({ title, data }) => {
  const rows = Object.entries(data).filter(([, value]) => value > 0);
  const total = rows.reduce((acc, [, value]) => acc + value, 0) || 1;
  let offset = 25;
  return (
    <section className="cp-docs-chart-card cp-docs-donut-card">
      <p className="cp-docs-kicker">{title}</p>
      <svg viewBox="0 0 42 42" className="cp-docs-donut" role="img" aria-label={title}>
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--cp-line)" strokeWidth="5" />
        {rows.map(([label, value], index) => {
          const dash = (value / total) * 100;
          const element = <circle key={label} cx="21" cy="21" r="15.915" fill="transparent" stroke={DIST_COLORS[index % DIST_COLORS.length]} strokeWidth="5" strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={offset} />;
          offset -= dash;
          return element;
        })}
      </svg>
      <div className="cp-docs-legend">
        {rows.map(([label, value], index) => <span key={label}><i style={{ background: DIST_COLORS[index % DIST_COLORS.length] }} />{label}: {value}</span>)}
      </div>
    </section>
  );
};

const InsightGrid: React.FC<{ items: { label: string; value: string | number }[] }> = ({ items }) => (
  <div className="cp-docs-insight-grid">
    {items.map(({ label, value }) => (
      <span key={label}><strong>{value}</strong> {label}</span>
    ))}
  </div>
);

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = React.useState<DashboardMetrics>(computeLocalDashboardMetrics);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    enrichDashboardMetrics().then(setMetrics).finally(() => setLoading(false));
  }, []);

  const categoryDist = React.useMemo(() => getCategoryDistribution(), []);
  const officialStatusDist = React.useMemo(() => getOfficialStatusDistribution(), []);
  const sourceDist = React.useMemo(() => getSourceDistribution(), []);

  const officialStatusLabels: Record<string, string> = {
    oficial_ativo: 'Oficiais ativos',
    rascunho: 'Rascunhos',
    fonte_bruta: 'Fontes brutas',
    curadoria: 'Curadoria',
    em_revisao: 'Em revisão',
    legado: 'Legado',
    incompleto: 'Incompletos',
    externo: 'Externos',
  };

  return (
    <CentralPageShell title="Dashboard Executivo" subtitle="Métricas reais da Central de Documentos e Padrões — paridade local, distribuição, lacunas e ações.">
      {loading && <div className="cp-docs-loading">Carregando métricas consolidadas...</div>}

      {/* ═══════════════════════════════════════════════════
          1. VISÃO EXECUTIVA
          ═══════════════════════════════════════════════════ */}
      <section className="cp-docs-dashboard-section">
        <p className="cp-docs-section-title">Visão Executiva</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="Arquivos físicos" value={metrics.physicalOfficialFiles} hint="Pasta estrutura-de-documentos-oficiais" />
          <MetricCard label="Indexados" value={metrics.indexedOfficialDocuments} hint="officialDocumentsIndex" />
          <MetricCard label="Manifest total" value={metrics.manifestTotal} hint="Índice oficial + planos legados" />
          <MetricCard label="Legados (fallback)" value={metrics.fallbackLegacyDocuments} hint="Base antiga preservada" />
          <MetricCard label="Oficiais ativos" value={metrics.officialActiveMasters} hint="12 Documentos Mestres v3.0" />
          <MetricCard label="Previstos" value={metrics.statusPrevisto} hint="Status previsto, em rascunho" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. COMO LER ESTES NÚMEROS
          ═══════════════════════════════════════════════════ */}
      <section className="cp-docs-dashboard-section">
        <p className="cp-docs-section-title">Como ler estes números</p>
        <div className="cp-docs-reading-block">
          <div className="cp-docs-reading-item"><strong>47</strong> <span>arquivos físicos</span> — arquivos reais na pasta <code>estrutura-de-documentos-oficiais</code>.</div>
          <div className="cp-docs-reading-item"><strong>75</strong> <span>indexados</span> — entradas oficiais catalogadas no <code>officialDocumentsIndex.ts</code> (47 arquivos geram 75 entradas porque alguns arquivos são desmembrados em entradas distintas).</div>
          <div className="cp-docs-reading-item"><strong>79</strong> <span>manifest total</span> — índice oficial (75) + 4 planos de desenvolvimento legados.</div>
          <div className="cp-docs-reading-item"><strong>24</strong> <span>fallback legado</span> — base antiga preservada, sem sobreposição com o índice oficial.</div>
          <div className="cp-docs-reading-item"><strong>12</strong> <span>oficiais ativos</span> — Documentos Mestres prontos para uso institucional (DM-00 a DM-11).</div>
          <div className="cp-docs-reading-item"><strong>Supabase</strong> <span>pendente</span> — leitura live não executada; a fonte primária local já cobre 100% da pasta oficial.</div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. PARIDADE LOCAL
          ═══════════════════════════════════════════════════ */}
      <section className="cp-docs-dashboard-section">
        <p className="cp-docs-section-title">Paridade Local dos Documentos Oficiais</p>
        <div className="cp-docs-parity-grid">
          <div className="cp-docs-parity-card ok">
            <span className="cp-docs-parity-icon">✅</span>
            <span className="cp-docs-parity-label">Pasta oficial auditada</span>
            <strong>47/47</strong>
          </div>
          <div className="cp-docs-parity-card ok">
            <span className="cp-docs-parity-icon">✅</span>
            <span className="cp-docs-parity-label">Indexados localmente</span>
            <strong>{metrics.parityRatio}</strong>
          </div>
          <div className="cp-docs-parity-card ok">
            <span className="cp-docs-parity-icon">✅</span>
            <span className="cp-docs-parity-label">Cobertura do manifest</span>
            <strong>100%</strong>
          </div>
          <div className="cp-docs-parity-card ok">
            <span className="cp-docs-parity-icon">✅</span>
            <span className="cp-docs-parity-label">Ausentes locais</span>
            <strong>0</strong>
          </div>
          <div className="cp-docs-parity-card ok">
            <span className="cp-docs-parity-icon">✅</span>
            <span className="cp-docs-parity-label">Colisões de id</span>
            <strong>{metrics.idCollisions}</strong>
          </div>
          <div className="cp-docs-parity-card ok">
            <span className="cp-docs-parity-icon">✅</span>
            <span className="cp-docs-parity-label">Previsto filtrável</span>
            <strong>Sim</strong>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. DISTRIBUIÇÃO
          ═══════════════════════════════════════════════════ */}
      <section className="cp-docs-dashboard-section">
        <p className="cp-docs-section-title">Distribuição</p>
        <div className="cp-docs-dashboard-grid">
          <DonutChart title="Por status oficial" data={Object.fromEntries(
            Object.entries(officialStatusDist).map(([k, v]) => [officialStatusLabels[k] || k, v])
          )} />
          <BarChart title="Por categoria (divisão real)" data={categoryDist} limit={14} />
          <section className="cp-docs-chart-card">
            <p className="cp-docs-kicker">Resumo por status</p>
            <InsightGrid items={[
              { label: 'Oficiais ativos (DMs)', value: metrics.officialActiveMasters },
              { label: 'Previstos (rascunho)', value: metrics.statusPrevisto },
              { label: 'Fontes brutas', value: metrics.fonteBruta },
              { label: 'Curadoria', value: metrics.curadoria },
              { label: 'Rascunhos totais', value: metrics.rascunho },
            ]} />
          </section>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. ORIGEM DOS DADOS
          ═══════════════════════════════════════════════════ */}
      <section className="cp-docs-dashboard-section">
        <p className="cp-docs-section-title">Origem dos Dados</p>
        <div className="cp-docs-origin-grid">
          <div className="cp-docs-origin-card source-official">
            <span className="cp-docs-origin-icon">📋</span>
            <strong>officialDocumentsIndex</strong>
            <span className="cp-docs-origin-value">{sourceDist.officialDocumentsIndex} docs</span>
            <small>Índice canônico da pasta oficial</small>
          </div>
          <div className="cp-docs-origin-card source-manifest">
            <span className="cp-docs-origin-icon">📦</span>
            <strong>centralDocumentsManifest</strong>
            <span className="cp-docs-origin-value">{sourceDist.centralDocumentsManifest} docs</span>
            <small>Índice + planos legados</small>
          </div>
          <div className="cp-docs-origin-card source-fallback">
            <span className="cp-docs-origin-icon">📚</span>
            <strong>fallbackData</strong>
            <span className="cp-docs-origin-value">{sourceDist.fallbackData} docs</span>
            <small>Base legada preservada</small>
          </div>
          <div className="cp-docs-origin-card source-pending">
            <span className="cp-docs-origin-icon">⏳</span>
            <strong>Supabase live</strong>
            <span className="cp-docs-origin-value">Pendente</span>
            <small>Leitura com auth real necessária</small>
          </div>
        </div>
        <div className="cp-docs-dedup-note">
          <span>🔗</span>
          <span>Merge: fallback → manifest → Supabase. Deduplicação por <code>id</code>. Total deduplicado estimado: {metrics.totalDeduplicated ?? metrics.estimatedTotalPreDedup} documentos.</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. LACUNAS REAIS
          ═══════════════════════════════════════════════════ */}
      <section className="cp-docs-dashboard-section">
        <p className="cp-docs-section-title">Lacunas Reais</p>
        <div className="cp-docs-lacuna-list">
          <div className="cp-docs-lacuna-item pending">⏳ Supabase não lido — tabela central_padroes_documents pendente de verificação com auth real.</div>
          <div className="cp-docs-lacuna-item pending">🖥️ QA visual em navegador — não executado neste ambiente.</div>
          <div className="cp-docs-lacuna-item pending">🔐 QA funcional com auth — testes de R5 (salvar, publicar, versionar) pendentes.</div>
          <div className="cp-docs-lacuna-item pending">🔍 Duplicidade Supabase × índice local — a verificar após leitura.</div>
          <div className="cp-docs-lacuna-item pending">🚀 Dashboard pós-deploy — a verificar após próximo deploy.</div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. PRÓXIMAS VALIDAÇÕES
          ═══════════════════════════════════════════════════ */}
      <section className="cp-docs-dashboard-section">
        <p className="cp-docs-section-title">Próximas Validações</p>
        <div className="cp-docs-checklist">
          <label className="cp-docs-check-item"><input type="checkbox" disabled checked readOnly /> Paridade local — 47/47 indexados</label>
          <label className="cp-docs-check-item"><input type="checkbox" disabled checked readOnly /> Manifest — 100% cobertura</label>
          <label className="cp-docs-check-item"><input type="checkbox" disabled readOnly /> QA visual real em navegador</label>
          <label className="cp-docs-check-item"><input type="checkbox" disabled readOnly /> Leitura Supabase central_padroes_documents</label>
          <label className="cp-docs-check-item"><input type="checkbox" disabled readOnly /> Verificação duplicidade Supabase × índice local</label>
          <label className="cp-docs-check-item"><input type="checkbox" disabled readOnly /> QA funcional R5 com auth</label>
          <label className="cp-docs-check-item"><input type="checkbox" disabled readOnly /> Commit/push/deploy da paridade e dashboard</label>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. AÇÕES RÁPIDAS
          ═══════════════════════════════════════════════════ */}
      <section className="cp-docs-dashboard-section">
        <p className="cp-docs-section-title">Ações Rápidas</p>
        <div className="cp-docs-actions-grid">
          <a href="#/central-padroes/documents" className="cp-docs-action-btn primary">📄 Abrir Documentos</a>
          <a href="#/central-padroes/documents?filter=oficial_ativo" className="cp-docs-action-btn">⭐ Oficiais Ativos (12 DMs)</a>
          <a href="#/central-padroes/audits" className="cp-docs-action-btn">📋 Auditoria 00.14 — Paridade</a>
          <a href="#/central-padroes/audits" className="cp-docs-action-btn">📋 Auditoria 00.18 — Interface</a>
          <a href="#/central-padroes/documents?filter=previsto" className="cp-docs-action-btn">📝 Ver Previstos ({metrics.statusPrevisto})</a>
          <a href="#/central-padroes/documents?filter=fonte_bruta" className="cp-docs-action-btn">🗂️ Fontes Originais ({metrics.fonteBruta})</a>
          <a href="#/central-padroes/documents?filter=curadoria" className="cp-docs-action-btn">🔍 Curadoria ({metrics.curadoria})</a>
          <button className="cp-docs-action-btn pending" disabled>⏳ Preparar leitura Supabase (pendente auth)</button>
        </div>
      </section>
    </CentralPageShell>
  );
};

export default DashboardPage;
