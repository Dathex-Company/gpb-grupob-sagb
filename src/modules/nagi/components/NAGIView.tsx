import React, { useCallback, useEffect, useState } from 'react';
import { TabId } from '../../../../types';
import { BackIcon } from '../../../../components/Icon';
import {
  getCatalogItems,
  getTriageItems,
  createAvulso,
  resetToBlueprint,
} from '../services/nagiService';
import { getEligibleForPromotion, refreshEligibility } from '../services/nagiPromotionService';
import { receiveFromNic, NicOutputPayload } from '../services/nagiNicBridge';
import { getIngestionDocuments } from '../services/nagiIngestionService';
import { NagiIngestionDocument, NagiItem, NagiItemType, ITEM_TYPE_LABELS } from '../domain/types';
import CatalogSection from './CatalogSection';
import TriageSection from './TriageSection';
import IngestionSection from './IngestionSection';

interface NAGIViewProps {
  onBack?: () => void;
  onOpenTab?: (tab: TabId) => void;
}

type NagiTab = 'ingestao' | 'catalogo' | 'triagem';

const NAGIView: React.FC<NAGIViewProps> = ({ onBack, onOpenTab }) => {
  const [activeTab, setActiveTab] = useState<NagiTab>('ingestao');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNicForm, setShowNicForm] = useState(false);

  const [catalogItems, setCatalogItems] = useState<NagiItem[]>([]);
  const [triageItems, setTriageItems] = useState<NagiItem[]>([]);
  const [ingestionDocs, setIngestionDocs] = useState<NagiIngestionDocument[]>([]);
  const [eligibleCount, setEligibleCount] = useState(0);

  const refresh = useCallback(() => {
    refreshEligibility();
    setCatalogItems(getCatalogItems());
    setTriageItems(getTriageItems());
    setIngestionDocs(getIngestionDocuments());
    setEligibleCount(getEligibleForPromotion().length);
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleNavigate = useCallback((tab: string) => {
    if (onOpenTab) onOpenTab(tab as TabId);
  }, [onOpenTab]);

  /* Criar ideia avulsa */
  const handleCreateAvulso = useCallback(
    (title: string, summary: string, itemType: NagiItemType, category: string) => {
      createAvulso({ title, summary, itemType, category });
      setShowCreateForm(false);
      refresh();
    },
    [refresh],
  );

  /* Importar do NIC */
  const handleReceiveFromNic = useCallback(
    (payload: NicOutputPayload) => {
      receiveFromNic(payload);
      setShowNicForm(false);
      refresh();
    },
    [refresh],
  );

  const totalCatalogo = catalogItems.length;
  const totalTriagem = triageItems.length;
  const totalIngestao = ingestionDocs.length;
  const totalRevisao = ingestionDocs.filter((doc) => doc.reviewStatus === 'em_revisao').length;

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[#F8F6F4]">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-8 space-y-6">

        {/* Header — Alice UI: surface branco, sem dark */}
        <header className="rounded-[24px] border border-[rgba(102,91,83,0.11)] bg-white shadow-sm">
          <div className="px-6 md:px-8 py-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
              <div className="max-w-2xl">
                {onBack && (
                  <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-semibold text-cyan-600 mb-3">
                    <BackIcon className="w-3.5 h-3.5" /> Voltar
                  </button>
                )}
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-cyan-600 block mb-2">
                  NAGI — Núcleo de Gestão de Ideias
                </span>
                <h1 className="text-[31px] font-extrabold tracking-[-0.04em] text-slate-950">
                  Central de Ideias
                </h1>
                <p className="text-[13px] leading-6 text-slate-500 mt-2 max-w-xl">
                  Receba documentos, transforme conteúdo em itens organizados e decida rápido o que entra na Triagem ou no Catálogo.
                  O NAGI não guarda bruto: ele governa o que merece virar estrutura.
                </p>
              </div>

              {/* Métricas — Alice UI: metric-card compacto */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-[260px]">
                <div className="rounded-[22px] border border-[rgba(102,91,83,0.07)] bg-white px-4 py-3">
                  <span className="text-[8px] uppercase tracking-[0.12em] font-bold text-slate-400 block mb-0.5">Docs</span>
                  <strong className="text-[24px] font-bold text-cyan-600">{totalIngestao}</strong>
                </div>
                <div className="rounded-[22px] border border-[rgba(102,91,83,0.07)] bg-white px-4 py-3">
                  <span className="text-[8px] uppercase tracking-[0.12em] font-bold text-slate-400 block mb-0.5">Catálogo</span>
                  <strong className="text-[24px] font-bold text-slate-950">{totalCatalogo}</strong>
                </div>
                <div className="rounded-[22px] border border-[rgba(102,91,83,0.07)] bg-white px-4 py-3">
                  <span className="text-[8px] uppercase tracking-[0.12em] font-bold text-slate-400 block mb-0.5">Triagem</span>
                  <strong className="text-[24px] font-bold text-slate-950">{totalTriagem}</strong>
                </div>
                <div className="rounded-[22px] border border-[rgba(102,91,83,0.07)] bg-white px-4 py-3">
                  <span className="text-[8px] uppercase tracking-[0.12em] font-bold text-slate-400 block mb-0.5">Revisão</span>
                  <strong className="text-[24px] font-bold text-amber-600">{totalRevisao}</strong>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navegação + Ações — Alice UI: tabs clean */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <div className="flex gap-1.5">
            <TabBtn active={activeTab === 'ingestao'} onClick={() => setActiveTab('ingestao')}>
              Documentos
              <span className="ml-1.5 opacity-60">{totalIngestao}</span>
            </TabBtn>
            <TabBtn active={activeTab === 'triagem'} onClick={() => setActiveTab('triagem')}>
              Ideias em análise
              <span className="ml-1.5 opacity-60">{totalTriagem}</span>
            </TabBtn>
            <TabBtn active={activeTab === 'catalogo'} onClick={() => setActiveTab('catalogo')}>
              Catálogo
              <span className="ml-1.5 opacity-60">{totalCatalogo}</span>
            </TabBtn>
            {eligibleCount > 0 && activeTab === 'triagem' && (
              <span className="h-[37px] flex items-center px-3 rounded-[14px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-[0.05em]">
                ★ {eligibleCount} prontos para catálogo
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {(activeTab === 'triagem' || activeTab === 'ingestao') && (
              <>
                <button onClick={() => setShowNicForm(true)}
                  className="h-[37px] px-4 rounded-[14px] bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-blue-100 transition-colors">
                  + Do NIC
                </button>
                <button onClick={() => setShowCreateForm(true)}
                  className="h-[37px] px-4 rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-slate-800 transition-colors">
                  + Nova ideia
                </button>
              </>
            )}
            <button onClick={() => { resetToBlueprint(); refresh(); }}
              className="h-[37px] px-3 rounded-[14px] border border-[rgba(102,91,83,0.11)] bg-white text-slate-400 text-[10px] font-semibold uppercase tracking-[0.06em] hover:bg-slate-50">
              ↺ Resetar
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        {activeTab === 'ingestao' && (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Entrada governada: documentos entram como candidatos, recebem sugestão, passam por revisão e viram evidência de itens do NAGI.
            </p>
            <IngestionSection
              key={`ing-${refreshKey}`}
              documents={ingestionDocs}
              catalogItems={catalogItems}
              onRefresh={refresh}
            />
          </div>
        )}

        {activeTab === 'catalogo' && (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Itens oficiais e reconhecidos do ecossistema — prontos, catalogados e vinculados a módulos especialistas.
            </p>
            <CatalogSection key={`cat-${refreshKey}`} items={catalogItems} onRefresh={refresh} onNavigate={handleNavigate} />
          </div>
        )}

        {activeTab === 'triagem' && (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Ideias em análise, aguardando classificação, qualificação ou decisão. Itens com <strong className="text-emerald-600 font-semibold">★ Elegível</strong> podem ser promovidos ao catálogo.
            </p>
            <TriageSection key={`tri-${refreshKey}`} items={triageItems} onRefresh={refresh} onNavigate={handleNavigate} />
          </div>
        )}

        {/* Rodapé — Alice UI: sutil */}
        <footer className="rounded-[22px] border border-[rgba(102,91,83,0.07)] bg-white/70 px-5 py-4 text-center">
          <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-slate-400">
            CID + RAI → NICO → NAGI → NIDE → SADEV
          </span>
          <p className="text-[10px] text-slate-400 mt-1">O documento entra, o NAGI organiza, a governança decide.</p>
        </footer>
      </div>

      {/* Modal: Nova ideia avulsa */}
      {showCreateForm && (
        <ModalShell title="Nova ideia" onClose={() => setShowCreateForm(false)}>
          <CreateAvulsoForm onSubmit={handleCreateAvulso} />
        </ModalShell>
      )}

      {/* Modal: Importar do NIC */}
      {showNicForm && (
        <ModalShell title="Importar do NIC" onClose={() => setShowNicForm(false)}>
          <NicImportForm onSubmit={handleReceiveFromNic} />
        </ModalShell>
      )}
    </div>
  );
};

/* ── Tab Button ────────────────────────────────── */

const TabBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active, onClick, children,
}) => (
  <button
    onClick={onClick}
    className={`h-[37px] px-4 rounded-[14px] text-[11px] font-semibold uppercase tracking-[0.06em] transition-all ${
      active ? 'bg-slate-950 text-white shadow-sm' : 'bg-white text-slate-500 border border-[rgba(102,91,83,0.11)] hover:bg-slate-50'
    }`}
  >
    {children}
  </button>
);

/* ── Modal Shell ───────────────────────────────── */

const ModalShell: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title, onClose, children,
}) => (
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

/* ── CreateAvulsoForm ──────────────────────────── */

const CreateAvulsoForm: React.FC<{
  onSubmit: (title: string, summary: string, itemType: NagiItemType, category: string) => void;
}> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [itemType, setItemType] = useState<NagiItemType>('ideia');
  const [category, setCategory] = useState('');

  const categoryOptions = [
    'Memória Operacional', 'Inteligência Documental',
    'Reuniões e Contexto', 'Treinamento e Capital Intelectual',
    'Vídeo e Contexto', 'Criatividade e Inteligência Pessoal',
    'Aplicação Comercial', 'Análise Multimodal',
    'Organização Estratégica', 'Gestão de Portfólio',
  ];

  return (
    <div className="space-y-3">
      <Input label="Título" value={title} onChange={setTitle} placeholder="Nome da ideia…" />
      <Textarea label="Descrição" value={summary} onChange={setSummary} placeholder="Resumo da ideia…" />
      <Select label="Tipo" value={itemType} onChange={(v) => setItemType(v as NagiItemType)} options={Object.entries(ITEM_TYPE_LABELS) as [string, string][]} />
      <Select label="Categoria" value={category} onChange={setCategory} options={categoryOptions.map((c) => [c, c])} placeholder="Selecione…" />
      <button
        onClick={() => { if (title.trim() && summary.trim() && category) onSubmit(title.trim(), summary.trim(), itemType, category); }}
        disabled={!title.trim() || !summary.trim() || !category}
        className="w-full h-[37px] rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-slate-800 transition-colors disabled:opacity-40">
        Criar ideia
      </button>
    </div>
  );
};

