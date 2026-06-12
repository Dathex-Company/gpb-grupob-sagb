-- ============================================================
-- Central de Documentos e Padrões — extensão segura
-- Data: 2026-06-12
-- Risco: R4 local / R5 se aplicada em Supabase remoto
-- Objetivo: completar tabelas mínimas para relatórios, auditorias,
-- LOZE-TRACE e curadoria sem alterar dados existentes.
-- Rollback: drop table das tabelas criadas nesta migration.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.central_padroes_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  type text not null default 'relatorio',
  category text not null default 'governanca',
  status text not null default 'registro',
  risk_level text not null default 'R2',
  path_absolute text,
  path_relative text,
  summary text,
  content text,
  tags text[] not null default '{}',
  owner text,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.central_padroes_audits (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  type text not null default 'auditoria',
  category text not null default 'governanca',
  status text not null default 'aberta',
  risk_level text not null default 'R2',
  path_absolute text,
  path_relative text,
  summary text,
  content text,
  tags text[] not null default '{}',
  owner text,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.central_padroes_trace_logs (
  id uuid primary key default gen_random_uuid(),
  execution_id text not null,
  project text not null default 'SagB',
  module text not null default 'central_padroes',
  executor text,
  task_title text not null,
  risk_max text not null default 'R2',
  status text not null default 'registro',
  started_at timestamptz,
  finished_at timestamptz,
  commands_json jsonb not null default '[]'::jsonb,
  files_changed_json jsonb not null default '[]'::jsonb,
  errors_json jsonb not null default '[]'::jsonb,
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.central_padroes_curadoria (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  type text not null default 'curadoria',
  category text not null default '99-curadoria',
  status text not null default 'triagem',
  risk_level text not null default 'R2',
  path_absolute text,
  path_relative text,
  summary text,
  content text,
  tags text[] not null default '{}',
  owner text,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create index if not exists idx_cp_reports_status on public.central_padroes_reports(status);
create index if not exists idx_cp_audits_status on public.central_padroes_audits(status);
create index if not exists idx_cp_trace_execution_id on public.central_padroes_trace_logs(execution_id);
create index if not exists idx_cp_curadoria_status on public.central_padroes_curadoria(status);

alter table public.central_padroes_reports enable row level security;
alter table public.central_padroes_audits enable row level security;
alter table public.central_padroes_trace_logs enable row level security;
alter table public.central_padroes_curadoria enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'central_padroes_reports',
    'central_padroes_audits',
    'central_padroes_trace_logs',
    'central_padroes_curadoria'
  ] loop
    execute format('drop policy if exists "%s_select_authenticated" on public.%I', tbl, tbl);
    execute format('drop policy if exists "%s_insert_authenticated" on public.%I', tbl, tbl);
    execute format('drop policy if exists "%s_update_authenticated" on public.%I', tbl, tbl);
    execute format('create policy "%s_select_authenticated" on public.%I for select to authenticated using (true)', tbl, tbl);
    execute format('create policy "%s_insert_authenticated" on public.%I for insert to authenticated with check (auth.uid() is not null)', tbl, tbl);
    execute format('create policy "%s_update_authenticated" on public.%I for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null)', tbl, tbl);
  end loop;
end $$;

comment on table public.central_padroes_reports is 'Relatórios oficiais e registros documentais da Central de Documentos e Padrões.';
comment on table public.central_padroes_audits is 'Auditorias, achados, evidências e planos de ação da Central de Documentos e Padrões.';
comment on table public.central_padroes_trace_logs is 'Execuções LOZE-TRACE com comandos, arquivos, erros e resumo.';
comment on table public.central_padroes_curadoria is 'Itens de curadoria documental, legado, duplicados e fora do padrão.';
