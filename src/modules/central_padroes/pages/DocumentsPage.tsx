import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { officialStatusLabel } from '../utils/documentNormalizers';
import { CentralDocument, CentralDocumentOfficialStatus, DocumentFilter } from '../types';

type DocumentsPageProps = {
  title?: string;
  subtitle?: string;
  initialFilters?: DocumentFilter;
  onOpenDocument?: (documentId: string) => void;
};

const officialFilterOptions: { value: CentralDocumentOfficialStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'oficial_ativo', label: 'Oficiais' },
  { value: 'rascunho', label: 'Rascunhos' },
  { value: 'fonte_bruta', label: 'Fontes' },
  { value: 'curadoria', label: 'Curadoria' },
  { value: 'legado', label: 'Legado' },
];

const chipClass = (status?: CentralDocumentOfficialStatus): string => {
  switch (status) {
    case 'oficial_ativo': return 'active';
    case 'em_revisao': return 'review';
    case 'rascunho': return 'draft';
    case 'legado': return 'legacy';
    case 'fonte_bruta': return 'raw';
    case 'curadoria': return 'curation';
    default: return '';
  }
};

const DocumentsPage: React.FC<DocumentsPageProps> = ({ title = 'Documentos', subtitle = 'Document Hub — Biblioteca compacta', initialFilters, onOpenDocument }) => {
  const [documents, setDocuments] = React.useState<CentralDocument[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [officialFilter, setOfficialFilter] = React.useState<CentralDocumentOfficialStatus | 'todos'>('todos');

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    centralPadroesDocumentHubService.listDocuments(initialFilters)
      .then(setDocuments)
      .catch((err) => setError(String((err as Error)?.message || err)))
      .finally(() => setLoading(false));
  }, [initialFilters]);

  const filtered = React.useMemo(() => {
    return documents.filter((doc) => {
      if (officialFilter !== 'todos' && doc.officialStatus !== officialFilter) return false;
      if (query.trim()) {
        const haystack = `${doc.title} ${doc.path} ${doc.category} ${doc.owner || ''} ${doc.summary || ''} ${(doc.tags || []).join(' ')}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [documents, query, officialFilter]);

  const summaryLine = (doc: CentralDocument): string => {
    if (doc.summary) return doc.summary;
    const p = doc.pathRelative || doc.path || '';
    return p.replace(/^docs\/estrutura-de-documentos-oficiais\//, '').replace(/^docs\//, '');
  };

  return (
    <CentralPageShell title={title} subtitle={subtitle} compact>
      {loading && <div className="cp-dh-loading">Carregando...</div>}
      {error && <div className="cp-dh-empty">Erro: {error}</div>}

      <div className="cp-dh-notice perm" style={{ marginBottom: 6 }}>
        🔵 Fonte oficial: Supabase — {filtered.length} documentos canônicos exibidos. Fallback local disponível apenas como backup técnico.
      </div>

      <div className="cp-dh-toolbar">
        <span className="cp-dh-toolbar-count">{filtered.length} documento{filtered.length !== 1 ? 's' : ''}</span>
        <div className="cp-dh-search">
          <span>⌕</span>
          <input placeholder="Buscar por título, owner, tag..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="cp-dh-filter-row">
          {officialFilterOptions.map((opt) => (
            <button key={opt.value} type="button" className={`cp-dh-filter-chip ${officialFilter === opt.value ? 'active' : ''}`} onClick={() => setOfficialFilter(opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {!filtered.length && !loading && <div className="cp-dh-empty">Nenhum documento encontrado. Ajuste os filtros.</div>}

      {filtered.length > 0 && (
        <table className="cp-dh-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Status</th>
              <th>Owner</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc.id} className="cp-dh-row" onClick={() => onOpenDocument?.(doc.id)}>
                <td className="cp-dh-cell-title">
                  <strong>{doc.title}</strong>
                  <small>{summaryLine(doc)}</small>
                </td>
                <td>
                  <span className={`cp-dh-chip ${chipClass(doc.officialStatus)}`}>
                    {officialStatusLabel[doc.officialStatus || 'incompleto']}
                  </span>
                </td>
                <td style={{ fontSize: '10.5px', color: 'var(--cp-muted)' }}>{doc.owner || doc.areaId || '—'}</td>
                <td className="cp-dh-cell-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="cp-dh-btn" onClick={() => onOpenDocument?.(doc.id)}>Abrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CentralPageShell>
  );
};

export default DocumentsPage;
