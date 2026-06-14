import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { CentralEmptyState, CentralErrorState, CentralFilterBar, CentralLoadingState } from '../components/CentralUI';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { centralPadroesStorageService } from '../services/centralPadroesStorageService';
import { officialStatusLabel } from '../utils/documentNormalizers';
import { CentralDocument, CentralDocumentOfficialStatus, DocumentFilter } from '../types';

const statusLabel: Record<string, string> = {
  canonico: 'Canônico',
  revisao: 'Revisão',
  bruto: 'Bruto',
  legado: 'Legado',
  externo: 'Externo',
  registro: 'Registro',
  previsto: 'Previsto',
  arquivado: 'Arquivado',
  bloqueado: 'Bloqueado'
};

const statusOptions = ['todos', 'bruto', 'revisao', 'canonico', 'legado', 'externo', 'registro'] as const;

const officialStatusOptions: { value: CentralDocumentOfficialStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'oficial_ativo', label: '⭐ Oficiais ativos' },
  { value: 'em_revisao', label: '📝 Em revisão' },
  { value: 'rascunho', label: '📄 Rascunhos' },
  { value: 'incompleto', label: '⚠️ Incompletos' },
  { value: 'legado', label: '📦 Legado' },
  { value: 'fonte_bruta', label: '🗂️ Fontes brutas' },
  { value: 'curadoria', label: '🔍 Curadoria' },
  { value: 'externo', label: '🔗 Externos' }
];

const officialBadgeClass = (status?: CentralDocumentOfficialStatus): string => {
  switch (status) {
    case 'oficial_ativo': return 'cp-official-badge active';
    case 'em_revisao': return 'cp-official-badge review';
    case 'rascunho': return 'cp-official-badge draft';
    case 'incompleto': return 'cp-official-badge incomplete';
    case 'legado': return 'cp-official-badge legacy';
    case 'fonte_bruta': return 'cp-official-badge raw';
    case 'curadoria': return 'cp-official-badge curation';
    case 'externo': return 'cp-official-badge external';
    default: return 'cp-official-badge';
  }
};

type DocumentsPageProps = {
  title?: string;
  subtitle?: string;
  initialFilters?: DocumentFilter;
  onOpenDocument?: (documentId: string) => void;
};

