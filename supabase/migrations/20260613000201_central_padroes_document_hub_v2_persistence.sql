-- Central de Padrões — Document Hub V2 — R5: Persistência, Versionamento, Rascunhos e Eventos
-- Data: 2026-06-13
-- Risco: R5 (migration estrutural com novas tabelas, índices, RLS e RPCs SECURITY DEFINER)
-- Rollback: DROP TABLE IF EXISTS + ALTER TABLE DROP COLUMN (documentado ao final)

-- ============================================================
-- 1. ALTER TABLE central_padroes_documents
-- ============================================================

alter table public.central_padroes_documents
  add column if not exists official_status text,
  add column if not exists published_at timestamptz,
  add column if not exists published_by uuid references auth.users(id);

create index if not exists idx_cp_documents_official_status
  on public.central_padroes_documents(official_status);

create index if not exists idx_cp_documents_published_at
  on public.central_padroes_documents(published_at desc);

comment on column public.central_padroes_documents.official_status is 'Status oficial do documento: oficial_ativo, em_revisao, rascunho, incompleto, legado, fonte_bruta, curadoria, externo.';
comment on column public.central_padroes_documents.published_at is 'Data da última publicação oficial.';
comment on column public.central_padroes_documents.published_by is 'Usuário que publicou a versão oficial ativa.';

-- ============================================================
-- 2. CREATE TABLE central_padroes_document_versions
-- ============================================================

create table if not exists public.central_padroes_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.central_padroes_documents(id) on delete cascade,
  version integer not null,
  title text,
  content text,
  summary text,
  tags text[],
  official_status text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create index if not exists idx_cp_doc_versions_document
  on public.central_padroes_document_versions(document_id, version desc);

comment on table public.central_padroes_document_versions is 'Histórico de versões publicadas de documentos oficiais.';
comment on column public.central_padroes_document_versions.version is 'Número sequencial da versão (1, 2, 3...).';

-- ============================================================
-- 3. CREATE TABLE central_padroes_document_drafts
-- ============================================================

create table if not exists public.central_padroes_document_drafts (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.central_padroes_documents(id) on delete cascade,
  title text,
  content text,
  summary text,
  tags text[],
  owner text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz default now(),
  unique(document_id)
);

create index if not exists idx_cp_doc_drafts_document
  on public.central_padroes_document_drafts(document_id);

comment on table public.central_padroes_document_drafts is 'Rascunhos de documentos. Um documento tem no máximo um rascunho ativo.';

-- ============================================================
-- 4. CREATE TABLE central_padroes_document_events
-- ============================================================

create table if not exists public.central_padroes_document_events (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.central_padroes_documents(id) on delete cascade,
  event_type text not null,
  previous_official_status text,
  new_official_status text,
  version_from integer,
  version_to integer,
  changed_by uuid references auth.users(id),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_cp_doc_events_document
  on public.central_padroes_document_events(document_id, created_at desc);

create index if not exists idx_cp_doc_events_type
  on public.central_padroes_document_events(event_type);

comment on table public.central_padroes_document_events is 'Log editorial: draft_saved, published, version_restored, status_changed.';

-- ============================================================
-- 5. RLS — Enable
-- ============================================================

alter table public.central_padroes_document_versions enable row level security;
alter table public.central_padroes_document_drafts enable row level security;
alter table public.central_padroes_document_events enable row level security;

-- ============================================================
-- 6. RLS Policies — central_padroes_document_versions
-- ============================================================

drop policy if exists cp_doc_versions_select on public.central_padroes_document_versions;
drop policy if exists cp_doc_versions_insert on public.central_padroes_document_versions;

create policy cp_doc_versions_select
on public.central_padroes_document_versions
for select
to authenticated
using (true);

create policy cp_doc_versions_insert
on public.central_padroes_document_versions
for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('editor', 'curador', 'aprovador', 'administrador'));

-- ============================================================
-- 7. RLS Policies — central_padroes_document_drafts
-- ============================================================

drop policy if exists cp_doc_drafts_select on public.central_padroes_document_drafts;
drop policy if exists cp_doc_drafts_insert on public.central_padroes_document_drafts;
drop policy if exists cp_doc_drafts_update on public.central_padroes_document_drafts;
drop policy if exists cp_doc_drafts_delete on public.central_padroes_document_drafts;

create policy cp_doc_drafts_select
on public.central_padroes_document_drafts
for select
to authenticated
using (true);

