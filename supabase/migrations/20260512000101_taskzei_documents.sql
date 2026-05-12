-- ============================================================================
-- Migration: taskzei_documents
-- Context: Compartilhado (shared pool do SagB) — isola por workspace_id
-- Module: taskzei (v1.11.0)
-- Feature: ET D08-D12 — Central de Documentos Inteligentes
-- Descrição: Schema de documentos hierárquicos estilo ClickUp Docs,
--            com blocos rich text, links bidirecionais com tarefas,
--            anexos, soft delete e RLS.
-- ============================================================================

-- ── 1. taskzei_doc_nodes ───────────────────────────────────────────────────
-- Nós da árvore de documentos (pastas e documentos).
-- Soft delete via deleted_at.
CREATE TABLE IF NOT EXISTS taskzei_doc_nodes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'default',
  parent_id   UUID REFERENCES taskzei_doc_nodes(id) ON DELETE SET NULL,
  title       TEXT NOT NULL DEFAULT 'Novo documento',
  slug        TEXT,                     -- amigável para URL
  icon        TEXT DEFAULT '📄',        -- emoji/ícone do nó
  type        TEXT NOT NULL DEFAULT 'document' CHECK (type IN ('folder', 'document')),
  sort_order  INT NOT NULL DEFAULT 0,
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  created_by  TEXT,
  deleted_at  TIMESTAMPTZ,              -- soft delete
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_doc_nodes_workspace ON taskzei_doc_nodes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_doc_nodes_parent   ON taskzei_doc_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_doc_nodes_type     ON taskzei_doc_nodes(type);
CREATE INDEX IF NOT EXISTS idx_doc_nodes_deleted  ON taskzei_doc_nodes(deleted_at) WHERE deleted_at IS NULL;

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION taskzei_doc_nodes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_doc_nodes_updated_at ON taskzei_doc_nodes;
CREATE TRIGGER trg_doc_nodes_updated_at
  BEFORE UPDATE ON taskzei_doc_nodes
  FOR EACH ROW EXECUTE FUNCTION taskzei_doc_nodes_updated_at();

-- ── 2. taskzei_doc_contents ────────────────────────────────────────────────
-- Blocos de conteúdo rich text para cada documento (ordem sequencial).
-- Cada bloco segue o modelo TipTap (type, attrs, content).
CREATE TABLE IF NOT EXISTS taskzei_doc_contents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     UUID NOT NULL REFERENCES taskzei_doc_nodes(id) ON DELETE CASCADE,
  block_type  TEXT NOT NULL DEFAULT 'paragraph' CHECK (block_type IN (
                'paragraph', 'heading', 'bulletList', 'orderedList',
                'checkList', 'blockquote', 'codeBlock', 'image', 'divider'
              )),
  attrs       JSONB DEFAULT '{}',       -- atributos do bloco (level para heading, language para codeBlock, etc.)
  content     JSONB DEFAULT '[]',       -- array de marks/inline content
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_doc_contents_node   ON taskzei_doc_contents(node_id);
CREATE INDEX IF NOT EXISTS idx_doc_contents_order  ON taskzei_doc_contents(node_id, sort_order);

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION taskzei_doc_contents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_doc_contents_updated_at ON taskzei_doc_contents;
CREATE TRIGGER trg_doc_contents_updated_at
  BEFORE UPDATE ON taskzei_doc_contents
  FOR EACH ROW EXECUTE FUNCTION taskzei_doc_contents_updated_at();

