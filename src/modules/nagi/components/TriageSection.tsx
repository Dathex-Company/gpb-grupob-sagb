import React, { useMemo, useState } from 'react';
import NagiItemDetail from './NagiItemDetail';
import {
  NagiItem,
  NagiOriginType,
  NagiMaturityStage,
  NagiPriority,
  NagiGovernanceStatus,
  ORIGIN_LABELS,
  MATURITY_LABELS,
  PRIORITY_LABELS,
  GOVERNANCE_STATUS_LABELS,
  MATURITY_DESCRIPTIONS,
  MATURITY_STAGES,
} from '../domain/types';
import EmptyState from './EmptyState';

interface TriageSectionProps {
  items: NagiItem[];
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

/* ── 3 zonas de maturidade ─────────────────────────── */

const ZONES: { id: string; label: string; stages: NagiMaturityStage[]; color: string }[] = [
  { id: 'entrada', label: 'Entrada', stages: ['entrada', 'classificacao'], color: 'var(--nagi-info)' },
  { id: 'analise', label: 'Análise', stages: ['qualificacao', 'priorizacao'], color: 'var(--nagi-warning)' },
  { id: 'decisao', label: 'Decisão', stages: ['decisao', 'encaminhada', 'catalogada'], color: 'var(--nagi-success)' },
];

/* Alice UI: cores suaves para cada estágio */
const stageTone: Record<NagiMaturityStage, { bg: string; text: string; border: string }> = {
  entrada: { bg: 'var(--nagi-neutral-soft)', text: 'var(--nagi-neutral)', border: 'var(--nagi-neutral-line)' },
  classificacao: { bg: 'var(--nagi-info-soft)', text: 'var(--nagi-info)', border: 'var(--nagi-info-line)' },
  qualificacao: { bg: 'var(--nagi-warning-soft)', text: 'var(--nagi-warning)', border: 'var(--nagi-warning-line)' },
  priorizacao: { bg: 'var(--nagi-accent-soft)', text: 'var(--nagi-accent)', border: 'var(--nagi-accent-soft)' },
  decisao: { bg: 'var(--nagi-danger-soft)', text: 'var(--nagi-danger)', border: 'var(--nagi-danger-line)' },
  encaminhada: { bg: 'var(--nagi-success-soft)', text: 'var(--nagi-success)', border: 'var(--nagi-success-line)' },
  catalogada: { bg: 'var(--nagi-brand-soft)', text: 'var(--nagi-brand)', border: 'var(--nagi-brand-soft)' },
};

const govBadge: Record<NagiGovernanceStatus, { label: string; color: string }> = {
  em_triagem: { label: 'Em triagem', color: 'var(--nagi-neutral)' },
  em_analise: { label: 'Em análise', color: 'var(--nagi-info)' },
  aprovada: { label: 'Aprovada', color: 'var(--nagi-success)' },
  rejeitada: { label: 'Rejeitada', color: 'var(--nagi-danger)' },
  incubada: { label: 'Incubada', color: 'var(--nagi-accent)' },
  arquivada: { label: 'Arquivada', color: 'var(--nagi-muted)' },
};

const TriageSection: React.FC<TriageSectionProps> = ({ items, onRefresh, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [originFilter, setOriginFilter] = useState<string>('todas');
  const [stageFilter, setStageFilter] = useState<string>('todas');
  const [priorityFilter, setPriorityFilter] = useState<string>('todas');
  const [govFilter, setGovFilter] = useState<string>('todas');
  const [showFullPipeline, setShowFullPipeline] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return items.find((i) => i.id === selectedId) ?? null;
  }, [items, selectedId]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (originFilter !== 'todas' && item.originType !== originFilter) return false;
      if (stageFilter !== 'todas' && item.maturityStage !== stageFilter) return false;
      if (priorityFilter !== 'todas' && item.priority !== priorityFilter) return false;
      if (govFilter !== 'todas' && item.governanceStatus !== govFilter) return false;
      if (!term) return true;
      return [item.title, item.summary, item.category, ...item.tags]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [items, search, originFilter, stageFilter, priorityFilter, govFilter]);

  const hasActiveFilters = search.trim() || originFilter !== 'todas' || stageFilter !== 'todas' || priorityFilter !== 'todas' || govFilter !== 'todas';

  const clearFilters = () => {
    setSearch('');
    setOriginFilter('todas');
    setStageFilter('todas');
    setPriorityFilter('todas');
    setGovFilter('todas');
  };

  const byStage = useMemo(() => {
    const map = new Map<NagiMaturityStage, NagiItem[]>();
    MATURITY_STAGES.forEach((s) => map.set(s, []));
    filtered.forEach((item) => {
      const arr = map.get(item.maturityStage) ?? [];
      arr.push(item);
      map.set(item.maturityStage, arr);
    });
    return map;
  }, [filtered]);

