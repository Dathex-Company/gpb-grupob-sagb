-- ============================================================================
-- taskzei persistence (tasks + checklist + comments)
-- modulo: taskzei / agenda_inteligente
-- contexto atual: usa o banco compartilhado do SagB
-- isolamento de dominio: garantido por prefixo exclusivo `taskzei_`
-- migracao futura: tabelas desenhadas para export/import 1:1 para projeto dedicado
-- arquivo de referencia de migracao futura:
--   src/modules/taskzei/docs/MIGRACAO_FUTURA_SUPABASE_TASKZEI.md
-- ============================================================================

create extension if not exists pgcrypto;

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.taskzei_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'aberta' check (status in ('aberta', 'em_andamento', 'concluida')),
  priority text not null default 'media' check (priority in ('baixa', 'media', 'alta')),
  assignee_name text,
  due_date timestamptz,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.taskzei_task_checklist_items (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.taskzei_tasks(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.taskzei_task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.taskzei_tasks(id) on delete cascade,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_taskzei_tasks_status on public.taskzei_tasks(status);
create index if not exists idx_taskzei_tasks_priority on public.taskzei_tasks(priority);
create index if not exists idx_taskzei_tasks_created_at on public.taskzei_tasks(created_at desc);
create index if not exists idx_taskzei_tasks_updated_at on public.taskzei_tasks(updated_at desc);
create index if not exists idx_taskzei_checklist_task_id on public.taskzei_task_checklist_items(task_id);
create index if not exists idx_taskzei_comments_task_id on public.taskzei_task_comments(task_id);
create index if not exists idx_taskzei_comments_created_at on public.taskzei_task_comments(created_at desc);

drop trigger if exists update_taskzei_tasks_updated_at on public.taskzei_tasks;
create trigger update_taskzei_tasks_updated_at
before update on public.taskzei_tasks
for each row execute function public.update_updated_at_column();

alter table public.taskzei_tasks enable row level security;
alter table public.taskzei_task_checklist_items enable row level security;
alter table public.taskzei_task_comments enable row level security;

drop policy if exists taskzei_tasks_select on public.taskzei_tasks;
create policy taskzei_tasks_select
on public.taskzei_tasks
for select
to authenticated
using (true);

drop policy if exists taskzei_tasks_insert on public.taskzei_tasks;
create policy taskzei_tasks_insert
on public.taskzei_tasks
for insert
to authenticated
with check (created_by is null or created_by = auth.uid());

drop policy if exists taskzei_tasks_update on public.taskzei_tasks;
create policy taskzei_tasks_update
on public.taskzei_tasks
for update
to authenticated
using (true)
with check (true);

drop policy if exists taskzei_tasks_delete on public.taskzei_tasks;
create policy taskzei_tasks_delete
on public.taskzei_tasks
for delete
to authenticated
using (true);

drop policy if exists taskzei_checklist_select on public.taskzei_task_checklist_items;
create policy taskzei_checklist_select
on public.taskzei_task_checklist_items
for select
to authenticated
using (true);

drop policy if exists taskzei_checklist_insert on public.taskzei_task_checklist_items;
create policy taskzei_checklist_insert
on public.taskzei_task_checklist_items
for insert
to authenticated
with check (
  exists (
    select 1 from public.taskzei_tasks t where t.id = task_id
  )
);

drop policy if exists taskzei_checklist_update on public.taskzei_task_checklist_items;
create policy taskzei_checklist_update
on public.taskzei_task_checklist_items
for update
to authenticated
using (true)
with check (true);

drop policy if exists taskzei_checklist_delete on public.taskzei_task_checklist_items;
create policy taskzei_checklist_delete
on public.taskzei_task_checklist_items
for delete
to authenticated
using (true);

drop policy if exists taskzei_comments_select on public.taskzei_task_comments;
create policy taskzei_comments_select
on public.taskzei_task_comments
for select
to authenticated
using (true);

drop policy if exists taskzei_comments_insert on public.taskzei_task_comments;
create policy taskzei_comments_insert
on public.taskzei_task_comments
for insert
to authenticated
with check (
  exists (
    select 1 from public.taskzei_tasks t where t.id = task_id
  )
);

drop policy if exists taskzei_comments_update on public.taskzei_task_comments;
create policy taskzei_comments_update
on public.taskzei_task_comments
for update
to authenticated
using (true)
with check (true);

drop policy if exists taskzei_comments_delete on public.taskzei_task_comments;
create policy taskzei_comments_delete
on public.taskzei_task_comments
for delete
to authenticated
using (true);
