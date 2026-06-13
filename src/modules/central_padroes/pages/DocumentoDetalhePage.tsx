import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { officialStatusLabel } from '../utils/documentNormalizers';
import { CentralDocument, CentralDocumentOfficialStatus } from '../types';

type DocumentoDetalhePageProps = {
  documentId: string | null;
  onBack: () => void;
  onEdit?: (documentId: string) => void;
  onSendToCuradoria?: (document: CentralDocument) => void;
};

const officialStatusBadgeClass = (status?: CentralDocumentOfficialStatus): string => {
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

const MetaCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="cp-meta-card">
    <span className="cp-meta-card-label">{label}</span>
    <span className="cp-meta-card-value">{value || '—'}</span>
  </div>
);

const DocumentoDetalhePage: React.FC<DocumentoDetalhePageProps> = ({ documentId, onBack, onEdit, onSendToCuradoria }) => {
  const [document, setDocument] = React.useState<CentralDocument | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  React.useEffect(() => {
    if (!documentId) {
      setDocument(null);
      return;
    }
    setLoading(true);
    setError(null);
    centralPadroesDocumentHubService.getDocument(documentId)
      .then(setDocument)
      .catch((err) => setError(String((err as Error)?.message || err)))
      .finally(() => setLoading(false));
  }, [documentId]);

  const copyPath = async () => {
    const path = document?.pathAbsolute || document?.pathRelative || document?.path;
    if (!path) return;
    try {
      await navigator.clipboard?.writeText(path);
      setToast({ message: 'Caminho copiado.', type: 'success' });
    } catch {
      setToast({ message: path, type: 'success' });
    }
  };

  if (!documentId) {
    return (
      <CentralPageShell title="Documento" subtitle="Nenhum documento selecionado.">
        <button type="button" className="cp-docs-top-link" onClick={onBack}>← Voltar para documentos</button>
      </CentralPageShell>
    );
  }

  return (
    <CentralPageShell title={document?.title || 'Documento'} subtitle="Document Hub V2 — Detalhe documental">
      <div className="cp-doc-detail-actions">
        <button type="button" className="cp-docs-top-link" onClick={onBack}>← Voltar</button>
        <button type="button" className="cp-docs-top-link" onClick={copyPath} disabled={!document}>📋 Copiar caminho</button>
        <button type="button" className="cp-docs-top-link" onClick={() => document && onEdit?.(document.id)} disabled={!document}>✏️ Editar documento</button>
        <button type="button" className="cp-docs-top-link primary" onClick={() => document && onSendToCuradoria?.(document)} disabled={!document}>📦 Enviar para curadoria</button>
      </div>

      {loading && <div className="cp-docs-inline-alert">Carregando detalhe documental...</div>}
      {error && <div className="cp-docs-inline-alert error">Falha ao carregar documento: {error}</div>}
      {!loading && !error && !document && <div className="cp-docs-inline-alert error">Documento não encontrado.</div>}

      {document && (
        <div className="cp-doc-detail-v2">
          {/* Header */}
          <section className="cp-doc-detail-header">
            <div className="cp-doc-detail-title-row">
              <h2 className="cp-doc-detail-title">{document.title}</h2>
              <div className="cp-doc-detail-badges">
                <span className={officialStatusBadgeClass(document.officialStatus)}>
                  {officialStatusLabel[document.officialStatus || 'incompleto']}
                </span>
                <StatusBadge value={document.status} />
                {document.isIncomplete && <span className="cp-visual-badge attention">⚠️ incompleto</span>}
              </div>
            </div>
            {document.summary && <p className="cp-doc-detail-summary">{document.summary}</p>}
          </section>

          {/* Metadata grid */}
          <section className="cp-doc-detail-metadata">
            <p className="cp-docs-kicker">Metadados</p>
            <div className="cp-meta-grid">
              <MetaCard label="Tipo" value={document.type} />
              <MetaCard label="Status técnico" value={document.status} />
              <MetaCard label="Status oficial" value={officialStatusLabel[document.officialStatus || 'incompleto']} />
              <MetaCard label="Risco" value={document.riskLevel} />
              <MetaCard label="Owner" value={document.owner} />
              <MetaCard label="Área" value={document.areaId} />
              <MetaCard label="Categoria" value={document.category} />
              <MetaCard label="Destino" value={document.shouldBecome} />
              <MetaCard label="Nível canônico" value={document.canonicalLevel} />
              <MetaCard label="Módulo" value={document.module} />
              <MetaCard label="Divisão" value={document.division} />
              <MetaCard label="Origem" value={document.source} />
              <MetaCard label="Conteúdo" value={document.contentAvailability} />
            </div>
          </section>

          {/* Paths */}
          <section className="cp-doc-detail-paths">
            <p className="cp-docs-kicker">Caminhos</p>
            <div className="cp-path-list">
              <div className="cp-path-item">
                <span className="cp-path-label">Relativo</span>
                <code className="cp-path-value">{document.pathRelative || document.path || '—'}</code>
              </div>
              <div className="cp-path-item">
                <span className="cp-path-label">Absoluto</span>
                <code className="cp-path-value">{document.pathAbsolute || '—'}</code>
              </div>
              <div className="cp-path-item">
                <span className="cp-path-label">Slug</span>
                <code className="cp-path-value">{document.slug || '—'}</code>
              </div>
            </div>
          </section>

          {/* Tags */}
          <section className="cp-doc-detail-tags">
            <p className="cp-docs-kicker">Tags</p>
            <div className="cp-tags-row">
              {(document.tags || []).map((tag) => (
                <span key={tag} className="cp-tag">#{tag}</span>
              ))}
              {!document.tags?.length && <span className="cp-muted-text">Nenhuma tag associada</span>}
            </div>
          </section>

          {/* Lacunas */}
          {document.incompleteReasons?.length ? (
            <section className="cp-doc-detail-gaps">
              <p className="cp-docs-kicker">Lacunas detectadas</p>
              <div className="cp-gaps-list">
                {document.incompleteReasons.map((reason) => (
                  <span key={reason} className="cp-gap-item">⚠️ {reason.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </section>
          ) : null}

          {/* Preview */}
          <section className="cp-doc-detail-preview">
            <p className="cp-docs-kicker">Conteúdo</p>
            <MarkdownPreview content={document.content} emptyMessage="Este documento não possui conteúdo markdown. Use o editor para adicionar conteúdo." />
          </section>
        </div>
      )}
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentoDetalhePage;
