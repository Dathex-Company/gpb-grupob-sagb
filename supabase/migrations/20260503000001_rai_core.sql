-- RAI — Radar Avançado de Inteligência: core tables
-- Configurações vinculadas aos agents existentes do SagB (sem cadastro paralelo)

-- 1. Tabela de configuração de radar por agente
-- Cada agente do SagB pode ter UMA config de radar ativa
create table if not exists public.rai_configs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  workspace_id uuid not null,
  theme text not null,
  objective text,
  frequency text not null default 'daily' check (frequency in ('real-time', 'hourly', 'daily', 'weekly')),
  status text not null default 'active' check (status in ('active', 'paused', 'error')),
  sources_json jsonb not null default '[]'::jsonb,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  payload jsonb,
  unique(agent_id, workspace_id)  -- um agente = uma config de radar por workspace
);

-- 2. Tabela de capturas (referencia o agent do SagB diretamente)
create table if not exists public.rai_captures (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  agent_id uuid not null references public.agents(id) on delete cascade,
  config_id uuid references public.rai_configs(id) on delete set null,
  title text not null,
  content text,
  summary text,
  source_url text,
  source_name text not null,
  relevance_score numeric(5,2) default 0,
  tfidf_vector jsonb,
  captured_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'read', 'archived', 'converted')),
  tags_json jsonb not null default '[]'::jsonb,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  payload jsonb
);

-- 3. Índices
create index if not exists idx_rai_configs_agent on public.rai_configs(agent_id);
create index if not exists idx_rai_configs_workspace on public.rai_configs(workspace_id);
create index if not exists idx_rai_configs_theme on public.rai_configs(theme);

create index if not exists idx_rai_captures_workspace on public.rai_captures(workspace_id);
create index if not exists idx_rai_captures_agent on public.rai_captures(agent_id);
create index if not exists idx_rai_captures_config on public.rai_captures(config_id);
create index if not exists idx_rai_captures_status on public.rai_captures(status);
create index if not exists idx_rai_captures_captured_at on public.rai_captures(captured_at desc);
create index if not exists idx_rai_captures_relevance on public.rai_captures(relevance_score desc);

-- 4. RLS
alter table public.rai_configs enable row level security;
alter table public.rai_captures enable row level security;

grant select, insert, update, delete on table public.rai_configs to authenticated;
grant select, insert, update, delete on table public.rai_captures to authenticated;

-- Policy: select por workspace (rai_configs)
drop policy if exists rai_configs_select_workspace on public.rai_configs;
create policy rai_configs_select_workspace on public.rai_configs
  for select to authenticated using (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_configs.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  );

-- Policy: select por workspace (rai_captures)
drop policy if exists rai_captures_select_workspace on public.rai_captures;
create policy rai_captures_select_workspace on public.rai_captures
  for select to authenticated using (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_captures.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  );

-- Policy: insert por workspace (rai_configs)
drop policy if exists rai_configs_insert_workspace on public.rai_configs;
create policy rai_configs_insert_workspace on public.rai_configs
  for insert to authenticated with check (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_configs.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  );

-- Policy: insert por workspace (rai_captures)
drop policy if exists rai_captures_insert_workspace on public.rai_captures;
create policy rai_captures_insert_workspace on public.rai_captures
  for insert to authenticated with check (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_captures.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  );

-- Policy: update por workspace (rai_configs)
drop policy if exists rai_configs_update_workspace on public.rai_configs;
create policy rai_configs_update_workspace on public.rai_configs
  for update to authenticated using (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_configs.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  ) with check (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_configs.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  );

-- Policy: update por workspace (rai_captures)
drop policy if exists rai_captures_update_workspace on public.rai_captures;
create policy rai_captures_update_workspace on public.rai_captures
  for update to authenticated using (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_captures.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  ) with check (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_captures.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  );

-- Policy: delete por workspace (rai_configs)
drop policy if exists rai_configs_delete_workspace on public.rai_configs;
create policy rai_configs_delete_workspace on public.rai_configs
  for delete to authenticated using (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_configs.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  );

-- Policy: delete por workspace (rai_captures)
drop policy if exists rai_captures_delete_workspace on public.rai_captures;
create policy rai_captures_delete_workspace on public.rai_captures
  for delete to authenticated using (
    auth.role() = 'service_role'
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = rai_captures.workspace_id
        and wm.user_id = auth.uid()
        and coalesce(wm.status, 'active') <> 'inactive'
    )
  );
