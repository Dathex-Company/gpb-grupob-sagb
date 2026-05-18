-- ============================================================================
-- Migration: taskzei_custom_fields
-- Context: Compartilhado (shared pool do SagB) — isola por workspace_id
-- Module: taskzei (v1.17.0)
-- Feature: ET D21 — Motor de Campos Personalizados (EAV) & Modal Central V1
-- Descrição:
--   1. Adiciona assignee_id, internal_description, completed_at em taskzei_tasks
--   2. Cria taskzei_custom_field_definitions (catálogo EAV)
--   3. Cria taskzei_task_custom_values (valores EAV por tarefa)
--   4. Cria taskzei_task_attachments (anexos por CID Drag & Drop)
--   5. Índices, triggers, RLS
-- ============================================================================

-- ── 0. Extensions ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── 1. ALTER taskzei_tasks ───────────────────────────────────────────────────
-- Novas colunas para suportar o Modal Central de Tarefa V1
ALTER TABLE public.taskzei_tasks
  ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS internal_description TEXT,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Índices para as novas colunas
CREATE INDEX IF NOT EXISTS idx_taskzei_tasks_assignee   ON public.taskzei_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_taskzei_tasks_completed  ON public.taskzei_tasks(completed_at);

-- ── 2. taskzei_custom_field_definitions ─────────────────────────────────────
-- Catálogo de definições de campos personalizados (EAV).
-- Cada linha define um campo que pode ser associado a tarefas.
CREATE TABLE IF NOT EXISTS public.taskzei_custom_field_definitions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  TEXT NOT NULL DEFAULT 'default',
  name          TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('TEXT', 'NUMBER', 'DATE', 'DROPDOWN')),
  config        JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cf_def_workspace ON public.taskzei_custom_field_definitions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_cf_def_sort      ON public.taskzei_custom_field_definitions(sort_order);
CREATE INDEX IF NOT EXISTS idx_cf_def_active    ON public.taskzei_custom_field_definitions(is_active);

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION taskzei_cf_definitions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cf_definitions_updated_at ON public.taskzei_custom_field_definitions;
CREATE TRIGGER trg_cf_definitions_updated_at
  BEFORE UPDATE ON public.taskzei_custom_field_definitions
  FOR EACH ROW EXECUTE FUNCTION taskzei_cf_definitions_updated_at();

-- ── 3. taskzei_task_custom_values ───────────────────────────────────────────
-- Valores dos campos personalizados associados a cada tarefa.
-- Usa PK composta (task_id, field_id) para garantir unicidade.
CREATE TABLE IF NOT EXISTS public.taskzei_task_custom_values (
  task_id    UUID NOT NULL REFERENCES public.taskzei_tasks(id) ON DELETE CASCADE,
  field_id   UUID NOT NULL REFERENCES public.taskzei_custom_field_definitions(id) ON DELETE CASCADE,
  value      JSONB NOT NULL DEFAULT '""'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id, field_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tcv_task  ON public.taskzei_task_custom_values(task_id);
CREATE INDEX IF NOT EXISTS idx_tcv_field ON public.taskzei_task_custom_values(field_id);

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION taskzei_tcv_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tcv_updated_at ON public.taskzei_task_custom_values;
CREATE TRIGGER trg_tcv_updated_at
  BEFORE UPDATE ON public.taskzei_task_custom_values
  FOR EACH ROW EXECUTE FUNCTION taskzei_tcv_updated_at();

-- ── 4. taskzei_task_attachments ─────────────────────────────────────────────
-- Anexos de tarefas (upload via CID Drag & Drop no Modal Central).
CREATE TABLE IF NOT EXISTS public.taskzei_task_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID NOT NULL REFERENCES public.taskzei_tasks(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_size   INT NOT NULL DEFAULT 0,
  mime_type   TEXT NOT NULL DEFAULT 'application/octet-stream',
  storage_key TEXT NOT NULL,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_attachments_task ON public.taskzei_task_attachments(task_id);

-- ── 5. RLS (Row Level Security) ─────────────────────────────────────────────

-- Habilita RLS
ALTER TABLE public.taskzei_custom_field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taskzei_task_custom_values       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taskzei_task_attachments          ENABLE ROW LEVEL SECURITY;

-- ── Políticas: taskzei_custom_field_definitions ─────────────────────────────
DROP POLICY IF EXISTS cf_def_select ON public.taskzei_custom_field_definitions;
CREATE POLICY cf_def_select
  ON public.taskzei_custom_field_definitions
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS cf_def_insert ON public.taskzei_custom_field_definitions;
CREATE POLICY cf_def_insert
  ON public.taskzei_custom_field_definitions
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS cf_def_update ON public.taskzei_custom_field_definitions;
CREATE POLICY cf_def_update
  ON public.taskzei_custom_field_definitions
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS cf_def_delete ON public.taskzei_custom_field_definitions;
CREATE POLICY cf_def_delete
  ON public.taskzei_custom_field_definitions
  FOR DELETE TO authenticated
  USING (true);

-- ── Políticas: taskzei_task_custom_values ───────────────────────────────────
DROP POLICY IF EXISTS tcv_select ON public.taskzei_task_custom_values;
CREATE POLICY tcv_select
  ON public.taskzei_task_custom_values
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS tcv_insert ON public.taskzei_task_custom_values;
CREATE POLICY tcv_insert
  ON public.taskzei_task_custom_values
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.taskzei_tasks t WHERE t.id = task_id)
  );

DROP POLICY IF EXISTS tcv_update ON public.taskzei_task_custom_values;
CREATE POLICY tcv_update
  ON public.taskzei_task_custom_values
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS tcv_delete ON public.taskzei_task_custom_values;
CREATE POLICY tcv_delete
  ON public.taskzei_task_custom_values
  FOR DELETE TO authenticated
  USING (true);

-- ── Políticas: taskzei_task_attachments ─────────────────────────────────────
DROP POLICY IF EXISTS task_attachments_select ON public.taskzei_task_attachments;
CREATE POLICY task_attachments_select
  ON public.taskzei_task_attachments
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS task_attachments_insert ON public.taskzei_task_attachments;
CREATE POLICY task_attachments_insert
  ON public.taskzei_task_attachments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.taskzei_tasks t WHERE t.id = task_id)
  );

DROP POLICY IF EXISTS task_attachments_update ON public.taskzei_task_attachments;
CREATE POLICY task_attachments_update
  ON public.taskzei_task_attachments
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS task_attachments_delete ON public.taskzei_task_attachments;
CREATE POLICY task_attachments_delete
  ON public.taskzei_task_attachments
  FOR DELETE TO authenticated
  USING (true);
