-- ============================================================================
-- taskzei — meetings, inbox, audit & origin
-- modulo: taskzei / agenda_inteligente
-- contexto atual: banco compartilhado do SagB, prefixo exclusivo `taskzei_`
-- expansao do schema original (20260417000101_taskzei_persistence.sql)
-- adiciona: reunioes, pautas, decisoes, inbox, auditoria, origem
-- ============================================================================

-- ============================================================
-- 1. taskzei_tasks — expandir com origin e relatedDocIds
-- ============================================================
alter table if exists public.taskzei_tasks
  add column if not exists origin_system text,
  add column if not exists origin_ref text,
  add column if not exists origin_metadata jsonb default '{}'::jsonb,
  add column if not exists related_doc_ids text[] default '{}',
  add column if not exists archived boolean default false;

drop index if exists idx_taskzei_tasks_origin_system;
create index if not exists idx_taskzei_tasks_origin_system on public.taskzei_tasks(origin_system);
drop index if exists idx_taskzei_tasks_archived;
create index if not exists idx_taskzei_tasks_archived on public.taskzei_tasks(archived);

-- ============================================================
-- 2. taskzei_meetings
-- ============================================================
create table if not exists public.taskzei_meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  meeting_date date,
  start_time time,
  duration_minutes integer,
  status text not null default 'agendada' check (status in ('agendada', 'em_andamento', 'concluida', 'cancelada')),
  notes text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop index if exists idx_taskzei_meetings_date;
create index if not exists idx_taskzei_meetings_date on public.taskzei_meetings(meeting_date desc);
drop index if exists idx_taskzei_meetings_status;
create index if not exists idx_taskzei_meetings_status on public.taskzei_meetings(status);

drop trigger if exists update_taskzei_meetings_updated_at on public.taskzei_meetings;
create trigger update_taskzei_meetings_updated_at
before update on public.taskzei_meetings
for each row execute function public.update_updated_at_column();

