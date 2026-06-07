import React, { useMemo, useState } from 'react';
import EmptyState from './EmptyState';
import {
  INGESTION_CLASSIFICATION_LABELS,
  INGESTION_DESTINATION_LABELS,
  INGESTION_REVIEW_LABELS,
  INGESTION_SOURCE_LABELS,
  ITEM_TYPE_LABELS,
  NagiIngestionDestination,
  NagiIngestionDocument,
  NagiIngestionSourceType,
  NagiItem,
  NagiItemType,
} from '../domain/types';
import {
  createIngestionBatch,
  createIngestionDocument,
  discardIngestionDocument,
  saveIngestionAsItem,
  saveManyIngestionDocuments,
  updateIngestionReview,
} from '../services/nagiIngestionService';

interface IngestionSectionProps {
  documents: NagiIngestionDocument[];
  catalogItems: NagiItem[];
  onRefresh: () => void;
  onOpenItem?: (itemId: string) => void;
}

type IngestionView = 'entrada' | 'revisao' | 'prontos' | 'historico';

const destinationStyles: Record<NagiIngestionDestination, { bg: string; text: string; border: string }> = {
  catalogo: { bg: 'var(--nagi-success-soft)', text: 'var(--nagi-success)', border: 'var(--nagi-success-line)' },
  triagem: { bg: 'var(--nagi-warning-soft)', text: 'var(--nagi-warning)', border: 'var(--nagi-warning-line)' },
  revisao_manual: { bg: 'var(--nagi-neutral-soft)', text: 'var(--nagi-neutral)', border: 'var(--nagi-neutral-line)' },
};

const IngestionSection: React.FC<IngestionSectionProps> = ({ documents, catalogItems, onRefresh }) => {
  const [view, setView] = useState<IngestionView>('entrada');
  const [selectedId, setSelectedId] = useState<string | null>(documents[0]?.id ?? null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selected = documents.find((doc) => doc.id === selectedId) ?? null;

  const stats = useMemo(() => ({
    total: documents.length,
    review: documents.filter((d) => d.reviewStatus === 'em_revisao').length,
    ready: documents.filter((d) => d.reviewStatus === 'pronto_para_salvar').length,
    saved: documents.filter((d) => d.reviewStatus === 'salvo').length,
    duplicates: documents.filter((d) => d.classificationStatus === 'duplicata_possivel').length,
  }), [documents]);

  const visibleDocs = useMemo(() => {
    if (view === 'entrada') return documents.slice(0, 6);
    if (view === 'revisao') return documents.filter((d) => d.reviewStatus === 'em_revisao');
    if (view === 'prontos') return documents.filter((d) => d.reviewStatus === 'pronto_para_salvar');
    return documents;
  }, [documents, view]);

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const saveSelected = (destination: 'catalogo' | 'triagem') => {
    saveManyIngestionDocuments(selectedIds, destination);
    setSelectedIds([]);
    onRefresh();
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Metric label="Recebidos" value={stats.total} />
        <Metric label="Em revisão" value={stats.review} tone="amber" />
        <Metric label="Prontos" value={stats.ready} tone="emerald" />
        <Metric label="Salvos" value={stats.saved} />
        <Metric label="Parecidos" value={stats.duplicates} tone="rose" />
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <MiniTab active={view === 'entrada'} onClick={() => setView('entrada')}>Entrada</MiniTab>
          <MiniTab active={view === 'revisao'} onClick={() => setView('revisao')}>Em revisão</MiniTab>
          <MiniTab active={view === 'prontos'} onClick={() => setView('prontos')}>Prontos para salvar</MiniTab>
          <MiniTab active={view === 'historico'} onClick={() => setView('historico')}>Histórico</MiniTab>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="h-[37px] px-3 rounded-[14px] bg-white border border-[rgba(102,91,83,0.11)] text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-500 flex items-center">
              {selectedIds.length} selecionados
            </span>
            <button onClick={() => saveSelected('triagem')} className="h-[37px] px-3 rounded-[14px] bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold uppercase tracking-[0.06em]">Mandar para Triagem</button>
            <button onClick={() => saveSelected('catalogo')} className="h-[37px] px-3 rounded-[14px] bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-[0.06em]">Mandar para Catálogo</button>
          </div>
        )}
      </div>

      {view === 'entrada' && <EntryPanel onCreated={onRefresh} />}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(360px,520px)_1fr] gap-4">
        <div style={{ borderRadius: 'var(--nagi-radius-xl)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface)', padding: 16, boxShadow: 'var(--nagi-shadow-sm)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold uppercase tracking-[0.08em]" style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}>Documentos</span>
            <span style={{ fontSize: 'var(--nagi-muted-size)', color: 'var(--nagi-muted)' }}>{visibleDocs.length}</span>
          </div>
          {visibleDocs.length === 0 && (
            <EmptyState title="Nada nesta etapa agora." description="Use a entrada para colar textos ou subir vários documentos." compact />
          )}
          <div className="space-y-1.5 max-h-[620px] overflow-y-auto custom-scrollbar pr-1">
            {visibleDocs.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                active={selectedId === doc.id}
                selected={selectedIds.includes(doc.id)}
                onSelect={() => { setSelectedId(doc.id); }}
                onToggle={() => toggleSelection(doc.id)}
              />
            ))}
          </div>
        </div>

        <div>
          {selected ? (
            <ReviewPanel doc={selected} catalogItems={catalogItems} onRefresh={onRefresh} />
          ) : (
            <EmptyState
              title="Selecione um documento"
              description="Aqui aparece a sugestão, os vínculos e a decisão final."
              compact
            />
          )}
        </div>
      </div>
    </div>
  );
};

