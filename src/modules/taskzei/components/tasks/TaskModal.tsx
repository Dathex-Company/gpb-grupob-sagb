// ============================================================================
// TaskModal.tsx — Modal Central de Tarefa V1
// Module: taskzei (v1.17.0)
// Feature: ET D21 — Motor de Campos Personalizados & Modal Central V1
// ============================================================================

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TaskzeiTaskInlineInput } from '../../types/taskzei.contracts';
import { TaskzeiTask } from '../../types/task.types';
import { CustomFieldRenderer } from './CustomFieldRenderer';
import { useCustomFieldStore } from '../../store/customFieldStore';

// ─── Tipos ───────────────────────────────────────────────────

type ModalMode = 'create' | 'edit';

interface TaskModalProps {
  mode: ModalMode;
  /** Tarefa existente para edição */
  task?: TaskzeiTask | null;
  /** Callback ao salvar (create ou update) */
  onSave: (input: TaskzeiTaskInlineInput) => Promise<void>;
  /** Callback ao fechar */
  onClose: () => void;
  /** Loading state */
  saving?: boolean;
}

type TabKey = 'details' | 'customFields' | 'attachments';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'details', label: 'Detalhes' },
  { key: 'customFields', label: 'Campos Personalizados' },
  { key: 'attachments', label: 'Anexos' },
];

// ─── Componente ──────────────────────────────────────────────