-- ============================================================
-- 3. taskzei_meeting_agenda_items (pautas)
-- ============================================================
create table if not exists public.taskzei_meeting_agenda_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.taskzei_meetings(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  duration_minutes integer,
  status text not null default 'pendente' check (status in ('pendente', 'discutido', 'adiado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop index if exists idx_taskzei_agenda_meeting_id;
create index if not exists idx_taskzei_agenda_meeting_id on public.taskzei_meeting_agenda_items(meeting_id);
drop index if exists idx_taskzei_agenda_order;
create index if not exists idx_taskzei_agenda_order on public.taskzei_meeting_agenda_items(meeting_id, sort_order);

drop trigger if exists update_taskzei_agenda_updated_at on public.taskzei_meeting_agenda_items;
create trigger update_taskzei_agenda_updated_at
before update on public.taskzei_meeting_agenda_items
for each row execute function public.update_updated_at_column();

-- ============================================================
-- 4. taskzei_decisions
-- ============================================================
create table if not exists public.taskzei_decisions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references public.taskzei_meetings(id) on delete set null,
  agenda_item_id uuid references public.taskzei_meeting_agenda_items(id) on delete set null,
  title text not null,
  description text,
  responsible text,
  deadline timestamptz,
  status text not null default 'aberta' check (status in ('aberta', 'em_andamento', 'concluida', 'cancelada')),
  related_task_id uuid references public.taskzei_tasks(id) on delete set null,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop index if exists idx_taskzei_decisions_meeting;
create index if not exists idx_taskzei_decisions_meeting on public.taskzei_decisions(meeting_id);
drop index if exists idx_taskzei_decisions_status;
create index if not exists idx_taskzei_decisions_status on public.taskzei_decisions(status);
drop index if exists idx_taskzei_decisions_responsible;
create index if not exists idx_taskzei_decisions_responsible on public.taskzei_decisions(responsible);

drop trigger if exists update_taskzei_decisions_updated_at on public.taskzei_decisions;
create trigger update_taskzei_decisions_updated_at
before update on public.taskzei_decisions
for each row execute function public.update_updated_at_column();

-- ============================================================
-- 5. taskzei_inbox_items
-- ============================================================
create table if not exists public.taskzei_inbox_items (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  source text not null default 'manual' check (source in ('manual', 'whatsapp', 'email', 'clickup', 'voice', 'sagb_chat')),
  status text not null default 'pending' check (status in ('pending', 'classified', 'converted', 'dismissed')),
  suggested_type text check (suggested_type in ('task', 'meeting', 'decision', 'note')),
  confidence numeric(4,3),
  converted_to_id uuid,
  converted_to_type text check (converted_to_type in ('task', 'meeting', 'decision')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop index if exists idx_taskzei_inbox_status;
create index if not exists idx_taskzei_inbox_status on public.taskzei_inbox_items(status);
drop index if exists idx_taskzei_inbox_source;
create index if not exists idx_taskzei_inbox_source on public.taskzei_inbox_items(source);
drop index if exists idx_taskzei_inbox_created;
create index if not exists idx_taskzei_inbox_created on public.taskzei_inbox_items(created_at desc);

drop trigger if exists update_taskzei_inbox_updated_at on public.taskzei_inbox_items;
create trigger update_taskzei_inbox_updated_at
before update on public.taskzei_inbox_items
for each row execute function public.update_updated_at_column();

-- ============================================================
-- 6. taskzei_audit_log
-- ============================================================
create table if not exists public.taskzei_audit_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  user_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

drop index if exists idx_taskzei_audit_entity;
create index if not exists idx_taskzei_audit_entity on public.taskzei_audit_log(entity_type, entity_id);
drop index if exists idx_taskzei_audit_action;
create index if not exists idx_taskzei_audit_action on public.taskzei_audit_log(action);
drop index if exists idx_taskzei_audit_created;
create index if not exists idx_taskzei_audit_created on public.taskzei_audit_log(created_at desc);

-- ============================================================
-- RLS — taskzei_meetings
-- ============================================================
alter table public.taskzei_meetings enable row level security;
alter table public.taskzei_meeting_agenda_items enable row level security;
alter table public.taskzei_decisions enable row level security;
alter table public.taskzei_inbox_items enable row level security;
alter table public.taskzei_audit_log enable row level security;

-- meetings
drop policy if exists taskzei_meetings_select on public.taskzei_meetings;
create policy taskzei_meetings_select on public.taskzei_meetings for select to authenticated using (true);
drop policy if exists taskzei_meetings_insert on public.taskzei_meetings;
create policy taskzei_meetings_insert on public.taskzei_meetings for insert to authenticated with check (true);
drop policy if exists taskzei_meetings_update on public.taskzei_meetings;
create policy taskzei_meetings_update on public.taskzei_meetings for update to authenticated using (true) with check (true);
drop policy if exists taskzei_meetings_delete on public.taskzei_meetings;
create policy taskzei_meetings_delete on public.taskzei_meetings for delete to authenticated using (true);

-- agenda items
drop policy if exists taskzei_agenda_select on public.taskzei_meeting_agenda_items;
create policy taskzei_agenda_select on public.taskzei_meeting_agenda_items for select to authenticated using (true);
drop policy if exists taskzei_agenda_insert on public.taskzei_meeting_agenda_items;
create policy taskzei_agenda_insert on public.taskzei_meeting_agenda_items for insert to authenticated with check (true);
drop policy if exists taskzei_agenda_update on public.taskzei_meeting_agenda_items;
create policy taskzei_agenda_update on public.taskzei_meeting_agenda_items for update to authenticated using (true) with check (true);
drop policy if exists taskzei_agenda_delete on public.taskzei_meeting_agenda_items;
create policy taskzei_agenda_delete on public.taskzei_meeting_agenda_items for delete to authenticated using (true);

-- decisions
drop policy if exists taskzei_decisions_select on public.taskzei_decisions;
create policy taskzei_decisions_select on public.taskzei_decisions for select to authenticated using (true);
drop policy if exists taskzei_decisions_insert on public.taskzei_decisions;
create policy taskzei_decisions_insert on public.taskzei_decisions for insert to authenticated with check (true);
drop policy if exists taskzei_decisions_update on public.taskzei_decisions;
create policy taskzei_decisions_update on public.taskzei_decisions for update to authenticated using (true) with check (true);
drop policy if exists taskzei_decisions_delete on public.taskzei_decisions;
create policy taskzei_decisions_delete on public.taskzei_decisions for delete to authenticated using (true);

-- inbox
drop policy if exists taskzei_inbox_select on public.taskzei_inbox_items;
create policy taskzei_inbox_select on public.taskzei_inbox_items for select to authenticated using (true);
drop policy if exists taskzei_inbox_insert on public.taskzei_inbox_items;
create policy taskzei_inbox_insert on public.taskzei_inbox_items for insert to authenticated with check (true);
drop policy if exists taskzei_inbox_update on public.taskzei_inbox_items;
create policy taskzei_inbox_update on public.taskzei_inbox_items for update to authenticated using (true) with check (true);
drop policy if exists taskzei_inbox_delete on public.taskzei_inbox_items;
create policy taskzei_inbox_delete on public.taskzei_inbox_items for delete to authenticated using (true);

-- audit log (apenas insert + select, sem update/delete)
drop policy if exists taskzei_audit_select on public.taskzei_audit_log;
create policy taskzei_audit_select on public.taskzei_audit_log for select to authenticated using (true);
drop policy if exists taskzei_audit_insert on public.taskzei_audit_log;
create policy taskzei_audit_insert on public.taskzei_audit_log for insert to authenticated with check (true);
