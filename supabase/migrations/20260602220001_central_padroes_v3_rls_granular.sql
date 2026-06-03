-- Central de Padrões V3 | RLS Granular + Soft Delete + Audit Log + Perfis
-- Migração obrigatória para status de fonte oficial plena.
-- Remove políticas permissivas "ALL for authenticated" e substitui por RLS granular por perfil.

-- ============================================================
-- 1. Tabela de perfis de usuário (se não existir globalmente)
-- ============================================================
create table if not exists public.central_padroes_user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  profile_role text not null default 'leitor' check (profile_role in ('leitor','editor','curador','aprovador','administrador','agente_autorizado','auditor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.central_padroes_user_profiles enable row level security;

-- Qualquer usuário autenticado pode ver seu próprio perfil
drop policy if exists "cp_profile_select_own" on public.central_padroes_user_profiles;
create policy "cp_profile_select_own" on public.central_padroes_user_profiles
  for select using (auth.uid() = user_id);

-- Apenas admin pode criar/editar perfis
drop policy if exists "cp_profile_insert_admin" on public.central_padroes_user_profiles;
create policy "cp_profile_insert_admin" on public.central_padroes_user_profiles
  for insert with check (
    exists (select 1 from public.central_padroes_user_profiles where user_id = auth.uid() and profile_role = 'administrador')
  );

drop policy if exists "cp_profile_update_admin" on public.central_padroes_user_profiles;
create policy "cp_profile_update_admin" on public.central_padroes_user_profiles
  for update using (
    exists (select 1 from public.central_padroes_user_profiles where user_id = auth.uid() and profile_role = 'administrador')
  );

-- ============================================================
-- 2. Tabela de audit log
-- ============================================================
create table if not exists public.central_padroes_audit_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'CREATE','UPDATE','DELETE','SOFT_DELETE','RESTORE',
    'STATUS_CHANGE','APPROVE','REJECT','PUBLISH','ARCHIVE',
    'OWNER_CHANGE','CANONICAL_EDIT','AGENT_QUERY','CHAT_RESPONSE',
    'RECONCILIATION_DRIFT','SEARCH_FAILURE','PERMISSION_DENIED'
  )),
  entity_type text not null check (entity_type in (
    'standard','document','decision','checklist','module','agent','base_module','evidence','approval'
  )),
  entity_id text not null,
  previous_state jsonb null,
  new_state jsonb null,
  diff jsonb null,
  changed_by text not null,
  changed_by_role text null,
  reason text null,
  risk_level text null check (risk_level in ('baixo','medio','alto','critico')),
  metadata jsonb null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Índices para consulta eficiente
create index if not exists idx_cp_audit_event_type on public.central_padroes_audit_log(event_type);
create index if not exists idx_cp_audit_entity on public.central_padroes_audit_log(entity_type, entity_id);
create index if not exists idx_cp_audit_changed_by on public.central_padroes_audit_log(changed_by);
create index if not exists idx_cp_audit_created_at on public.central_padroes_audit_log(created_at desc);

alter table public.central_padroes_audit_log enable row level security;

-- INSERT: qualquer serviço autenticado pode escrever log
drop policy if exists "cp_audit_insert_authenticated" on public.central_padroes_audit_log;
create policy "cp_audit_insert_authenticated" on public.central_padroes_audit_log
  for insert with check (auth.role() = 'authenticated');

-- SELECT: auditor, admin e aprovador podem ler
drop policy if exists "cp_audit_select_admin_auditor" on public.central_padroes_audit_log;
create policy "cp_audit_select_admin_auditor" on public.central_padroes_audit_log
  for select using (
    exists (select 1 from public.central_padroes_user_profiles where user_id = auth.uid() and profile_role in ('auditor','administrador','aprovador'))
  );

-- ============================================================
-- 3. Soft delete nas tabelas principais
-- ============================================================
alter table public.central_padroes_standards
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by text null;

alter table public.central_padroes_documents
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by text null;

alter table public.central_padroes_decisions
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by text null;

alter table public.central_padroes_checklists
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by text null;

alter table public.central_padroes_module_links
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by text null;

-- ============================================================
-- 4. Campos para canonicidade expandida
-- ============================================================
alter table public.central_padroes_standards
  add column if not exists canonical_level text not null default 'bruto' check (canonical_level in (
    'bruto','rascunho','em_revisao','em_curadoria','homologado','canonico_operacional','canonico_oficial','publicado','obsoleto','arquivado','bloqueado'
  )),
  add column if not exists requires_visual_evidence boolean not null default false,
  add column if not exists visual_evidence_url text null,
  add column if not exists next_review_at timestamptz null,
  add column if not exists last_reviewed_by text null,
  add column if not exists last_reviewed_at timestamptz null;