/* ── NicImportForm ─────────────────────────────── */

const NicImportForm: React.FC<{
  onSubmit: (payload: NicOutputPayload) => void;
}> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [itemType, setItemType] = useState<NagiItemType>('iniciativa');
  const [category, setCategory] = useState('');
  const [originRefId, setOriginRefId] = useState('');
  const [originSnapshot, setOriginSnapshot] = useState('');

  return (
    <div className="space-y-3">
      <Input label="Título (do NIC)" value={title} onChange={setTitle} placeholder="Nome da saída do NIC…" />
      <Textarea label="Resumo" value={summary} onChange={setSummary} placeholder="Resumo da inteligência gerada…" />
      <Input label="ID de referência NIC" value={originRefId} onChange={setOriginRefId} placeholder="nic-output-003" />
      <Textarea label="Snapshot (cópia do conteúdo NIC)" value={originSnapshot} onChange={setOriginSnapshot} placeholder="Cole aqui a saída original do NIC para referência…" />
      <Select label="Tipo" value={itemType} onChange={(v) => setItemType(v as NagiItemType)} options={Object.entries(ITEM_TYPE_LABELS) as [string, string][]} />
      <Input label="Categoria" value={category} onChange={setCategory} placeholder="Ex: Organização Estratégica" />
      <button
        onClick={() => {
          if (title.trim() && summary.trim() && originRefId.trim() && category.trim()) {
            onSubmit({
              title: title.trim(), summary: summary.trim(),
              itemType, category: category.trim(),
              originRefId: originRefId.trim(), originSnapshot: originSnapshot.trim(),
              evidenceLabel: 'Saída do NIC',
              evidenceExcerpt: summary.substring(0, 120),
            });
          }
        }}
        disabled={!title.trim() || !summary.trim() || !originRefId.trim() || !category.trim()}
        className="w-full h-[37px] rounded-[14px] bg-blue-600 text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-blue-700 transition-colors disabled:opacity-40">
        Importar do NIC para triagem
      </button>
    </div>
  );
};

/* ── Field helpers ────────────────────────────── */

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({
  label, value, onChange, placeholder,
}) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] px-3 text-sm outline-none focus:border-slate-400" />
  </div>
);

const Textarea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({
  label, value, onChange, placeholder,
}) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] text-sm resize-none outline-none focus:border-slate-400" />
  </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: [string, string][]; placeholder?: string }> = ({
  label, value, onChange, options, placeholder,
}) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full h-[42px] rounded-[15px] border border-[rgba(102,91,83,0.11)] bg-[#FDFBFA] px-3 text-sm outline-none focus:border-slate-400">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
    </select>
  </div>
);

export default NAGIView;
