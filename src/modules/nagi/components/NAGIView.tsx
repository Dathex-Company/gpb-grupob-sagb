import React, { useDeferredValue, useMemo, useState } from 'react';
import { TabId } from '../../../../types';
import { BackIcon, SearchIcon } from '../../../../components/Icon';
import {
  CATEGORY_OPTIONS,
  INITIATIVES,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  operationalMeta,
  priorityTone,
  statusTone,
  InitiativeCategory,
  InitiativePriority,
  InitiativeStatus,
  OperationalState
} from '../data/nagiBlueprint';

interface NAGIViewProps {
  onBack?: () => void;
  onOpenTab?: (tab: TabId) => void;
}

/* dados movidos para ../data/nagiBlueprint.ts */

const TogglePill: React.FC<{ state: OperationalState }> = ({ state }) => {
  const meta = operationalMeta[state];
  return (
    <div className={`relative inline-flex items-center w-[72px] h-9 rounded-full px-2 transition-colors ${meta.on ? 'bg-emerald-500' : state === 'inactive' ? 'bg-slate-700' : 'bg-slate-400'}`}>
      <span className={`absolute inset-y-1 w-7 h-7 rounded-full bg-white shadow-sm transition-transform ${meta.on ? 'translate-x-[34px]' : 'translate-x-0'}`} />
      <span className={`relative z-10 text-[10px] font-black uppercase tracking-[0.24em] text-white ${meta.on ? 'ml-auto mr-1' : 'ml-1'}`}>
        {meta.on ? 'ON' : 'OFF'}
      </span>
    </div>
  );
};

const InfoList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
    <h3 className="text-xl font-black tracking-tight text-slate-950 mb-4">{title}</h3>
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
          <span className="mt-2 w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  </section>
);

