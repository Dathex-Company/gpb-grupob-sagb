import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { FormField } from '../components/FormField';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Toast } from '../components/Toast';
import { CentralActionBar, EditorialEventsPanel, VersionHistoryPanel } from '../components/CentralUI';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { centralPadroesIndexService } from '../services/centralPadroesIndexService';
import { centralPadroesPermissionService } from '../services/centralPadroesPermissionService';
import { centralPadroesStorageService } from '../services/centralPadroesStorageService';
import { officialStatusLabel } from '../utils/documentNormalizers';
import { CentralDocument, CentralDocumentOfficialStatus, DocumentVersion, DocumentEvent } from '../types';

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
  const [versions, setVersions] = React.useState<DocumentVersion[]>([]);
  const [events, setEvents] = React.useState<DocumentEvent[]>([]);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [restoringVersion, setRestoringVersion] = React.useState<number | null>(null);
  const [confirmRestore, setConfirmRestore] = React.useState<number | null>(null);
  const [showVersions, setShowVersions] = React.useState(false);
  const [showEvents, setShowEvents] = React.useState(false);

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
    if (!documentId) return;
    setLoadingHistory(true);
    Promise.all([
      centralPadroesCrudService.listVersions(documentId).catch(() => [] as DocumentVersion[]),
      centralPadroesCrudService.listEvents(documentId).catch(() => [] as DocumentEvent[])
    ])
      .then(([v, e]) => { setVersions(v); setEvents(e); })
      .finally(() => setLoadingHistory(false));
  }, [documentId, toast]);

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
      await centralPadroesCrudService.saveDraft(documentId, {
        title: form.title,
        content: form.content,
        summary: form.summary,
        tags,
        owner: form.owner
      });
      originalContent.current = form.content;
      setHasChanges(false);
      setToast({ message: '💾 Rascunho salvo com sucesso.', type: 'success' });
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
      const result = await centralPadroesCrudService.publishDocument(documentId, form.content, {
        title: form.title,
        summary: form.summary,
        tags,
        owner: form.owner
      });

      if (form.content.trim()) {
        await centralPadroesStorageService.uploadMarkdownDocument(documentId, document.slug || form.title, form.content).catch(() => undefined);
      }

      await centralPadroesIndexService.reindexItem(documentId).catch(() => undefined);
      originalContent.current = form.content;
      setHasChanges(false);
      setToast({ message: `✅ Documento publicado como oficial ativo (versão ${result.version}).`, type: 'success' });
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

  const restoreVersion = async (version: number) => {
    if (!documentId) return;
    if (confirmRestore !== version) {
      setConfirmRestore(version);
      setToast({ message: `⚠️ Tem certeza que deseja restaurar a versão ${version}? O conteúdo atual será substituído. Clique novamente para confirmar.`, type: 'error' });
      return;
    }
    setConfirmRestore(null);
    setRestoringVersion(version);
    try {
      const result = await centralPadroesCrudService.restoreVersion(documentId, version);
      setForm((prev) => ({ ...prev, content: '' }));
      setToast({ message: `✅ Versão ${result.restoredVersion} restaurada com sucesso.`, type: 'success' });
      // Reload document
      const doc = await centralPadroesDocumentHubService.getDocument(documentId);
      if (doc) {
        setDocument(doc);
        setForm({
          title: doc.title || '',
          summary: doc.summary || '',
          owner: doc.owner || '',
          tags: (doc.tags || []).join(', '),
          content: doc.content || ''
        });
        originalContent.current = doc.content || '';
        setHasChanges(false);
      }
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    } finally {
      setRestoringVersion(null);
    }
  };

  const eventLabel = (type: string): string => {
    switch (type) {
      case 'draft_saved': return '💾 Rascunho salvo';
      case 'published': return '⭐ Publicado';
      case 'version_restored': return '↩️ Versão restaurada';
      case 'status_changed': return '📝 Status alterado';
      default: return type;
    }
  };

  const formatDate = (date?: string | null): string => {
    if (!date) return '—';
    try { return new Date(date).toLocaleString('pt-BR'); }
    catch { return date; }
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
      <CentralActionBar>
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
      </CentralActionBar>

      {/* Toggle history panels */}
      <CentralActionBar compact>
        <button type="button" className="cp-docs-btn-secondary" onClick={() => setShowVersions((v) => !v)}>
          {showVersions ? '🔼 Ocultar' : '📜'} Histórico de versões ({versions.length})
        </button>
        <button type="button" className="cp-docs-btn-secondary" onClick={() => setShowEvents((v) => !v)}>
          {showEvents ? '🔼 Ocultar' : '📋'} Eventos editoriais ({events.length})
        </button>
      </CentralActionBar>

      {/* Version history panel */}
      {showVersions && (
        <VersionHistoryPanel
          versions={versions}
          loading={loadingHistory}
          canEdit={canEdit}
          restoringVersion={restoringVersion}
          confirmRestore={confirmRestore}
          onRestore={restoreVersion}
          formatDate={formatDate}
          getStatusLabel={(status) => status ? (officialStatusLabel[status as CentralDocumentOfficialStatus] || status) : '—'}
        />
      )}

      {/* Events panel */}
      {showEvents && (
        <EditorialEventsPanel
          events={events}
          loading={loadingHistory}
          formatDate={formatDate}
          getEventLabel={eventLabel}
          getStatusLabel={(status) => status ? (officialStatusLabel[status as CentralDocumentOfficialStatus] || status) : '—'}
        />
      )}

      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentoEditorPage;