  const zoneCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ZONES.forEach((zone) => {
      counts[zone.id] = zone.stages.reduce((sum, s) => sum + (byStage.get(s)?.length ?? 0), 0);
    });
    return counts;
  }, [byStage]);

  if (items.length === 0) {
    return (
      <div className="pt-4">
        <EmptyState
          title="Nenhuma ideia em análise"
          description="Crie uma ideia nova, importe do NIC ou envie documentos da aba Documentos."
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3.32A2.5 2.5 0 0 1 9.5 2Z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3.32A2.5 2.5 0 0 0 14.5 2Z" />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros — Alice UI */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Busca */}
          <label className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--nagi-muted)' }}
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..."
              style={{
                paddingLeft: 36, paddingRight: 12, height: 36,
                borderRadius: 'var(--nagi-radius-md)',
                border: `1px solid var(--nagi-line)`,
                backgroundColor: 'var(--nagi-surface-soft)',
                fontSize: 'var(--nagi-body)', outline: 'none', minWidth: 180, color: 'var(--nagi-text)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--nagi-brand)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--nagi-line)'; }}
            />
          </label>

          <select value={originFilter} onChange={(e) => setOriginFilter(e.target.value)}
            style={{ padding: '0 12px', height: 36, borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', fontSize: 'var(--nagi-body)', outline: 'none', color: 'var(--nagi-text)' }}>
            <option value="todas">Todas origens</option>
            {(Object.entries(ORIGIN_LABELS) as [NagiOriginType, string][]).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
          </select>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}
            style={{ padding: '0 12px', height: 36, borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', fontSize: 'var(--nagi-body)', outline: 'none', color: 'var(--nagi-text)' }}>
            <option value="todas">Todos estágios</option>
            {(Object.entries(MATURITY_LABELS) as [NagiMaturityStage, string][]).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: '0 12px', height: 36, borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', fontSize: 'var(--nagi-body)', outline: 'none', color: 'var(--nagi-text)' }}>
            <option value="todas">Todas prioridades</option>
            {(Object.entries(PRIORITY_LABELS) as [NagiPriority, string][]).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
          </select>
          <select value={govFilter} onChange={(e) => setGovFilter(e.target.value)}
            style={{ padding: '0 12px', height: 36, borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', fontSize: 'var(--nagi-body)', outline: 'none', color: 'var(--nagi-text)' }}>
            <option value="todas">Toda governança</option>
            {(Object.entries(GOVERNANCE_STATUS_LABELS) as [NagiGovernanceStatus, string][]).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.06em] transition-opacity hover:opacity-70"
              style={{ fontSize: 9, color: 'var(--nagi-muted)', padding: '0 8px', height: 36 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Limpar
            </button>
          )}
        </div>
        <span className="font-semibold uppercase tracking-[0.1em]"
          style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
        >
          {filtered.length} {filtered.length === 1 ? 'ideia' : 'ideias'}
        </span>
      </div>

      {/* Pipeline toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {ZONES.map((zone) => (
            <div key={zone.id} className="flex items-center gap-1.5 font-semibold uppercase tracking-[0.06em]"
              style={{ fontSize: 9, color: zone.color }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', backgroundColor: zone.color }} />
              {zone.label}
              <span style={{ color: 'var(--nagi-muted)' }}>({zoneCounts[zone.id]})</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowFullPipeline(!showFullPipeline)}
          className="font-semibold uppercase tracking-[0.06em] transition-opacity hover:opacity-70"
          style={{ fontSize: 9, color: 'var(--nagi-brand)' }}
        >
          {showFullPipeline ? 'Visão por zona' : 'Visão completa'}
        </button>
      </div>

      {/* Pipeline */}
      {showFullPipeline ? (
        /* Visão completa — 7 colunas lado a lado (preservação do pipeline original) */
        <div className="overflow-x-auto custom-scrollbar pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="flex gap-3" style={{ minWidth: 700 }}>
            {MATURITY_STAGES.map((stage) => {
              const stageItems = byStage.get(stage) ?? [];
              const tone = stageTone[stage];
              return (
                <div key={stage} className="flex-1 min-w-[100px]" style={{ scrollSnapAlign: 'start' }}>
                  <div className="flex items-center gap-1 font-semibold uppercase tracking-[0.04em] px-2"
                    style={{ height: 28, borderRadius: 'var(--nagi-radius-sm)', fontSize: 9, backgroundColor: tone.bg, color: tone.text, border: `1px solid ${tone.border}` }}
                  >
                    {MATURITY_LABELS[stage]}
                    <span className="ml-auto opacity-60">({stageItems.length})</span>
                  </div>
                  <p className="mt-1 mb-2 px-1" style={{ fontSize: 8, color: 'var(--nagi-muted)' }}>{MATURITY_DESCRIPTIONS[stage]}</p>
                  <div className="space-y-1.5">
                    {stageItems.map((item) => (
                      <TriageCard key={item.id} item={item} onClick={() => setSelectedId(item.id)} />
                    ))}
                    {stageItems.length === 0 && (
                      <div className="text-center py-4" style={{ borderRadius: 'var(--nagi-radius-lg)', border: `1px dashed var(--nagi-line-soft)`, backgroundColor: 'var(--nagi-surface-soft)' }}>
                        <span style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted-light)' }}>—</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Visão por zona — 3 zonas expansíveis */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ZONES.map((zone) => {
            const zoneItems = zone.stages.flatMap((s) => byStage.get(s) ?? []);
            return (
              <div key={zone.id} className="space-y-2">
                {/* Cabeçalho da zona */}
                <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.06em] px-3"
                  style={{
                    height: 36,
                    borderRadius: 'var(--nagi-radius-md)',
                    backgroundColor: zone.color === 'var(--nagi-info)' ? 'var(--nagi-info-soft)' : zone.color === 'var(--nagi-warning)' ? 'var(--nagi-warning-soft)' : 'var(--nagi-success-soft)',
                    color: zone.color,
                    fontSize: 'var(--nagi-micro)',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', backgroundColor: zone.color }} />
                  {zone.label}
                  <span className="ml-auto" style={{ opacity: 0.6 }}>({zoneItems.length})</span>
                </div>

                {/* Sub-estágios dentro da zona */}
                <div className="space-y-2">
                  {zone.stages.map((stage) => {
                    const stageItems = byStage.get(stage) ?? [];
                    const tone = stageTone[stage];
                    if (stageItems.length === 0) return null;
                    return (
                      <div key={stage}>
                        <div className="flex items-center gap-1 font-semibold uppercase tracking-[0.04em] px-2 mb-1"
                          style={{ height: 22, borderRadius: 'var(--nagi-radius-sm)', fontSize: 8, backgroundColor: tone.bg, color: tone.text, border: `1px solid ${tone.border}` }}
                        >
                          {MATURITY_LABELS[stage]}
                          <span className="ml-auto opacity-60">({stageItems.length})</span>
                        </div>
                        <div className="space-y-1">
                          {stageItems.map((item) => (
                            <TriageCard key={item.id} item={item} onClick={() => setSelectedId(item.id)} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {zoneItems.length === 0 && (
                    <div className="text-center py-4" style={{ borderRadius: 'var(--nagi-radius-lg)', border: `1px dashed var(--nagi-line-soft)` }}>
                      <span style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted-light)' }}>Vazio</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SlidePanel com detalhes do item selecionado */}
      {selectedItem && (
        <NagiItemDetail
          item={selectedItem}
          open={!!selectedItem}
          onClose={() => setSelectedId(null)}
          onRefresh={onRefresh}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

/* ── TriageCard ────────────────────────────────────── */

const TriageCard: React.FC<{ item: NagiItem; onClick: () => void }> = ({ item, onClick }) => {
  const gov = govBadge[item.governanceStatus];
  const elegivel = item.promotionStatus === 'elegivel';

  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-all hover:-translate-y-[0.5px]"
      style={{
        borderRadius: 'var(--nagi-radius-lg)',
        border: `1px solid var(--nagi-line)`,
        backgroundColor: 'var(--nagi-surface)',
        padding: '10px 12px',
        boxShadow: 'var(--nagi-shadow-sm)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--nagi-shadow-md)'; e.currentTarget.style.borderColor = 'var(--nagi-muted-light)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--nagi-shadow-sm)'; e.currentTarget.style.borderColor = 'var(--nagi-line)'; }}
    >
      {/* Badge governança + prioridade */}
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="font-semibold uppercase tracking-[0.04em]"
          style={{ fontSize: 8, padding: '1px 6px', borderRadius: 4, height: 16, lineHeight: '14px', color: gov.color, backgroundColor: `${gov.color}15`, border: `1px solid ${gov.color}30` }}
        >
          {gov.label}
        </span>
        <span className="font-semibold uppercase shrink-0"
          style={{ fontSize: 8, color: item.priority === 'alta' ? 'var(--nagi-danger)' : item.priority === 'media' ? 'var(--nagi-warning)' : 'var(--nagi-muted-light)' }}
        >
          {PRIORITY_LABELS[item.priority]}
        </span>
      </div>

      <h4 className="font-semibold tracking-[-0.01em] line-clamp-2"
        style={{ fontSize: 'var(--nagi-body)', color: 'var(--nagi-text)' }}
      >
        {item.title}
      </h4>

      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
        <span className="font-semibold uppercase tracking-[0.04em]"
          style={{ fontSize: 8, color: 'var(--nagi-brand)' }}
        >
          {ORIGIN_LABELS[item.originType]}
        </span>
        {item.score.final > 0 && (
          <span style={{ fontSize: 8, color: 'var(--nagi-muted)' }}>
            · {item.score.final}/100
          </span>
        )}
        {elegivel && (
          <span className="font-semibold ml-auto"
            style={{ fontSize: 8, color: 'var(--nagi-success)' }}
          >
            Pronto para catálogo
          </span>
        )}
      </div>
    </button>
  );
};

export default TriageSection;
