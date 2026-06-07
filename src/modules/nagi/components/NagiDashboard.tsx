import React from 'react';
import { NagiItem, NagiIngestionDocument, GOVERNANCE_STATUS_LABELS } from '../domain/types';
import EmptyState from './EmptyState';
import '../styles/nagi-tokens.css';

/* ── Tipos ──────────────────────────────────────────── */

interface NagiDashboardProps {
  catalogItems: NagiItem[];
  triageItems: NagiItem[];
  ingestionDocs: NagiIngestionDocument[];
  eligibleCount: number;
  onNavigate: (section: string) => void;
}

type QuickAction = {
  label: string;
  section: string;
  icon: React.ReactNode;
  color: string;
};

/* ── SVG Icons inline ───────────────────────────────── */

const SvgDoc = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const SvgFlask = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3.32A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3.32A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);
const SvgBook = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);
const SvgAlert = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const SvgTarget = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const SvgSend = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const SvgCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SvgPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const SvgArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const SvgZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const SvgClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ── Subcomponentes internos ─────────────────────────── */

const MetricCard: React.FC<{
  icon: React.ReactNode; label: string; value: number;
  color: string; subtitle?: string;
}> = ({ icon, label, value, color, subtitle }) => (
  <div
    style={{
      borderRadius: 'var(--nagi-radius-xl)',
      border: `1px solid var(--nagi-line)`,
      backgroundColor: 'var(--nagi-surface)',
      padding: '18px 20px',
      boxShadow: 'var(--nagi-shadow-sm)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
      <div style={{ color, opacity: 0.7 }}>{icon}</div>
      <span
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color,
        }}
      >
        {value}
      </span>
    </div>
    <div style={{ fontSize: 'var(--nagi-micro)', fontWeight: 600, color: 'var(--nagi-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </div>
    {subtitle && (
      <div style={{ fontSize: 10, color: 'var(--nagi-muted)', marginTop: 2, opacity: 0.7 }}>{subtitle}</div>
    )}
  </div>
);

const QuickActionBtn: React.FC<{
  label: string; icon: React.ReactNode; color: string;
  onClick: () => void;
}> = ({ label, icon, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 38, padding: '0 16px',
      borderRadius: 'var(--nagi-radius-md)',
      border: `1px solid ${color}20`,
      backgroundColor: `${color}08`,
      color,
      fontSize: 'var(--nagi-micro)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      cursor: 'pointer',
      transition: 'all var(--nagi-transition-base)',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${color}15`; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${color}08`; }}
  >
    {icon}
    {label}
  </button>
);

/* ── NeedsAttentionBlock ────────────────────────────── */

const NeedsAttentionBlock: React.FC<{ items: NagiItem[] }> = ({ items }) => {
  const needsAction = items.filter(
    (i) => i.governanceStatus === 'em_triagem' || i.governanceStatus === 'em_analise'
  ).slice(0, 5);

  if (needsAction.length === 0) {
    return (
      <div
        style={{
          borderRadius: 'var(--nagi-radius-xl)',
          border: `1px solid var(--nagi-line)`,
          backgroundColor: 'var(--nagi-surface)',
          padding: 20,
          boxShadow: 'var(--nagi-shadow-sm)',
        }}
      >
        <div style={{ fontSize: 'var(--nagi-micro)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-success)', marginBottom: 4 }}>
          <SvgCheck /> Tudo em dia
        </div>
        <div style={{ fontSize: 'var(--nagi-body)', color: 'var(--nagi-muted)' }}>
          Nenhum item precisa de atenção agora.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: 'var(--nagi-radius-xl)',
        border: `1px solid var(--nagi-danger-line)`,
        backgroundColor: 'var(--nagi-danger-soft)',
        padding: 20,
        boxShadow: 'var(--nagi-shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ color: 'var(--nagi-danger)' }}><SvgZap /></div>
        <span style={{ fontSize: 'var(--nagi-micro)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-danger)' }}>
          Pedem atenção agora
        </span>
        <span
          style={{
            fontSize: 9, fontWeight: 700, marginLeft: 'auto',
            padding: '2px 8px', borderRadius: 'var(--nagi-radius-sm)',
            backgroundColor: 'var(--nagi-danger-line)',
            color: '#fff',
          }}
        >
          {needsAction.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {needsAction.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px',
              borderRadius: 'var(--nagi-radius-md)',
              backgroundColor: 'rgba(255,255,255,0.5)',
              fontSize: 'var(--nagi-body)',
              color: 'var(--nagi-text)',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--nagi-danger)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontWeight: 500, lineClamp: 1 }}>{item.title}</span>
            <span style={{ fontSize: 9, color: 'var(--nagi-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              {GOVERNANCE_LABELS[item.governanceStatus] || item.governanceStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── ActivityFeed ───────────────────────────────────── */

const ActivityFeed: React.FC<{ triageItems: NagiItem[]; catalogItems: NagiItem[] }> = ({ triageItems, catalogItems }) => {
  const activities: { text: string; time: string; color: string }[] = [];

  // Gera atividade a partir de dados reais do catálogo
  catalogItems.slice(0, 3).forEach((item) => {
    activities.push({
      text: `"${item.title}" — ${item.itemType} catalogado`,
      time: `Score: ${item.score.final}`,
      color: 'var(--nagi-success)',
    });
  });

  // Gera atividade a partir da triagem
  triageItems.slice(0, 3).forEach((item) => {
    activities.push({
      text: `"${item.title}" — em análise (${item.maturityStage})`,
      time: `Prioridade: ${item.priority}`,
      color: 'var(--nagi-warning)',
    });
  });

  if (activities.length === 0) {
    activities.push(
      { text: 'Sistema NAGI inicializado', time: '—', color: 'var(--nagi-brand)' },
      { text: 'Aguardando entrada de dados...', time: '—', color: 'var(--nagi-muted)' },
    );
  }

  return (
    <div
      style={{
        borderRadius: 'var(--nagi-radius-xl)',
        border: `1px solid var(--nagi-line)`,
        backgroundColor: 'var(--nagi-surface)',
        padding: 20,
        boxShadow: 'var(--nagi-shadow-sm)',
      }}
    >
      <div style={{ fontSize: 'var(--nagi-micro)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-muted)', marginBottom: 14 }}>
        Atividade recente
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {activities.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: a.color, flexShrink: 0, marginTop: 4 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--nagi-body)', color: 'var(--nagi-text)', fontWeight: 500, lineClamp: 1 }}>
                {a.text}
              </div>
              <div style={{ fontSize: 10, color: 'var(--nagi-muted)', marginTop: 1 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── QuickActionsGrid ───────────────────────────────── */

const QuickActionsGrid: React.FC<{ onNavigate: (s: string) => void }> = ({ onNavigate }) => {
  const actions: QuickAction[] = [
    { label: 'Nova ideia', section: 'ideias', icon: <SvgPlus />, color: 'var(--nagi-brand)' },
    { label: 'Importar do NIC', section: 'ideias', icon: <SvgArrowRight />, color: 'var(--nagi-info)' },
    { label: 'Documentos', section: 'documentos', icon: <SvgDoc />, color: 'var(--nagi-brand)' },
    { label: 'Ir para catálogo', section: 'catalogo', icon: <SvgBook />, color: 'var(--nagi-success)' },
    { label: 'Ver triagem', section: 'ideias', icon: <SvgFlask />, color: 'var(--nagi-warning)' },
  ];

  return (
    <div
      style={{
        borderRadius: 'var(--nagi-radius-xl)',
        border: `1px solid var(--nagi-line)`,
        backgroundColor: 'var(--nagi-surface)',
        padding: 20,
        boxShadow: 'var(--nagi-shadow-sm)',
      }}
    >
      <div style={{ fontSize: 'var(--nagi-micro)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-muted)', marginBottom: 12 }}>
        Ações rápidas
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {actions.map((a) => (
          <QuickActionBtn key={a.label} label={a.label} icon={a.icon} color={a.color} onClick={() => onNavigate(a.section)} />
        ))}
      </div>
    </div>
  );
};

/* ── Componente principal ───────────────────────────── */

const NagiDashboard: React.FC<NagiDashboardProps> = ({
  catalogItems, triageItems, ingestionDocs, eligibleCount, onNavigate,
}) => {
  const totalIngestao = ingestionDocs.length;
  const totalTriagem = triageItems.length;
  const totalCatalogo = catalogItems.length;
  const totalRevisao = ingestionDocs.filter((doc) => doc.reviewStatus === 'em_revisao').length;
  const totalEncaminhados = catalogItems.filter((i) => i.handoffRecord?.status === 'encaminhado' || i.specialistTarget).length;
  const hasData = totalIngestao > 0 || totalTriagem > 0 || totalCatalogo > 0;

  if (!hasData) {
    return (
      <div style={{ padding: '40px 32px' }}>
        <EmptyState
          title="Bem-vindo ao NAGI"
          description="Núcleo Avançado de Gestão de Ideias. Adicione documentos, crie ideias ou importe do NIC para começar."
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          }
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <QuickActionBtn label="Nova ideia" icon={<SvgPlus />} color="var(--nagi-brand)" onClick={() => onNavigate('ideias')} />
          <QuickActionBtn label="Importar do NIC" icon={<SvgArrowRight />} color="var(--nagi-info)" onClick={() => onNavigate('ideias')} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1280 }}>
      {/* ── Bloco de abertura ──────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1
              style={{
                fontSize: 'var(--nagi-page-title)',
                fontWeight: 'var(--nagi-page-title-weight)',
                letterSpacing: 'var(--nagi-page-title-spacing)',
                color: 'var(--nagi-text)',
                margin: 0,
              }}
            >
              NAGI
            </h1>
            <p
              style={{
                fontSize: 'var(--nagi-muted-size)',
                color: 'var(--nagi-muted)',
                marginTop: 4,
                maxWidth: 540,
              }}
            >
              Núcleo Avançado de Gestão de Ideias — hub central de recepção, classificação, 
              qualificação, priorização, governança e encaminhamento para módulos especialistas.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <QuickActionBtn label="Nova ideia" icon={<SvgPlus />} color="var(--nagi-brand)" onClick={() => onNavigate('ideias')} />
            <QuickActionBtn label="Documentos" icon={<SvgDoc />} color="var(--nagi-brand)" onClick={() => onNavigate('documentos')} />
          </div>
        </div>
      </div>

      {/* ── Grid de KPIs (6 cards) ─────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <MetricCard icon={<SvgDoc />} label="Documentos" value={totalIngestao} color="var(--nagi-brand)" subtitle="recebidos" />
        <MetricCard icon={<SvgFlask />} label="Em análise" value={totalTriagem} color="var(--nagi-warning)" subtitle="ideias na triagem" />
        <MetricCard icon={<SvgBook />} label="Catálogo" value={totalCatalogo} color="var(--nagi-success)" subtitle="itens governados" />
        <MetricCard icon={<SvgAlert />} label="Revisão" value={totalRevisao} color={totalRevisao > 0 ? 'var(--nagi-danger)' : 'var(--nagi-muted)'} subtitle="pendentes" />
        <MetricCard icon={<SvgTarget />} label="Elegíveis" value={eligibleCount} color={eligibleCount > 0 ? 'var(--nagi-accent)' : 'var(--nagi-muted)'} subtitle="prontos p/ catálogo" />
        <MetricCard icon={<SvgSend />} label="Encaminhados" value={totalEncaminhados} color={totalEncaminhados > 0 ? 'var(--nagi-info)' : 'var(--nagi-muted)'} subtitle="para especialistas" />
      </div>

      {/* ── Grid secundário (2 colunas) ────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {/* Atenção */}
        <NeedsAttentionBlock items={[...triageItems, ...catalogItems]} />
        {/* Timeline de atividades */}
        <ActivityFeed triageItems={triageItems} catalogItems={catalogItems} />
      </div>

      {/* ── Ações rápidas ──────────────────────── */}
      <QuickActionsGrid onNavigate={onNavigate} />
    </div>
  );
};

export default NagiDashboard;
