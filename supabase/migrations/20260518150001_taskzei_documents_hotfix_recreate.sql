-- Hotfix: recria estruturas da Central de Documentos caso histórico tenha sido marcado como applied sem efetivar DDL.

-- 1) Tabela de nós
CREATE TABLE IF NOT EXISTS public.taskzei_doc_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL DEFAULT 'default',
  parent_id UUID NULL REFERENCES public.taskzei_doc_nodes(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Novo documento',
  slug TEXT NULL,
  icon TEXT NULL,
  type TEXT NOT NULL DEFAULT 'document',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT NULL,
  deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doc_nodes_workspace ON public.taskzei_doc_nodes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_doc_nodes_parent ON public.taskzei_doc_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_doc_nodes_type ON public.taskzei_doc_nodes(type);

-- 2) Conteúdo dos blocos
CREATE TABLE IF NOT EXISTS public.taskzei_doc_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES public.taskzei_doc_nodes(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL DEFAULT 'paragraph',
  attrs JSONB NOT NULL DEFAULT '{}'::jsonb,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doc_contents_node ON public.taskzei_doc_contents(node_id);
CREATE INDEX IF NOT EXISTS idx_doc_contents_order ON public.taskzei_doc_contents(node_id, sort_order);

-- 3) Links entre entidades
CREATE TABLE IF NOT EXISTS public.taskzei_entity_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relationship TEXT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_entity_links_source ON public.taskzei_entity_links(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_entity_links_target ON public.taskzei_entity_links(target_type, target_id);

-- 4) Anexos
CREATE TABLE IF NOT EXISTS public.taskzei_doc_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES public.taskzei_doc_nodes(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  storage_key TEXT NOT NULL,
  cid_ref_id TEXT NULL,
  created_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doc_attachments_node ON public.taskzei_doc_attachments(node_id);
CREATE INDEX IF NOT EXISTS idx_doc_attachments_cid_ref ON public.taskzei_doc_attachments(cid_ref_id);

-- 5) RLS mínimo
ALTER TABLE public.taskzei_doc_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taskzei_doc_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taskzei_entity_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taskzei_doc_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS doc_nodes_select_workspace ON public.taskzei_doc_nodes;
CREATE POLICY doc_nodes_select_workspace ON public.taskzei_doc_nodes
  FOR SELECT USING (workspace_id = 'default' OR workspace_id = current_setting('app.current_workspace_id', true));

DROP POLICY IF EXISTS doc_nodes_insert_workspace ON public.taskzei_doc_nodes;
CREATE POLICY doc_nodes_insert_workspace ON public.taskzei_doc_nodes
  FOR INSERT WITH CHECK (workspace_id = 'default' OR workspace_id = current_setting('app.current_workspace_id', true));

DROP POLICY IF EXISTS doc_nodes_update_workspace ON public.taskzei_doc_nodes;
CREATE POLICY doc_nodes_update_workspace ON public.taskzei_doc_nodes
  FOR UPDATE USING (workspace_id = 'default' OR workspace_id = current_setting('app.current_workspace_id', true));

DROP POLICY IF EXISTS doc_nodes_delete_workspace ON public.taskzei_doc_nodes;
CREATE POLICY doc_nodes_delete_workspace ON public.taskzei_doc_nodes
  FOR DELETE USING (workspace_id = 'default' OR workspace_id = current_setting('app.current_workspace_id', true));

DROP POLICY IF EXISTS doc_contents_select ON public.taskzei_doc_contents;
CREATE POLICY doc_contents_select ON public.taskzei_doc_contents
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.taskzei_doc_nodes n WHERE n.id = node_id));

DROP POLICY IF EXISTS doc_contents_insert ON public.taskzei_doc_contents;
CREATE POLICY doc_contents_insert ON public.taskzei_doc_contents
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.taskzei_doc_nodes n WHERE n.id = node_id));

DROP POLICY IF EXISTS doc_contents_update ON public.taskzei_doc_contents;
CREATE POLICY doc_contents_update ON public.taskzei_doc_contents
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.taskzei_doc_nodes n WHERE n.id = node_id));

DROP POLICY IF EXISTS doc_contents_delete ON public.taskzei_doc_contents;
CREATE POLICY doc_contents_delete ON public.taskzei_doc_contents
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.taskzei_doc_nodes n WHERE n.id = node_id));

DROP POLICY IF EXISTS entity_links_select_all ON public.taskzei_entity_links;
CREATE POLICY entity_links_select_all ON public.taskzei_entity_links FOR SELECT USING (true);

DROP POLICY IF EXISTS entity_links_insert_auth ON public.taskzei_entity_links;
CREATE POLICY entity_links_insert_auth ON public.taskzei_entity_links FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS entity_links_update_auth ON public.taskzei_entity_links;
CREATE POLICY entity_links_update_auth ON public.taskzei_entity_links FOR UPDATE USING (true);

DROP POLICY IF EXISTS entity_links_delete_auth ON public.taskzei_entity_links;
CREATE POLICY entity_links_delete_auth ON public.taskzei_entity_links FOR DELETE USING (true);

DROP POLICY IF EXISTS doc_attachments_select ON public.taskzei_doc_attachments;
CREATE POLICY doc_attachments_select ON public.taskzei_doc_attachments
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.taskzei_doc_nodes n WHERE n.id = node_id));

DROP POLICY IF EXISTS doc_attachments_insert ON public.taskzei_doc_attachments;
CREATE POLICY doc_attachments_insert ON public.taskzei_doc_attachments
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.taskzei_doc_nodes n WHERE n.id = node_id));

DROP POLICY IF EXISTS doc_attachments_update ON public.taskzei_doc_attachments;
CREATE POLICY doc_attachments_update ON public.taskzei_doc_attachments
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.taskzei_doc_nodes n WHERE n.id = node_id));

DROP POLICY IF EXISTS doc_attachments_delete ON public.taskzei_doc_attachments;
CREATE POLICY doc_attachments_delete ON public.taskzei_doc_attachments
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.taskzei_doc_nodes n WHERE n.id = node_id));

NOTIFY pgrst, 'reload schema';

