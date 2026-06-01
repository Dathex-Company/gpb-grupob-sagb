import React, { useMemo, useState } from 'react';
import { SearchIcon } from '../../../../components/Icon';
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
import NagiItemDetail from './NagiItemDetail';

interface TriageSectionProps {
  items: NagiItem[];
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

/* Alice UI: chips clean com cor suave */
const maturityTone: Record<NagiMaturityStage, string> = {
  entrada: 'bg-slate-50 text-slate-600 border-slate-200',
  classificacao: 'bg-blue-50 text-blue-700 border-blue-200',
  qualificacao: 'bg-amber-50 text-amber-700 border-amber-200',
  priorizacao: 'bg-purple-50 text-purple-700 border-purple-200',
  decisao: 'bg-rose-50 text-rose-700 border-rose-200',
  encaminhada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  catalogada: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const governanceBadge: Record<NagiGovernanceStatus, { label: string; tone: string }> = {
  em_triagem: { label: 'Em triagem', tone: 'bg-slate-50 text-slate-600 border-slate-200' },
  em_analise: { label: 'Em análise', tone: 'bg-blue-50 text-blue-700 border-blue-200' },
  aprovada: { label: 'Aprovada', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejeitada: { label: 'Rejeitada', tone: 'bg-red-50 text-red-700 border-red-200' },
  incubada: { label: 'Incubada', tone: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  arquivada: { label: 'Arquivada', tone: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const TriageSection: React.FC<TriageSectionProps> = ({ items, onRefresh, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [originFilter, setOriginFilter] = useState<string>('todas');
  const [stageFilter, setStageFilter] = useState<string>('todas');
  const [priorityFilter, setPriorityFilter] = useState<string>('todas');
  const [govFilter, setGovFilter] = useState<string>('todas');
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const selected = selectedId ? items.find((i) => i.id === selectedId) ?? null : null;
  if (selected) {
    return (
      <NagiItemDetail
        item={selected}
        onBack={() => setSelectedId(null)}
        onRefresh={onRefresh}
        onNavigate={onNavigate}
      />
    );
  }

  /* Agrupar por estágio */
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

  return (
    <div className="space-y-4">
      {/* Filtros — Alice UI */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <label className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar na triagem…"
              className="pl-10 pr-3 h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm outline-none focus:border-slate-400 transition-colors min-w-[180px]"
            />
          </label>
          <select value={originFilter} onChange={(e) => setOriginFilter(e.target.value)}
            className="px-3 h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm outline-none focus:border-slate-400">
            <option value="todas">Todas origens</option>
            {(Object.entries(ORIGIN_LABELS) as [NagiOriginType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm outline-none focus:border-slate-400">
            <option value="todas">Todos estágios</option>
            {(Object.entries(MATURITY_LABELS) as [NagiMaturityStage, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm outline-none focus:border-slate-400">
            <option value="todas">Todas prioridades</option>
            {(Object.entries(PRIORITY_LABELS) as [NagiPriority, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={govFilter} onChange={(e) => setGovFilter(e.target.value)}
            className="px-3 h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm outline-none focus:border-slate-400">
            <option value="todas">Toda governança</option>
            {(Object.entries(GOVERNANCE_STATUS_LABELS) as [NagiGovernanceStatus, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-slate-400">
          {filtered.length} ideias
        </span>
      </div>

      {/* Pipeline por colunas — Alice UI: cards compactos */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {MATURITY_STAGES.map((stage) => {
          const stageItems = byStage.get(stage) ?? [];
          return (
            <div key={stage} className="space-y-2">
              {/* Cabeçalho da coluna — chip Alice UI */}
              <div className={`rounded-[8px] px-2.5 h-6 text-[10px] font-semibold uppercase tracking-[0.06em] flex items-center gap-1 ${maturityTone[stage]}`}>
                {MATURITY_LABELS[stage]}
                <span className="ml-auto opacity-60">({stageItems.length})</span>
              </div>
              <p className="text-[9px] text-slate-400 px-1 leading-3">{MATURITY_DESCRIPTIONS[stage]}</p>

              <div className="space-y-1.5">
                {stageItems.map((item) => {
                  const gov = governanceBadge[item.governanceStatus];
                  const elegivel = item.promotionStatus === 'elegivel';
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className="w-full rounded-[18px] border border-[rgba(102,91,83,0.11)] bg-white p-3 text-left hover:shadow-sm hover:border-slate-300 transition-all"
                    >
                      {/* Badge de governança + prioridade */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className={`text-[9px] px-1.5 h-4 rounded-[4px] font-semibold uppercase tracking-[0.04em] leading-4 ${gov.tone}`}>
                          {gov.label}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase ${
                          item.priority === 'alta' ? 'text-rose-500' :
                          item.priority === 'media' ? 'text-amber-500' : 'text-slate-400'
                        }`}>
                          {PRIORITY_LABELS[item.priority]}
                        </span>
                      </div>

                      <h4 className="text-[12px] font-semibold tracking-[-0.01em] text-slate-950 mb-0.5 line-clamp-2">{item.title}</h4>
                      <p className="text-[10px] leading-4 text-slate-500 line-clamp-2">{item.summary}</p>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-semibold text-cyan-600 uppercase tracking-[0.04em]">
                          {ORIGIN_LABELS[item.originType]}
                        </span>
                        {item.score.final > 0 && (
                          <span className="text-[9px] text-slate-400">· {item.score.final}</span>
                        )}
                        {elegivel && (
                          <span className="ml-auto text-[9px] font-semibold text-emerald-600">★ Elegível</span>
                        )}
                      </div>
                    </button>
                  );
                })}
                {stageItems.length === 0 && (
                  <div className="rounded-[16px] border border-dashed border-[rgba(102,91,83,0.07)] bg-white/40 p-3 text-center">
                    <span className="text-[10px] text-slate-300">—</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TriageSection;
