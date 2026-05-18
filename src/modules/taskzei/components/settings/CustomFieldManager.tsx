// ============================================================================
// CustomFieldManager.tsx — Gestão de Campos Personalizados (Settings)
// Module: taskzei (v1.17.0)
// Feature: ET D21 — Motor de Campos Personalizados & Modal Central V1
// ============================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { useCustomFieldStore } from '../../store/customFieldStore';
import {
  CustomFieldDefinition,
  CustomFieldDefinitionInput,
  CustomFieldType,
  DropdownOption,
} from '../../types/customField.types';

// ─── Tipos auxiliares ───────────────────────────────────────

type EditingField = {
  id: string | '__new__';
  name: string;
  type: CustomFieldType;
  options: DropdownOption[];
  sortOrder: number;
};

const FIELD_TYPES: { value: CustomFieldType; label: string }[] = [
  { value: 'TEXT', label: 'Texto' },
  { value: 'NUMBER', label: 'Número' },
  { value: 'DATE', label: 'Data' },
  { value: 'DROPDOWN', label: 'Dropdown' },
];

const EMPTY_EDITING: EditingField = {
  id: '__new__',
  name: '',
  type: 'TEXT',
  options: [],
  sortOrder: 0,
};

// ─── Sub-componente: OptionRow ───────────────────────────────

const OptionRow: React.FC<{
  option: DropdownOption;
  index: number;
  onChange: (index: number, updated: DropdownOption) => void;
  onRemove: (index: number) => void;
}> = ({ option, index, onChange, onRemove }) => {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <input
        type="text"
        value={option.label}
        onChange={(e) => onChange(index, { ...option, label: e.target.value })}
        placeholder="Rótulo"
        className="flex-1 min-w-0 rounded-md px-2.5 py-1.5 text-[13px] outline-none"
        style={{
          backgroundColor: 'var(--sagb-bg)',
          border: '1px solid var(--sagb-line)',
          color: 'var(--sagb-text)',
        }}
      />
      <input
        type="color"
        value={option.color || '#6366f1'}
        onChange={(e) => onChange(index, { ...option, color: e.target.value })}
        className="h-7 w-10 cursor-pointer rounded border-none p-0"
        style={{ backgroundColor: 'transparent' }}
      />
      <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={option.is_completed_state}
          onChange={(e) => onChange(index, { ...option, is_completed_state: e.target.checked })}
          className="h-3.5 w-3.5 rounded"
          style={{ accentColor: 'var(--sagb-primary)' }}
        />
        <span className="text-[11px] font-medium" style={{ color: 'var(--sagb-muted)' }}>
          Conclui
        </span>
      </label>
      <button
        onClick={() => onRemove(index)}
        className="flex h-6 w-6 items-center justify-center rounded-md text-[13px] font-bold transition-colors hover:opacity-70"
        style={{ color: 'var(--sagb-danger, #ef4444)' }}
        title="Remover opção"
      >
        ×
      </button>
    </div>
  );
};

// ─── Componente Principal ────────────────────────────────────

