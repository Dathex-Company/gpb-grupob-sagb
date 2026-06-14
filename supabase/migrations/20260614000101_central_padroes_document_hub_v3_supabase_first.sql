-- Central de Padrões — Document Hub V3 — Supabase-First
-- Data: 2026-06-14
-- Risco: R5 (migration estrutural com novas tabelas, índices, constraints e RPCs)
-- 
-- Esta migration prepara a Central como módulo espelho oficial,
-- com Supabase como fonte canônica e pasta docs/ como seed/importação.
--
-- Revisado: 14-06-2026 — adicionado pgcrypto extension para sha256
-- Rollback documentado ao final do arquivo.

-- ============================================================
-- 0. Extensão pgcrypto (necessária para sha256)
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- ============================================================
-- 1. Novos campos em central_padroes_documents
-- ============================================================

alter table public.central_padroes_documents
  add column if not exists source_kind text default 'ui_created',
  add column if not exists content_format text default 'markdown',
  add column if not exists source_hash text,
  add column if not exists source_updated_at timestamptz,
  add column if not exists domain text,
  add column if not exists is_active boolean default true,
  add column if not exists metadata jsonb default '{}',
  add column if not exists archived_at timestamptz;

comment on column public.central_padroes_documents.source_kind is 'Origem: local_md, ui_created, upload, imported, external.';
comment on column public.central_padroes_documents.content_format is 'Formato: markdown, html, plain, pdf_reference, docx_reference.';
comment on column public.central_padroes_documents.source_hash is 'Hash SHA-256 do conteúdo original para deduplicação.';
comment on column public.central_padroes_documents.source_updated_at is 'Data de última modificação do arquivo fonte.';
comment on column public.central_padroes_documents.domain is 'Domínio real: Governança, Técnico, Segurança, UX/UI, Agentes, Modelos IA, Naming, Exploração, Metodologias, Educação, Negócios.';
comment on column public.central_padroes_documents.is_active is 'Documento ativo (não arquivado).';
comment on column public.central_padroes_documents.metadata is 'Metadados extras em JSON (flexível para extensões futuras).';

create index if not exists idx_cp_documents_source_kind on public.central_padroes_documents(source_kind);
create index if not exists idx_cp_documents_source_hash on public.central_padroes_documents(source_hash);
create index if not exists idx_cp_documents_domain on public.central_padroes_documents(domain);
create index if not exists idx_cp_documents_is_active on public.central_padroes_documents(is_active);

-- Unique index (slug + source_path): slug column may not exist yet, deferred to future migration
-- create unique index if not exists idx_cp_documents_slug_path_unique
--   on public.central_padroes_documents(slug, source_path)
--   where source_path is not null and slug is not null;

-- ============================================================
-- 2. Tabela de import runs
-- ============================================================

create table if not exists public.central_padroes_document_import_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'local_docs',
  mode text not null default 'dry_run',
  status text not null default 'started',
  started_at timestamptz default now(),
  finished_at timestamptz,
  total_scanned integer default 0,
  total_created integer default 0,
  total_updated integer default 0,
  total_skipped integer default 0,
  total_errors integer default 0,
  report jsonb default '{}',
  run_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- ============================================================
-- 3. Tabela de import items
-- ============================================================