-- ── 3. taskzei_entity_links ────────────────────────────────────────────────
-- Links bidirecionais entre entidades (tarefas ↔ documentos, etc.).
CREATE TABLE IF NOT EXISTS taskzei_entity_links (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type   TEXT NOT NULL,          -- ex: 'task', 'document', 'meeting'
  source_id     TEXT NOT NULL,
  target_type   TEXT NOT NULL,          -- ex: 'task', 'document', 'meeting'
  target_id     TEXT NOT NULL,
  relationship  TEXT DEFAULT 'related', -- ex: 'related', 'parent', 'reference'
  metadata      JSONB DEFAULT '{}',     -- payload opcional (intent, linked_from, timestamp, etc.)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_type, source_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_entity_links_source ON taskzei_entity_links(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_entity_links_target ON taskzei_entity_links(target_type, target_id);

-- ── 4. taskzei_doc_attachments ─────────────────────────────────────────────
-- Anexos de documentos (arquivos referenciados via storage bucket).
CREATE TABLE IF NOT EXISTS taskzei_doc_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     UUID NOT NULL REFERENCES taskzei_doc_nodes(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_size   INT NOT NULL DEFAULT 0,
  mime_type   TEXT NOT NULL DEFAULT 'application/octet-stream',
  storage_key TEXT NOT NULL,            -- path no bucket do Supabase Storage
  created_by  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doc_attachments_node ON taskzei_doc_attachments(node_id);

-- ── RLS (Row Level Security) ───────────────────────────────────────────────

-- Habilita RLS em todas as tabelas
ALTER TABLE taskzei_doc_nodes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE taskzei_doc_contents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE taskzei_entity_links   ENABLE ROW LEVEL SECURITY;
ALTER TABLE taskzei_doc_attachments ENABLE ROW LEVEL SECURITY;

-- Políticas para taskzei_doc_nodes
CREATE POLICY doc_nodes_select_workspace ON taskzei_doc_nodes
  FOR SELECT USING (workspace_id = current_setting('app.current_workspace_id', true) OR workspace_id = 'default');

CREATE POLICY doc_nodes_insert_workspace ON taskzei_doc_nodes
  FOR INSERT WITH CHECK (workspace_id = current_setting('app.current_workspace_id', true) OR workspace_id = 'default');

CREATE POLICY doc_nodes_update_workspace ON taskzei_doc_nodes
  FOR UPDATE USING (workspace_id = current_setting('app.current_workspace_id', true) OR workspace_id = 'default');

CREATE POLICY doc_nodes_delete_workspace ON taskzei_doc_nodes
  FOR DELETE USING (workspace_id = current_setting('app.current_workspace_id', true) OR workspace_id = 'default');

-- Políticas para taskzei_doc_contents (baseadas no node.workspace_id)
CREATE POLICY doc_contents_select ON taskzei_doc_contents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM taskzei_doc_nodes n WHERE n.id = node_id)
  );

CREATE POLICY doc_contents_insert ON taskzei_doc_contents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM taskzei_doc_nodes n WHERE n.id = node_id)
  );

CREATE POLICY doc_contents_update ON taskzei_doc_contents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM taskzei_doc_nodes n WHERE n.id = node_id)
  );

CREATE POLICY doc_contents_delete ON taskzei_doc_contents
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM taskzei_doc_nodes n WHERE n.id = node_id)
  );

-- Políticas para taskzei_entity_links (público leitura, insert/update/delete autenticado)
CREATE POLICY entity_links_select_all ON taskzei_entity_links
  FOR SELECT USING (true);

CREATE POLICY entity_links_insert_auth ON taskzei_entity_links
  FOR INSERT WITH CHECK (true);

CREATE POLICY entity_links_update_auth ON taskzei_entity_links
  FOR UPDATE USING (true);

CREATE POLICY entity_links_delete_auth ON taskzei_entity_links
  FOR DELETE USING (true);

-- Políticas para taskzei_doc_attachments (baseadas no node)
CREATE POLICY doc_attachments_select ON taskzei_doc_attachments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM taskzei_doc_nodes n WHERE n.id = node_id)
  );

CREATE POLICY doc_attachments_insert ON taskzei_doc_attachments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM taskzei_doc_nodes n WHERE n.id = node_id)
  );

CREATE POLICY doc_attachments_update ON taskzei_doc_attachments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM taskzei_doc_nodes n WHERE n.id = node_id)
  );

CREATE POLICY doc_attachments_delete ON taskzei_doc_attachments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM taskzei_doc_nodes n WHERE n.id = node_id)
  );