export const CustomFieldManager: React.FC = () => {
  const {
    definitions,
    definitionsLoading,
    loadDefinitions,
    createDefinition,
    updateDefinition,
    deleteDefinition,
  } = useCustomFieldStore();

  const [editing, setEditing] = useState<EditingField | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDefinitions();
  }, [loadDefinitions]);

  // ── Handlers ───────────────────────────────────────────────

  const handleNew = useCallback(() => {
    setEditing({ ...EMPTY_EDITING });
  }, []);

  const handleEdit = useCallback((def: CustomFieldDefinition) => {
    setEditing({
      id: def.id,
      name: def.name,
      type: def.type,
      options: def.config || [],
      sortOrder: def.sortOrder,
    });
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editing || !editing.name.trim()) return;
    setSaving(true);
    try {
      const input: CustomFieldDefinitionInput = {
        name: editing.name.trim(),
        type: editing.type,
        config: editing.type === 'DROPDOWN' ? editing.options : [],
        sortOrder: editing.sortOrder,
      };

      if (editing.id === '__new__') {
        await createDefinition(input);
      } else {
        await updateDefinition(editing.id, input);
      }
      setEditing(null);
    } catch (err) {
      console.error('[CustomFieldManager] Error saving:', err);
    } finally {
      setSaving(false);
    }
  }, [editing, createDefinition, updateDefinition]);

  const handleDelete = useCallback(
    async (id: string) => {
      setSaving(true);
      try {
        await deleteDefinition(id);
        setDeletingId(null);
      } catch (err) {
        console.error('[CustomFieldManager] Error deleting:', err);
      } finally {
        setSaving(false);
      }
    },
    [deleteDefinition]
  );

  const handleOptionChange = useCallback(
    (index: number, updated: DropdownOption) => {
      setEditing((prev) => {
        if (!prev) return prev;
        const options = [...prev.options];
        options[index] = updated;
        return { ...prev, options };
      });
    },
    []
  );

  const handleOptionRemove = useCallback(
    (index: number) => {
      setEditing((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          options: prev.options.filter((_, i) => i !== index),
        };
      });
    },
    []
  );

  const handleAddOption = useCallback(() => {
    setEditing((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        options: [
          ...prev.options,
          { id: crypto.randomUUID(), label: '', color: '#6366f1', is_completed_state: false },
        ],
      };
    });
  }, []);

  // ── Render ─────────────────────────────────────────────────

  if (definitionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--sagb-muted)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: 'var(--sagb-text)' }}>
            Campos Personalizados
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--sagb-muted)' }}>
            Defina campos extras (EAV) que aparecerão no modal de tarefa.
          </p>
        </div>
        {!editing && (
          <button
            onClick={handleNew}
            className="rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--sagb-primary)',
              color: 'white',
            }}
          >
            + Novo Campo
          </button>
        )}
      </div>

      {/* ── Lista de definições ────────────────────────────── */}
      <div className="space-y-2">
        {definitions.length === 0 && !editing && (
          <div
            className="rounded-xl px-4 py-6 text-center text-[13px] font-medium"
            style={{ backgroundColor: 'var(--sagb-bg)', color: 'var(--sagb-muted)' }}
          >
            Nenhum campo personalizado ainda. Clique em "+ Novo Campo" para criar.
          </div>
        )}

        {definitions.map((def) => (
          <div
            key={def.id}
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
            style={{ backgroundColor: 'var(--sagb-bg)' }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--sagb-text)' }}>
                  {def.name}
                </span>
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 10%, transparent)',
                    color: 'var(--sagb-primary)',
                  }}
                >
                  {def.type}
                </span>
              </div>
              {def.type === 'DROPDOWN' && def.config.length > 0 && (
                <p className="mt-0.5 text-[11px] truncate" style={{ color: 'var(--sagb-muted)' }}>
                  {def.config.length} opção{def.config.length > 1 ? 'ões' : ''}
                  {def.config.some((o) => o.is_completed_state) ? ' · com estado de conclusão' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleEdit(def)}
                className="rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors hover:opacity-70"
                style={{ color: 'var(--sagb-primary)', backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 8%, transparent)' }}
              >
                Editar
              </button>
              {deletingId === def.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(def.id)}
                    disabled={saving}
                    className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-white transition-colors"
                    style={{ backgroundColor: 'var(--sagb-danger, #ef4444)' }}
                  >
                    {saving ? '...' : 'Confirmar'}
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors"
                    style={{ color: 'var(--sagb-muted)' }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeletingId(def.id)}
                  className="rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors hover:opacity-70"
                  style={{ color: 'var(--sagb-danger, #ef4444)' }}
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Formulário de criação/edição ───────────────────── */}
      {editing && (
        <div
          className="mt-4 rounded-xl p-4 space-y-4"
          style={{ backgroundColor: 'var(--sagb-bg)', border: '1px solid var(--sagb-line)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold" style={{ color: 'var(--sagb-text)' }}>
              {editing.id === '__new__' ? 'Novo Campo Personalizado' : 'Editar Campo'}
            </h3>
          </div>

          {/* Nome */}
          <div>
            <label className="mb-1 block text-[12px] font-medium" style={{ color: 'var(--sagb-muted)' }}>
              Nome
            </label>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing((prev) => prev ? { ...prev, name: e.target.value } : prev)}
              placeholder="Ex: Data de Revisão"
              className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
              style={{
                backgroundColor: 'var(--sagb-surface)',
                border: '1px solid var(--sagb-line)',
                color: 'var(--sagb-text)',
              }}
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="mb-1 block text-[12px] font-medium" style={{ color: 'var(--sagb-muted)' }}>
              Tipo
            </label>
            <select
              value={editing.type}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, type: e.target.value as CustomFieldType, options: [] } : prev
                )
              }
              className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
              style={{
                backgroundColor: 'var(--sagb-surface)',
                border: '1px solid var(--sagb-line)',
                color: 'var(--sagb-text)',
              }}
            >
              {FIELD_TYPES.map((ft) => (
                <option key={ft.value} value={ft.value}>
                  {ft.label}
                </option>
              ))}
            </select>
          </div>

          {/* Opções de Dropdown */}
          {editing.type === 'DROPDOWN' && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[12px] font-medium" style={{ color: 'var(--sagb-muted)' }}>
                  Opções
                </label>
                <button
                  onClick={handleAddOption}
                  className="rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors hover:opacity-70"
                  style={{
                    color: 'var(--sagb-primary)',
                    backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 8%, transparent)',
                  }}
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-0.5">
                {editing.options.length === 0 && (
                  <p className="text-[12px] py-2" style={{ color: 'var(--sagb-muted)' }}>
                    Nenhuma opção. Adicione ao menos uma para usar o dropdown.
                  </p>
                )}
                {editing.options.map((opt, idx) => (
                  <OptionRow
                    key={opt.id}
                    option={opt}
                    index={idx}
                    onChange={handleOptionChange}
                    onRemove={handleOptionRemove}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleCancel}
              className="rounded-lg px-4 py-2 text-[12px] font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--sagb-muted)' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editing.name.trim()}
              className="rounded-lg px-4 py-2 text-[12px] font-semibold text-white transition-all hover:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: 'var(--sagb-primary)' }}
            >
              {saving ? 'Salvando...' : editing.id === '__new__' ? 'Criar' : 'Salvar'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