const NAGIView: React.FC<NAGIViewProps> = ({ onBack, onOpenTab }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InitiativeStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | InitiativeCategory>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | InitiativePriority>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const initiatives = INITIATIVES;
  const selected = initiatives.find((initiative) => initiative.id === selectedId) || null;

  const filtered = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    return initiatives.filter((initiative) => {
      if (statusFilter !== 'all' && initiative.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && initiative.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && initiative.priority !== priorityFilter) return false;
      if (!term) return true;
      return [
        initiative.title,
        initiative.shortDescription,
        initiative.category,
        initiative.status,
        initiative.heroDescription
      ].join(' ').toLowerCase().includes(term);
    });
  }, [initiatives, deferredSearch, statusFilter, categoryFilter, priorityFilter]);

  const statusCounts = useMemo(() => {
    const counts = new Map<InitiativeStatus, number>();
    initiatives.forEach((initiative) => counts.set(initiative.status, (counts.get(initiative.status) || 0) + 1));
    return counts;
  }, [initiatives]);

  const operationalCounts = useMemo(() => {
    const active = initiatives.filter((initiative) => operationalMeta[initiative.operationalState].on).length;
    return { active, inactive: initiatives.length - active };
  }, [initiatives]);

  if (selected) {
    const stateMeta = operationalMeta[selected.operationalState];
    return (
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_100%)]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-8 space-y-8">
          <header className="rounded-[34px] bg-slate-950 text-white shadow-[0_32px_90px_rgba(15,23,42,0.22)] overflow-hidden">
            <div className="px-8 md:px-10 py-8">
              <button onClick={() => setSelectedId(null)} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] font-black text-cyan-300 mb-5">
                <BackIcon className="w-4 h-4" /> Voltar ao hub
              </button>
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                <div className="max-w-4xl">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-300 block mb-3">NAGI / Iniciativa</span>
                  <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em]">{selected.title}</h1>
                  <p className="text-slate-300 text-lg leading-8 mt-4">{selected.heroDescription}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-[300px]">
                  <div className={`rounded-[24px] border px-4 py-4 ${statusTone[selected.status]}`}>
                    <span className="text-[10px] uppercase tracking-[0.28em] font-black opacity-70 block mb-1">Status</span>
                    <strong className="text-base font-black">{selected.status}</strong>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                    <span className="text-[10px] uppercase tracking-[0.28em] font-black text-slate-400 block mb-1">Categoria</span>
                    <strong className="text-base font-black">{selected.category}</strong>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                    <span className="text-[10px] uppercase tracking-[0.28em] font-black text-slate-400 block mb-1">Prioridade</span>
                    <strong className={`text-base font-black ${selected.priority === 'Alta' ? 'text-rose-300' : selected.priority === 'Média' ? 'text-amber-300' : 'text-slate-200'}`}>{selected.priority}</strong>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                    <span className="text-[10px] uppercase tracking-[0.28em] font-black text-slate-400 block mb-1">Vínculo</span>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${stateMeta.dot}`} />
                        <strong className="text-base font-black">{stateMeta.label}</strong>
                      </div>
                      <TogglePill state={selected.operationalState} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <span className="text-[10px] uppercase tracking-[0.35em] font-black text-slate-400 block mb-3">Visão Geral</span>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 mb-4">O que é, para que serve e valor atual</h2>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                {selected.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="rounded-[22px] border border-cyan-100 bg-cyan-50 px-4 py-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] font-black text-cyan-700 mb-2">Valor do projeto</div>
                  <p className="text-sm leading-7 text-cyan-900">{selected.value}</p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] font-black text-slate-500 mb-2">Estágio atual</div>
                  <p className="text-sm leading-7 text-slate-700">{selected.currentStage}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <span className="text-[10px] uppercase tracking-[0.35em] font-black text-slate-400 block mb-3">Estrutura</span>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 mb-4">Entradas, processamento, saídas e integrações</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Entradas', items: selected.structure.inputs },
                  { title: 'Processamento', items: selected.structure.processing },
                  { title: 'Saídas', items: selected.structure.outputs },
                  { title: 'Integrações', items: selected.structure.integrations }
                ].map((block) => (
                  <div key={block.title} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[10px] uppercase tracking-[0.24em] font-black text-slate-500 mb-3">{block.title}</div>
                    <div className="space-y-2">
                      {block.items.map((item) => (
                        <div key={item} className="text-sm leading-6 text-slate-700">{item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <InfoList title="O que já foi feito" items={selected.completed} />
            <InfoList title="Próximos passos" items={selected.nextSteps} />
            <InfoList title="Documentos e decisões" items={selected.documentsAndDecisions} />
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] font-black text-slate-400 block mb-3">Conexão com SagB</span>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Vínculo do projeto com o ecossistema</h2>
                <p className="text-sm leading-7 text-slate-600 mt-3">
                  Esta iniciativa existe dentro do NAGI como frente estratégica do ecossistema e pode se desdobrar em módulo real do SagB conforme sua maturidade operacional.
                </p>
              </div>
              {selected.routeTab && onOpenTab && (
                <button
                  onClick={() => onOpenTab(selected.routeTab!)}
                  className="px-5 py-3 rounded-2xl bg-slate-950 text-white font-black tracking-tight hover:bg-slate-800 transition-colors"
                >
                  Abrir módulo real no SagB
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_100%)]">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-8 space-y-8">
        <header className="rounded-[34px] border border-white/70 bg-slate-950 text-white shadow-[0_32px_90px_rgba(15,23,42,0.22)] overflow-hidden">
          <div className="px-8 md:px-10 py-8">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div className="max-w-4xl">
                {onBack && (
                  <button onClick={onBack} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] font-black text-cyan-300 mb-5">
                    <BackIcon className="w-4 h-4" /> Voltar ao ecossistema
                  </button>
                )}
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-300 block mb-3">Hub Estrutural</span>
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em]">NAGI</h1>
                <p className="text-slate-300 text-lg leading-8 mt-4">
                  Plataforma-mãe de captação, memória, transcrição e inteligência operacional.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-[320px]">
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <span className="text-[10px] uppercase tracking-[0.28em] font-black text-slate-400 block mb-1">Frentes</span>
                  <strong className="text-3xl font-black tracking-tight">{initiatives.length}</strong>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <span className="text-[10px] uppercase tracking-[0.28em] font-black text-slate-400 block mb-1">Ligadas</span>
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-3xl font-black tracking-tight">{operationalCounts.active}</strong>
                    <TogglePill state="active" />
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <span className="text-[10px] uppercase tracking-[0.28em] font-black text-slate-400 block mb-1">Desligadas</span>
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-3xl font-black tracking-tight">{operationalCounts.inactive}</strong>
                    <TogglePill state="inactive" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[30px] border border-white/80 bg-white/85 backdrop-blur-xl p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <label className="relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar iniciativa, categoria ou descrição..."
                  className="pl-10 pr-3 py-3 rounded-2xl border border-slate-200 bg-white text-sm min-w-[260px]"
                />
              </label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | InitiativeStatus)} className="px-3 py-3 rounded-2xl border border-slate-200 bg-white text-sm">
                <option value="all">Todos os status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status} ({statusCounts.get(status) || 0})</option>
                ))}
              </select>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as 'all' | InitiativeCategory)} className="px-3 py-3 rounded-2xl border border-slate-200 bg-white text-sm">
                <option value="all">Todas as categorias</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as 'all' | InitiativePriority)} className="px-3 py-3 rounded-2xl border border-slate-200 bg-white text-sm">
                <option value="all">Todas as prioridades</option>
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <button className="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-black tracking-tight cursor-default">
              Adicionar iniciativa depois
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {filtered.map((initiative) => {
            const stateMeta = operationalMeta[initiative.operationalState];
            return (
              <button
                key={initiative.id}
                onClick={() => setSelectedId(initiative.id)}
                className={`group min-h-[228px] rounded-[28px] border p-4 text-left bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] transition-all ${initiative.featured ? 'border-cyan-300 ring-1 ring-cyan-200' : 'border-slate-200'} ${stateMeta.card}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] font-black ${statusTone[initiative.status]}`}>
                    <span className={`w-2 h-2 rounded-full ${stateMeta.dot}`} />
                    {initiative.status}
                  </div>
                  <TogglePill state={initiative.operationalState} />
                </div>

                <div className="mb-4">
                  <h3 className="text-[20px] leading-6 font-black tracking-tight text-slate-950 mb-2">{initiative.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{initiative.shortDescription}</p>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="text-[10px] uppercase tracking-[0.24em] font-black text-slate-400">{initiative.category}</div>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-xs font-black uppercase tracking-[0.18em] ${priorityTone[initiative.priority]}`}>Prioridade {initiative.priority}</span>
                    {initiative.featured && <span className="text-[10px] uppercase tracking-[0.24em] font-black text-cyan-700">Primeiro módulo real</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default NAGIView;