export const TaskModal: React.FC<TaskModalProps> = ({
  mode,
  task,
  onSave,
  onClose,
  saving = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('details');
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskzeiTask['priority']>(task?.priority || 'media');
  const [status, setStatus] = useState<TaskzeiTask['status']>(task?.status || 'aberta');
  const [assigneeName, setAssigneeName] = useState(task?.assigneeName || '');
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || '');
  const [internalDescription, setInternalDescription] = useState(task?.internalDescription || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : '');

  const titleRef = useRef<HTMLInputElement>(null);

  // Foco no título ao abrir
  useEffect(() => {
    if (mode === 'create') {
      titleRef.current?.focus();
    }
  }, [mode]);

  // Carrega definições de custom fields
  const { loadDefinitions } = useCustomFieldStore();
  useEffect(() => {
    loadDefinitions();
  }, [loadDefinitions]);

  // Fecha com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, saving]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      await onSave({
        title: title.trim(),
        priority,
        status,
        assigneeName: assigneeName || undefined,
        assigneeId: assigneeId || undefined,
        internalDescription: internalDescription || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
    },
    [title, priority, status, assigneeName, assigneeId, internalDescription, dueDate, onSave]
  );

  // ── Render ─────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-12"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-xl shadow-2xl"
        style={{
          backgroundColor: 'var(--sagb-surface)',
          border: '1px solid var(--sagb-line)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--sagb-line)' }}
        >
          <h2 className="text-[15px] font-bold" style={{ color: 'var(--sagb-text)' }}>
            {mode === 'create' ? 'Nova Tarefa' : 'Editar Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[16px] font-bold transition-colors hover:opacity-70"
            style={{ color: 'var(--sagb-muted)' }}
          >
            ×
          </button>
        </div>

        {/* ── Tabs ────────────────────────────────────────── */}
        <div
          className="flex gap-0 px-6"
          style={{ borderBottom: '1px solid var(--sagb-line)' }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative px-4 py-2.5 text-[12px] font-semibold transition-colors"
                style={{
                  color: isActive ? 'var(--sagb-primary)' : 'var(--sagb-muted)',
                }}
              >
                {tab.label}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--sagb-primary)' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Body ────────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-4">
            {/* ── Aba: Detalhes ───────────────────────────── */}
            {activeTab === 'details' && (
              <>
                {/* Título */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
                    Título *
                  </label>
                  <input
                    ref={titleRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="O que precisa ser feito?"
                    required
                    className="w-full rounded-md px-3 py-2.5 text-[14px] font-semibold outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--sagb-bg)',
                      border: '1px solid var(--sagb-line)',
                      color: 'var(--sagb-text)',
                    }}
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
                    Descrição
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva a tarefa..."
                    rows={3}
                    className="w-full resize-none rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--sagb-bg)',
                      border: '1px solid var(--sagb-line)',
                      color: 'var(--sagb-text)',
                    }}
                  />
                </div>

                {/* Grid: Prioridade + Status + Data */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
                      Prioridade
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskzeiTask['priority'])}
                      className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--sagb-bg)',
                        border: '1px solid var(--sagb-line)',
                        color: 'var(--sagb-text)',
                      }}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskzeiTask['status'])}
                      className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--sagb-bg)',
                        border: '1px solid var(--sagb-line)',
                        color: 'var(--sagb-text)',
                      }}
                    >
                      <option value="aberta">Aberta</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
                      Data de Vencimento
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--sagb-bg)',
                        border: '1px solid var(--sagb-line)',
                        color: 'var(--sagb-text)',
                      }}
                    />
                  </div>
                </div>

                {/* Responsável */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    placeholder="Nome do responsável"
                    className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--sagb-bg)',
                      border: '1px solid var(--sagb-line)',
                      color: 'var(--sagb-text)',
                    }}
                  />
                </div>

                {/* Descrição Interna */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
                    Descrição Interna
                  </label>
                  <textarea
                    value={internalDescription}
                    onChange={(e) => setInternalDescription(e.target.value)}
                    placeholder="Anotações internas (visível para usuários autenticados)..."
                    rows={2}
                    className="w-full resize-none rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--sagb-bg)',
                      border: '1px solid var(--sagb-line)',
                      color: 'var(--sagb-text)',
                    }}
                  />
                </div>
              </>
            )}

            {/* ── Aba: Campos Personalizados ──────────────── */}
            {activeTab === 'customFields' && (
              <div className="py-2">
                {task ? (
                  <CustomFieldRenderer taskId={task.id} />
                ) : (
                  <p className="py-4 text-center text-[12px] font-medium" style={{ color: 'var(--sagb-muted)' }}>
                    Crie a tarefa primeiro para acessar os campos personalizados.
                  </p>
                )}
              </div>
            )}

            {/* ── Aba: Anexos ──────────────────────────────── */}
            {activeTab === 'attachments' && (
              <div className="py-2">
                {task ? (
                  <AttachmentsTab taskId={task.id} />
                ) : (
                  <p className="py-4 text-center text-[12px] font-medium" style={{ color: 'var(--sagb-muted)' }}>
                    Crie a tarefa primeiro para anexar arquivos.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ──────────────────────────────────────── */}
          <div
            className="flex items-center justify-end gap-2 px-6 py-4"
            style={{ borderTop: '1px solid var(--sagb-line)' }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg px-4 py-2 text-[12px] font-medium transition-colors hover:opacity-70 disabled:opacity-40"
              style={{ color: 'var(--sagb-muted)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="rounded-lg px-5 py-2 text-[12px] font-semibold text-white transition-all hover:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: 'var(--sagb-primary)' }}
            >
              {saving ? 'Salvando...' : mode === 'create' ? 'Criar Tarefa' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// AttachmentsTab — Zona de Drag & Drop e Lista de Anexos (FASE 10)
// ============================================================================

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AttachmentsTab: React.FC<{ taskId: string }> = ({ taskId }) => {
  const {
    attachmentsByTask,
    attachmentsLoading,
    loadAttachments,
    addAttachment,
  } = useCustomFieldStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const attachments = attachmentsByTask[taskId] || [];

  useEffect(() => {
    loadAttachments(taskId);
  }, [taskId, loadAttachments]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          await addAttachment(taskId, file);
        }
      } finally {
        setUploading(false);
      }
    },
    [taskId, addAttachment]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = '';
      }
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    async (attachmentId: string) => {
      // Remove do store (remoção física no storage fica como improvement futuro)
      useCustomFieldStore.setState((state) => {
        const existing = state.attachmentsByTask[taskId] || [];
        return {
          attachmentsByTask: {
            ...state.attachmentsByTask,
            [taskId]: existing.filter((a) => a.id !== attachmentId),
          },
        };
      });
    },
    [taskId]
  );

  if (attachmentsLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm font-medium" style={{ color: 'var(--sagb-muted)' }}>
        Carregando anexos...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Zona de Drop */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors"
        style={{
          borderColor: isDragOver ? 'var(--sagb-primary)' : 'var(--sagb-line)',
          backgroundColor: isDragOver
            ? 'color-mix(in srgb, var(--sagb-primary) 6%, transparent)'
            : 'var(--sagb-bg)',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />

        {uploading ? (
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--sagb-primary)' }}>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Enviando arquivos...
          </div>
        ) : (
          <>
            <svg className="mb-2 h-8 w-8" style={{ color: 'var(--sagb-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium" style={{ color: isDragOver ? 'var(--sagb-primary)' : 'var(--sagb-muted)' }}>
              {isDragOver ? 'Solte para anexar' : 'Arraste arquivos ou clique para anexar'}
            </p>
            <p className="mt-1 text-[11px]" style={{ color: 'var(--sagb-muted)' }}>
              Qualquer formato de arquivo
            </p>
          </>
        )}
      </div>

      {/* Lista de Anexos Existentes */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
            Anexos ({attachments.length})
          </p>
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
              style={{ backgroundColor: 'var(--sagb-bg)' }}
            >
              {/* Ícone de arquivo */}
              <svg className="h-5 w-5 shrink-0" style={{ color: 'var(--sagb-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>

              {/* Info do arquivo */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium" style={{ color: 'var(--sagb-text)' }}>
                  {att.fileName}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--sagb-muted)' }}>
                  {formatFileSize(att.fileSize)}
                </p>
              </div>

              {/* Botão remover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(att.id);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-md text-[14px] transition-colors hover:opacity-70"
                style={{ color: 'var(--sagb-muted)' }}
                title="Remover anexo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!attachmentsLoading && attachments.length === 0 && (
        <p className="py-2 text-center text-[12px] font-medium" style={{ color: 'var(--sagb-muted)' }}>
          Nenhum anexo ainda
        </p>
      )}
    </div>
  );
};
