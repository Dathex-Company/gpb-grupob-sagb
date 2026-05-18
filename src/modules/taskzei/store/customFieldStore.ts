// ============================================================================
// customFieldStore.ts — Zustand Store do Motor de Campos Personalizados (EAV)
// Module: taskzei (v1.17.0)
// Feature: ET D21 — Motor de Campos Personalizados & Modal Central V1
// ============================================================================

import { create } from 'zustand';
import { TaskzeiAdapter } from '../services/taskzei.adapters';
import {
  CustomFieldDefinition,
  CustomFieldDefinitionInput,
  CustomFieldValue,
} from '../types/customField.types';
import { TaskAttachment } from '../types/taskzei.contracts';

// ─── State ──────────────────────────────────────────────────

interface CustomFieldState {
  // Definitions
  definitions: CustomFieldDefinition[];
  definitionsLoading: boolean;
  definitionsError: string | null;

  // Values (keyed by taskId)
  valuesByTask: Record<string, CustomFieldValue[]>;
  valuesLoading: boolean;
  valuesError: string | null;

  // Attachments (keyed by taskId)
  attachmentsByTask: Record<string, TaskAttachment[]>;
  attachmentsLoading: boolean;
  attachmentsError: string | null;

  // Actions — Definitions
  loadDefinitions: () => Promise<void>;
  createDefinition: (input: CustomFieldDefinitionInput) => Promise<CustomFieldDefinition>;
  updateDefinition: (id: string, updates: Partial<CustomFieldDefinitionInput>) => Promise<CustomFieldDefinition>;
  deleteDefinition: (id: string) => Promise<boolean>;

  // Actions — Values
  loadValues: (taskId: string) => Promise<void>;
  setValue: (taskId: string, fieldId: string, value: string | number | null) => Promise<void>;
  deleteValue: (taskId: string, fieldId: string) => Promise<boolean>;

  // Actions — Attachments
  loadAttachments: (taskId: string) => Promise<void>;
  addAttachment: (taskId: string, file: File) => Promise<TaskAttachment>;
}

// ─── Store ──────────────────────────────────────────────────

export const useCustomFieldStore = create<CustomFieldState>((set, get) => {
  const repo = () => TaskzeiAdapter.getProvider();

  return {
    // ── Initial State ──────────────────────────────────────────

    definitions: [],
    definitionsLoading: false,
    definitionsError: null,

    valuesByTask: {},
    valuesLoading: false,
    valuesError: null,

    attachmentsByTask: {},
    attachmentsLoading: false,
    attachmentsError: null,

    // ── Definitions ────────────────────────────────────────────

    loadDefinitions: async () => {
      set({ definitionsLoading: true, definitionsError: null });
      try {
        const definitions = await repo().getCustomFieldDefinitions();
        set({ definitions, definitionsLoading: false });
      } catch (err: any) {
        set({ definitionsError: err?.message || 'Failed to load definitions', definitionsLoading: false });
      }
    },

    createDefinition: async (input: CustomFieldDefinitionInput) => {
      const definition = await repo().createCustomFieldDefinition(input);
      set((state) => ({ definitions: [...state.definitions, definition] }));
      return definition;
    },

    updateDefinition: async (id: string, updates: Partial<CustomFieldDefinitionInput>) => {
      const definition = await repo().updateCustomFieldDefinition(id, updates);
      set((state) => ({
        definitions: state.definitions.map((d) => (d.id === id ? definition : d)),
      }));
      return definition;
    },

    deleteDefinition: async (id: string) => {
      const result = await repo().deleteCustomFieldDefinition(id);
      if (result) {
        set((state) => ({ definitions: state.definitions.filter((d) => d.id !== id) }));
      }
      return result;
    },

    // ── Values ─────────────────────────────────────────────────

    loadValues: async (taskId: string) => {
      set({ valuesLoading: true, valuesError: null });
      try {
        const values = await repo().getTaskCustomValues(taskId);
        set((state) => ({
          valuesByTask: { ...state.valuesByTask, [taskId]: values },
          valuesLoading: false,
        }));
      } catch (err: any) {
        set({ valuesError: err?.message || 'Failed to load values', valuesLoading: false });
      }
    },

    setValue: async (taskId: string, fieldId: string, value: string | number | null) => {
      const result = await repo().setTaskCustomValue(taskId, fieldId, value);
      set((state) => {
        const existing = state.valuesByTask[taskId] || [];
        const idx = existing.findIndex((v) => v.fieldId === fieldId);
        const updated =
          idx >= 0
            ? [...existing.slice(0, idx), result, ...existing.slice(idx + 1)]
            : [...existing, result];
        return {
          valuesByTask: { ...state.valuesByTask, [taskId]: updated },
        };
      });
    },

    deleteValue: async (taskId: string, fieldId: string) => {
      const result = await repo().deleteTaskCustomValue(taskId, fieldId);
      if (result) {
        set((state) => {
          const existing = state.valuesByTask[taskId] || [];
          return {
            valuesByTask: {
              ...state.valuesByTask,
              [taskId]: existing.filter((v) => v.fieldId !== fieldId),
            },
          };
        });
      }
      return result;
    },

    // ── Attachments ────────────────────────────────────────────

    loadAttachments: async (taskId: string) => {
      set({ attachmentsLoading: true, attachmentsError: null });
      try {
        const attachments = await repo().getTaskAttachments(taskId);
        set((state) => ({
          attachmentsByTask: { ...state.attachmentsByTask, [taskId]: attachments },
          attachmentsLoading: false,
        }));
      } catch (err: any) {
        set({ attachmentsError: err?.message || 'Failed to load attachments', attachmentsLoading: false });
      }
    },

    addAttachment: async (taskId: string, file: File) => {
      const attachment = await repo().addTaskAttachment(taskId, file);
      set((state) => {
        const existing = state.attachmentsByTask[taskId] || [];
        return {
          attachmentsByTask: {
            ...state.attachmentsByTask,
            [taskId]: [...existing, attachment],
          },
        };
      });
      return attachment;
    },
  };
});