-- ============================================================
-- 5. Substituir políticas RLS permissivas por granulares
-- ============================================================

-- Função auxiliar para obter o perfil do usuário atual
create or replace function public.cp_current_user_role()
returns text
language sql
stable
security definer
as $$
  select coalesce(
    (select profile_role from public.central_padroes_user_profiles where user_id = auth.uid()),
    'leitor'
  );
$$;

-- Função auxiliar: usuário pode editar este standard?
create or replace function public.cp_can_edit_standard(standard_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select case
    when public.cp_current_user_role() in ('administrador') then true
    when public.cp_current_user_role() in ('curador','aprovador') then
      (select canonical_level from public.central_padroes_standards where id = standard_id) not in ('canonico_operacional','canonico_oficial','publicado')
    when public.cp_current_user_role() = 'editor' then
      (select owner_name from public.central_padroes_standards where id = standard_id) = coalesce(auth.email()::text, '')
      and (select canonical_level from public.central_padroes_standards where id = standard_id) in ('bruto','rascunho','em_revisao')
    else false
  end;
$$;

-- ============================================================
-- 5.1 Políticas para central_padroes_standards
-- ============================================================
drop policy if exists "cp_authenticated_read_central_padroes_standards" on public.central_padroes_standards;
drop policy if exists "cp_authenticated_write_central_padroes_standards" on public.central_padroes_standards;
drop policy if exists "cp_read_authenticated_central_padroes_standards" on public.central_padroes_standards;
drop policy if exists "cp_write_authenticated_central_padroes_standards" on public.central_padroes_standards;

create policy "cp_standards_select" on public.central_padroes_standards
  for select using (auth.role() = 'authenticated' and deleted_at is null);

create policy "cp_standards_insert" on public.central_padroes_standards
  for insert with check (
    public.cp_current_user_role() in ('editor','curador','aprovador','administrador')
  );

create policy "cp_standards_update" on public.central_padroes_standards
  for update using (public.cp_can_edit_standard(id))
  with check (public.cp_can_edit_standard(id));

create policy "cp_standards_delete" on public.central_padroes_standards
  for update using (public.cp_current_user_role() = 'administrador')
  with check (public.cp_current_user_role() = 'administrador' and deleted_at is not null);

-- ============================================================
-- 5.2 Políticas para central_padroes_documents
-- ============================================================
drop policy if exists "cp_authenticated_read_central_padroes_documents" on public.central_padroes_documents;
drop policy if exists "cp_authenticated_write_central_padroes_documents" on public.central_padroes_documents;
drop policy if exists "cp_read_authenticated_central_padroes_documents" on public.central_padroes_documents;
drop policy if exists "cp_write_authenticated_central_padroes_documents" on public.central_padroes_documents;

create policy "cp_documents_select" on public.central_padroes_documents
  for select using (auth.role() = 'authenticated' and deleted_at is null);

create policy "cp_documents_insert" on public.central_padroes_documents
  for insert with check (
    public.cp_current_user_role() in ('editor','curador','aprovador','administrador')
  );

create policy "cp_documents_update" on public.central_padroes_documents
  for update using (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

create policy "cp_documents_delete" on public.central_padroes_documents
  for update using (public.cp_current_user_role() = 'administrador')
  with check (public.cp_current_user_role() = 'administrador' and deleted_at is not null);

-- ============================================================
-- 5.3 Políticas para central_padroes_decisions
-- ============================================================
drop policy if exists "cp_authenticated_read_central_padroes_decisions" on public.central_padroes_decisions;
drop policy if exists "cp_authenticated_write_central_padroes_decisions" on public.central_padroes_decisions;
drop policy if exists "cp_read_authenticated_central_padroes_decisions" on public.central_padroes_decisions;
drop policy if exists "cp_write_authenticated_central_padroes_decisions" on public.central_padroes_decisions;

create policy "cp_decisions_select" on public.central_padroes_decisions
  for select using (auth.role() = 'authenticated' and deleted_at is null);

create policy "cp_decisions_insert" on public.central_padroes_decisions
  for insert with check (
    public.cp_current_user_role() in ('editor','curador','aprovador','administrador')
  );

create policy "cp_decisions_update" on public.central_padroes_decisions
  for update using (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

create policy "cp_decisions_delete" on public.central_padroes_decisions
  for update using (public.cp_current_user_role() = 'administrador')
  with check (public.cp_current_user_role() = 'administrador' and deleted_at is not null);

-- ============================================================
-- 5.4 Políticas para central_padroes_checklists
-- ============================================================
drop policy if exists "cp_authenticated_read_central_padroes_checklists" on public.central_padroes_checklists;
drop policy if exists "cp_authenticated_write_central_padroes_checklists" on public.central_padroes_checklists;
drop policy if exists "cp_read_authenticated_central_padroes_checklists" on public.central_padroes_checklists;
drop policy if exists "cp_write_authenticated_central_padroes_checklists" on public.central_padroes_checklists;

create policy "cp_checklists_select" on public.central_padroes_checklists
  for select using (auth.role() = 'authenticated' and deleted_at is null);

create policy "cp_checklists_insert" on public.central_padroes_checklists
  for insert with check (
    public.cp_current_user_role() in ('editor','curador','aprovador','administrador')
  );

create policy "cp_checklists_update" on public.central_padroes_checklists
  for update using (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

create policy "cp_checklists_delete" on public.central_padroes_checklists
  for update using (public.cp_current_user_role() = 'administrador')
  with check (public.cp_current_user_role() = 'administrador' and deleted_at is not null);

-- ============================================================
-- 5.5 Políticas para central_padroes_module_links
-- ============================================================
drop policy if exists "cp_authenticated_read_central_padroes_module_links" on public.central_padroes_module_links;
drop policy if exists "cp_authenticated_write_central_padroes_module_links" on public.central_padroes_module_links;
drop policy if exists "cp_read_authenticated_central_padroes_module_links" on public.central_padroes_module_links;
drop policy if exists "cp_write_authenticated_central_padroes_module_links" on public.central_padroes_module_links;

create policy "cp_modules_select" on public.central_padroes_module_links
  for select using (auth.role() = 'authenticated' and deleted_at is null);

create policy "cp_modules_insert" on public.central_padroes_module_links
  for insert with check (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

create policy "cp_modules_update" on public.central_padroes_module_links
  for update using (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

-- ============================================================
-- 5.6 Políticas para central_padroes_approval_requests
-- ============================================================
drop policy if exists "cp_authenticated_read_central_padroes_approval_requests" on public.central_padroes_approval_requests;
drop policy if exists "cp_authenticated_write_central_padroes_approval_requests" on public.central_padroes_approval_requests;
drop policy if exists "cp_read_authenticated_central_padroes_approval_requests" on public.central_padroes_approval_requests;
drop policy if exists "cp_write_authenticated_central_padroes_approval_requests" on public.central_padroes_approval_requests;

create policy "cp_approval_select" on public.central_padroes_approval_requests
  for select using (
    auth.role() = 'authenticated' and (
      requested_by = auth.email()::text
      or assigned_to = auth.email()::text
      or exists (select 1 from public.central_padroes_user_profiles where user_id = auth.uid() and profile_role in ('aprovador','administrador','auditor'))
    )
  );

create policy "cp_approval_insert" on public.central_padroes_approval_requests
  for insert with check (
    public.cp_current_user_role() in ('editor','curador','administrador')
  );

create policy "cp_approval_update" on public.central_padroes_approval_requests
  for update using (
    public.cp_current_user_role() in ('aprovador','administrador')
  );

-- ============================================================
-- 5.7 Políticas para central_padroes_agent_runs
-- ============================================================
drop policy if exists "cp_authenticated_read_central_padroes_agent_runs" on public.central_padroes_agent_runs;
drop policy if exists "cp_authenticated_write_central_padroes_agent_runs" on public.central_padroes_agent_runs;
drop policy if exists "cp_read_authenticated_central_padroes_agent_runs" on public.central_padroes_agent_runs;
drop policy if exists "cp_write_authenticated_central_padroes_agent_runs" on public.central_padroes_agent_runs;

create policy "cp_agents_select" on public.central_padroes_agent_runs
  for select using (auth.role() = 'authenticated');

create policy "cp_agents_insert" on public.central_padroes_agent_runs
  for insert with check (
    public.cp_current_user_role() in ('administrador','agente_autorizado')
  );

create policy "cp_agents_update" on public.central_padroes_agent_runs
  for update using (
    public.cp_current_user_role() in ('administrador','agente_autorizado')
  );

-- ============================================================
-- 5.8 Políticas para central_padroes_evidence_records
-- ============================================================
drop policy if exists "cp_authenticated_read_central_padroes_evidence_records" on public.central_padroes_evidence_records;
drop policy if exists "cp_authenticated_write_central_padroes_evidence_records" on public.central_padroes_evidence_records;
drop policy if exists "cp_read_authenticated_central_padroes_evidence_records" on public.central_padroes_evidence_records;
drop policy if exists "cp_write_authenticated_central_padroes_evidence_records" on public.central_padroes_evidence_records;

create policy "cp_evidence_select" on public.central_padroes_evidence_records
  for select using (auth.role() = 'authenticated');

create policy "cp_evidence_insert" on public.central_padroes_evidence_records
  for insert with check (
    public.cp_current_user_role() in ('editor','curador','administrador')
  );

create policy "cp_evidence_update" on public.central_padroes_evidence_records
  for update using (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

-- ============================================================
-- 5.9 Políticas para tabelas auxiliares (herdadas)
-- ============================================================
-- central_padroes_areas: leitura para todos, escrita só admin
drop policy if exists "cp_authenticated_read_central_padroes_areas" on public.central_padroes_areas;
drop policy if exists "cp_authenticated_write_central_padroes_areas" on public.central_padroes_areas;
drop policy if exists "cp_read_authenticated_central_padroes_areas" on public.central_padroes_areas;
drop policy if exists "cp_write_authenticated_central_padroes_areas" on public.central_padroes_areas;

create policy "cp_areas_select" on public.central_padroes_areas
  for select using (auth.role() = 'authenticated');

create policy "cp_areas_insert" on public.central_padroes_areas
  for insert with check (public.cp_current_user_role() = 'administrador');

create policy "cp_areas_update" on public.central_padroes_areas
  for update using (public.cp_current_user_role() = 'administrador');

-- central_padroes_standard_dependencies: leitura para todos, escrita só curador+
drop policy if exists "cp_authenticated_read_central_padroes_standard_dependencies" on public.central_padroes_standard_dependencies;
drop policy if exists "cp_authenticated_write_central_padroes_standard_dependencies" on public.central_padroes_standard_dependencies;
drop policy if exists "cp_read_authenticated_central_padroes_standard_dependencies" on public.central_padroes_standard_dependencies;
drop policy if exists "cp_write_authenticated_central_padroes_standard_dependencies" on public.central_padroes_standard_dependencies;

create policy "cp_deps_select" on public.central_padroes_standard_dependencies
  for select using (auth.role() = 'authenticated');

create policy "cp_deps_insert" on public.central_padroes_standard_dependencies
  for insert with check (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

-- central_padroes_ingestion_queue: leitura e escrita para editor+
drop policy if exists "cp_authenticated_read_central_padroes_ingestion_queue" on public.central_padroes_ingestion_queue;
drop policy if exists "cp_authenticated_write_central_padroes_ingestion_queue" on public.central_padroes_ingestion_queue;

create policy "cp_ingestion_select" on public.central_padroes_ingestion_queue
  for select using (
    auth.role() = 'authenticated' and public.cp_current_user_role() in ('editor','curador','aprovador','administrador')
  );

create policy "cp_ingestion_insert" on public.central_padroes_ingestion_queue
  for insert with check (
    public.cp_current_user_role() in ('editor','curador','aprovador','administrador')
  );

-- central_padroes_triagem: curador+
drop policy if exists "cp_authenticated_read_central_padroes_triagem" on public.central_padroes_triagem;
drop policy if exists "cp_authenticated_write_central_padroes_triagem" on public.central_padroes_triagem;

create policy "cp_triagem_select" on public.central_padroes_triagem
  for select using (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

create policy "cp_triagem_insert" on public.central_padroes_triagem
  for insert with check (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

-- central_padroes_tags: leitura para todos, escrita curador+
drop policy if exists "cp_authenticated_read_central_padroes_tags" on public.central_padroes_tags;
drop policy if exists "cp_authenticated_write_central_padroes_tags" on public.central_padroes_tags;

create policy "cp_tags_select" on public.central_padroes_tags
  for select using (auth.role() = 'authenticated');

create policy "cp_tags_insert" on public.central_padroes_tags
  for insert with check (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

-- central_padroes_embeddings: leitura para todos autenticados, escrita curador+
drop policy if exists "cp_authenticated_read_central_padroes_embeddings" on public.central_padroes_embeddings;
drop policy if exists "cp_authenticated_write_central_padroes_embeddings" on public.central_padroes_embeddings;

create policy "cp_embeddings_select" on public.central_padroes_embeddings
  for select using (auth.role() = 'authenticated');

create policy "cp_embeddings_insert" on public.central_padroes_embeddings
  for insert with check (
    public.cp_current_user_role() in ('curador','aprovador','administrador')
  );

-- ============================================================
-- 6. Função para obter perfil do usuário
-- ============================================================
create or replace function public.cp_get_user_profile()
returns jsonb
language sql
stable
security definer
as $$
  select to_jsonb(t) from (
    select user_id, email, display_name, profile_role, created_at, updated_at
    from public.central_padroes_user_profiles
    where user_id = auth.uid()
  ) t;
$$;
