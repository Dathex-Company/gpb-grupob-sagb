import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { CentralDocument } from '../types';

type DocumentoDetalhePageProps = {
  documentId: string | null;
  onBack: () => void;
  onEdit?: (documentId: string) => void;
  onSendToCuradoria?: (document: CentralDocument) => void;
};

const field = (label: string, value?: React.ReactNode) => (
  <div className="cp-doc-detail-field">
    <span>{label}</span>
    <strong>{value || '—'}</strong>
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
        <button type="button" className="cp-docs-top-link" onClick={onBack}>Voltar para documentos</button>
      </CentralPageShell>
    );
  }

  return (
    <CentralPageShell title={document?.title || 'Documento'} subtitle="Detalhe documental read-only. Salvamento persistente de markdown depende da etapa R5.">
      <div className="cp-doc-detail-actions">
        <button type="button" className="cp-docs-top-link" onClick={onBack}>← Voltar</button>
        <button type="button" className="cp-docs-top-link" onClick={copyPath} disabled={!document}>Copiar caminho</button>
        <button type="button" className="cp-docs-top-link" onClick={() => document && onEdit?.(document.id)} disabled={!document}>Editar markdown</button>
        <button type="button" className="cp-docs-top-link primary" onClick={() => document && onSendToCuradoria?.(document)} disabled={!document}>Enviar para curadoria</button>
      </div>

      {loading && <div className="cp-docs-inline-alert">Carregando detalhe documental...</div>}
      {error && <div className="cp-docs-inline-alert error">Falha ao carregar documento: {error}</div>}
      {!loading && !error && !document && <div className="cp-docs-inline-alert error">Documento não encontrado.</div>}

      {document && (
        <div className="cp-doc-detail-grid">
          <section className="cp-docs-panel">
            <p className="cp-docs-kicker">Metadados</p>
            <h2>{document.title}</h2>
            <div className="cp-doc-detail-status-row">
              <StatusBadge value={document.status} />
              {document.isIncomplete && <span className="cp-visual-badge attention">incompleto</span>}
              <span className="cp-visual-badge info">{document.source}</span>
            </div>
            <div className="cp-doc-detail-fields">
              {field('Tipo', document.type)}
              {field('Risco', document.riskLevel)}
              {field('Owner', document.owner)}
              {field('Área', document.areaId)}
              {field('Categoria', document.category)}
              {field('Destino', document.shouldBecome)}
              {field('Nível canônico', document.canonicalLevel)}
              {field('Módulo', document.module)}
              {field('Divisão', document.division)}
              {field('Conteúdo', document.contentAvailability)}
            </div>
            <div className="cp-doc-detail-tags">
              {(document.tags || []).map((tag) => <span key={tag}>#{tag}</span>)}
              {!document.tags?.length && <span>sem tags</span>}
            </div>
            {document.incompleteReasons?.length ? (
              <div className="cp-docs-inline-alert">Lacunas: {document.incompleteReasons.join(', ')}</div>
            ) : null}
          </section>

          <section className="cp-docs-panel">
            <p className="cp-docs-kicker">Caminhos</p>
            {field('Relativo', document.pathRelative || document.path)}
            {field('Absoluto', document.pathAbsolute)}
            {field('Slug', document.slug)}
            <p className="cp-doc-detail-summary">{document.summary || 'Sem resumo disponível.'}</p>
          </section>

          <section className="cp-docs-panel cp-doc-detail-preview">
            <p className="cp-docs-kicker">Preview markdown</p>
            <MarkdownPreview content={document.content} />
          </section>
        </div>
      )}
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentoDetalhePage;
