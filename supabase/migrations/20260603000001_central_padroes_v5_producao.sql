-- Central de Padrões V5 | Pacote de Produção Inicial
-- Obrigatória antes de declarar a Central como fonte oficial plena.
-- Inclui: RPCs críticas, busca segura, histórico do Chat Pietro,
-- índice documental, rate limiting mínimo, Storage e auditoria redundante.

-- ============================================================
-- 0. Extensões e ajustes defensivos
-- ============================================================
create extension if not exists vector;

alter table public.central_padroes_audit_log
  add column if not exists ip_address inet null,
  add column if not exists user_agent text null;

alter table public.central_padroes_areas
  add column if not exists review_interval_days int not null default 60,
  add column if not exists display_order int not null default 0;

alter table public.central_padroes_approval_requests
  add column if not exists expires_at timestamptz null;

alter table public.central_padroes_standard_dependencies
  add column if not exists description text null;

-- ============================================================
-- 1. Rate limiting mínimo para RPCs sensíveis
-- ============================================================
create table if not exists public.central_padroes_rate_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete cascade,
  action_name text not null,
  bucket_start timestamptz not null,
  hit_count int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, action_name, bucket_start)
);

alter table public.central_padroes_rate_limits enable row level security;

drop policy if exists "cp_rate_limits_admin_select" on public.central_padroes_rate_limits;
create policy "cp_rate_limits_admin_select" on public.central_padroes_rate_limits
  for select using (public.cp_current_user_role() in ('administrador','auditor'));

create index if not exists idx_cp_rate_limits_user_action
  on public.central_padroes_rate_limits(user_id, action_name, bucket_start desc);

create or replace function public.cp_rate_limit(
  p_action_name text,
  max_hits int default 60,
  window_seconds int default 60
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  bucket timestamptz;
  current_hits int;
begin
  if current_user_id is null then
    return false;
  end if;

  bucket := to_timestamp(floor(extract(epoch from now()) / window_seconds) * window_seconds);

  insert into public.central_padroes_rate_limits(user_id, action_name, bucket_start, hit_count)
  values (current_user_id, p_action_name, bucket, 1)
  on conflict (user_id, action_name, bucket_start)
  do update set hit_count = public.central_padroes_rate_limits.hit_count + 1,
                updated_at = now()
  returning hit_count into current_hits;

  return current_hits <= max_hits;
end;
$$;

-- ============================================================
-- 2. Histórico persistente do Chat Pietro
-- ============================================================
create table if not exists public.central_padroes_chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  mode text not null default 'buscar_documento',
  sources jsonb not null default '[]'::jsonb,
  feedback boolean null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.central_padroes_chat_history enable row level security;

drop policy if exists "cp_chat_history_select_own_or_admin" on public.central_padroes_chat_history;
create policy "cp_chat_history_select_own_or_admin" on public.central_padroes_chat_history
  for select using (
    user_id = auth.uid()
    or public.cp_current_user_role() in ('administrador','auditor')
  );

drop policy if exists "cp_chat_history_insert_own" on public.central_padroes_chat_history;
create policy "cp_chat_history_insert_own" on public.central_padroes_chat_history
  for insert with check (user_id = auth.uid());

drop policy if exists "cp_chat_history_update_feedback_own" on public.central_padroes_chat_history;
create policy "cp_chat_history_update_feedback_own" on public.central_padroes_chat_history
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index if not exists idx_cp_chat_history_user_created
  on public.central_padroes_chat_history(user_id, created_at desc);

-- ============================================================
-- 3. Índice documental Supabase
-- ============================================================
create table if not exists public.central_padroes_search_index (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('standard','document','decision','checklist','module','agent','base_module','evidence')),
  entity_id text not null,
  title text not null,
  summary text null,
  chunks text[] not null default '{}',
  tags text[] not null default '{}',
  owner_name text null,
  status text null,
  normative_type text null,
  area_id text null,
  route text null,
  canonical_level text null,
  allowed_roles text[] not null default array['leitor','editor','curador','aprovador','administrador','auditor'],
  embedding vector(1536) null,
  search_vector tsvector null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(entity_type, entity_id)
);

alter table public.central_padroes_search_index enable row level security;

drop policy if exists "cp_search_index_select_by_role" on public.central_padroes_search_index;
create policy "cp_search_index_select_by_role" on public.central_padroes_search_index
  for select using (public.cp_current_user_role() = any(allowed_roles));

