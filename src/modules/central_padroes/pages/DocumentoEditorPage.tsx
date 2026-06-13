import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { FormField } from '../components/FormField';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Toast } from '../components/Toast';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { centralPadroesIndexService } from '../services/centralPadroesIndexService';
import { centralPadroesPermissionService } from '../services/centralPadroesPermissionService';
import { centralPadroesStorageService } from '../services/centralPadroesStorageService';
import { officialStatusLabel } from '../utils/documentNormalizers';
import { CentralDocument, CentralDocumentOfficialStatus } from '../types';

type DocumentoEditorPageProps = {
  documentId: string | null;
  onBack: () => void;
  onSaved?: (documentId: string) => void;
};

type EditorMode = 'read' | 'edit';

const DocumentoEditorPage: React.FC<DocumentoEditorPageProps> = ({ documentId, onBack, onSaved }) => {
  const [document, setDocument] = React.useState<CentralDocument | null>(null);
  const [form, setForm] = React.useState({ title: '', summary: '', owner: '', tags: '', content: '' });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [mode, setMode] = React.useState<EditorMode>('read');
  const [hasChanges, setHasChanges] = React.useState(false);
  const [confirmPublish, setConfirmPublish] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const originalContent = React.useRef('');

  React.useEffect(() => {
    if (!documentId) return;
    setLoading(true);
    centralPadroesDocumentHubService.getDocument(documentId)
      .then((doc) => {
        setDocument(doc);
        const content = doc?.content || '';
        originalContent.current = content;
        setForm({
          title: doc?.title || '',
          summary: doc?.summary || '',
          owner: doc?.owner || '',
          tags: (doc?.tags || []).join(', '),
          content
        });
      })
      .catch((err) => setToast({ message: String((err as Error)?.message || err), type: 'error' }))
      .finally(() => setLoading(false));
  }, [documentId]);

  React.useEffect(() => {
    setHasChanges(form.content !== originalContent.current);
  }, [form.content]);

  const role = centralPadroesPermissionService.getCurrentRole();
  const canEdit = centralPadroesPermissionService.canEditDocument(role, document || undefined);
  const isOfficial = document?.officialStatus === 'oficial_ativo';

  const saveDraft = async () => {
    if (!documentId || !document) return;
    setSaving(true);
    try {
      const tags = form.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      await centralPadroesCrudService.updateDocument(documentId, {
        title: form.title,
        path: document.path,
        category: document.category,
        areaId: document.areaId,
        shouldBecome: document.shouldBecome,
        summary: form.summary,
        owner: form.owner,
        tags,
        content: form.content,
        status: 'bruto',
        officialStatus: 'rascunho' as CentralDocumentOfficialStatus
      });
      originalContent.current = form.content;
      setHasChanges(false);
      setToast({ message: 'Rascunho salvo com sucesso.', type: 'success' });
      onSaved?.(documentId);
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const publishOfficial = async () => {
    if (!documentId || !document) return;
    if (isOfficial && !confirmPublish) {
      setConfirmPublish(true);
      setToast({ message: '⚠️ Você está alterando um documento oficial ativo. Confirme novamente para publicar.', type: 'error' });
      return;
    }
    setSaving(true);
    setConfirmPublish(false);
    try {
      const tags = form.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      await centralPadroesCrudService.updateDocument(documentId, {
        title: form.title,
        path: document.path,
        category: document.category,
        areaId: document.areaId,
        shouldBecome: document.shouldBecome,
        summary: form.summary,
        owner: form.owner,
        tags,
        content: form.content,
        status: 'canonico',
        officialStatus: 'oficial_ativo' as CentralDocumentOfficialStatus
      });

      if (form.content.trim()) {
        await centralPadroesStorageService.uploadMarkdownDocument(documentId, document.slug || form.title, form.content).catch(() => undefined);
      }

      await centralPadroesIndexService.reindexItem(documentId).catch(() => undefined);
      originalContent.current = form.content;
      setHasChanges(false);
      setToast({ message: '✅ Documento publicado como oficial ativo.', type: 'success' });
      onSaved?.(documentId);
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    setForm((prev) => ({ ...prev, content: originalContent.current }));
    setHasChanges(false);
    setToast({ message: 'Alterações descartadas.', type: 'success' });
  };

  return (
    <CentralPageShell title="Editor de Documento" subtitle={document?.title || 'Document Hub V2 — Editor vivo'}>
      <div className="cp-doc-detail-actions">
        <button type="button" className="cp-docs-top-link" onClick={onBack}>← Voltar</button>
        <div className="cp-docs-filters">
          <button type="button" className={`cp-docs-filter ${mode === 'read' ? 'active' : ''}`} onClick={() => setMode('read')}>👁️ Leitura</button>
          <button type="button" className={`cp-docs-filter ${mode === 'edit' ? 'active' : ''}`} onClick={() => { if (canEdit) setMode('edit'); else setToast({ message: 'Seu perfil não permite edição.', type: 'error' }); }}>✏️ Edição</button>
        </div>
      </div>

      {loading && <div className="cp-docs-inline-alert">Carregando documento...</div>}
      {!canEdit && <div className="cp-docs-inline-alert attention">🔒 Modo somente leitura para o seu perfil. A edição persistente depende de R5 aplicado no ambiente.</div>}

      {/* Status bar */}
      {document && (
        <div className="cp-editor-status-bar">
          <span>Status oficial: <strong>{officialStatusLabel[document.officialStatus || 'incompleto']}</strong></span>
          {hasChanges && <span className="cp-visual-badge attention">⚠️ Alterações não salvas</span>}
          {isOfficial && <span className="cp-visual-badge safe">⭐ Documento oficial ativo</span>}
        </div>
      )}

      {/* Metadata form */}
      <section className="cp-docs-panel">
        <p className="cp-docs-kicker">Metadados</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} disabled={!canEdit || mode === 'read'} />
          <FormField label="Owner" value={form.owner} onChange={(value) => setForm((prev) => ({ ...prev, owner: value }))} disabled={!canEdit || mode === 'read'} />
          <FormField label="Tags (separadas por vírgula)" value={form.tags} onChange={(value) => setForm((prev) => ({ ...prev, tags: value }))} disabled={!canEdit || mode === 'read'} />
          <FormField label="Resumo" value={form.summary} onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))} disabled={!canEdit || mode === 'read'} />
        </div>
      </section>

      {/* Content area — editor or preview */}
      {mode === 'edit' ? (
        <MarkdownEditor value={form.content} onChange={(value) => setForm((prev) => ({ ...prev, content: value }))} disabled={!canEdit} />
      ) : (
        <section className="cp-docs-panel" onClick={() => { if (canEdit) setMode('edit'); }}>
          <p className="cp-docs-kicker">Conteúdo (clique para editar)</p>
          <div className="cp-editor-readonly-area">
            <MarkdownPreview content={form.content} emptyMessage="Nenhum conteúdo. Clique em Editar para começar a escrever." />
          </div>
        </section>
      )}

      {/* Action buttons */}
      <div className="cp-editor-actions">
        <button type="button" className="cp-docs-btn-secondary" onClick={discardChanges} disabled={!hasChanges || saving}>
          ↩️ Descartar alterações
        </button>
        <button type="button" className="cp-docs-btn-secondary" onClick={saveDraft} disabled={saving || !canEdit}>
          💾 Salvar rascunho
        </button>
        <button
          type="button"
          className={`cp-docs-btn-primary ${confirmPublish ? 'cp-docs-btn-danger' : ''}`}
          onClick={publishOfficial}
          disabled={saving || !canEdit}
        >
          {confirmPublish ? '⚠️ Confirmar publicação' : '⭐ Publicar como oficial'}
        </button>
      </div>

      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentoEditorPage;
