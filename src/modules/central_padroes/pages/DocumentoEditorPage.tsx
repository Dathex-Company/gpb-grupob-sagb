import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { FormField } from '../components/FormField';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { Toast } from '../components/Toast';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { centralPadroesIndexService } from '../services/centralPadroesIndexService';
import { centralPadroesPermissionService } from '../services/centralPadroesPermissionService';
import { centralPadroesStorageService } from '../services/centralPadroesStorageService';
import { CentralDocument } from '../types';

type DocumentoEditorPageProps = {
  documentId: string | null;
  onBack: () => void;
  onSaved?: (documentId: string) => void;
};

const DocumentoEditorPage: React.FC<DocumentoEditorPageProps> = ({ documentId, onBack, onSaved }) => {
  const [document, setDocument] = React.useState<CentralDocument | null>(null);
  const [form, setForm] = React.useState({ title: '', summary: '', owner: '', tags: '', content: '' });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  React.useEffect(() => {
    if (!documentId) return;
    setLoading(true);
    centralPadroesDocumentHubService.getDocument(documentId)
      .then((doc) => {
        setDocument(doc);
        setForm({
          title: doc?.title || '',
          summary: doc?.summary || '',
          owner: doc?.owner || '',
          tags: (doc?.tags || []).join(', '),
          content: doc?.content || ''
        });
      })
      .catch((err) => setToast({ message: String((err as Error)?.message || err), type: 'error' }))
      .finally(() => setLoading(false));
  }, [documentId]);

  const role = centralPadroesPermissionService.getCurrentRole();
  const canEdit = centralPadroesPermissionService.canEditDocument(role, document || undefined);

  const save = async () => {
    if (!documentId || !document) return;
    if (!canEdit) {
      setToast({ message: 'Seu perfil não pode editar este documento.', type: 'error' });
      return;
    }
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
        content: form.content
      });

      if (form.content.trim()) {
        await centralPadroesStorageService.uploadMarkdownDocument(documentId, document.slug || form.title, form.content).catch(() => undefined);
      }

      await centralPadroesIndexService.reindexItem(documentId).catch(() => undefined);
      setToast({ message: 'Documento salvo e índice invalidado para reindexação.', type: 'success' });
      onSaved?.(documentId);
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CentralPageShell title="Editor de Documento" subtitle="Editor persistente do Document Hub V1. Requer schema/RPC/storage R5 aplicados no ambiente alvo.">
      <div className="cp-doc-detail-actions">
        <button type="button" className="cp-docs-top-link" onClick={onBack}>← Voltar</button>
        <button type="button" className="cp-docs-top-link primary" onClick={save} disabled={saving || loading || !canEdit}>{saving ? 'Salvando...' : 'Salvar conteúdo'}</button>
      </div>
      {loading && <div className="cp-docs-inline-alert">Carregando documento...</div>}
      {!canEdit && <div className="cp-docs-inline-alert error">Editor em modo somente leitura para o seu perfil.</div>}
      <section className="cp-docs-panel">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
          <FormField label="Owner" value={form.owner} onChange={(value) => setForm((prev) => ({ ...prev, owner: value }))} />
          <FormField label="Tags (separadas por vírgula)" value={form.tags} onChange={(value) => setForm((prev) => ({ ...prev, tags: value }))} />
          <FormField label="Resumo" value={form.summary} onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))} />
        </div>
      </section>
      <MarkdownEditor value={form.content} onChange={(value) => setForm((prev) => ({ ...prev, content: value }))} disabled={!canEdit} />
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentoEditorPage;

