// ============================================================================
// CustomFieldRenderer.tsx — Renderizador Dinâmico de Campos Personalizados
// Module: taskzei (v1.17.0)
// Feature: ET D21 — Motor de Campos Personalizados & Modal Central V1
// ============================================================================

import React, { useCallback, useMemo } from 'react';
import { useCustomFieldStore } from '../../store/customFieldStore';
import {
  CustomFieldDefinition,
  CustomFieldValue,
  DropdownOption,
} from '../../types/customField.types';

// ─── Props ───────────────────────────────────────────────────

interface CustomFieldRendererProps {
  taskId: string;
  /** Se true, desabilita edição (modo leitura) */
  readOnly?: boolean;
}

// ─── Sub-componentes de input por tipo ───────────────────────

const TextInput: React.FC<{
  field: CustomFieldDefinition;
  value: string | number | null;
  onChange: (fieldId: string, value: string | number | null) => void;
  readOnly?: boolean;
}> = ({ field, value, onChange, readOnly }) => (
  <input
    type="text"
    value={typeof value === 'string' ? value : value !== null ? String(value) : ''}
    onChange={(e) => onChange(field.id, e.target.value || null)}
    placeholder={field.name}
    readOnly={readOnly}
    className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
    style={{
      backgroundColor: readOnly ? 'transparent' : 'var(--sagb-surface)',
      border: readOnly ? 'none' : '1px solid var(--sagb-line)',
      color: 'var(--sagb-text)',
    }}
  />
);

const NumberInput: React.FC<{
  field: CustomFieldDefinition;
  value: string | number | null;
  onChange: (fieldId: string, value: string | number | null) => void;
  readOnly?: boolean;
}> = ({ field, value, onChange, readOnly }) => (
  <input
    type="number"
    value={typeof value === 'number' ? value : value !== null ? Number(value) : ''}
    onChange={(e) => {
      const raw = e.target.value;
      onChange(field.id, raw === '' ? null : Number(raw));
    }}
    placeholder={field.name}
    readOnly={readOnly}
    className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
    style={{
      backgroundColor: readOnly ? 'transparent' : 'var(--sagb-surface)',
      border: readOnly ? 'none' : '1px solid var(--sagb-line)',
      color: 'var(--sagb-text)',
    }}
  />
);

const DateInput: React.FC<{
  field: CustomFieldDefinition;
  value: string | number | null;
  onChange: (fieldId: string, value: string | number | null) => void;
  readOnly?: boolean;
}> = ({ field, value, onChange, readOnly }) => (
  <input
    type="date"
    value={typeof value === 'string' ? value.slice(0, 10) : ''}
    onChange={(e) => onChange(field.id, e.target.value || null)}
    readOnly={readOnly}
    className="w-full rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
    style={{
      backgroundColor: readOnly ? 'transparent' : 'var(--sagb-surface)',
      border: readOnly ? 'none' : '1px solid var(--sagb-line)',
      color: 'var(--sagb-text)',
    }}
  />
);

const DropdownInput: React.FC<{
  field: CustomFieldDefinition;
  value: string | number | null;
  onChange: (fieldId: string, value: string | number | null) => void;
  readOnly?: boolean;
}> = ({ field, value, onChange, readOnly }) => {
  const selectedOption = useMemo(
    () => field.config.find((opt) => opt.id === value),
    [field.config, value]
  );

  return (
    <div className="relative">
      <select
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(field.id, e.target.value || null)}
        disabled={readOnly}
        className="w-full appearance-none rounded-md px-3 py-2 text-[13px] outline-none transition-colors"
        style={{
          backgroundColor: readOnly ? 'transparent' : 'var(--sagb-surface)',
          border: readOnly ? 'none' : '1px solid var(--sagb-line)',
          color: 'var(--sagb-text)',
        }}
      >
        <option value="">—</option>
        {field.config.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      {selectedOption && selectedOption.color && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: selectedOption.color }}
        />
      )}
    </div>
  );
};

// ─── Mapa de renderizadores ──────────────────────────────────

const RENDERERS: Record<
  string,
  React.FC<{
    field: CustomFieldDefinition;
    value: string | number | null;
    onChange: (fieldId: string, value: string | number | null) => void;
    readOnly?: boolean;
  }>
> = {
  TEXT: TextInput,
  NUMBER: NumberInput,
  DATE: DateInput,
  DROPDOWN: DropdownInput,
};

// ─── Componente Principal ────────────────────────────────────

export const CustomFieldRenderer: React.FC<CustomFieldRendererProps> = ({
  taskId,
  readOnly = false,
}) => {
  const { definitions, valuesByTask, loadValues, setValue } = useCustomFieldStore();

  const values = useMemo(() => valuesByTask[taskId] || [], [valuesByTask, taskId]);

  const activeDefinitions = useMemo(
    () => definitions.filter((d) => d.isActive),
    [definitions]
  );

  // Carrega valores ao montar
  React.useEffect(() => {
    if (taskId) {
      loadValues(taskId);
    }
  }, [taskId, loadValues]);

  const handleChange = useCallback(
    (fieldId: string, value: string | number | null) => {
      setValue(taskId, fieldId, value);
    },
    [taskId, setValue]
  );

  const getValue = useCallback(
    (fieldId: string): string | number | null => {
      const v = values.find((v) => v.fieldId === fieldId);
      return v ? v.value : null;
    },
    [values]
  );

  if (activeDefinitions.length === 0) {
    return (
      <p className="py-4 text-center text-[12px] font-medium" style={{ color: 'var(--sagb-muted)' }}>
        {readOnly ? 'Nenhum campo personalizado.' : 'Nenhum campo personalizado definido. Vá em Configurações para criar.'}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {activeDefinitions.map((field) => {
        const Renderer = RENDERERS[field.type];
        if (!Renderer) return null;

        return (
          <div key={field.id}>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-muted)' }}>
              {field.name}
            </label>
            <Renderer
              field={field}
              value={getValue(field.id)}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
        );
      })}
    </div>
  );
};