const EntryPanel: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const [mode, setMode] = useState<'colar' | 'lote'>('colar');
  const [sourceLabel, setSourceLabel] = useState('Entrada manual');
  const [singleText, setSingleText] = useState('');
  const [batchText, setBatchText] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const createSingle = () => {
    if (!singleText.trim()) return;
    createIngestionDocument({ sourceType: 'texto_colado', sourceLabel, originalText: singleText });
    setSingleText('');
    onCreated();
  };

  const createBatchFromText = () => {
    const chunks = batchText.split(/\n---+\n/g).map((chunk) => chunk.trim()).filter(Boolean);
    createIngestionBatch(chunks.map((chunk, index) => ({
      sourceType: 'texto_colado',
      sourceLabel: `${sourceLabel || 'Lote colado'} #${index + 1}`,
      originalText: chunk,
    })));
    setBatchText('');
    onCreated();
  };

  const createBatchFromFiles = async () => {
    if (!files?.length) return;
    const inputs = await Promise.all(Array.from(files).map(async (file) => ({
      sourceType: 'upload' as NagiIngestionSourceType,
      sourceLabel: 'Upload em lote',
      fileName: file.name,
      originalText: await file.text(),
    })));
    createIngestionBatch(inputs);
    setFiles(null);
    onCreated();
  };

  return (
    <section className="rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-cyan-600">Entrada de documentos</span>
          <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-slate-950 mt-1">Coloque documentos e deixe o NAGI organizar</h3>
          <p className="text-[11px] text-slate-500 mt-1">Use para textos relevantes. O NAGI lê, sugere classificação e você revisa antes de salvar.</p>
        </div>
        <div className="flex gap-1.5">
          <MiniTab active={mode === 'colar'} onClick={() => setMode('colar')}>Colar texto</MiniTab>
          <MiniTab active={mode === 'lote'} onClick={() => setMode('lote')}>Lote</MiniTab>
        </div>
      </div>

      <Input label="Nome da entrada" value={sourceLabel} onChange={setSourceLabel} placeholder="Ex: documentos antigos, reunião, lote de ideias..." />
      {mode === 'colar' ? (
        <div className="space-y-3">
          <Textarea label="Texto do documento" value={singleText} onChange={setSingleText} placeholder="Cole aqui o conteúdo do documento..." rows={7} />
          <button onClick={createSingle} disabled={!singleText.trim()} className="h-[37px] px-4 rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] disabled:opacity-40">
            Ler e classificar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Textarea label="Lote colado" value={batchText} onChange={setBatchText} placeholder="Cole vários documentos separados por uma linha com ---" rows={8} />
            <button onClick={createBatchFromText} disabled={!batchText.trim()} className="h-[37px] px-4 rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] disabled:opacity-40">
              Criar lote colado
            </button>
          </div>
          <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50 p-4 space-y-3">
            <label className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block">Arquivos de texto</label>
            <input type="file" multiple accept=".txt,.md,.csv,.json" onChange={(e) => setFiles(e.target.files)} className="text-[11px] text-slate-500" />
            <p className="text-[10px] text-slate-400">Nesta V1, leitura direta funciona melhor com arquivos de texto, Markdown, CSV ou JSON.</p>
            <button onClick={createBatchFromFiles} disabled={!files?.length} className="h-[37px] px-4 rounded-[14px] bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold uppercase tracking-[0.06em] disabled:opacity-40">
              Ler arquivos
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const DocumentRow: React.FC<{ doc: NagiIngestionDocument; active: boolean; selected: boolean; onSelect: () => void; onToggle: () => void }> = ({ doc, active, selected, onSelect, onToggle }) => (
  <div className={`rounded-[18px] border p-3 transition-all ${active ? 'border-slate-400 bg-slate-50' : 'border-[rgba(102,91,83,0.11)] bg-white hover:bg-slate-50'}`}>
    <div className="flex gap-2">
      <input type="checkbox" checked={selected} onChange={onToggle} className="mt-1 accent-slate-950" />
      <button onClick={onSelect} className="text-left flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[12px] font-semibold text-slate-950 line-clamp-2">{doc.extractedTitle}</h4>
          <span className="shrink-0 h-5 px-1.5 rounded-[6px] font-semibold uppercase tracking-[0.04em] flex items-center"
            style={{
              fontSize: 9,
              backgroundColor: destinationStyles[doc.suggestedDestination].bg,
              color: destinationStyles[doc.suggestedDestination].text,
              border: `1px solid ${destinationStyles[doc.suggestedDestination].border}`,
            }}>
            {INGESTION_DESTINATION_LABELS[doc.suggestedDestination]}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{doc.extractedSummary}</p>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[9px] text-slate-400 uppercase tracking-[0.05em] font-semibold">{INGESTION_SOURCE_LABELS[doc.sourceType]}</span>
          <span className="text-[9px] text-slate-300">·</span>
          <span className="text-[9px] text-slate-400">{INGESTION_CLASSIFICATION_LABELS[doc.classificationStatus]}</span>
          <span className="text-[9px] text-slate-300">·</span>
          <span className="text-[9px] text-slate-400">{doc.confidence}%</span>
        </div>
      </button>
    </div>
  </div>
);

const ReviewPanel: React.FC<{ doc: NagiIngestionDocument; catalogItems: NagiItem[]; onRefresh: () => void }> = ({ doc, catalogItems, onRefresh }) => {
  const [title, setTitle] = useState(doc.extractedTitle);
  const [summary, setSummary] = useState(doc.extractedSummary);
  const [type, setType] = useState<NagiItemType>(doc.extractedTypeSuggestion);
  const [category, setCategory] = useState(doc.extractedCategorySuggestion);
  const [tags, setTags] = useState(doc.extractedTags.join(', '));
  const [destination, setDestination] = useState<'catalogo' | 'triagem'>(doc.chosenDestination ?? (doc.suggestedDestination === 'catalogo' ? 'catalogo' : 'triagem'));
  const [selectedCatalog, setSelectedCatalog] = useState(doc.selectedCatalogItemId ?? '');

  const saveReview = () => {
    updateIngestionReview(doc.id, {
      extractedTitle: title,
      extractedSummary: summary,
      extractedTypeSuggestion: type,
      extractedCategorySuggestion: category,
      extractedTags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      chosenDestination: destination,
      selectedCatalogItemId: selectedCatalog || undefined,
    });
    onRefresh();
  };

  const saveAsItem = () => {
    saveReview();
    saveIngestionAsItem(doc.id, destination);
    onRefresh();
  };

  const discard = () => {
    discardIngestionDocument(doc.id);
    onRefresh();
  };

  return (
    <section className="rounded-[22px] border border-[rgba(102,91,83,0.11)] bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.08em] font-semibold" style={{ color: 'var(--nagi-muted)' }}>Revisão do documento</span>
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] mt-1" style={{ color: 'var(--nagi-text)' }}>{doc.extractedTitle}</h3>
          <p className="text-[11px] mt-1" style={{ color: 'var(--nagi-muted)' }}>{INGESTION_REVIEW_LABELS[doc.reviewStatus]} · {doc.confidence}% de segurança</p>
        </div>
        <span className="h-6 px-2 rounded-[8px] text-[10px] font-semibold uppercase tracking-[0.04em] flex items-center"
          style={{
            backgroundColor: destinationStyles[doc.suggestedDestination].bg,
            color: destinationStyles[doc.suggestedDestination].text,
            border: `1px solid ${destinationStyles[doc.suggestedDestination].border}`,
          }}>
          Sugestão: {INGESTION_DESTINATION_LABELS[doc.suggestedDestination]}
        </span>
      </div>

      {doc.extractedSignals.length > 0 && (
        <div className="rounded-[16px] bg-slate-50 border border-slate-200 p-3">
          <span className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-400 block mb-2">Sinais encontrados</span>
          <div className="flex flex-wrap gap-1.5">
            {doc.extractedSignals.map((signal) => <span key={signal} className="rounded-[8px] bg-white border border-slate-200 px-2 py-1 text-[10px] text-slate-600">{signal}</span>)}
          </div>
        </div>
      )}

      {doc.relatedCatalogCandidates.length > 0 && (
        <div className="rounded-[16px] bg-cyan-50 border border-cyan-200 p-3">
          <span className="text-[10px] uppercase tracking-[0.06em] font-semibold text-cyan-700 block mb-2">Pode estar ligado a algo que já existe</span>
          <select value={selectedCatalog} onChange={(e) => setSelectedCatalog(e.target.value)} className="w-full h-[42px] rounded-[15px] border border-cyan-200 bg-white px-3 text-sm outline-none">
            <option value="">Não vincular agora</option>
            {doc.relatedCatalogCandidates.map((candidate) => (
              <option key={candidate.itemId} value={candidate.itemId}>{candidate.title} · {candidate.confidence}%</option>
            ))}
          </select>
          <p className="text-[10px] text-cyan-700 mt-2">Se escolher um item do catálogo, o documento será salvo como evidência desse item.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="Título" value={title} onChange={setTitle} />
        <Select label="Tipo" value={type} onChange={(value) => setType(value as NagiItemType)} options={Object.entries(ITEM_TYPE_LABELS) as [string, string][]} />
        <Input label="Categoria" value={category} onChange={setCategory} />
        <Input label="Tags" value={tags} onChange={setTags} placeholder="separadas por vírgula" />
      </div>
      <Textarea label="Resumo" value={summary} onChange={setSummary} rows={4} />

      <div>
        <span className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 block mb-2">Salvar como</span>
        <div className="flex gap-2">
          <button onClick={() => setDestination('triagem')} className={`h-[37px] px-4 rounded-[14px] border text-[11px] font-semibold uppercase tracking-[0.06em] ${destination === 'triagem' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>Triagem</button>
          <button onClick={() => setDestination('catalogo')} className={`h-[37px] px-4 rounded-[14px] border text-[11px] font-semibold uppercase tracking-[0.06em] ${destination === 'catalogo' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>Catálogo</button>
        </div>
      </div>

      <details className="rounded-[16px] border border-slate-200 bg-slate-50 p-3">
        <summary className="text-[10px] uppercase tracking-[0.06em] font-semibold text-slate-500 cursor-pointer">Ver conteúdo original</summary>
        <pre className="mt-3 whitespace-pre-wrap text-[11px] leading-5 text-slate-500 max-h-56 overflow-y-auto custom-scrollbar">{doc.originalText}</pre>
      </details>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        <button onClick={saveReview} className="h-[37px] px-4 rounded-[14px] bg-white border border-[rgba(102,91,83,0.11)] text-slate-600 text-[11px] font-semibold uppercase tracking-[0.06em]">Salvar revisão</button>
        <button onClick={saveAsItem} disabled={doc.reviewStatus === 'salvo'} className="h-[37px] px-4 rounded-[14px] bg-slate-950 text-white text-[11px] font-semibold uppercase tracking-[0.06em] disabled:opacity-40">Salvar como item</button>
        <button onClick={discard} disabled={doc.reviewStatus === 'salvo'} className="h-[37px] px-4 rounded-[14px] bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold uppercase tracking-[0.06em] disabled:opacity-40">Descartar</button>
      </div>
    </section>
  );
};

const Metric: React.FC<{ label: string; value: number; tone?: 'emerald' | 'amber' | 'rose' }> = ({ label, value, tone }) => {
  const toneColor = tone === 'emerald' ? 'var(--nagi-success)'
    : tone === 'amber' ? 'var(--nagi-warning)'
    : tone === 'rose' ? 'var(--nagi-danger)'
    : 'var(--nagi-text)';
  return (
    <div style={{ borderRadius: 'var(--nagi-radius-xl)', border: `1px solid var(--nagi-line-soft)`, backgroundColor: 'var(--nagi-surface)', padding: '12px 16px', boxShadow: 'var(--nagi-shadow-sm)' }}>
      <span className="font-bold uppercase tracking-[0.12em] block mb-0.5" style={{ fontSize: 8, color: 'var(--nagi-muted)' }}>{label}</span>
      <strong style={{ fontSize: 24, color: toneColor }}>{value}</strong>
    </div>
  );
};

const MiniTab: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className="font-semibold uppercase tracking-[0.06em] transition-all"
    style={{
      height: 37,
      padding: '0 14px',
      borderRadius: 'var(--nagi-radius-md)',
      fontSize: 'var(--nagi-micro)',
      backgroundColor: active ? 'var(--nagi-primary)' : 'var(--nagi-surface)',
      color: active ? '#FFFFFF' : 'var(--nagi-muted)',
      border: active ? 'none' : `1px solid var(--nagi-line)`,
      boxShadow: active ? 'var(--nagi-shadow-sm)' : 'none',
    }}
  >{children}</button>
);

const Input: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="font-semibold uppercase tracking-[0.06em] block mb-1" style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}>{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', height: 42, borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', padding: '0 12px', fontSize: 'var(--nagi-body)', outline: 'none', color: 'var(--nagi-text)' }}
      onFocus={(e) => { e.target.style.borderColor = 'var(--nagi-brand)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--nagi-line)'; }}
    />
  </div>
);

const Textarea: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }> = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="font-semibold uppercase tracking-[0.06em] block mb-1" style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}>{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', fontSize: 'var(--nagi-body)', resize: 'none', outline: 'none', color: 'var(--nagi-text)' }}
      onFocus={(e) => { e.target.style.borderColor = 'var(--nagi-brand)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--nagi-line)'; }}
    />
  </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: [string, string][] }> = ({ label, value, onChange, options }) => (
  <div>
    <label className="font-semibold uppercase tracking-[0.06em] block mb-1" style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)' }}>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', height: 42, borderRadius: 'var(--nagi-radius-md)', border: `1px solid var(--nagi-line)`, backgroundColor: 'var(--nagi-surface-soft)', padding: '0 12px', fontSize: 'var(--nagi-body)', outline: 'none', color: 'var(--nagi-text)' }}
      onFocus={(e) => { e.target.style.borderColor = 'var(--nagi-brand)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--nagi-line)'; }}>
      {options.map(([key, labelValue]) => <option key={key} value={key}>{labelValue}</option>)}
    </select>
  </div>
);

export default IngestionSection;
