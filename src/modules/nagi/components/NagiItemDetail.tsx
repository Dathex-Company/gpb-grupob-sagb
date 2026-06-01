import React, { useState } from 'react';
import { BackIcon } from '../../../../components/Icon';
import {
  NagiItem,
  NagiItemType,
  NagiPriority,
  NagiGovernanceStatus,
  ITEM_TYPE_LABELS,
  MATURITY_LABELS,
  MATURITY_DESCRIPTIONS,
  PRIORITY_LABELS,
  OPERATIONAL_STATUS_LABELS,
  GOVERNANCE_STATUS_LABELS,
  GOVERNANCE_SUBTEXT,
  ORIGIN_LABELS,
  PROMOTION_STATUS_LABELS,
  HANDOFF_STATUS_LABELS,
  calculateFinalScore,
  isEligibleForPromotion,
} from '../domain/types';
import {
  classifyItem,
  qualifyItem,
  prioritizeItem,
  decideItem,
} from '../services/nagiService';
import { promoteToCatalog } from '../services/nagiPromotionService';
import { sendToSpecialist, updateHandoffStatus } from '../services/nagiHandoffService';
import { TabId } from '../../../../types';

interface NagiItemDetailProps {
  item: NagiItem;
  onBack: () => void;
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

/* ── Modal (Alice UI: radius 24px) ────────────── */

const Modal: React.FC<{ open: boolean; title: string; onClose: () => void; children: React.ReactNode }> = ({
  open, title, onClose, children,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[24px] shadow-lg max-w-lg w-full mx-4 p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-slate-950">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ── Componente principal ────────────────────── */

const NagiItemDetail: React.FC<NagiItemDetailProps> = ({ item, onBack, onRefresh, onNavigate }) => {
  const [mode, setMode] = useState<'view' | 'classify' | 'qualify' | 'decide' | 'encaminhar' | 'promover' | 'handoff_status'>('view');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const user = 'Cássio';

  const show = (type: 'ok' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const eligible = isEligibleForPromotion(item);

  /* ── Ações ──────────────────────────────────── */

  const handleClassify = (itemType: NagiItemType, category: string, tags: string) => {
    const r = classifyItem(item.id, { itemType, category, tags: tags.split(',').map(t => t.trim()).filter(Boolean) }, user);
    if (r) { show('ok', 'Classificação salva!'); setMode('view'); onRefresh(); }
  };

  const handleQualify = (impact: number, effort: number, risk: number, alignment: number) => {
    const r = qualifyItem(item.id, { impact, effort, risk, alignment }, user);
    if (r) { show('ok', `Score final: ${r.score.final}/100`); setMode('view'); onRefresh(); }
  };

  const handlePrioritize = (priority: NagiPriority) => {
    const r = prioritizeItem(item.id, priority, user);
    if (r) { show('ok', `Prioridade: ${PRIORITY_LABELS[priority]}`); onRefresh(); }
  };

  const handleDecide = (govStatus: NagiGovernanceStatus, rationale: string) => {
    const r = decideItem(item.id, { governanceStatus: govStatus, rationale }, user);
    if (r) { show('ok', `Decisão registrada: ${GOVERNANCE_STATUS_LABELS[govStatus]}`); setMode('view'); onRefresh(); }
  };

  const handlePromote = () => {
    const r = promoteToCatalog(item.id, user);
    if (r.success) { show('ok', 'Item promovido ao catálogo!'); onRefresh(); }
    else { show('error', r.reason ?? 'Não foi possível promover.'); }
  };

  const handleEncaminhar = (tab: TabId, label: string, reason: string) => {
    const r = sendToSpecialist({ itemId: item.id, targetTab: tab, targetLabel: label, reason, by: user });
    if (r.success) { show('ok', `Enviado para ${label}!`); setMode('view'); onRefresh(); }
    else { show('error', r.reason ?? 'Erro ao encaminhar.'); }
  };

  const handleHandoffStatus = (status: 'recebido' | 'processado' | 'finalizado', note?: string) => {
    const r = updateHandoffStatus(item.id, status, note, user);
    if (r) { show('ok', `Status do handoff: ${HANDOFF_STATUS_LABELS[status]}`); setMode('view'); onRefresh(); }
  };

  /* ── Utilitários visuais ────────────────────── */

  const scoreBar = (label: string, value: number) => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${value >= 4 ? 'bg-emerald-400' : value >= 2 ? 'bg-amber-400' : 'bg-rose-400'}`}
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-500 w-4 text-right">{value}</span>
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Mensagem */}
      {message && (
        <div className={`rounded-[16px] px-4 py-3 text-sm font-semibold ${
          message.type === 'ok' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header do item — Alice UI: clean, sem dark pesado */}
      <header className="rounded-[24px] border border-[rgba(102,91,83,0.11)] bg-white overflow-hidden shadow-sm">
        <div className="px-6 md:px-8 py-6">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-semibold text-cyan-600 mb-4">
            <BackIcon className="w-3.5 h-3.5" /> Voltar
          </button>

          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
            <div className="max-w-2xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {item.isCatalog ? (
                  <span className="rounded-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 h-6 text-[10px] font-semibold uppercase tracking-[0.04em] flex items-center">
                    Catálogo
                  </span>
                ) : (
                  <span className="rounded-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-2 h-6 text-[10px] font-semibold uppercase tracking-[0.04em] flex items-center">
                    Triagem
                  </span>
                )}
                <span className="rounded-[8px] bg-slate-50 text-slate-600 border border-slate-200 px-2 h-6 text-[10px] font-semibold uppercase tracking-[0.04em] flex items-center">
                  {ITEM_TYPE_LABELS[item.itemType]}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.04em] font-semibold">
                  {ORIGIN_LABELS[item.originType]}
                </span>
              </div>

              <h1 className="text-[23px] font-extrabold tracking-[-0.028em] text-slate-950">{item.title}</h1>
              <p className="text-[13px] leading-6 text-slate-500 mt-2">{item.summary}</p>

              {/* Responsável + categoria */}
              <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-slate-400">
                <span><strong className="font-semibold text-slate-600">Responsável:</strong> {item.ownerName || '—'}</span>
                <span><strong className="font-semibold text-slate-600">Categoria:</strong> {item.category}</span>
                {item.tags.length > 0 && (
                  <span><strong className="font-semibold text-slate-600">Tags:</strong> {item.tags.join(', ')}</span>
                )}
              </div>
            </div>

            {/* Métricas compactas — Alice UI */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-w-[240px]">
              <MetricCard label="Maturidade" value={MATURITY_LABELS[item.maturityStage]} sub={MATURITY_DESCRIPTIONS[item.maturityStage]} />
              <MetricCard label="Governança" value={GOVERNANCE_STATUS_LABELS[item.governanceStatus]} sub={GOVERNANCE_SUBTEXT[item.governanceStatus]}
                highlight={item.governanceStatus === 'aprovada' ? 'emerald' : item.governanceStatus === 'rejeitada' ? 'rose' : undefined} />
              <MetricCard label="Score" value={`${item.score.final}/100`} sub="0-100"
                highlight={item.score.final >= 80 ? 'emerald' : item.score.final >= 50 ? 'amber' : undefined} />
              <MetricCard label="Prioridade" value={PRIORITY_LABELS[item.priority]}
                highlight={item.priority === 'alta' ? 'rose' : item.priority === 'media' ? 'amber' : undefined} />
              <MetricCard label="Operacional" value={OPERATIONAL_STATUS_LABELS[item.operationalStatus]} />
              <MetricCard label="Promoção" value={PROMOTION_STATUS_LABELS[item.promotionStatus]}
                highlight={item.promotionStatus === 'promovida' ? 'emerald' : item.promotionStatus === 'elegivel' ? 'amber' : undefined} />
            </div>
          </div>
        </div>
      </header>

      {/* Score detalhado — Alice UI: compacto */}
      {item.score.final > 0 && (
        <section className="rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.08em] font-semibold text-slate-400 block mb-3">Score detalhado</span>
          <div className="space-y-2 max-w-md">
            {scoreBar('Impacto', item.score.impact)}
            {scoreBar('Esforço', item.score.effort)}
            {scoreBar('Risco', item.score.risk)}
            {scoreBar('Alinhamento', item.score.alignment)}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-400 w-20 shrink-0">Final</span>
              <span className={`text-lg font-bold ${item.score.final >= 80 ? 'text-emerald-600' : item.score.final >= 50 ? 'text-amber-600' : 'text-slate-500'}`}>
                {item.score.final}
              </span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Atualizado em {new Date(item.score.updatedAt).toLocaleString('pt-BR')}</p>
        </section>
      )}

      {/* Origem (NIC) */}
      {item.originSnapshot && (
        <section className="rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.08em] font-semibold text-slate-400 block mb-2">Origem</span>
          <div className="rounded-[16px] bg-slate-50 border border-slate-200 p-4">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.04em] block mb-1">
              {ORIGIN_LABELS[item.originType]} {item.originRefId ? `· ${item.originRefId}` : ''}
            </span>
            <p className="text-[12px] leading-6 text-slate-600">{item.originSnapshot}</p>
          </div>
        </section>
      )}

      {/* Handoff / Destino especialista — Alice UI: clean */}
      {item.handoffRecord && (
        <section className="rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.08em] font-semibold text-slate-400 block mb-2">Encaminhamento para especialista</span>
          <div className="rounded-[16px] bg-cyan-50 border border-cyan-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <strong className="text-[15px] font-semibold tracking-[-0.01em] text-slate-950">{item.handoffRecord.targetModuleLabel}</strong>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                  <span className="rounded-[6px] bg-white px-2 h-5 flex items-center text-[10px] font-semibold uppercase tracking-[0.04em] text-slate-600 border border-slate-200">
                    {HANDOFF_STATUS_LABELS[item.handoffRecord.status]}
                  </span>
                  <span>Enviado em {new Date(item.handoffRecord.routedAt).toLocaleDateString('pt-BR')}</span>
                </div>
                {item.handoffRecord.specialistNote && (
                  <p className="text-[11px] text-slate-500 mt-2 italic">"{item.handoffRecord.specialistNote}"</p>
                )}
              </div>
              <button
                onClick={() => onNavigate(item.handoffRecord!.targetModuleTab)}
                className="h-[37px] px-4 rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-slate-800 transition-colors shrink-0"
              >
                Abrir módulo
              </button>
            </div>
            {/* Atualização de status do handoff (só para gestores) */}
            {item.handoffRecord.status !== 'finalizado' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-cyan-200">
                {item.handoffRecord.status === 'encaminhado' && (
                  <button onClick={() => handleHandoffStatus('recebido', 'Recebido pelo módulo especialista.')}
                    className="h-[30px] px-3 rounded-[10px] bg-cyan-600 text-white text-[10px] font-semibold uppercase tracking-[0.04em] hover:bg-cyan-700">
                    Marcar como recebido
                  </button>
                )}
                {item.handoffRecord.status === 'recebido' && (
                  <button onClick={() => handleHandoffStatus('processado', 'Em processo de análise.')}
                    className="h-[30px] px-3 rounded-[10px] bg-amber-500 text-white text-[10px] font-semibold uppercase tracking-[0.04em] hover:bg-amber-600">
                    Marcar em processo
                  </button>
                )}
                {item.handoffRecord.status === 'processado' && (
                  <button onClick={() => handleHandoffStatus('finalizado', 'Trabalho concluído pelo módulo.')}
                    className="h-[30px] px-3 rounded-[10px] bg-emerald-500 text-white text-[10px] font-semibold uppercase tracking-[0.04em] hover:bg-emerald-600">
                    Finalizar handoff
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Evidências */}
      {item.evidences.length > 0 && (
        <section className="rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.08em] font-semibold text-slate-400 block mb-2">
            Evidências ({item.evidences.length})
          </span>
          <div className="space-y-1.5">
            {item.evidences.map((ev) => (
              <div key={ev.id} className="flex items-start gap-2.5 rounded-[14px] bg-slate-50 border border-slate-200 px-3.5 py-2.5">
                <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  ev.type === 'doc' ? 'bg-blue-400' :
                  ev.type === 'audio' ? 'bg-green-400' :
                  ev.type === 'link' ? 'bg-purple-400' : 'bg-amber-400'
                }`} />
                <div>
                  <span className="text-[12px] font-semibold text-slate-700">{ev.label}</span>
                  {ev.excerpt && <p className="text-[10px] text-slate-500 mt-0.5">{ev.excerpt}</p>}
                  {ev.uri && <p className="text-[10px] text-cyan-600 font-semibold mt-0.5">{ev.uri}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Histórico de decisão */}
      {item.decisionHistory.length > 0 && (
        <section className="rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.08em] font-semibold text-slate-400 block mb-3">
            Histórico ({item.decisionHistory.length})
          </span>
          <div className="space-y-1.5">
            {[...item.decisionHistory].reverse().map((dec) => (
              <div key={dec.id} className="flex items-start gap-2.5 rounded-[14px] border border-slate-200 px-3.5 py-2.5">
                <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  dec.action === 'aprovar' || dec.action === 'encaminhar' || dec.action === 'promover' ? 'bg-emerald-400' :
                  dec.action === 'rejeitar' || dec.action === 'arquivar' ? 'bg-rose-400' :
                  dec.action === 'incubar' ? 'bg-fuchsia-400' :
                  'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-700">{dec.action}</span>
                    <span className="text-[10px] text-slate-400">— {dec.by}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">{new Date(dec.at).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{dec.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ações de governança — Alice UI: botões padronizados */}
      <section className="rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-5 shadow-sm">
        <span className="text-[10px] uppercase tracking-[0.08em] font-semibold text-slate-400 block mb-3">Ações disponíveis</span>
        <div className="flex flex-wrap gap-2">
          {!item.isCatalog && (
            <>
              <ActionBtn label="Classificar" onClick={() => setMode('classify')} tone="blue" />
              <ActionBtn label="Qualificar" onClick={() => setMode('qualify')} tone="amber" />
              <ActionBtn
                label={`Prioridade: ${PRIORITY_LABELS[item.priority]}`}
                onClick={() => handlePrioritize(item.priority === 'alta' ? 'media' : item.priority === 'media' ? 'baixa' : 'alta')}
                tone="purple"
              />
              <ActionBtn label="Decidir" onClick={() => setMode('decide')} tone="rose" />
              {/* Promoção para catálogo */}
              {eligible && (
                <ActionBtn label="★ Promover ao catálogo" onClick={handlePromote} tone="emerald" />
              )}
              {!eligible && item.governanceStatus === 'aprovada' && item.itemType === 'ideia' && (
                <span className="text-[10px] text-slate-400 flex items-center px-2">Ideias não podem ser promovidas diretamente</span>
              )}
              {!eligible && item.governanceStatus === 'aprovada' && item.score.final < 50 && (
                <span className="text-[10px] text-slate-400 flex items-center px-2">Score mínimo (50) não atingido</span>
              )}
              {/* Encaminhamento */}
              {(item.governanceStatus === 'aprovada' || item.governanceStatus === 'incubada') && (
                <ActionBtn label="Encaminhar" onClick={() => setMode('encaminhar')} tone="emerald" />
              )}
            </>
          )}
          {item.isCatalog && (
            <span className="text-[11px] text-slate-400 italic">Item do catálogo. Use a seção de governança no módulo especialista para alterações.</span>
          )}
        </div>
      </section>

      {/* Formulários modais */}
      <Modal open={mode === 'classify'} title="Classificar" onClose={() => setMode('view')}>
        <ClassifyForm currentType={item.itemType} currentCategory={item.category} currentTags={item.tags.join(', ')} onSubmit={handleClassify} />
      </Modal>
      <Modal open={mode === 'qualify'} title="Qualificar" onClose={() => setMode('view')}>
        <QualifyForm current={item.score} onSubmit={handleQualify} />
      </Modal>
      <Modal open={mode === 'decide'} title="Decisão" onClose={() => setMode('view')}>
        <DecideForm currentGov={item.governanceStatus} onSubmit={handleDecide} />
      </Modal>
      <Modal open={mode === 'encaminhar'} title="Encaminhar para especialista" onClose={() => setMode('view')}>
        <EncaminharForm onSubmit={handleEncaminhar} />
      </Modal>
    </div>
  );
};

/* ── Subcomponentes ───────────────────────────── */

const MetricCard: React.FC<{ label: string; value: string; sub?: string; highlight?: 'emerald' | 'amber' | 'rose' | 'blue' }> = ({
  label, value, sub, highlight,
}) => (
  <div className="rounded-[16px] border border-[rgba(102,91,83,0.07)] bg-white px-3 py-2.5">
    <span className="text-[8px] uppercase tracking-[0.1em] font-semibold text-slate-400 block mb-0.5">{label}</span>
    <strong className={`text-[13px] font-bold ${
      highlight === 'emerald' ? 'text-emerald-600' :
      highlight === 'amber' ? 'text-amber-600' :
      highlight === 'rose' ? 'text-rose-600' :
      'text-slate-800'
    }`}>{value}</strong>
    {sub && <span className="text-[9px] text-slate-400 block">{sub}</span>}
  </div>
);

const ActionBtn: React.FC<{ label: string; onClick: () => void; tone: string; disabled?: boolean }> = ({
  label, onClick, tone, disabled,
}) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-[37px] px-4 rounded-[14px] border text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors ${colors[tone] ?? colors.blue} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
};

/* ── Slider (Alice UI: clean) ─────────────────── */

const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500">{label}</label>
      <span className="text-[11px] font-semibold text-slate-600">{value}/5</span>
    </div>
    <input type="range" min={0} max={5} step={1} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-slate-950 h-1.5" />
  </div>
);

/* ── ClassifyForm ─────────────────────────────── */

const ClassifyForm: React.FC<{
  currentType: NagiItemType; currentCategory: string; currentTags: string;
  onSubmit: (itemType: NagiItemType, category: string, tags: string) => void;
}> = ({ currentType, currentCategory, currentTags, onSubmit }) => {
  const [type, setType] = useState(currentType);
  const [cat, setCat] = useState(currentCategory);
  const [tags, setTags] = useState(currentTags);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value as NagiItemType)}
          className="w-full h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] px-3 text-sm outline-none">
          {(Object.entries(ITEM_TYPE_LABELS) as [NagiItemType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">Categoria</label>
        <input value={cat} onChange={(e) => setCat(e.target.value)}
          className="w-full h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] px-3 text-sm outline-none" />
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">Tags (separadas por vírgula)</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)}
          className="w-full h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] px-3 text-sm outline-none" />
      </div>
      <button onClick={() => onSubmit(type, cat, tags)}
        className="w-full h-[37px] rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-slate-800 transition-colors">
        Salvar classificação
      </button>
    </div>
  );
};

/* ── QualifyForm ──────────────────────────────── */

const QualifyForm: React.FC<{
  current: { impact: number; effort: number; risk: number; alignment: number };
  onSubmit: (impact: number, effort: number, risk: number, alignment: number) => void;
}> = ({ current, onSubmit }) => {
  const [impact, setImpact] = useState(current.impact);
  const [effort, setEffort] = useState(current.effort);
  const [risk, setRisk] = useState(current.risk);
  const [alignment, setAlignment] = useState(current.alignment);
  const finalScore = calculateFinalScore({ impact, effort, risk, alignment });

  return (
    <div className="space-y-3">
      <Slider label="Impacto" value={impact} onChange={setImpact} />
      <Slider label="Esforço" value={effort} onChange={setEffort} />
      <Slider label="Risco" value={risk} onChange={setRisk} />
      <Slider label="Alinhamento" value={alignment} onChange={setAlignment} />
      <div className="rounded-[14px] bg-slate-50 border border-slate-200 px-4 py-3 text-center">
        <span className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">Score final</span>
        <span className={`text-xl font-bold ${finalScore >= 80 ? 'text-emerald-600' : finalScore >= 50 ? 'text-amber-600' : 'text-slate-500'}`}>
          {finalScore}/100
        </span>
      </div>
      <button onClick={() => onSubmit(impact, effort, risk, alignment)}
        className="w-full h-[37px] rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-slate-800 transition-colors">
        Salvar score
      </button>
    </div>
  );
};

/* ── DecideForm ───────────────────────────────── */

const DecideForm: React.FC<{
  currentGov: NagiGovernanceStatus;
  onSubmit: (govStatus: NagiGovernanceStatus, rationale: string) => void;
}> = ({ currentGov, onSubmit }) => {
  const [status, setStatus] = useState<NagiGovernanceStatus>(currentGov);
  const [rationale, setRationale] = useState('');

  const options: NagiGovernanceStatus[] = ['aprovada', 'rejeitada', 'incubada', 'arquivada', 'em_analise'];

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">Novo status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as NagiGovernanceStatus)}
          className="w-full h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] px-3 text-sm outline-none">
          {options.map((opt) => (
            <option key={opt} value={opt}>{GOVERNANCE_STATUS_LABELS[opt]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">Justificativa</label>
        <textarea value={rationale} onChange={(e) => setRationale(e.target.value)} rows={3}
          className="w-full px-3 py-2.5 rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm resize-none outline-none"
          placeholder="Explique o motivo da decisão…" />
      </div>
      <button onClick={() => { if (rationale.trim()) onSubmit(status, rationale); }}
        disabled={!rationale.trim()}
        className="w-full h-[37px] rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-slate-800 transition-colors disabled:opacity-40">
        Registrar decisão
      </button>
    </div>
  );
};

/* ── EncaminharForm ───────────────────────────── */

const EncaminharForm: React.FC<{
  onSubmit: (tab: TabId, label: string, reason: string) => void;
}> = ({ onSubmit }) => {
  const [tab, setTab] = useState<TabId>('cid');
  const [reason, setReason] = useState('');

  const moduleOptions: { tab: TabId; label: string }[] = [
    { tab: 'cid', label: 'CID' },
    { tab: 'nic', label: 'NIC' },
    { tab: 'continuous-memory', label: 'Memória Contínua' },
    { tab: 'ventures', label: 'Hub de Ventures' },
    { tab: 'rai', label: 'RAI' },
    { tab: 'mentorias', label: 'Mentorias' },
    { tab: 'governance', label: 'Governança' },
  ];

  const selectedLabel = moduleOptions.find((o) => o.tab === tab)?.label ?? tab;

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">Módulo destino</label>
        <select value={tab} onChange={(e) => setTab(e.target.value as TabId)}
          className="w-full h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] px-3 text-sm outline-none">
          {moduleOptions.map((opt) => (
            <option key={opt.tab} value={opt.tab}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">Motivo do encaminhamento</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
          className="w-full px-3 py-2.5 rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm resize-none outline-none"
          placeholder="Explique por que este item deve ser enviado para este módulo…" />
      </div>
      <button onClick={() => { if (reason.trim()) onSubmit(tab, selectedLabel, reason); }}
        disabled={!reason.trim()}
        className="w-full h-[37px] rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-slate-800 transition-colors disabled:opacity-40">
        Encaminhar item
      </button>
    </div>
  );
};

export default NagiItemDetail;
