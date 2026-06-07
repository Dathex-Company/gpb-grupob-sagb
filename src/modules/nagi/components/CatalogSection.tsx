import React, { useMemo, useState, useCallback } from 'react';
import NagiItemCard from './NagiItemCard';
import NagiItemDetail from './NagiItemDetail';
import EmptyState from './EmptyState';
import {
  NagiItem,
  NagiItemType,
  NagiOperationalStatus,
  NagiGovernanceStatus,
  NagiPriority,
  NagiOriginType,
  ITEM_TYPE_LABELS,
  OPERATIONAL_STATUS_LABELS,
  GOVERNANCE_STATUS_LABELS,
  ORIGIN_LABELS,
  PRIORITY_LABELS,
  isEligibleForPromotion,
} from '../domain/types';
import '../styles/nagi-tokens.css';

/* ── Types ──────────────────────────────────────────── */

interface CatalogSectionProps {
  items: NagiItem[];
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

type ViewMode = 'grid' | 'list' | 'grouped' | 'explore';
type GroupBy = 'type' | 'category' | 'status' | 'priority';

const FILTER_ALL = 'todos' as const;

interface FilterState {
  search: string;
  type: string;
  category: string;
  status: string;
  governance: string;
  priority: string;
  origin: string;
  tag: string;
}

const EMPTY_FILTERS: FilterState = {
  search: '', type: FILTER_ALL, category: FILTER_ALL, status: FILTER_ALL,
  governance: FILTER_ALL, priority: FILTER_ALL, origin: FILTER_ALL, tag: FILTER_ALL,
};

/* ── SVG Icons ──────────────────────────────────────── */

const SvgSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const SvgGrid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const SvgList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const SvgGroup = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    <line x1="10" y1="3" x2="10" y2="21" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const SvgExplore = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);
const SvgCross = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const SvgArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── Filter components ──────────────────────────────── */

const FilterSelect: React.FC<{
  value: string; onChange: (v: string) => void;
  options: [string, string][]; placeholder: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: '0 12px', height: 34,
      borderRadius: 'var(--nagi-radius-md)',
      border: `1px solid var(--nagi-line)`,
      backgroundColor: 'var(--nagi-surface-soft)',
      fontSize: 'var(--nagi-body)', outline: 'none',
      color: 'var(--nagi-text)', cursor: 'pointer',
      minWidth: 100,
    }}
  >
    <option value={FILTER_ALL}>{placeholder}</option>
    {options.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
  </select>
);

const FilterChip: React.FC<{
  label: string; onRemove: () => void;
}> = ({ label, onRemove }) => (
  <span
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 26, padding: '0 10px',
      borderRadius: 'var(--nagi-radius-md)',
      backgroundColor: 'var(--nagi-brand-soft)',
      border: `1px solid var(--nagi-brand-line)`,
      fontSize: 10, fontWeight: 600,
      color: 'var(--nagi-brand)',
    }}
  >
    {label}
    <button onClick={onRemove} style={{ display: 'flex', color: 'var(--nagi-brand)', opacity: 0.6, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
      <SvgCross />
    </button>
  </span>
);

/* ── TagChip ────────────────────────────────────────── */

const TagChip: React.FC<{
  tag: string; active?: boolean; onClick?: () => void; size?: 'sm' | 'md';
}> = ({ tag, active, onClick, size = 'sm' }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center',
      height: size === 'sm' ? 22 : 28,
      padding: size === 'sm' ? '0 8px' : '0 12px',
      borderRadius: 'var(--nagi-radius-sm)',
      backgroundColor: active ? 'var(--nagi-brand-soft)' : 'var(--nagi-neutral-soft)',
      border: `1px solid ${active ? 'var(--nagi-brand-line)' : 'var(--nagi-line)'}`,
      fontSize: size === 'sm' ? 9 : 10,
      fontWeight: 600, color: active ? 'var(--nagi-brand)' : 'var(--nagi-muted)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s',
    }}
    onMouseEnter={(e) => { if (onClick) { e.currentTarget.style.backgroundColor = 'var(--nagi-brand-soft)'; e.currentTarget.style.borderColor = 'var(--nagi-brand-line)'; } }}
    onMouseLeave={(e) => { if (onClick) { e.currentTarget.style.backgroundColor = active ? 'var(--nagi-brand-soft)' : 'var(--nagi-neutral-soft)'; e.currentTarget.style.borderColor = active ? 'var(--nagi-brand-line)' : 'var(--nagi-line)'; } }}
  >
    {tag}
  </button>
);

/* ── View: Grouped ──────────────────────────────────── */

