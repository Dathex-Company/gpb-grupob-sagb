import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Toast } from '../components/Toast';
import { EditorialEventsPanel, VersionHistoryPanel } from '../components/CentralUI';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';
import { centralPadroesDocumentHubService } from '../services/centralPadroesDocumentHubService';
import { centralPadroesIndexService } from '../services/centralPadroesIndexService';
import { centralPadroesMarkdownContentService } from '../services/centralPadroesMarkdownContentService';
import { centralPadroesStorageService } from '../services/centralPadroesStorageService';
import { officialStatusLabel } from '../utils/documentNormalizers';
import { CentralDocumentOfficialStatus, DocumentVersion, DocumentEvent } from '../types';

type DocumentoEditorPageProps = { documentId: string | null; onBack: () => void; onSaved?: (id: string) => void };

const DocumentoEditorPage: React.FC<DocumentoEditorPageProps> = ({ documentId, onBack, onSaved }) => {
  const [document, setDocument] = React.useState<any>(null);
  const [form, setForm] = React.useState({ title: '', summary: '', owner: '', tags: '', content: '' });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
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
  const [preview, setPreview] = React.useState(false);
  const [showMeta, setShowMeta] = React.useState(false);

  const originalContent = React.useRef('');

  React.useEffect(() => {
    if (!documentId) return;
    setLoading(true);
    centralPadroesDocumentHubService.getDocument(documentId)
      .then((doc) => {
        if (doc) {
          const enriched = centralPadroesMarkdownContentService.enrichWithContent(doc);
          setDocument(enriched);
          const c = enriched.content || '';
          originalContent.current = c;
          setForm({ title: enriched.title || '', summary: enriched.summary || '', owner: enriched.owner || '', tags: (enriched.tags || []).join(', '), content: c });
        }
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
    ]).then(([v, e]) => { setVersions(v); setEvents(e); }).finally(() => setLoadingHistory(false));
  }, [documentId, toast]);

  React.useEffect(() => { setHasChanges(form.content !== originalContent.current); }, [form.content]);

  const isOfficial = document?.officialStatus === 'oficial_ativo';

  const saveChanges = async () => {
    if (!documentId) return;
    setSaving(true);
    try {
      const tags = form.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      await centralPadroesCrudService.saveDraft(documentId, { title: form.title, content: form.content, summary: form.summary, tags, owner: form.owner });
      originalContent.current = form.content; setHasChanges(false);
      setToast({ message: '✅ Alterações salvas.', type: 'success' }); onSaved?.(documentId);
    } catch (err) { setToast({ message: String((err as Error)?.message || err), type: 'error' }); }
    finally { setSaving(false); }
  };

  const publishOfficial = async () => {
    if (!documentId || !document) return;
    if (isOfficial && !confirmPublish) { setConfirmPublish(true); setToast({ message: '⚠️ Documento oficial ativo — confirme novamente.', type: 'error' }); return; }
    setSaving(true); setConfirmPublish(false);
    try {
      const tags = form.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      const result = await centralPadroesCrudService.publishDocument(documentId, form.content, { title: form.title, summary: form.summary, tags, owner: form.owner });
      if (form.content.trim()) await centralPadroesStorageService.uploadMarkdownDocument(documentId, document.slug || form.title, form.content).catch(() => undefined);
      await centralPadroesIndexService.reindexItem(documentId).catch(() => undefined);
      originalContent.current = form.content; setHasChanges(false);
      setToast({ message: `✅ Publicado como oficial (v${result.version}).`, type: 'success' }); onSaved?.(documentId);
    } catch (err) {
      setToast({ message: `Alteração preparada, mas a persistência depende das permissões do ambiente. ${String((err as Error)?.message || err)}`, type: 'error' });
    } finally { setSaving(false); }
  };

  const discardChanges = () => { setForm((p) => ({ ...p, content: originalContent.current })); setHasChanges(false); setToast({ message: 'Alterações descartadas.', type: 'success' }); };

  const restoreVersion = async (version: number) => {
    if (!documentId) return;
    if (confirmRestore !== version) { setConfirmRestore(version); setToast({ message: `Restaurar v${version}? Clique novamente.`, type: 'error' }); return; }
    setConfirmRestore(null); setRestoringVersion(version);
    try {
      await centralPadroesCrudService.restoreVersion(documentId, version);
      setToast({ message: `✅ v${version} restaurada.`, type: 'success' });
      const doc = await centralPadroesDocumentHubService.getDocument(documentId);
      if (doc) {
        const enriched = centralPadroesMarkdownContentService.enrichWithContent(doc);
        setDocument(enriched); const c = enriched.content || ''; originalContent.current = c;
        setForm({ title: enriched.title || '', summary: enriched.summary || '', owner: enriched.owner || '', tags: (enriched.tags || []).join(', '), content: c }); setHasChanges(false);
      }
    } catch (err) { setToast({ message: String((err as Error)?.message || err), type: 'error' }); }
    finally { setRestoringVersion(null); }
  };

  const eventLabel = (t: string) => ({ draft_saved: 'Rascunho', published: 'Publicado', version_restored: 'Restaurado', status_changed: 'Status' } as Record<string, string>)[t] || t;
  const fmt = (d?: string | null) => { if (!d) return '—'; try { return new Date(d).toLocaleString('pt-BR'); } catch { return d; } };

  return (
    <CentralPageShell title={document?.title || 'Editor'} subtitle="" compact>
      {/* Sticky toolbar */}
      <div className="cp-dh-sticky-bar">
        <div className="cp-dh-sticky-left">
          <button className="cp-dh-btn" onClick={onBack}>← Voltar</button>
          <button className="cp-dh-btn" onClick={() => setPreview((v) => !v)}>{preview ? '✏️ Editar' : '👁 Preview'}</button>
          {hasChanges && <span className="cp-dh-chip review">Alterações pendentes</span>}
          {isOfficial && <span className="cp-dh-chip active">Oficial ativo</span>}
        </div>
        <div className="cp-dh-sticky-right">
          <button className="cp-dh-btn-outline" onClick={discardChanges} disabled={!hasChanges || saving}>Descartar</button>
          <button className="cp-dh-btn-primary" onClick={saveChanges} disabled={saving || !hasChanges}>
            💾 Salvar alterações
          </button>
          <button className="cp-dh-btn-primary" onClick={publishOfficial} disabled={saving} style={{ background: 'var(--cp-green)' }}>
            {confirmPublish ? '⚠️ Confirmar' : '⭐ Publicar'}
          </button>
        </div>
      </div>

      {loading && <div className="cp-dh-loading">Carregando...</div>}

      {/* Metadata — collapsible */}
      <div className="cp-dh-meta-toggle">
        <button className="cp-dh-btn" onClick={() => setShowMeta((v) => !v)}>
          {showMeta ? '🔼' : '🔽'} Metadados {showMeta ? '' : '(recolhido)'}
        </button>
        {showMeta && (
          <div className="cp-dh-editor-fields" style={{ marginTop: 6 }}>
            <div className="cp-dh-editor-field"><label>Título</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
            <div className="cp-dh-editor-field"><label>Owner</label><input value={form.owner} onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))} /></div>
            <div className="cp-dh-editor-field"><label>Tags (vírgula)</label><input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} /></div>
            <div className="cp-dh-editor-field" style={{ gridColumn: '1 / -1' }}><label>Resumo</label><input value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} /></div>
          </div>
        )}
      </div>

      {/* Content area */}
      {preview ? (
        <div className="cp-dh-preview"><MarkdownPreview content={form.content} emptyMessage="Nenhum conteúdo." /></div>
      ) : (
        <MarkdownEditor value={form.content} onChange={(v) => setForm((p) => ({ ...p, content: v }))} />
      )}

      {/* Bottom sticky bar — duplicate for accessibility */}
      <div className="cp-dh-sticky-bar bottom">
        <div className="cp-dh-sticky-left">
          <span style={{ fontSize: 10, color: 'var(--cp-muted)' }}>{form.content.length} caracteres | {form.content.split('\n').length} linhas</span>
        </div>
        <div className="cp-dh-sticky-right">
          <button className="cp-dh-btn-outline" onClick={() => setShowVersions((v) => !v)}>{showVersions ? 'Ocultar' : 'Histórico'} ({versions.length})</button>
          <button className="cp-dh-btn-outline" onClick={() => setShowEvents((v) => !v)}>{showEvents ? 'Ocultar' : 'Eventos'} ({events.length})</button>
        </div>
      </div>

      {showVersions && <VersionHistoryPanel versions={versions} loading={loadingHistory} canEdit={true} restoringVersion={restoringVersion} confirmRestore={confirmRestore} onRestore={restoreVersion} formatDate={fmt} getStatusLabel={(s) => s ? (officialStatusLabel[s as CentralDocumentOfficialStatus] || s) : '—'} />}
      {showEvents && <EditorialEventsPanel events={events} loading={loadingHistory} formatDate={fmt} getEventLabel={eventLabel} getStatusLabel={(s) => s ? (officialStatusLabel[s as CentralDocumentOfficialStatus] || s) : '—'} />}
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentoEditorPage;
