import React, { useMemo, useState } from 'react';
import { SearchIcon } from '../../../../components/Icon';
import {
  NagiItem,
  NagiItemType,
  NagiOperationalStatus,
  ITEM_TYPE_LABELS,
  OPERATIONAL_STATUS_LABELS,
  HANDOFF_STATUS_LABELS,
} from '../domain/types';
import NagiItemDetail from './NagiItemDetail';

interface CatalogSectionProps {
  items: NagiItem[];
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

const FILTER_ALL = 'todos' as const;

const CatalogSection: React.FC<CatalogSectionProps> = ({ items, onRefresh, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(FILTER_ALL);
  const [opFilter, setOpFilter] = useState<string>(FILTER_ALL);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter !== FILTER_ALL && item.itemType !== typeFilter) return false;
      if (opFilter !== FILTER_ALL && item.operationalStatus !== opFilter) return false;
      if (!term) return true;
      return [item.title, item.summary, item.category, ...item.tags]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [items, search, typeFilter, opFilter]);

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

  return (
    <div className="space-y-4">
      {/* Filtros — Alice UI: inputs discretos, bordas finas */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <label className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar no catálogo…"
              className="pl-10 pr-3 h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm outline-none focus:border-slate-400 transition-colors min-w-[200px]"
            />
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm outline-none focus:border-slate-400"
          >
            <option value={FILTER_ALL}>Todos os tipos</option>
            {(Object.entries(ITEM_TYPE_LABELS) as [NagiItemType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={opFilter}
            onChange={(e) => setOpFilter(e.target.value)}
            className="px-3 h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm outline-none focus:border-slate-400"
          >
            <option value={FILTER_ALL}>Todos os status</option>
            {(Object.entries(OPERATIONAL_STATUS_LABELS) as [NagiOperationalStatus, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-slate-400">
          {filtered.length} itens
        </span>
      </div>

      {/* Grid de cards — Alice UI: radius 22px, padding 15px, borda fina */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className="group min-h-[124px] rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-4 text-left hover:shadow-md hover:border-slate-300 transition-all"
          >
            {/* Linha de badges */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-[8px] bg-emerald-50 text-emerald-700 px-2 h-6 text-[10px] font-semibold uppercase tracking-[0.06em]">
                {ITEM_TYPE_LABELS[item.itemType]}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-[0.06em] ${
                item.priority === 'alta' ? 'text-rose-500' :
                item.priority === 'media' ? 'text-amber-500' : 'text-slate-400'
              }`}>
                {item.priority === 'alta' ? 'Alta' : item.priority === 'media' ? 'Média' : 'Baixa'}
              </span>
            </div>

            {/* Título */}
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-slate-950 mb-1 line-clamp-2">
              {item.title}
            </h3>

            {/* Descrição */}
            <p className="text-[11px] leading-5 text-slate-500 mb-3 line-clamp-2">
              {item.summary}
            </p>

            {/* Rodapé do card */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  item.operationalStatus === 'concluido' ? 'bg-emerald-400' :
                  item.operationalStatus === 'em_execucao' || item.operationalStatus === 'em_teste' ? 'bg-amber-400' :
                  'bg-slate-300'
                }`} />
                {OPERATIONAL_STATUS_LABELS[item.operationalStatus]}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-cyan-600">
                  {item.category}
                </span>
                {item.handoffRecord && (
                  <span className="text-[10px] text-slate-400">
                    → {item.handoffRecord.targetModuleLabel}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-[22px] border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-400">Nenhum item encontrado no catálogo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogSection;