const GroupedView: React.FC<{
  items: NagiItem[]; groupBy: GroupBy; onSelect: (id: string) => void;
}> = ({ items, groupBy, onSelect }) => {
  const groups = useMemo(() => {
    const map = new Map<string, NagiItem[]>();
    items.forEach((item) => {
      let key = '';
      if (groupBy === 'type') key = ITEM_TYPE_LABELS[item.itemType];
      else if (groupBy === 'category') key = item.category || 'Sem categoria';
      else if (groupBy === 'status') key = OPERATIONAL_STATUS_LABELS[item.operationalStatus];
      else if (groupBy === 'priority') key = PRIORITY_LABELS[item.priority] || item.priority;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [items, groupBy]);

  if (items.length === 0) return null;

  const groupLabel = groupBy === 'type' ? 'Tipo' : groupBy === 'category' ? 'Categoria' : groupBy === 'status' ? 'Status' : 'Prioridade';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)', fontWeight: 600 }}>Agrupar por:</span>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-brand)' }}>{groupLabel}</span>
      </div>
      {groups.map(([key, groupItems]) => (
        <div key={key}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <h3 style={{ fontSize: 'var(--nagi-module-title)', fontWeight: 700, color: 'var(--nagi-text)', margin: 0 }}>{key}</h3>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 8px',
              borderRadius: 'var(--nagi-radius-sm)',
              backgroundColor: 'var(--nagi-neutral-soft)',
              color: 'var(--nagi-muted)',
            }}>
              {groupItems.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {groupItems.map((item) => (
              <NagiItemCard key={item.id} item={item} variant="compact" onClick={() => onSelect(item.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── View: Explore ──────────────────────────────────── */

const ExploreView: React.FC<{
  items: NagiItem[]; onSelect: (id: string) => void; onTagClick: (tag: string) => void;
}> = ({ items, onSelect, onTagClick }) => {
  // Collect all tags and their frequencies
  const tagMap = useMemo(() => {
    const map = new Map<string, NagiItem[]>();
    items.forEach((item) => item.tags.forEach((t) => {
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(item);
    }));
    return map;
  }, [items]);

  const topTags = useMemo(() =>
    Array.from(tagMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 15),
    [tagMap]
  );

  const byPriority = useMemo(() => {
    const alta = items.filter((i) => i.priority === 'alta');
    const media = items.filter((i) => i.priority === 'media');
    const baixa = items.filter((i) => i.priority === 'baixa');
    return { alta, media, baixa };
  }, [items]);

  const elegiveis = useMemo(() => items.filter((i) => isEligibleForPromotion(i)), [items]);

  const recentes = useMemo(() =>
    [...items].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 5),
    [items]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tags cloud */}
      {topTags.length > 0 && (
        <div
          style={{
            borderRadius: 'var(--nagi-radius-xl)',
            border: `1px solid var(--nagi-line)`,
            backgroundColor: 'var(--nagi-surface)',
            padding: 20,
            boxShadow: 'var(--nagi-shadow-sm)',
          }}
        >
          <h3 style={{ fontSize: 'var(--nagi-micro)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-muted)', margin: '0 0 10px' }}>
            Nuvem de tags
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {topTags.map(([tag, taggedItems]) => (
              <TagChip key={tag} tag={`${tag} (${taggedItems.length})`} size="md" onClick={() => onTagClick(tag)} />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Por prioridade */}
        <div style={{
          borderRadius: 'var(--nagi-radius-xl)', border: `1px solid var(--nagi-line)`,
          backgroundColor: 'var(--nagi-surface)', padding: 20, boxShadow: 'var(--nagi-shadow-sm)',
        }}>
          <h3 style={{ fontSize: 'var(--nagi-micro)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-muted)', margin: '0 0 12px' }}>
            Por prioridade
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <ExploreRow label="Alta" count={byPriority.alta.length} color="var(--nagi-danger)" onClick={() => onSelect(byPriority.alta[0]?.id)} />
            <ExploreRow label="Média" count={byPriority.media.length} color="var(--nagi-warning)" onClick={() => onSelect(byPriority.media[0]?.id)} />
            <ExploreRow label="Baixa" count={byPriority.baixa.length} color="var(--nagi-muted)" onClick={() => onSelect(byPriority.baixa[0]?.id)} />
          </div>
        </div>

        {/* Elegíveis */}
        <div style={{
          borderRadius: 'var(--nagi-radius-xl)', border: `1px solid var(--nagi-line)`,
          backgroundColor: 'var(--nagi-surface)', padding: 20, boxShadow: 'var(--nagi-shadow-sm)',
        }}>
          <h3 style={{ fontSize: 'var(--nagi-micro)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-muted)', margin: '0 0 12px' }}>
            Elegíveis para ação
          </h3>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--nagi-accent)', marginBottom: 4 }}>
            {elegiveis.length}
          </div>
          <div style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)', marginBottom: 12 }}>
            itens prontos para próximo estágio
          </div>
          {elegiveis.slice(0, 3).map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}
              onClick={() => onSelect(item.id)}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--nagi-accent)' }} />
              <span style={{ fontSize: 'var(--nagi-body)', color: 'var(--nagi-text)', fontWeight: 500 }}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recentes */}
      <div style={{
        borderRadius: 'var(--nagi-radius-xl)', border: `1px solid var(--nagi-line)`,
        backgroundColor: 'var(--nagi-surface)', padding: 20, boxShadow: 'var(--nagi-shadow-sm)',
      }}>
        <h3 style={{ fontSize: 'var(--nagi-micro)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--nagi-muted)', margin: '0 0 10px' }}>
          Mais recentes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {recentes.map((item) => (
            <NagiItemCard key={item.id} item={item} variant="compact" onClick={() => onSelect(item.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ExploreRow: React.FC<{ label: string; count: number; color: string; onClick?: () => void }> = ({ label, count, color, onClick }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
    <span style={{ flex: 1, fontSize: 'var(--nagi-body)', fontWeight: 500, color: 'var(--nagi-text)' }}>{label}</span>
    <span style={{ fontSize: 16, fontWeight: 700, color }}>{count}</span>
  </div>
);

/* ── View: List ─────────────────────────────────────── */

const ListView: React.FC<{ items: NagiItem[]; onSelect: (id: string) => void; onTagClick: (tag: string) => void }> = ({ items, onSelect, onTagClick }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {items.map((item) => (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        className="group text-left transition-all hover:-translate-y-[0.5px]"
        style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          borderRadius: 'var(--nagi-radius-lg)',
          border: `1px solid transparent`,
          borderBottom: `1px solid var(--nagi-line)`,
          backgroundColor: 'transparent',
          padding: '8px 12px',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--nagi-surface-muted)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        {/* Type indicator */}
        <div style={{
          width: 4, height: 28, borderRadius: 2, flexShrink: 0,
          backgroundColor: item.itemType === 'ideia' ? 'var(--nagi-warning)' : item.itemType === 'framework' ? 'var(--nagi-brand)' : item.itemType === 'programa' ? 'var(--nagi-accent)' : 'var(--nagi-muted)',
        }} />

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'var(--nagi-body)', fontWeight: 600, color: 'var(--nagi-text)', lineClamp: 1 }}>
            {item.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--nagi-muted)' }}>
              {ITEM_TYPE_LABELS[item.itemType]}
            </span>
            {item.category && (
              <span style={{ fontSize: 9, color: 'var(--nagi-muted)', opacity: 0.6 }}>{item.category}</span>
            )}
            <span style={{ fontSize: 9, color: 'var(--nagi-muted)', opacity: 0.6 }}>
              {OPERATIONAL_STATUS_LABELS[item.operationalStatus]}
            </span>
          </div>
          {/* Tags inline */}
          {item.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              {item.tags.slice(0, 4).map((tag) => (
                <TagChip key={tag} tag={tag} onClick={(e) => { e?.stopPropagation?.(); onTagClick(tag); }} />
              ))}
            </div>
          )}
        </div>

        {/* Score + Governance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {item.score.final > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
              color: item.score.final >= 80 ? 'var(--nagi-success)' : item.score.final >= 50 ? 'var(--nagi-warning)' : 'var(--nagi-muted)',
            }}>
              {item.score.final}
            </span>
          )}
          {item.governanceStatus && (
            <span style={{
              fontSize: 9, padding: '2px 8px', borderRadius: 'var(--nagi-radius-sm)',
              backgroundColor: item.governanceStatus === 'aprovada' ? 'var(--nagi-success-soft)' : (item.governanceStatus === 'em_analise' || item.governanceStatus === 'em_triagem') ? 'var(--nagi-warning-soft)' : 'var(--nagi-neutral-soft)',
              color: item.governanceStatus === 'aprovada' ? 'var(--nagi-success)' : (item.governanceStatus === 'em_analise' || item.governanceStatus === 'em_triagem') ? 'var(--nagi-warning)' : 'var(--nagi-muted)',
              fontWeight: 600,
            }}>
              {GOVERNANCE_STATUS_LABELS[item.governanceStatus] || item.governanceStatus}
            </span>
          )}
          {item.handoffRecord && (
            <span style={{ fontSize: 9, color: 'var(--nagi-muted)' }}>
              → {item.handoffRecord.targetModuleLabel}
            </span>
          )}
        </div>

        {/* Arrow */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--nagi-muted-light)', opacity: 0, transition: 'opacity 0.15s', flexShrink: 0 }}
          className="group-hover:opacity-100"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    ))}
    {items.length === 0 && <EmptyState title="Nenhum item encontrado" description="Tente ajustar os filtros." compact />}
  </div>
);

/* ── CatalogSection principal ───────────────────────── */

const CatalogSection: React.FC<CatalogSectionProps> = ({ items, onRefresh, onNavigate }) => {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [groupBy, setGroupBy] = useState<GroupBy>('type');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const setFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const handleTagClick = useCallback((tag: string) => {
    setFilter('tag', filters.tag === tag ? FILTER_ALL : tag);
  }, [filters.tag, setFilter]);

  // Derive unique categories from items
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return Array.from(set) as string[];
  }, [items]);

  // Filter pipeline
  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return items.filter((item) => {
      if (filters.type !== FILTER_ALL && item.itemType !== filters.type) return false;
      if (filters.category !== FILTER_ALL && item.category !== filters.category) return false;
      if (filters.status !== FILTER_ALL && item.operationalStatus !== filters.status) return false;
      if (filters.governance !== FILTER_ALL && item.governanceStatus !== filters.governance) return false;
      if (filters.priority !== FILTER_ALL && item.priority !== filters.priority) return false;
      if (filters.origin !== FILTER_ALL && item.originType !== filters.origin) return false;
      if (filters.tag !== FILTER_ALL && !item.tags.includes(filters.tag)) return false;
      if (!term) return true;
      return [item.title, item.summary, item.category, ...item.tags]
        .join(' ').toLowerCase().includes(term);
    });
  }, [items, filters]);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (filters.type !== FILTER_ALL) chips.push({ label: ITEM_TYPE_LABELS[filters.type as NagiItemType] || filters.type, onRemove: () => setFilter('type', FILTER_ALL) });
    if (filters.category !== FILTER_ALL) chips.push({ label: `Cat: ${filters.category}`, onRemove: () => setFilter('category', FILTER_ALL) });
    if (filters.status !== FILTER_ALL) chips.push({ label: OPERATIONAL_STATUS_LABELS[filters.status as NagiOperationalStatus] || filters.status, onRemove: () => setFilter('status', FILTER_ALL) });
    if (filters.governance !== FILTER_ALL) chips.push({ label: GOVERNANCE_STATUS_LABELS[filters.governance as NagiGovernanceStatus] || filters.governance, onRemove: () => setFilter('governance', FILTER_ALL) });
    if (filters.priority !== FILTER_ALL) chips.push({ label: `Prioridade: ${PRIORITY_LABELS[filters.priority as NagiPriority] || filters.priority}`, onRemove: () => setFilter('priority', FILTER_ALL) });
    if (filters.origin !== FILTER_ALL) chips.push({ label: ORIGIN_LABELS[filters.origin as NagiOriginType] || filters.origin, onRemove: () => setFilter('origin', FILTER_ALL) });
    if (filters.tag !== FILTER_ALL) chips.push({ label: `Tag: ${filters.tag}`, onRemove: () => setFilter('tag', FILTER_ALL) });
    return chips;
  }, [filters, setFilter]);

  const hasActiveFilters = activeChips.length > 0 || filters.search.trim();

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return items.find((i) => i.id === selectedId) ?? null;
  }, [items, selectedId]);

  if (items.length === 0) {
    return (
      <div className="pt-4">
        <EmptyState
          title="Nada no catálogo ainda"
          description="Itens aprovados na triagem aparecem aqui. Crie uma ideia ou promova um item elegível."
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Toolbar ──────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Primeira linha: busca + toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Busca */}
            <label className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--nagi-muted)', display: 'flex' }}>
                <SvgSearch />
              </span>
              <input
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                placeholder="Buscar no catálogo..."
                style={{
                  paddingLeft: 36, paddingRight: 12, height: 34,
                  borderRadius: 'var(--nagi-radius-md)',
                  border: `1px solid var(--nagi-line)`,
                  backgroundColor: 'var(--nagi-surface-soft)',
                  fontSize: 'var(--nagi-body)', outline: 'none',
                  minWidth: 200, color: 'var(--nagi-text)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--nagi-brand)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--nagi-line)'; }}
              />
            </label>

            {/* Filtros dropdown */}
            <FilterSelect value={filters.type} onChange={(v) => setFilter('type', v)}
              options={Object.entries(ITEM_TYPE_LABELS) as [string, string][]} placeholder="Todos os tipos" />
            <FilterSelect value={filters.status} onChange={(v) => setFilter('status', v)}
              options={Object.entries(OPERATIONAL_STATUS_LABELS) as [string, string][]} placeholder="Todos os status" />
            <FilterSelect value={filters.governance} onChange={(v) => setFilter('governance', v)}
              options={Object.entries(GOVERNANCE_STATUS_LABELS) as [string, string][]} placeholder="Governança" />
            <FilterSelect value={filters.priority} onChange={(v) => setFilter('priority', v)}
              options={Object.entries(PRIORITY_LABELS) as [string, string][]} placeholder="Prioridade" />

            {/* Category dropdown (dinâmico) */}
            {categories.length > 0 && (
              <FilterSelect value={filters.category} onChange={(v) => setFilter('category', v)}
                options={categories.map((c) => [c, c])} placeholder="Categoria" />
            )}
          </div>

          {/* View mode toggles + count */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5 rounded-[var(--nagi-radius-md)] p-0.5"
              style={{ backgroundColor: 'var(--nagi-neutral-soft)' }}
            >
              <ViewToggleBtn active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={<SvgGrid />} title="Cards" />
              <ViewToggleBtn active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={<SvgList />} title="Lista" />
              <ViewToggleBtn active={viewMode === 'grouped'} onClick={() => setViewMode('grouped')} icon={<SvgGroup />} title="Agrupado" />
              <ViewToggleBtn active={viewMode === 'explore'} onClick={() => setViewMode('explore')} icon={<SvgExplore />} title="Explorar" />
            </div>
            <span className="font-semibold uppercase tracking-[0.1em]"
              style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
            >
              {filtered.length} {filtered.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
        </div>

        {/* Segunda linha: categoria + origem (se viewMode não for explore) */}
        {viewMode !== 'explore' && (
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect value={filters.origin} onChange={(v) => setFilter('origin', v)}
              options={Object.entries(ORIGIN_LABELS) as [string, string][]} placeholder="Origem" />

            {/* GroupBy selector (only for grouped view) */}
            {viewMode === 'grouped' && (
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 9, color: 'var(--nagi-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Agrupar:
                </span>
                {(['type', 'category', 'status', 'priority'] as GroupBy[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroupBy(g)}
                    style={{
                      height: 26, padding: '0 10px',
                      borderRadius: 'var(--nagi-radius-sm)',
                      border: `1px solid ${groupBy === g ? 'var(--nagi-brand-line)' : 'var(--nagi-line)'}`,
                      backgroundColor: groupBy === g ? 'var(--nagi-brand-soft)' : 'transparent',
                      fontSize: 9, fontWeight: 600,
                      color: groupBy === g ? 'var(--nagi-brand)' : 'var(--nagi-muted)',
                      cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}
                  >
                    {g === 'type' ? 'Tipo' : g === 'category' ? 'Categoria' : g === 'status' ? 'Status' : 'Prioridade'}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip, i) => (
              <FilterChip key={i} label={chip.label} onRemove={chip.onRemove} />
            ))}
            <button onClick={clearFilters}
              style={{
                fontSize: 9, fontWeight: 600, color: 'var(--nagi-muted)',
                padding: '4px 8px', cursor: 'pointer',
                background: 'none', border: 'none', textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* ── Content: view mode ──────────────────────────── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <NagiItemCard
              key={item.id} item={item}
              variant={item.score.final >= 80 ? 'highlight' : 'default'}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full">
              <EmptyState title="Nenhum item encontrado" description="Tente ajustar os filtros ou a busca." compact />
            </div>
          )}
        </div>
      )}

      {viewMode === 'list' && (
        <ListView items={filtered} onSelect={setSelectedId} onTagClick={handleTagClick} />
      )}

      {viewMode === 'grouped' && (
        <GroupedView items={filtered} groupBy={groupBy} onSelect={setSelectedId} />
      )}

      {viewMode === 'explore' && (
        <ExploreView items={filtered} onSelect={setSelectedId} onTagClick={handleTagClick} />
      )}

      {/* ── Detail panel ────────────────────────────── */}
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

/* ── ViewToggleBtn ──────────────────────────────────── */

const ViewToggleBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; title: string }> = ({ active, onClick, icon, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      padding: '4px 8px',
      borderRadius: 'var(--nagi-radius-sm)',
      backgroundColor: active ? 'var(--nagi-surface)' : 'transparent',
      color: active ? 'var(--nagi-text)' : 'var(--nagi-muted)',
      border: 'none', cursor: 'pointer', display: 'flex',
    }}
  >
    {icon}
  </button>
);

export default CatalogSection;
