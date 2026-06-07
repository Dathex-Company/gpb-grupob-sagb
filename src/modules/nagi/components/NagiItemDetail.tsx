import React, { useState } from 'react';
import SlidePanel from './SlidePanel';
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
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

/* ── Componente principal ────────────────────── */

const NagiItemDetail: React.FC<NagiItemDetailProps> = ({ item, open, onClose, onRefresh, onNavigate }) => {
  const [mode, setMode] = useState<'view' | 'classify' | 'qualify' | 'decide' | 'encaminhar' | 'promover' | 'handoff_status'>('view');
  const [toast, setToast] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const user = 'Cássio';

  const showToast = (type: 'ok' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const eligible = isEligibleForPromotion(item);

  /* ── Ações ──────────────────────────────────── */

  const handleClassify = (itemType: NagiItemType, category: string, tags: string) => {
    const r = classifyItem(item.id, { itemType, category, tags: tags.split(',').map(t => t.trim()).filter(Boolean) }, user);
    if (r) { showToast('ok', 'Classificação salva!'); setMode('view'); onRefresh(); }
  };

  const handleQualify = (impact: number, effort: number, risk: number, alignment: number) => {
    const r = qualifyItem(item.id, { impact, effort, risk, alignment }, user);
    if (r) { showToast('ok', `Score final: ${r.score.final}/100`); setMode('view'); onRefresh(); }
  };

  const handlePrioritize = (priority: NagiPriority) => {
    const r = prioritizeItem(item.id, priority, user);
    if (r) { showToast('ok', `Prioridade: ${PRIORITY_LABELS[priority]}`); onRefresh(); }
  };

  const handleDecide = (govStatus: NagiGovernanceStatus, rationale: string) => {
    const r = decideItem(item.id, { governanceStatus: govStatus, rationale }, user);
    if (r) { showToast('ok', `Decisão: ${GOVERNANCE_STATUS_LABELS[govStatus]}`); setMode('view'); onRefresh(); }
  };

  const handlePromote = () => {
    const r = promoteToCatalog(item.id, user);
    if (r.success) { showToast('ok', 'Item promovido ao catálogo!'); onRefresh(); }
    else { showToast('error', r.reason ?? 'Não foi possível promover.'); }
  };

  const handleEncaminhar = (tab: TabId, label: string, reason: string) => {
    const r = sendToSpecialist({ itemId: item.id, targetTab: tab, targetLabel: label, reason, by: user });
    if (r.success) { showToast('ok', `Enviado para ${label}!`); setMode('view'); onRefresh(); }
    else { showToast('error', r.reason ?? 'Erro ao encaminhar.'); }
  };

  const handleHandoffStatus = (status: 'recebido' | 'processado' | 'finalizado', note?: string) => {
    const r = updateHandoffStatus(item.id, status, note, user);
    if (r) { showToast('ok', `Status: ${HANDOFF_STATUS_LABELS[status]}`); setMode('view'); onRefresh(); }
  };

  /* ── Score bar ────────────────────────────── */

  const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex items-center gap-2">
      <span className="font-semibold uppercase tracking-[0.06em] w-20 shrink-0"
        style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
      >
        {label}
      </span>
      <div className="flex-1" style={{ height: 6, borderRadius: 3, backgroundColor: 'var(--nagi-neutral-soft)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          borderRadius: 3,
          width: `${(value / 5) * 100}%`,
          backgroundColor: value >= 4 ? 'var(--nagi-success)' : value >= 2 ? 'var(--nagi-warning)' : 'var(--nagi-danger)',
          transition: 'width 0.2s ease',
        }} />
      </div>
      <span className="font-semibold w-4 text-right" style={{ fontSize: 'var(--nagi-body)', color: 'var(--nagi-text-secondary)' }}>{value}</span>
    </div>
  );

  return (
    <SlidePanel open={open} onClose={onClose} title={item.isCatalog ? 'Catálogo' : 'Triagem'}>
      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2 px-3 py-2.5 font-semibold"
          style={{
            fontSize: 'var(--nagi-body)',
            borderRadius: 'var(--nagi-radius-md)',
            backgroundColor: toast.type === 'ok' ? 'var(--nagi-success-soft)' : 'var(--nagi-danger-soft)',
            color: toast.type === 'ok' ? 'var(--nagi-success)' : 'var(--nagi-danger)',
            border: `1px solid ${toast.type === 'ok' ? 'var(--nagi-success-line)' : 'var(--nagi-danger-line)'}`,
          }}
        >
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-semibold uppercase tracking-[0.04em]"
            style={{
              fontSize: 9,
              borderRadius: 'var(--nagi-radius-sm)',
              padding: '2px 8px',
              height: 22,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: item.isCatalog ? 'var(--nagi-success-soft)' : 'var(--nagi-warning-soft)',
              color: item.isCatalog ? 'var(--nagi-success)' : 'var(--nagi-warning)',
              border: `1px solid ${item.isCatalog ? 'var(--nagi-success-line)' : 'var(--nagi-warning-line)'}`,
            }}
          >
            {item.isCatalog ? 'Catálogo' : 'Triagem'}
          </span>
          <span className="font-semibold uppercase tracking-[0.04em]"
            style={{
              fontSize: 9,
              borderRadius: 'var(--nagi-radius-sm)',
              padding: '2px 8px',
              height: 22,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--nagi-neutral-soft)',
              color: 'var(--nagi-neutral)',
              border: `1px solid var(--nagi-neutral-line)`,
            }}
          >
            {ITEM_TYPE_LABELS[item.itemType]}
          </span>
          <span className="font-semibold uppercase tracking-[0.04em]"
            style={{ fontSize: 9, color: 'var(--nagi-muted)' }}
          >
            {ORIGIN_LABELS[item.originType]}
          </span>
        </div>

        <h2 className="font-bold tracking-[-0.028em]"
          style={{ fontSize: 'var(--nagi-screen-title)', color: 'var(--nagi-text)' }}
        >
          {item.title}
        </h2>
        <p className="mt-2 leading-6" style={{ fontSize: 'var(--nagi-body)', color: 'var(--nagi-muted)' }}>
          {item.summary}
        </p>

        <div className="flex flex-wrap gap-3 mt-3" style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)' }}>
          <span><strong style={{ color: 'var(--nagi-text-secondary)' }}>Responsável:</strong> {item.ownerName || '—'}</span>
          <span><strong style={{ color: 'var(--nagi-text-secondary)' }}>Categoria:</strong> {item.category}</span>
          {item.tags.length > 0 && (
            <span><strong style={{ color: 'var(--nagi-text-secondary)' }}>Tags:</strong> {item.tags.join(', ')}</span>
          )}
        </div>
      </div>

      {/* Métricas compactas */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="Maturidade" value={MATURITY_LABELS[item.maturityStage]} sub={MATURITY_DESCRIPTIONS[item.maturityStage]} />
        <MetricCard label="Governança" value={GOVERNANCE_STATUS_LABELS[item.governanceStatus]} sub={GOVERNANCE_SUBTEXT[item.governanceStatus]}
          highlight={item.governanceStatus === 'aprovada' ? 'success' : item.governanceStatus === 'rejeitada' ? 'danger' : undefined} />
        <MetricCard label="Score" value={`${item.score.final}/100`}
          highlight={item.score.final >= 80 ? 'success' : item.score.final >= 50 ? 'warning' : undefined} />
        <MetricCard label="Prioridade" value={PRIORITY_LABELS[item.priority]}
          highlight={item.priority === 'alta' ? 'danger' : item.priority === 'media' ? 'warning' : undefined} />
        <MetricCard label="Operacional" value={OPERATIONAL_STATUS_LABELS[item.operationalStatus]} />
        <MetricCard label="Promoção" value={PROMOTION_STATUS_LABELS[item.promotionStatus]}
          highlight={item.promotionStatus === 'promovida' ? 'success' : item.promotionStatus === 'elegivel' ? 'warning' : undefined} />
      </div>

      {/* Score detalhado */}
      {item.score.final > 0 && (
        <section>
          <span className="font-semibold uppercase tracking-[0.08em] block mb-2"
            style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
          >
            Score detalhado
          </span>
          <div className="space-y-2">
            <ScoreBar label="Impacto" value={item.score.impact} />
            <ScoreBar label="Esforço" value={item.score.effort} />
            <ScoreBar label="Risco" value={item.score.risk} />
            <ScoreBar label="Alinhamento" value={item.score.alignment} />
            <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px solid var(--nagi-line)` }}>
              <span className="font-semibold uppercase tracking-[0.06em] w-20 shrink-0"
                style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
              >
                Final
              </span>
              <span className="font-bold" style={{
                fontSize: 18,
                color: item.score.final >= 80 ? 'var(--nagi-success)' : item.score.final >= 50 ? 'var(--nagi-warning)' : 'var(--nagi-muted)',
              }}>
                {item.score.final}
              </span>
              <span style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)' }}>/ 100</span>
            </div>
          </div>
          <p style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)', marginTop: 8 }}>
            Atualizado em {new Date(item.score.updatedAt).toLocaleString('pt-BR')}
          </p>
        </section>
      )}

      {/* Origem (NIC) */}
      {item.originSnapshot && (
        <section>
          <span className="font-semibold uppercase tracking-[0.08em] block mb-2"
            style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
          >
            Origem
          </span>
          <div style={{ borderRadius: 'var(--nagi-radius-lg)', backgroundColor: 'var(--nagi-neutral-soft)', border: `1px solid var(--nagi-neutral-line)`, padding: 16 }}>
            <span className="font-semibold uppercase tracking-[0.04em] block mb-1"
              style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
            >
              {ORIGIN_LABELS[item.originType]} {item.originRefId ? `· ${item.originRefId}` : ''}
            </span>
            <p style={{ fontSize: 'var(--nagi-body)', lineHeight: '24px', color: 'var(--nagi-text-secondary)' }}>{item.originSnapshot}</p>
          </div>
        </section>
      )}

      {/* Handoff */}
      {item.handoffRecord && (
        <section>
          <span className="font-semibold uppercase tracking-[0.08em] block mb-2"
            style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
          >
            Encaminhamento
          </span>
          <div style={{ borderRadius: 'var(--nagi-radius-lg)', backgroundColor: 'var(--nagi-info-soft)', border: `1px solid var(--nagi-info-line)`, padding: 16 }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <strong className="font-semibold" style={{ fontSize: 15, color: 'var(--nagi-text)' }}>
                  {item.handoffRecord.targetModuleLabel}
                </strong>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-semibold uppercase tracking-[0.04em]"
                    style={{ fontSize: 'var(--nagi-micro)', borderRadius: 'var(--nagi-radius-sm)', padding: '2px 8px', height: 20, display: 'flex', alignItems: 'center', backgroundColor: 'var(--nagi-surface)', color: 'var(--nagi-text-secondary)', border: `1px solid var(--nagi-line)` }}
                  >
                    {HANDOFF_STATUS_LABELS[item.handoffRecord.status]}
                  </span>
                  <span style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)' }}>
                    Enviado em {new Date(item.handoffRecord.routedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {item.handoffRecord.specialistNote && (
                  <p className="mt-2 italic" style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)' }}>
                    "{item.handoffRecord.specialistNote}"
                  </p>
                )}
              </div>
              <button onClick={() => onNavigate(item.handoffRecord!.targetModuleTab)}
                className="font-semibold uppercase tracking-[0.06em] transition-all hover:opacity-90 shrink-0"
                style={{ height: 37, padding: '0 14px', borderRadius: 'var(--nagi-radius-md)', fontSize: 'var(--nagi-micro)', backgroundColor: 'var(--nagi-brand)', color: '#FFFFFF', border: 'none' }}
              >
                Abrir módulo
              </button>
            </div>

            {item.handoffRecord.status !== 'finalizado' && (
              <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: `1px solid var(--nagi-info-line)` }}>
                {item.handoffRecord.status === 'encaminhado' && (
                  <MiniActionBtn label="Recebido" onClick={() => handleHandoffStatus('recebido', 'Recebido pelo módulo especialista.')} color="var(--nagi-info)" />
                )}
                {item.handoffRecord.status === 'recebido' && (
                  <MiniActionBtn label="Em processo" onClick={() => handleHandoffStatus('processado', 'Em processo de análise.')} color="var(--nagi-warning)" />
                )}
                {item.handoffRecord.status === 'processado' && (
                  <MiniActionBtn label="Finalizar" onClick={() => handleHandoffStatus('finalizado', 'Trabalho concluído pelo módulo.')} color="var(--nagi-success)" />
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Evidências */}
      {item.evidences.length > 0 && (
        <section>
          <span className="font-semibold uppercase tracking-[0.08em] block mb-2"
            style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
          >
            Evidências ({item.evidences.length})
          </span>
          <div className="space-y-1.5">
            {item.evidences.map((ev) => (
              <div key={ev.id} className="flex items-start gap-2.5" style={{ borderRadius: 'var(--nagi-radius-md)', backgroundColor: 'var(--nagi-neutral-soft)', border: `1px solid var(--nagi-neutral-line)`, padding: '10px 14px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 4, backgroundColor: ev.type === 'doc' ? 'var(--nagi-info)' : ev.type === 'audio' ? 'var(--nagi-success)' : ev.type === 'link' ? 'var(--nagi-accent)' : 'var(--nagi-warning)' }} />
                <div>
                  <span className="font-semibold" style={{ fontSize: 'var(--nagi-body)', color: 'var(--nagi-text-secondary)' }}>{ev.label}</span>
                  {ev.excerpt && <p style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)', marginTop: 2 }}>{ev.excerpt}</p>}
                  {ev.uri && <p className="font-semibold mt-1" style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-brand)' }}>{ev.uri}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline de decisão */}
      {item.decisionHistory.length > 0 && (
        <section>
          <span className="font-semibold uppercase tracking-[0.08em] block mb-3"
            style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
          >
            Histórico ({item.decisionHistory.length})
          </span>
          <div className="space-y-1">
            {[...item.decisionHistory].reverse().map((dec, idx) => (
              <div key={dec.id} className="flex items-start gap-3">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 20 }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: dec.action === 'aprovar' || dec.action === 'encaminhar' || dec.action === 'promover'
                      ? 'var(--nagi-success)'
                      : dec.action === 'rejeitar' || dec.action === 'arquivar'
                        ? 'var(--nagi-danger)'
                        : dec.action === 'incubar'
                          ? 'var(--nagi-accent)'
                          : 'var(--nagi-info)',
                  }} />
                  {idx < item.decisionHistory.length - 1 && (
                    <div style={{ width: 1, flex: 1, backgroundColor: 'var(--nagi-line)', marginTop: 4 }} />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase tracking-[0.04em]"
                      style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-text-secondary)' }}
                    >
                      {dec.action}
                    </span>
                    <span style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)' }}>— {dec.by}</span>
                    <span className="ml-auto" style={{ fontSize: 9, color: 'var(--nagi-muted-light)' }}>
                      {new Date(dec.at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)', marginTop: 2 }}>{dec.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ações */}
      <section>
        <span className="font-semibold uppercase tracking-[0.08em] block mb-3"
          style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}
        >
          Ações
        </span>
        <div className="flex flex-wrap gap-2">
          {!item.isCatalog && (
            <>
              <ActionBtn label="Classificar" onClick={() => setMode('classify')} color="var(--nagi-info)" />
              <ActionBtn label="Qualificar" onClick={() => setMode('qualify')} color="var(--nagi-warning)" />
              <ActionBtn label={`Prioridade: ${PRIORITY_LABELS[item.priority]}`}
                onClick={() => handlePrioritize(item.priority === 'alta' ? 'media' : item.priority === 'media' ? 'baixa' : 'alta')}
                color="var(--nagi-accent)" />
              <ActionBtn label="Decidir" onClick={() => setMode('decide')} color="var(--nagi-danger)" />
              {eligible && (
                <ActionBtn label="Promover ao catálogo" onClick={handlePromote} color="var(--nagi-success)" filled />
              )}
              {(item.governanceStatus === 'aprovada' || item.governanceStatus === 'incubada') && (
                <ActionBtn label="Encaminhar" onClick={() => setMode('encaminhar')} color="var(--nagi-success)" />
              )}
            </>
          )}
          {item.isCatalog && (
            <span style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)', fontStyle: 'italic', padding: '0 8px' }}>
              Item do catálogo. Use o módulo especialista para alterações.
            </span>
          )}
        </div>
      </section>

      {/* Formulários inline */}
      {mode === 'classify' && (
        <ClassifyForm
          currentType={item.itemType} currentCategory={item.category} currentTags={item.tags.join(', ')}
          onSubmit={handleClassify} onCancel={() => setMode('view')}
        />
      )}
      {mode === 'qualify' && (
        <QualifyForm current={item.score} onSubmit={handleQualify} onCancel={() => setMode('view')} />
      )}
      {mode === 'decide' && (
        <DecideForm currentGov={item.governanceStatus} onSubmit={handleDecide} onCancel={() => setMode('view')} />
      )}
      {mode === 'encaminhar' && (
        <EncaminharForm onSubmit={handleEncaminhar} onCancel={() => setMode('view')} />
      )}
    </SlidePanel>
  );
};

/* ── Subcomponentes ───────────────────────────── */

const MetricCard: React.FC<{ label: string; value: string; sub?: string; highlight?: 'success' | 'warning' | 'danger' }> = ({
  label, value, sub, highlight,
}) => (
  <div style={{ borderRadius: 'var(--nagi-radius-lg)', border: `1px solid var(--nagi-line-soft)`, backgroundColor: 'var(--nagi-surface)', padding: '10px 12px', boxShadow: 'var(--nagi-shadow-sm)' }}>
    <span className="font-semibold uppercase tracking-[0.1em] block mb-0.5"
      style={{ fontSize: 8, color: 'var(--nagi-muted)' }}
    >
      {label}
    </span>
    <strong style={{
      fontSize: 13,
      color: highlight === 'success' ? 'var(--nagi-success)' : highlight === 'warning' ? 'var(--nagi-warning)' : highlight === 'danger' ? 'var(--nagi-danger)' : 'var(--nagi-text)',
    }}>
      {value}
    </strong>
    {sub && <span style={{ fontSize: 8, color: 'var(--nagi-muted)', display: 'block' }}>{sub}</span>}
  </div>
);

const ActionBtn: React.FC<{ label: string; onClick: () => void; color: string; filled?: boolean; disabled?: boolean }> = ({
  label, onClick, color, filled, disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="font-semibold uppercase tracking-[0.06em] transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
    style={{
      height: 37,
      padding: '0 14px',
      borderRadius: 'var(--nagi-radius-md)',
      fontSize: 'var(--nagi-micro)',
      backgroundColor: filled ? color : `${color}15`,
      color: filled ? '#FFFFFF' : color,
      border: filled ? 'none' : `1px solid ${color}30`,
    }}
  >
    {label}
  </button>
);

const MiniActionBtn: React.FC<{ label: string; onClick: () => void; color: string }> = ({ label, onClick, color }) => (
  <button onClick={onClick}
    className="font-semibold uppercase tracking-[0.04em] transition-all hover:opacity-80"
    style={{ height: 30, padding: '0 10px', borderRadius: 'var(--nagi-radius-sm)', fontSize: 9, backgroundColor: color, color: '#FFFFFF', border: 'none' }}
  >
    {label}
  </button>
);

/* ── Slider ──────────────────────────────────── */

const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="font-semibold uppercase tracking-[0.06em]" style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}>{label}</label>
      <span className="font-semibold" style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-text-secondary)' }}>{value}/5</span>
    </div>
    <input type="range" min={0} max={5} step={1} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: 'var(--nagi-brand)' }} />
  </div>
);

/* ── Forms ────────────────────────────────────── */

const FormWrapper: React.FC<{ title: string; onCancel: () => void; children: React.ReactNode }> = ({ title, onCancel, children }) => (
  <section className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="font-semibold uppercase tracking-[0.08em]" style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-brand)' }}>{title}</span>
      <button onClick={onCancel} style={{ fontSize: 9, color: 'var(--nagi-muted)' }} className="hover:opacity-70">Cancelar</button>
    </div>
    {children}
  </section>
);

const FormInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="font-semibold uppercase tracking-[0.06em] block mb-1" style={{ fontSize: 9, color: 'var(--nagi-muted)' }}>{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', height: 38, borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', padding: '0 12px', fontSize: 'var(--nagi-body)', outline: 'none', color: 'var(--nagi-text)' }}
      onFocus={(e) => { e.target.style.borderColor = 'var(--nagi-brand)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--nagi-line)'; }}
    />
  </div>
);

const FormTextarea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="font-semibold uppercase tracking-[0.06em] block mb-1" style={{ fontSize: 9, color: 'var(--nagi-muted)' }}>{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
      style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', fontSize: 'var(--nagi-body)', resize: 'none', outline: 'none', color: 'var(--nagi-text)' }}
      onFocus={(e) => { e.target.style.borderColor = 'var(--nagi-brand)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--nagi-line)'; }}
    />
  </div>
);

const FormSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: [string, string][] }> = ({ label, value, onChange, options }) => (
  <div>
    <label className="font-semibold uppercase tracking-[0.06em] block mb-1" style={{ fontSize: 9, color: 'var(--nagi-muted)' }}>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', height: 38, borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', padding: '0 12px', fontSize: 'var(--nagi-body)', outline: 'none', color: 'var(--nagi-text)' }}>
      {options.map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
    </select>
  </div>
);

const FormBtn: React.FC<{ label: string; onClick: () => void; disabled?: boolean }> = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full font-semibold uppercase tracking-[0.06em] transition-all hover:opacity-90 disabled:opacity-40"
    style={{ height: 37, borderRadius: 'var(--nagi-radius-md)', fontSize: 'var(--nagi-micro)', backgroundColor: 'var(--nagi-brand)', color: '#FFFFFF', border: 'none' }}
  >
    {label}
  </button>
);

/* ── ClassifyForm ─────────────────────────────── */

const ClassifyForm: React.FC<{
  currentType: NagiItemType; currentCategory: string; currentTags: string;
  onSubmit: (itemType: NagiItemType, category: string, tags: string) => void; onCancel: () => void;
}> = ({ currentType, currentCategory, currentTags, onSubmit, onCancel }) => {
  const [type, setType] = useState(currentType);
  const [cat, setCat] = useState(currentCategory);
  const [tags, setTags] = useState(currentTags);
  return (
    <FormWrapper title="Classificar" onCancel={onCancel}>
      <FormSelect label="Tipo" value={type} onChange={(v) => setType(v as NagiItemType)} options={Object.entries(ITEM_TYPE_LABELS) as [string, string][]} />
      <FormInput label="Categoria" value={cat} onChange={setCat} />
      <FormInput label="Tags (separadas por vírgula)" value={tags} onChange={setTags} />
      <FormBtn label="Salvar classificação" onClick={() => onSubmit(type, cat, tags)} />
    </FormWrapper>
  );
};

/* ── QualifyForm ──────────────────────────────── */

const QualifyForm: React.FC<{
  current: { impact: number; effort: number; risk: number; alignment: number };
  onSubmit: (impact: number, effort: number, risk: number, alignment: number) => void; onCancel: () => void;
}> = ({ current, onSubmit, onCancel }) => {
  const [impact, setImpact] = useState(current.impact);
  const [effort, setEffort] = useState(current.effort);
  const [risk, setRisk] = useState(current.risk);
  const [alignment, setAlignment] = useState(current.alignment);
  const finalScore = calculateFinalScore({ impact, effort, risk, alignment });

  return (
    <FormWrapper title="Qualificar" onCancel={onCancel}>
      <Slider label="Impacto" value={impact} onChange={setImpact} />
      <Slider label="Esforço" value={effort} onChange={setEffort} />
      <Slider label="Risco" value={risk} onChange={setRisk} />
      <Slider label="Alinhamento" value={alignment} onChange={setAlignment} />
      <div className="text-center py-2" style={{ borderRadius: 'var(--nagi-radius-md)', backgroundColor: 'var(--nagi-neutral-soft)' }}>
        <span className="font-semibold" style={{ fontSize: 18, color: finalScore >= 80 ? 'var(--nagi-success)' : finalScore >= 50 ? 'var(--nagi-warning)' : 'var(--nagi-muted)' }}>
          {finalScore}/100
        </span>
      </div>
      <FormBtn label="Salvar score" onClick={() => onSubmit(impact, effort, risk, alignment)} />
    </FormWrapper>
  );
};

/* ── DecideForm ───────────────────────────────── */

const DecideForm: React.FC<{
  currentGov: NagiGovernanceStatus;
  onSubmit: (govStatus: NagiGovernanceStatus, rationale: string) => void; onCancel: () => void;
}> = ({ currentGov, onSubmit, onCancel }) => {
  const [status, setStatus] = useState<NagiGovernanceStatus>(currentGov);
  const [rationale, setRationale] = useState('');
  const options: NagiGovernanceStatus[] = ['aprovada', 'rejeitada', 'incubada', 'arquivada', 'em_analise'];
  return (
    <FormWrapper title="Decisão" onCancel={onCancel}>
      <FormSelect label="Novo status" value={status} onChange={(v) => setStatus(v as NagiGovernanceStatus)} options={options.map((o) => [o, GOVERNANCE_STATUS_LABELS[o]])} />
      <FormTextarea label="Justificativa" value={rationale} onChange={setRationale} placeholder="Explique o motivo da decisão..." />
      <FormBtn label="Registrar decisão" onClick={() => { if (rationale.trim()) onSubmit(status, rationale); }} disabled={!rationale.trim()} />
    </FormWrapper>
  );
};

/* ── EncaminharForm ───────────────────────────── */

const EncaminharForm: React.FC<{
  onSubmit: (tab: TabId, label: string, reason: string) => void; onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
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
    <FormWrapper title="Encaminhar para especialista" onCancel={onCancel}>
      <FormSelect label="Módulo destino" value={tab} onChange={(v) => setTab(v as TabId)} options={moduleOptions.map((o) => [o.tab, o.label])} />
      <FormTextarea label="Motivo" value={reason} onChange={setReason} placeholder="Explique por que este item deve ser enviado..." />
      <FormBtn label="Encaminhar item" onClick={() => { if (reason.trim()) onSubmit(tab, selectedLabel, reason); }} disabled={!reason.trim()} />
    </FormWrapper>
  );
};

export default NagiItemDetail;