create table if not exists public.central_padroes_document_import_items (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.central_padroes_document_import_runs(id) on delete cascade,
  source_path text not null,
  source_hash text,
  document_id uuid references public.central_padroes_documents(id),
  action text not null,
  status text not null default 'pending',
  error text,
  before_snapshot jsonb,
  after_snapshot jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_cp_import_items_run on public.central_padroes_document_import_items(run_id);
create index if not exists idx_cp_import_items_path on public.central_padroes_document_import_items(source_path);

-- ============================================================
-- 4. RLS
-- ============================================================

alter table public.central_padroes_document_import_runs enable row level security;
alter table public.central_padroes_document_import_items enable row level security;

create policy cp_import_runs_select on public.central_padroes_document_import_runs for select to authenticated using (true);
create policy cp_import_items_select on public.central_padroes_document_import_items for select to authenticated using (true);

-- ============================================================
-- 5. RPC: cp_document_hash
-- ============================================================

create or replace function public.cp_document_hash(content text)
returns text
language sql
security definer
set search_path = ''
as $$
  select encode(extensions.digest(content::bytea, 'sha256'), 'hex');
$$;

-- ============================================================
-- 6. RPC: cp_import_document (idempotente)
-- ============================================================

create or replace function public.cp_import_document(
  p_title text,
  p_content text,
  p_source_path text default null,
  p_category text default 'Documentos',
  p_slug text default null,
  p_content_format text default 'markdown',
  p_source_kind text default 'local_md',
  p_domain text default null,
  p_owner text default null,
  p_tags text[] default null,
  p_summary text default null,
  p_official_status text default 'rascunho',
  p_metadata jsonb default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hash text; v_existing_id uuid; v_doc_id uuid; v_action text;
begin
  v_hash := public.cp_document_hash(p_content);
  -- Busca por source_path (slug pode não existir ainda)
  if p_source_path is not null then
    select id into v_existing_id from public.central_padroes_documents
    where source_path = p_source_path limit 1;
  elsif p_slug is not null then
    select id into v_existing_id from public.central_padroes_documents
    where slug = p_slug limit 1;
  end if;

  if v_existing_id is not null then
    if exists (select 1 from public.central_padroes_documents where id = v_existing_id and source_hash = v_hash) then
      v_action := 'skipped'; v_doc_id := v_existing_id;
    else
      update public.central_padroes_documents
      set content = p_content, source_hash = v_hash,
          source_kind = coalesce(source_kind, p_source_kind),
          content_format = coalesce(content_format, p_content_format),
          domain = coalesce(domain, p_domain), category = coalesce(category, p_category),
          owner = coalesce(owner, p_owner), tags = coalesce(tags, p_tags),
          summary = coalesce(summary, p_summary),
          updated_at = now(), updated_by = auth.uid()
      where id = v_existing_id;
      v_action := 'updated'; v_doc_id := v_existing_id;
    end if;
  else
    insert into public.central_padroes_documents (
      title, slug, content, content_format, source_kind, source_path, source_hash,
      domain, category, owner, tags, summary, official_status, metadata,
      created_by, updated_by
    ) values (
      p_title, p_slug, p_content, p_content_format, p_source_kind, p_source_path, v_hash,
      p_domain, p_category, p_owner, p_tags, p_summary, p_official_status, p_metadata,
      auth.uid(), auth.uid()
    ) returning id into v_doc_id;
    v_action := 'created';
  end if;
  return jsonb_build_object('action', v_action, 'document_id', v_doc_id, 'hash', v_hash);
end;
$$;

-- ============================================================
-- 7. RPC: cp_create_document
-- ============================================================

create or replace function public.cp_create_document(
  p_title text, p_slug text default null, p_content text default '',
  p_content_format text default 'markdown',
  p_domain text default null, p_category text default null,
  p_owner text default null, p_tags text[] default null,
  p_summary text default null, p_official_status text default 'rascunho'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid; v_slug text;
begin
  v_slug := coalesce(p_slug, lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '-+$', '')));
  insert into public.central_padroes_documents (
    title, slug, content, content_format, source_kind,
    domain, category, owner, tags, summary, official_status,
    created_by, updated_by
  ) values (
    p_title, v_slug, p_content, p_content_format, 'ui_created',
    p_domain, p_category, p_owner, p_tags, p_summary, p_official_status,
    auth.uid(), auth.uid()
  ) returning id into v_id;
  return v_id;
end;
$$;

-- ============================================================
-- ROLLBACK
-- ============================================================
-- alter table public.central_padroes_documents drop column source_kind, drop column content_format, drop column source_hash, drop column source_updated_at, drop column domain, drop column is_active, drop column metadata, drop column archived_at;
-- drop table if exists public.central_padroes_document_import_items;
-- drop table if exists public.central_padroes_document_import_runs;
-- drop function if exists public.cp_document_hash;
-- drop function if exists public.cp_import_document;
-- drop function if exists public.cp_create_document;