const DocumentsPage: React.FC<DocumentsPageProps> = ({ title = 'Biblioteca de Documentos', subtitle = 'Document Hub V2 — Documentos oficiais, rascunhos, revisões e fontes.', initialFilters, onOpenDocument }) => {
  const [documentsRaw, setDocumentsRaw] = React.useState<CentralDocument[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = React.useState({ title: '', path: '', category: 'Governança', areaId: 'pietro' });
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<string>(initialFilters?.status || 'todos');
  const [officialFilter, setOfficialFilter] = React.useState<CentralDocumentOfficialStatus | 'todos'>('todos');
  const activeFilterCount = (query.trim() ? 1 : 0) + (status !== 'todos' ? 1 : 0) + (officialFilter !== 'todos' ? 1 : 0);
  const clearFilters = () => { setQuery(''); setStatus('todos'); setOfficialFilter('todos'); };

  const refetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await centralPadroesDocumentHubService.listDocuments(initialFilters);
      setDocumentsRaw(result);
    } catch (err) {
      setError(String((err as Error)?.message || err));
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  React.useEffect(() => { refetch(); }, [refetch]);

  const documents = React.useMemo(() => {
    return documentsRaw.filter((doc) => {
      const matchesStatus = status === 'todos' || doc.status === status;
      const matchesOfficial = officialFilter === 'todos' || doc.officialStatus === officialFilter;
      const haystack = `${doc.title} ${doc.path} ${doc.category} ${doc.areaId} ${doc.owner || ''} ${doc.summary || ''} ${(doc.tags || []).join(' ')}`.toLowerCase();
      return matchesStatus && matchesOfficial && haystack.includes(query.toLowerCase());
    });
  }, [documentsRaw, query, status, officialFilter]);

  const ownerInitial = (areaId: string) => (areaId || 'P').slice(0, 1).toUpperCase();

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', path: '', category: 'Governança', areaId: 'pietro' });
    setOpen(true);
  };

  const openEdit = (id: string) => {
    const doc = documentsRaw.find((d) => d.id === id);
    if (!doc) return;
    setEditingId(id);
    setForm({ title: doc.title, path: doc.path, category: doc.category, areaId: doc.areaId });
    setOpen(true);
  };

  const submit = async () => {
    try {
      if (editingId) {
        await centralPadroesCrudService.updateDocument(editingId, { ...form });
        setToast({ message: 'Documento atualizado.', type: 'success' });
      } else {
        await centralPadroesCrudService.createDocument({ ...form, status: 'bruto', shouldBecome: 'apoio' });
        await centralPadroesStorageService.ingestDocument({ title: form.title, sourcePath: form.path, sourceKind: 'manual' }).catch(() => '');
        setToast({ message: 'Documento registrado e enviado para triagem.', type: 'success' });
      }
      await refetch();
      setOpen(false);
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  return (
    <CentralPageShell title={title} subtitle={subtitle}>
      {loading && <CentralLoadingState label="Carregando documentos..." />}
      {error && <CentralErrorState title="Falha ao carregar documentos" message={error} />}

      {/* Count bar */}
      <div className="cp-docs-count-bar">
        <span className="cp-docs-count">{documents.length} documento{documents.length !== 1 ? 's' : ''}</span>
        <span className="cp-docs-count-muted">
          {documents.filter((d) => d.officialStatus === 'oficial_ativo').length} oficiais ativos
        </span>
      </div>

      <section className="cp-docs-panel">
        {/* Search and official filter row */}
        <CentralFilterBar activeCount={activeFilterCount} onClear={activeFilterCount ? clearFilters : undefined}>
          <label className="cp-docs-subtle-search">
            <span>⌕</span>
            <input placeholder="Buscar por título, owner, tag, conteúdo..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
        </CentralFilterBar>

        {/* Official status filter tabs */}
        <div className="cp-docs-filters cp-docs-filters-official">
          {officialStatusOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setOfficialFilter(item.value)}
              className={`cp-docs-filter ${officialFilter === item.value ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Technical status filter */}
        <div className="cp-docs-filters">
          {statusOptions.map((item) => (
            <button key={item} type="button" onClick={() => setStatus(item)} className={`cp-docs-filter cp-docs-filter-sm ${status === item ? 'active' : ''}`}>
              {item === 'todos' ? 'Todos os status' : statusLabel[item] || item}
            </button>
          ))}
        </div>
      </section>

      {/* Document list — clickable rows */}
      <section className="cp-docs-table">
        <div className="cp-docs-table-head">
          <span>Documento</span>
          <span>Oficial</span>
          <span>Status</span>
          <span>Owner</span>
          <span>Tipo</span>
          <span>Ações</span>
        </div>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="cp-docs-doc-row cp-docs-doc-row-clickable"
            onClick={() => onOpenDocument?.(doc.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenDocument?.(doc.id); }}
          >
            <div className="cp-docs-doc-name">
              <span>📄</span>
              <span>
                <strong>{doc.title}</strong>
                <small>{doc.summary || doc.pathRelative || doc.path}</small>
              </span>
            </div>
            <span>
              <span className={officialBadgeClass(doc.officialStatus)}>
                {officialStatusLabel[doc.officialStatus || 'incompleto']}
              </span>
            </span>
            <span><StatusBadge value={doc.status} /></span>
            <span className="cp-docs-person">
              <span className="cp-docs-owner-dot">{ownerInitial(doc.owner || doc.areaId)}</span>
              {doc.owner || doc.areaId}
            </span>
            <span><small>{doc.type || doc.shouldBecome}</small></span>
            <span className="cp-docs-row-actions" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onOpenDocument?.(doc.id)} className="cp-docs-mini-btn primary">Abrir</button>
              <button onClick={() => openEdit(doc.id)} className="cp-docs-mini-btn">Editar</button>
            </span>
          </div>
        ))}
        {!documents.length && (
          <CentralEmptyState icon="📄" title="Nenhum documento encontrado" description="Ajuste a busca, limpe filtros ou registre um novo documento para triagem." />
        )}
      </section>

      <div className="cp-docs-new-line" onClick={openCreate}>
        <span>+</span><span>Registrar novo documento nesta biblioteca</span>
      </div>

      <button type="button" className="cp-docs-floating-add" onClick={openCreate}>+</button>

      <CrudModal
        title={editingId ? 'Editar Documento' : 'Registrar Documento'}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <button onClick={submit} className="cp-docs-btn-primary">
            {editingId ? 'Atualizar' : 'Salvar'}
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
          <FormField label="Caminho/Origem" value={form.path} onChange={(value) => setForm((prev) => ({ ...prev, path: value }))} />
          <FormField label="Categoria" value={form.category} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} />
          <FormField label="Área" value={form.areaId} onChange={(value) => setForm((prev) => ({ ...prev, areaId: value }))} />
        </div>
      </CrudModal>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentsPage;
