-- Central de Padrões V2 CRUD | ET-02
-- Complementa a V1 sem remover nem alterar dados existentes de forma destrutiva.

alter table if exists public.central_padroes_standards
  add column if not exists content_rich jsonb not null default '{}'::jsonb,
  add column if not exists approval_status text not null default 'draft',
  add column if not exists approval_requested_at timestamptz null,
  add column if not exists approval_decided_at timestamptz null,
  add column if not exists canonical boolean not null default false,
  add column if not exists canonical_version int not null default 1;

create table if not exists public.central_padroes_ingestion_queue (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_path text null,
  source_kind text not null default 'manual',
  raw_content text null,
  suggested_area_id text null references public.central_padroes_areas(id),
  suggested_destination text not null default 'apoio',
  confidence numeric(5,2) not null default 0,
  status text not null default 'queued',
  created_by text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.central_padroes_triagem (
  id uuid primary key default gen_random_uuid(),
  queue_id uuid not null references public.central_padroes_ingestion_queue(id) on delete cascade,
  classification_type text not null default 'documento',
  area_id text null references public.central_padroes_areas(id),
  destination_type text not null default 'apoio',
  status text not null default 'pending',
  reviewer_notes text null,
  reviewed_by text null,
  reviewed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.central_padroes_standard_history (
  id uuid primary key default gen_random_uuid(),
  standard_id uuid not null references public.central_padroes_standards(id) on delete cascade,
  action text not null,
  previous_data jsonb null,
  next_data jsonb null,
  changed_by text null,
  created_at timestamptz not null default now()
);

create table if not exists public.central_padroes_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  category text not null default 'geral',
  created_at timestamptz not null default now()
);

create table if not exists public.central_padroes_standard_tags (
  id uuid primary key default gen_random_uuid(),
  standard_id uuid not null references public.central_padroes_standards(id) on delete cascade,
  tag_id uuid not null references public.central_padroes_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (standard_id, tag_id)
);

create index if not exists idx_cp_ingestion_status on public.central_padroes_ingestion_queue(status);
create index if not exists idx_cp_ingestion_area on public.central_padroes_ingestion_queue(suggested_area_id);
create index if not exists idx_cp_triagem_queue on public.central_padroes_triagem(queue_id);
create index if not exists idx_cp_triagem_status on public.central_padroes_triagem(status);
create index if not exists idx_cp_history_standard on public.central_padroes_standard_history(standard_id);
create index if not exists idx_cp_tags_slug on public.central_padroes_tags(slug);
create index if not exists idx_cp_standard_tags_standard on public.central_padroes_standard_tags(standard_id);

alter table public.central_padroes_ingestion_queue enable row level security;
alter table public.central_padroes_triagem enable row level security;
alter table public.central_padroes_standard_history enable row level security;
alter table public.central_padroes_tags enable row level security;
alter table public.central_padroes_standard_tags enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'central_padroes_ingestion_queue',
    'central_padroes_triagem',
    'central_padroes_standard_history',
    'central_padroes_tags',
    'central_padroes_standard_tags'
  ]
  loop
    execute format('drop policy if exists "cp_authenticated_read_%s" on public.%I', t, t);
    execute format('create policy "cp_authenticated_read_%s" on public.%I for select using (auth.role() = ''authenticated'')', t, t);
    execute format('drop policy if exists "cp_authenticated_write_%s" on public.%I', t, t);
    execute format('create policy "cp_authenticated_write_%s" on public.%I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t, t);
  end loop;
end $$;

create or replace function public.central_padroes_ingest_document(
  p_title text,
  p_source_path text default null,
  p_raw_content text default null,
  p_source_kind text default 'manual'
) returns uuid
language plpgsql
security definer
as $$
declare
  v_id uuid;
  v_area text;
  v_destination text := 'apoio';
begin
  v_area := case
    when lower(coalesce(p_source_path, '') || ' ' || p_title) like '%savio%' then 'savio'
    when lower(coalesce(p_source_path, '') || ' ' || p_title) like '%pietro%' then 'pietro'
    when lower(coalesce(p_source_path, '') || ' ' || p_title) like '%alice%' then 'alice'
    when lower(coalesce(p_source_path, '') || ' ' || p_title) like '%seguran%' then 'pedro'
    else null
  end;

  v_destination := case
    when lower(p_title) like '%checklist%' then 'checklist'
    when lower(p_title) like '%adr%' or lower(p_title) like '%decis%' then 'registro'
    when lower(p_title) like '%padrao%' or lower(p_title) like '%padrão%' then 'padrao'
    else 'apoio'
  end;

  insert into public.central_padroes_ingestion_queue(title, source_path, raw_content, source_kind, suggested_area_id, suggested_destination, confidence, created_by)
  values (p_title, p_source_path, p_raw_content, p_source_kind, v_area, v_destination, case when v_area is null then 55 else 80 end, auth.uid()::text)
  returning id into v_id;

  insert into public.central_padroes_triagem(queue_id, area_id, destination_type, status)
  values (v_id, v_area, v_destination, 'pending');

  return v_id;
end;
$$;

create or replace function public.central_padroes_sync_governance()
returns int
language plpgsql
security definer
as $$
begin
  -- Placeholder seguro: ambientes sem governance_rules continuam operacionais.
  return 0;
end;
$$;

insert into public.central_padroes_tags(slug, label, category) values
  ('governanca', 'Governança', 'dominio'),
  ('arquitetura', 'Arquitetura', 'dominio'),
  ('seguranca', 'Segurança', 'risco'),
  ('ux-ui', 'UX/UI', 'dominio'),
  ('antes-de-construir', 'Antes de Construir', 'principio')
on conflict (slug) do update set label = excluded.label, category = excluded.category;

