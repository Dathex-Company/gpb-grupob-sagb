-- Central de Padrões | ET-23
-- Biblioteca de Módulos Base e persistência estrutural complementar.
-- Não canoniza conteúdo final; cria estrutura governada para curadoria posterior.

create table if not exists public.central_padroes_base_modules (
  id uuid primary key default gen_random_uuid(),
  module_id text not null unique,
  name text not null,
  module_type text not null default 'core',
  description text not null default '',
  status text not null default 'candidato',
  owner_name text not null default 'Central de Padrões',
  area_id text null references public.central_padroes_areas(id),
  dependencies jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  recommended_use text not null default '',
  reuse_criteria jsonb not null default '[]'::jsonb,
  linked_standards jsonb not null default '[]'::jsonb,
  linked_protocols jsonb not null default '[]'::jsonb,
  linked_checklists jsonb not null default '[]'::jsonb,
  gate_checklist_key text not null default 'CP-TEC-006',
  canonical boolean not null default false,
  canonical_status text not null default 'candidato',
  pietro_validation_required boolean not null default true,
  rodrigues_decision_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cp_base_modules_module_id on public.central_padroes_base_modules(module_id);
create index if not exists idx_cp_base_modules_area on public.central_padroes_base_modules(area_id);
create index if not exists idx_cp_base_modules_status on public.central_padroes_base_modules(status);
create index if not exists idx_cp_base_modules_type on public.central_padroes_base_modules(module_type);

alter table public.central_padroes_base_modules enable row level security;

drop policy if exists "cp_authenticated_read_central_padroes_base_modules" on public.central_padroes_base_modules;
create policy "cp_authenticated_read_central_padroes_base_modules"
  on public.central_padroes_base_modules for select
  using (auth.role() = 'authenticated');

drop policy if exists "cp_authenticated_write_central_padroes_base_modules" on public.central_padroes_base_modules;
create policy "cp_authenticated_write_central_padroes_base_modules"
  on public.central_padroes_base_modules for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

