// ============================================================================
// customField.types.ts — Tipos do Motor de Campos Personalizados (EAV)
// Module: taskzei (v1.17.0)
// Feature: ET D21 — Motor de Campos Personalizados & Modal Central V1
// ============================================================================

export type CustomFieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN';

export interface DropdownOption {
  id: string;
  label: string;
  color?: string;
  is_completed_state: boolean;
}

/**
 * Config JSONB armazenado em taskzei_custom_field_definitions.config.
 * Para DROPDOWN: array de DropdownOption.
 * Para TEXT/NUMBER/DATE: array vazio ({}).
 */
export type CustomFieldConfig = DropdownOption[];

export interface CustomFieldDefinition {
  id: string;
  workspaceId: string;
  name: string;
  type: CustomFieldType;
  config: CustomFieldConfig;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomFieldValue {
  taskId: string;
  fieldId: string;
  value: string | number | null;
  updatedAt: string;
}

export interface CustomFieldDefinitionInput {
  name: string;
  type: CustomFieldType;
  config?: CustomFieldConfig;
  sortOrder?: number;
}

/**
 * Helper: verifica se um dropdown option tem is_completed_state = true.
 */
export const findCompletedStateOption = (options: DropdownOption[]): DropdownOption | undefined =>
  options.find((o) => o.is_completed_state === true);

/**
 * Helper: extrai o valor escalar de um JSONB armazenado.
 */
export const extractCustomValue = (raw: unknown): string | number | null => {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'number') return raw;
  // JSONB wraps strings in quotes, so JSON.parse may be needed
  if (typeof raw === 'object') {
    try {
      const parsed = JSON.parse(JSON.stringify(raw));
      return typeof parsed === 'string' || typeof parsed === 'number' ? parsed : String(parsed);
    } catch {
      return String(raw);
    }
  }
  return String(raw);
};
