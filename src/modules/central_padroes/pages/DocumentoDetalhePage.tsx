import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Toast } from '../components/Toast';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { centralPadroesMarkdownContentService } from '../services/centralPadroesMarkdownContentService';
import { officialStatusLabel } from '../utils/documentNormalizers';
import { CentralDocument, CentralDocumentOfficialStatus } from '../types';

type DocumentoDetalhePageProps = {
  documentId: string | null;
  onBack: () => void;
  onEdit?: (documentId: string) => void;
  onSendToCuradoria?: (document: CentralDocument) => void;
};

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

/** Mapeia areaId (agente) para domínio real */
const domainLabel = (areaId?: string): string => {
  const map: Record<string, string> = {
    pietro: 'Governança', savio: 'Técnico', yuri: 'Processos', pedro: 'Segurança',
    alice: 'UX/UI', pierre: 'IA e Orquestração', klaus: 'Modelos IA', noah: 'Naming',
    dante: 'Exploração', nilo: 'Metodologias', julio: 'Educação', cesar: 'Negócios',
    tales: 'RI e Capital',
  };
  return map[areaId || ''] || areaId || '—';
};

const DocumentoDetalhePage: React.FC<DocumentoDetalhePageProps> = ({ documentId, onBack, onEdit, onSendToCuradoria }) => {
  const [document, setDocument] = React.useState<CentralDocument | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  React.useEffect(() => {
    if (!documentId) { setDocument(null); return; }
    setLoading(true); setError(null);
    centralPadroesDocumentHubService.getDocument(documentId)
      .then((doc) => {
        if (doc) {
          // Enriquece com conteúdo real do .md local se não tiver conteúdo do Supabase
          const enriched = centralPadroesMarkdownContentService.enrichWithContent(doc);
          setDocument(enriched);
        } else {
          setDocument(null);
        }
      })
      .catch((err) => setError(String((err as Error)?.message || err)))
      .finally(() => setLoading(false));
  }, [documentId]);

  const copyPath = async () => {
    const path = document?.pathRelative || document?.path || '';
    if (!path) return;
    try { await navigator.clipboard?.writeText(path); setToast({ message: 'Caminho copiado.', type: 'success' }); }
    catch { setToast({ message: path, type: 'success' }); }
  };

  const displayPath = () => document?.pathRelative || document?.path || '—';

  if (!documentId) {
    return <CentralPageShell title="Documento" subtitle="Nenhum selecionado." compact><button className="cp-dh-btn" onClick={onBack}>← Voltar</button></CentralPageShell>;
  }

  const hasContent = !!(document?.content?.trim());

  return (
    <CentralPageShell title="Detalhe" subtitle={document?.title || 'Documento'} compact>
      <div className="cp-dh-detail-actions" style={{ marginBottom: 8 }}>
        <button className="cp-dh-btn" onClick={onBack}>← Voltar</button>
        <button className="cp-dh-btn" onClick={copyPath}>📋 Copiar</button>
        <button className="cp-dh-btn" onClick={() => document && onEdit?.(document.id)}>✏️ Editar</button>
        <button className="cp-dh-btn" onClick={() => document && onSendToCuradoria?.(document)}>📦 Curadoria</button>
      </div>

      {loading && <div className="cp-dh-loading">Carregando...</div>}
      {error && <div className="cp-dh-empty">Erro: {error}</div>}
      {!loading && !error && !document && <div className="cp-dh-empty">Documento não encontrado.</div>}

      {document && (
        <div className="cp-dh-detail">
          <div className="cp-dh-detail-header">
            <div>
              <h2 className="cp-dh-detail-title">{document.title}</h2>
              {document.summary && <p className="cp-dh-detail-summary">{document.summary}</p>}
            </div>
            <div className="cp-dh-detail-badges">
              <span className={`cp-dh-chip ${chipClass(document.officialStatus)}`}>{officialStatusLabel[document.officialStatus || 'incompleto']}</span>
              {hasContent && <span className="cp-dh-chip active">Conteúdo</span>}
            </div>
          </div>

          <p className="cp-dh-section-title">Metadados</p>
          <div className="cp-dh-meta-grid">
            <div className="cp-dh-meta-item"><span className="cp-dh-meta-label">Domínio</span><span className="cp-dh-meta-value">{domainLabel(document.areaId)}</span></div>
            <div className="cp-dh-meta-item"><span className="cp-dh-meta-label">Tipo</span><span className="cp-dh-meta-value">{document.type || '—'}</span></div>
            <div className="cp-dh-meta-item"><span className="cp-dh-meta-label">Status</span><span className="cp-dh-meta-value">{document.status || '—'}</span></div>
            <div className="cp-dh-meta-item"><span className="cp-dh-meta-label">Risco</span><span className="cp-dh-meta-value">{document.riskLevel || '—'}</span></div>
            <div className="cp-dh-meta-item"><span className="cp-dh-meta-label">Owner</span><span className="cp-dh-meta-value">{document.owner || '—'}</span></div>
            <div className="cp-dh-meta-item"><span className="cp-dh-meta-label">Origem</span><span className="cp-dh-meta-value">{document.source || '—'}</span></div>
            <div className="cp-dh-meta-item" style={{ gridColumn: '1 / -1' }}>
              <span className="cp-dh-meta-label">Caminho</span>
              <code style={{ fontSize: 9.5, wordBreak: 'break-all', color: 'var(--cp-soft)', fontFamily: 'monospace' }}>{displayPath()}</code>
            </div>
          </div>

          {document.tags?.length ? (
            <>
              <p className="cp-dh-section-title">Tags</p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                {document.tags.map((t) => <span key={t} className="cp-dh-chip">{t}</span>)}
              </div>
            </>
          ) : null}

          <p className="cp-dh-section-title">Conteúdo</p>
          <div className="cp-dh-preview">
            <MarkdownPreview content={document.content} emptyMessage={hasContent ? undefined : 'Conteúdo não disponível. O arquivo .md pode não ter sido encontrado.'} />
          </div>
        </div>
      )}
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentoDetalhePage;