drop policy if exists "cp_search_index_write_curator" on public.central_padroes_search_index;
create policy "cp_search_index_write_curator" on public.central_padroes_search_index
  for all using (public.cp_current_user_role() in ('curador','aprovador','administrador'))
  with check (public.cp_current_user_role() in ('curador','aprovador','administrador'));

create index if not exists idx_cp_search_index_tsv
  on public.central_padroes_search_index using gin(search_vector);
create index if not exists idx_cp_search_index_entity
  on public.central_padroes_search_index(entity_type, entity_id);
create index if not exists idx_cp_search_index_area_status
  on public.central_padroes_search_index(area_id, status);

create or replace function public.cp_refresh_search_index_vector()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.search_vector := to_tsvector(
    'portuguese',
    coalesce(new.title,'') || ' ' || coalesce(new.summary,'') || ' ' || array_to_string(new.tags, ' ')
  );
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_cp_refresh_search_index_vector on public.central_padroes_search_index;
create trigger trg_cp_refresh_search_index_vector
  before insert or update on public.central_padroes_search_index
  for each row execute function public.cp_refresh_search_index_vector();

-- ============================================================
-- 4. Storage: buckets oficiais
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('cp-evidence', 'cp-evidence', false, 52428800, array['image/png','image/jpeg','image/webp','application/pdf','text/plain','text/markdown']),
  ('cp-documents', 'cp-documents', false, 104857600, array['application/pdf','text/plain','text/markdown','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cp_storage_read_authenticated" on storage.objects;
create policy "cp_storage_read_authenticated" on storage.objects
  for select using (
    bucket_id in ('cp-evidence','cp-documents')
    and auth.role() = 'authenticated'
  );

drop policy if exists "cp_storage_write_editors" on storage.objects;
create policy "cp_storage_write_editors" on storage.objects
  for insert with check (
    bucket_id in ('cp-evidence','cp-documents')
    and public.cp_current_user_role() in ('editor','curador','aprovador','administrador')
  );

drop policy if exists "cp_storage_update_curators" on storage.objects;
create policy "cp_storage_update_curators" on storage.objects
  for update using (
    bucket_id in ('cp-evidence','cp-documents')
    and public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

-- ============================================================
-- 5. Auditoria redundante no banco
-- ============================================================
create or replace function public.cp_audit_standard_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor text := coalesce(auth.email(), auth.uid()::text, 'system');
  actor_role text := public.cp_current_user_role();
  event text := 'UPDATE';
  risk text := 'medio';
begin
  if old.status is distinct from new.status or old.canonical_level is distinct from new.canonical_level then
    event := 'STATUS_CHANGE';
  end if;

  if old.owner_name is distinct from new.owner_name then
    event := 'OWNER_CHANGE';
  end if;

  if old.canonical_level in ('canonico_operacional','canonico_oficial','publicado') then
    event := 'CANONICAL_EDIT';
    risk := 'critico';
  elsif new.status in ('canonico_operacional','canonico_oficial','publicado') or new.canonical_level in ('canonico_operacional','canonico_oficial','publicado') then
    risk := 'alto';
  end if;

  insert into public.central_padroes_audit_log(
    event_type, entity_type, entity_id, previous_state, new_state, diff,
    changed_by, changed_by_role, reason, risk_level, metadata
  ) values (
    event,
    'standard',
    new.id::text,
    to_jsonb(old),
    to_jsonb(new),
    jsonb_build_object(
      'status', jsonb_build_object('from', old.status, 'to', new.status),
      'canonical_level', jsonb_build_object('from', old.canonical_level, 'to', new.canonical_level),
      'owner_name', jsonb_build_object('from', old.owner_name, 'to', new.owner_name),
      'version', jsonb_build_object('from', old.version, 'to', new.version)
    ),
    actor,
    actor_role,
    'Auditoria redundante automática no banco',
    risk,
    jsonb_build_object('trigger', 'cp_audit_standard_update')
  );

  return new;
end;
$$;

drop trigger if exists trg_cp_audit_standard_update on public.central_padroes_standards;
create trigger trg_cp_audit_standard_update
  after update on public.central_padroes_standards
  for each row
  when (old is distinct from new)
  execute function public.cp_audit_standard_update();

-- ============================================================
-- 6. Funções RPC de aprovação/publicação
-- ============================================================
create or replace function public.cp_approve_standard(
  target_standard_id uuid,
  approval_reason text default 'Aprovação canônica'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := public.cp_current_user_role();
  before_row jsonb;
  after_row jsonb;
begin
  if not public.cp_rate_limit('cp_approve_standard', 20, 60) then
    return jsonb_build_object('error', 'Rate limit excedido para aprovação');
  end if;

  if caller_role not in ('aprovador','administrador') then
    insert into public.central_padroes_audit_log(event_type, entity_type, entity_id, changed_by, changed_by_role, reason, risk_level, metadata)
    values ('PERMISSION_DENIED', 'standard', target_standard_id::text, coalesce(auth.email(), auth.uid()::text), caller_role, 'Tentativa de aprovação sem permissão', 'alto', jsonb_build_object('rpc','cp_approve_standard'));
    return jsonb_build_object('error', 'Apenas aprovadores ou administradores podem aprovar padrões');
  end if;

  select to_jsonb(s) into before_row from public.central_padroes_standards s where s.id = target_standard_id and s.deleted_at is null;
  if before_row is null then
    return jsonb_build_object('error', 'Padrão não encontrado');
  end if;

  update public.central_padroes_standards
  set status = 'homologado',
      canonical_level = 'homologado',
      last_reviewed_by = coalesce(auth.email(), auth.uid()::text),
      last_reviewed_at = now(),
      updated_at = now()
  where id = target_standard_id
  returning to_jsonb(public.central_padroes_standards.*) into after_row;

  update public.central_padroes_approval_requests
  set status = 'approved', review_notes = approval_reason, decided_at = now()
  where standard_id = target_standard_id and status = 'pending';

  insert into public.central_padroes_audit_log(event_type, entity_type, entity_id, previous_state, new_state, changed_by, changed_by_role, reason, risk_level, metadata)
  values ('APPROVE', 'standard', target_standard_id::text, before_row, after_row, coalesce(auth.email(), auth.uid()::text), caller_role, approval_reason, 'alto', jsonb_build_object('rpc','cp_approve_standard'));

  return jsonb_build_object('success', true, 'standard_id', target_standard_id, 'status', 'homologado');
end;
$$;

create or replace function public.cp_reject_standard(
  target_standard_id uuid,
  rejection_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := public.cp_current_user_role();
  before_row jsonb;
  after_row jsonb;
begin
  if not public.cp_rate_limit('cp_reject_standard', 20, 60) then
    return jsonb_build_object('error', 'Rate limit excedido para rejeição');
  end if;

  if caller_role not in ('aprovador','administrador') then
    return jsonb_build_object('error', 'Apenas aprovadores ou administradores podem rejeitar padrões');
  end if;

  if coalesce(trim(rejection_reason), '') = '' then
    return jsonb_build_object('error', 'Motivo de rejeição é obrigatório');
  end if;

  select to_jsonb(s) into before_row from public.central_padroes_standards s where s.id = target_standard_id and s.deleted_at is null;
  if before_row is null then
    return jsonb_build_object('error', 'Padrão não encontrado');
  end if;

  update public.central_padroes_standards
  set status = 'em_curadoria',
      canonical_level = 'em_curadoria',
      updated_at = now()
  where id = target_standard_id
  returning to_jsonb(public.central_padroes_standards.*) into after_row;

  update public.central_padroes_approval_requests
  set status = 'rejected', review_notes = rejection_reason, decided_at = now()
  where standard_id = target_standard_id and status = 'pending';

  insert into public.central_padroes_audit_log(event_type, entity_type, entity_id, previous_state, new_state, changed_by, changed_by_role, reason, risk_level, metadata)
  values ('REJECT', 'standard', target_standard_id::text, before_row, after_row, coalesce(auth.email(), auth.uid()::text), caller_role, rejection_reason, 'medio', jsonb_build_object('rpc','cp_reject_standard'));

  return jsonb_build_object('success', true, 'standard_id', target_standard_id, 'status', 'em_curadoria');
end;
$$;

create or replace function public.cp_publish_standard(target_standard_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := public.cp_current_user_role();
  before_row jsonb;
  after_row jsonb;
begin
  if not public.cp_rate_limit('cp_publish_standard', 15, 60) then
    return jsonb_build_object('error', 'Rate limit excedido para publicação');
  end if;

  if caller_role not in ('aprovador','administrador') then
    return jsonb_build_object('error', 'Apenas aprovadores ou administradores podem publicar padrões');
  end if;

  select to_jsonb(s) into before_row from public.central_padroes_standards s where s.id = target_standard_id and s.deleted_at is null;
  if before_row is null then
    return jsonb_build_object('error', 'Padrão não encontrado');
  end if;

  update public.central_padroes_standards
  set status = 'publicado',
      canonical_level = 'canonico_oficial',
      last_reviewed_by = coalesce(auth.email(), auth.uid()::text),
      last_reviewed_at = now(),
      updated_at = now()
  where id = target_standard_id
    and canonical_level in ('homologado','canonico_operacional','canonico_oficial')
  returning to_jsonb(public.central_padroes_standards.*) into after_row;

  if after_row is null then
    return jsonb_build_object('error', 'Padrão precisa estar homologado/canônico antes de publicar');
  end if;

  insert into public.central_padroes_audit_log(event_type, entity_type, entity_id, previous_state, new_state, changed_by, changed_by_role, reason, risk_level, metadata)
  values ('PUBLISH', 'standard', target_standard_id::text, before_row, after_row, coalesce(auth.email(), auth.uid()::text), caller_role, 'Publicação oficial', 'alto', jsonb_build_object('rpc','cp_publish_standard'));

  return jsonb_build_object('success', true, 'standard_id', target_standard_id, 'status', 'publicado', 'canonical_level', 'canonico_oficial');
end;
$$;

-- ============================================================
-- 7. Busca FTS segura com permissão e aviso de não oficial
-- ============================================================
create or replace function public.cp_search_standards(
  search_query text default '',
  filter_status text[] default null,
  filter_area text default null,
  filter_owner text default null,
  filter_canonical text default null,
  max_results int default 20
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := public.cp_current_user_role();
  result jsonb;
begin
  if not public.cp_rate_limit('cp_search_standards', 120, 60) then
    return jsonb_build_object('error', 'Rate limit excedido para busca');
  end if;

  if caller_role not in ('leitor','editor','curador','aprovador','administrador','agente_autorizado','auditor') then
    return jsonb_build_object('error', 'Perfil sem permissão de busca');
  end if;

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) into result
  from (
    select
      s.id,
      s.standard_key,
      s.title,
      s.normative_type,
      s.status,
      s.area_id,
      s.owner_name,
      s.summary,
      s.risk_level,
      s.version,
      s.canonical_level,
      s.updated_at,
      case
        when s.canonical_level in ('canonico_operacional','canonico_oficial') or s.status = 'publicado' then false
        else true
      end as not_official,
      case
        when s.canonical_level in ('canonico_operacional','canonico_oficial') or s.status = 'publicado' then null
        else 'Este item não é oficial. Está em ' || coalesce(s.status, s.canonical_level) || '.'
      end as official_warning,
      ts_rank(
        to_tsvector('portuguese', coalesce(s.standard_key,'') || ' ' || coalesce(s.title,'') || ' ' || coalesce(s.summary,'') || ' ' || coalesce(s.owner_name,'')),
        plainto_tsquery('portuguese', coalesce(search_query,''))
      ) as rank
    from public.central_padroes_standards s
    where s.deleted_at is null
      and (filter_status is null or s.status = any(filter_status))
      and (filter_area is null or s.area_id = filter_area)
      and (filter_owner is null or s.owner_name ilike '%' || filter_owner || '%')
      and (filter_canonical is null or s.canonical_level = filter_canonical)
      and (
        coalesce(trim(search_query),'') = ''
        or to_tsvector('portuguese', coalesce(s.standard_key,'') || ' ' || coalesce(s.title,'') || ' ' || coalesce(s.summary,'') || ' ' || coalesce(s.owner_name,''))
           @@ plainto_tsquery('portuguese', search_query)
        or s.title ilike '%' || search_query || '%'
        or s.summary ilike '%' || search_query || '%'
      )
    order by rank desc, s.updated_at desc
    limit greatest(1, least(max_results, 100))
  ) t;

  return jsonb_build_object('results', result, 'role', caller_role, 'source', 'supabase');
end;
$$;

-- ============================================================
-- 8. Métricas para Governance Panel
-- ============================================================
create or replace function public.cp_get_dashboard_metrics()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  caller_role text := public.cp_current_user_role();
  payload jsonb;
begin
  if caller_role not in ('curador','aprovador','administrador','auditor') then
    return jsonb_build_object('error', 'Acesso negado ao painel de governança');
  end if;

  select jsonb_build_object(
    'standards_total', (select count(*) from public.central_padroes_standards where deleted_at is null),
    'standards_canonical', (select count(*) from public.central_padroes_standards where deleted_at is null and canonical_level in ('canonico_operacional','canonico_oficial')),
    'standards_drafts', (select count(*) from public.central_padroes_standards where deleted_at is null and status in ('bruto','rascunho','em_revisao','em_curadoria')),
    'standards_pending_approval', (select count(*) from public.central_padroes_approval_requests where status = 'pending'),
    'standards_without_owner', (select count(*) from public.central_padroes_standards where deleted_at is null and coalesce(trim(owner_name),'') = ''),
    'standards_without_evidence', (select count(*) from public.central_padroes_standards where deleted_at is null and requires_visual_evidence = true and coalesce(visual_evidence_url,'') = ''),
    'standards_expired_review', (select count(*) from public.central_padroes_standards where deleted_at is null and next_review_at is not null and next_review_at < now()),
    'critical_risks', (select count(*) from public.central_padroes_standards where deleted_at is null and risk_level in ('alto','critico')),
    'decisions_pending', (select count(*) from public.central_padroes_decisions where deleted_at is null and status = 'proposta'),
    'audit_events_24h', (select count(*) from public.central_padroes_audit_log where created_at > now() - interval '24 hours')
  ) into payload;

  return payload;
end;
$$;

-- ============================================================
-- 9. Reconciliação operacional
-- ============================================================
create or replace function public.cp_reconcile_fallback()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text := public.cp_current_user_role();
  payload jsonb;
begin
  if caller_role not in ('curador','aprovador','administrador','auditor') then
    return jsonb_build_object('error', 'Acesso negado à reconciliação');
  end if;

  select jsonb_build_object(
    'source_of_truth', 'supabase',
    'fallback_mode', 'offline_cache_only',
    'warning', 'Modo offline/cache: estes dados podem estar desatualizados. A fonte oficial é o Supabase.',
    'counts', jsonb_build_object(
      'areas', (select count(*) from public.central_padroes_areas),
      'standards', (select count(*) from public.central_padroes_standards where deleted_at is null),
      'documents', (select count(*) from public.central_padroes_documents where deleted_at is null),
      'decisions', (select count(*) from public.central_padroes_decisions where deleted_at is null),
      'checklists', (select count(*) from public.central_padroes_checklists where deleted_at is null),
      'modules', (select count(*) from public.central_padroes_module_links where deleted_at is null),
      'agents', (select count(*) from public.central_padroes_agent_runs)
    ),
    'generated_at', now()
  ) into payload;

  insert into public.central_padroes_audit_log(event_type, entity_type, entity_id, changed_by, changed_by_role, reason, risk_level, metadata)
  values ('RECONCILIATION_DRIFT', 'module', 'central_padroes', coalesce(auth.email(), auth.uid()::text), caller_role, 'Reconciliação operacional executada', 'medio', payload);

  return payload;
end;
$$;

-- ============================================================
-- 10. Registro de conversa do Chat Pietro via RPC
-- ============================================================
create or replace function public.cp_log_chat_pietro(
  question text,
  answer text,
  mode text default 'buscar_documento',
  sources jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
begin
  if not public.cp_rate_limit('cp_log_chat_pietro', 60, 60) then
    return jsonb_build_object('error', 'Rate limit excedido para Chat Pietro');
  end if;

  insert into public.central_padroes_chat_history(user_id, question, answer, mode, sources, metadata)
  values (auth.uid(), question, answer, mode, sources, metadata)
  returning id into new_id;

  insert into public.central_padroes_audit_log(event_type, entity_type, entity_id, changed_by, changed_by_role, reason, risk_level, metadata)
  values ('CHAT_RESPONSE', 'agent', new_id::text, coalesce(auth.email(), auth.uid()::text), public.cp_current_user_role(), 'Chat Pietro respondeu consulta', 'baixo', jsonb_build_object('mode', mode, 'question', question));

  return jsonb_build_object('success', true, 'chat_history_id', new_id);
end;
$$;