create policy cp_doc_drafts_insert
on public.central_padroes_document_drafts
for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('editor', 'curador', 'aprovador', 'administrador'));

create policy cp_doc_drafts_update
on public.central_padroes_document_drafts
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('editor', 'curador', 'aprovador', 'administrador'))
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('editor', 'curador', 'aprovador', 'administrador'));

create policy cp_doc_drafts_delete
on public.central_padroes_document_drafts
for delete
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('curador', 'aprovador', 'administrador'));

-- ============================================================
-- 8. RLS Policies — central_padroes_document_events
-- ============================================================

drop policy if exists cp_doc_events_select on public.central_padroes_document_events;
drop policy if exists cp_doc_events_insert on public.central_padroes_document_events;

create policy cp_doc_events_select
on public.central_padroes_document_events
for select
to authenticated
using (true);

create policy cp_doc_events_insert
on public.central_padroes_document_events
for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('editor', 'curador', 'aprovador', 'administrador', 'auditor'));

-- ============================================================
-- 9. RPC — cp_save_document_draft
-- ============================================================

create or replace function public.cp_save_document_draft(
  p_document_id uuid,
  p_content text default null,
  p_title text default null,
  p_summary text default null,
  p_tags text[] default null,
  p_owner text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_draft_id uuid;
  v_role text;
begin
  -- Permission check: must be editor, curador, aprovador, or administrador
  v_role := auth.jwt() -> 'app_metadata' ->> 'profile_role';
  if v_role is null or v_role not in ('editor', 'curador', 'aprovador', 'administrador') then
    return jsonb_build_object('error', 'Permissão negada: perfil insuficiente para salvar rascunho.');
  end if;

  insert into public.central_padroes_document_drafts (
    document_id, title, content, summary, tags, owner, updated_by, updated_at
  ) values (
    p_document_id, p_title, p_content, p_summary, p_tags, p_owner, auth.uid(), now()
  )
  on conflict (document_id)
  do update set
    title = coalesce(p_title, central_padroes_document_drafts.title),
    content = coalesce(p_content, central_padroes_document_drafts.content),
    summary = coalesce(p_summary, central_padroes_document_drafts.summary),
    tags = coalesce(p_tags, central_padroes_document_drafts.tags),
    owner = coalesce(p_owner, central_padroes_document_drafts.owner),
    updated_by = auth.uid(),
    updated_at = now()
  returning id into v_draft_id;

  -- Update main document's official_status to 'rascunho' if not already official
  update public.central_padroes_documents
  set official_status = coalesce(official_status, 'rascunho'),
      updated_at = now()
  where id = p_document_id
    and official_status is distinct from 'oficial_ativo';

  insert into public.central_padroes_document_events (
    document_id, event_type, new_official_status, changed_by, metadata
  ) values (
    p_document_id, 'draft_saved', 'rascunho', auth.uid(),
    jsonb_build_object('draft_id', v_draft_id)
  );

  return jsonb_build_object(
    'draft_id', v_draft_id,
    'document_id', p_document_id,
    'status', 'draft_saved'
  );
end;
$$;

grant execute on function public.cp_save_document_draft(uuid, text, text, text, text[], text) to authenticated;

-- ============================================================
-- 10. RPC — cp_publish_document
-- ============================================================

create or replace function public.cp_publish_document(
  p_document_id uuid,
  p_content text,
  p_title text default null,
  p_summary text default null,
  p_tags text[] default null,
  p_owner text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_version integer;
  v_new_version integer;
  v_previous_status text;
  v_role text;
begin
  -- Permission check: must be aprovador or administrador
  v_role := auth.jwt() -> 'app_metadata' ->> 'profile_role';
  if v_role is null or v_role not in ('aprovador', 'administrador') then
    return jsonb_build_object('error', 'Permissão negada: apenas aprovador ou administrador pode publicar.');
  end if;

  -- Get current version number
  select coalesce(max(version), 0)
  into v_current_version
  from public.central_padroes_document_versions
  where document_id = p_document_id;

  v_new_version := v_current_version + 1;

  -- Get previous status for event log
  select official_status into v_previous_status
  from public.central_padroes_documents
  where id = p_document_id;

  -- Insert version record
  insert into public.central_padroes_document_versions (
    document_id, version, title, content, summary, tags,
    official_status, created_by, created_at
  )
  select
    p_document_id, v_new_version,
    coalesce(p_title, d.title),
    p_content,
    coalesce(p_summary, d.summary),
    coalesce(p_tags, d.tags),
    'oficial_ativo',
    auth.uid(),
    now()
  from public.central_padroes_documents d
  where d.id = p_document_id;

  -- Update main document
  update public.central_padroes_documents
  set title = coalesce(p_title, title),
      content = p_content,
      summary = coalesce(p_summary, summary),
      tags = coalesce(p_tags, tags),
      owner = coalesce(p_owner, owner),
      official_status = 'oficial_ativo',
      status = 'canonico',
      published_at = now(),
      published_by = auth.uid(),
      updated_at = now(),
      updated_by = auth.uid()
  where id = p_document_id;

  -- Clear draft
  delete from public.central_padroes_document_drafts
  where document_id = p_document_id;

  -- Log event
  insert into public.central_padroes_document_events (
    document_id, event_type, previous_official_status, new_official_status,
    version_from, version_to, changed_by, metadata
  ) values (
    p_document_id, 'published',
    v_previous_status, 'oficial_ativo',
    v_current_version, v_new_version,
    auth.uid(),
    jsonb_build_object('version', v_new_version)
  );

  return jsonb_build_object(
    'document_id', p_document_id,
    'version', v_new_version,
    'status', 'published',
    'official_status', 'oficial_ativo'
  );
end;
$$;

grant execute on function public.cp_publish_document(uuid, text, text, text, text[], text) to authenticated;

-- ============================================================
-- 11. RPC — cp_restore_document_version
-- ============================================================

create or replace function public.cp_restore_document_version(
  p_document_id uuid,
  p_version integer
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target public.central_padroes_document_versions;
  v_previous_status text;
  v_role text;
begin
  -- Permission check: must be administrador
  v_role := auth.jwt() -> 'app_metadata' ->> 'profile_role';
  if v_role is null or v_role != 'administrador' then
    return jsonb_build_object('error', 'Permissão negada: apenas administrador pode restaurar versão.');
  end if;

  select * into v_target
  from public.central_padroes_document_versions
  where document_id = p_document_id and version = p_version;

  if v_target is null then
    return jsonb_build_object(
      'error', 'Versão não encontrada',
      'document_id', p_document_id,
      'version', p_version
    );
  end if;

  -- Get previous status for event
  select official_status into v_previous_status
  from public.central_padroes_documents
  where id = p_document_id;

  -- Restore main document to target version
  update public.central_padroes_documents
  set title = v_target.title,
      content = v_target.content,
      summary = v_target.summary,
      tags = v_target.tags,
      official_status = 'oficial_ativo',
      status = 'canonico',
      published_at = now(),
      published_by = auth.uid(),
      updated_at = now(),
      updated_by = auth.uid()
  where id = p_document_id;

  -- Clear any draft
  delete from public.central_padroes_document_drafts
  where document_id = p_document_id;

  -- Log event
  insert into public.central_padroes_document_events (
    document_id, event_type, previous_official_status, new_official_status,
    version_from, version_to, changed_by, metadata
  ) values (
    p_document_id, 'version_restored',
    v_previous_status, 'oficial_ativo',
    null, p_version,
    auth.uid(),
    jsonb_build_object('restored_version', p_version)
  );

  return jsonb_build_object(
    'document_id', p_document_id,
    'restored_version', p_version,
    'status', 'restored',
    'official_status', 'oficial_ativo'
  );
end;
$$;

grant execute on function public.cp_restore_document_version(uuid, integer) to authenticated;

-- ============================================================
-- ROLLBACK (apenas em emergência)
-- ============================================================
-- DROP TABLE IF EXISTS public.central_padroes_document_events CASCADE;
-- DROP TABLE IF EXISTS public.central_padroes_document_drafts CASCADE;
-- DROP TABLE IF EXISTS public.central_padroes_document_versions CASCADE;
-- ALTER TABLE public.central_padroes_documents DROP COLUMN IF EXISTS official_status, DROP COLUMN IF EXISTS published_at, DROP COLUMN IF EXISTS published_by;
-- DROP FUNCTION IF EXISTS public.cp_restore_document_version(uuid, integer);
-- DROP FUNCTION IF EXISTS public.cp_publish_document(uuid, text, text, text, text[], text);
-- DROP FUNCTION IF EXISTS public.cp_save_document_draft(uuid, text, text, text, text[], text);
