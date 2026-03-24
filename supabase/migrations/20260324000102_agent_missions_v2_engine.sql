-- Evolução do módulo de Missões para Motor de Times Autônomos

-- 1. Blueprints de Missão (Definição dos Times)
create table if not exists public.agent_mission_blueprints (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null, -- null se for blueprint global do sistema
  title text not null,
  description text,
  category text not null default 'general', -- marketing, product, dev, legal, etc
  flow_config jsonb not null default '[]', -- array de etapas/passos configurados
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Papéis (Roles) dentro do Blueprint
create table if not exists public.agent_mission_blueprint_roles (
  id uuid primary key default gen_random_uuid(),
  blueprint_id uuid not null references public.agent_mission_blueprints(id) on delete cascade,
  role_key text not null, -- ex: 'lead_developer', 'ux_researcher'
  role_name text not null,
  required_skills text[] not null default '{}',
  suggested_agent_id text, -- sugestão de agente específico
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint mission_blueprint_roles_unique unique (blueprint_id, role_key)
);

-- 3. Eventos da Missão (Log granular de inteligência e interação)
create table if not exists public.agent_mission_events (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.agent_missions(id) on delete cascade,
  event_type text not null, -- 'step_started', 'internal_comment', 'objection', 'artifact_created', etc
  actor_id text, -- id do agente ou do usuário
  actor_name text,
  actor_type text not null default 'agent', -- 'agent', 'human', 'system'
  content text,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- 4. Checkpoints (Intervenção Humana)
create table if not exists public.agent_mission_checkpoints (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.agent_missions(id) on delete cascade,
  step_id uuid references public.agent_mission_steps(id) on delete cascade,
  status text not null default 'pending', -- 'pending', 'approved', 'rejected'
  reviewer_id uuid, -- usuário que revisou
  note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- 5. Atualização da tabela de Missões para suportar Blueprint
alter table public.agent_missions add column if not exists blueprint_id uuid references public.agent_mission_blueprints(id) on delete set null;
alter table public.agent_missions add column if not exists mission_mode text not null default 'autonomous'; -- 'autonomous', 'supervised'
alter table public.agent_missions add column if not exists current_phase text;

-- Índices
create index if not exists idx_agent_mission_blueprints_workspace on public.agent_mission_blueprints(workspace_id);
create index if not exists idx_agent_mission_events_mission on public.agent_mission_events(mission_id, created_at desc);
create index if not exists idx_agent_mission_checkpoints_mission on public.agent_mission_checkpoints(mission_id);

-- RLS
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'agent_mission_blueprints',
    'agent_mission_blueprint_roles',
    'agent_mission_events',
    'agent_mission_checkpoints'
  ]
  loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', tbl);

    execute format('drop policy if exists %I_select_workspace on public.%I', tbl, tbl);
    execute format(
      'create policy %I_select_workspace on public.%I for select to authenticated using (
        auth.role() = ''service_role''
        or %I.workspace_id is null
        or exists (
          select 1
          from public.workspace_members wm
          where wm.workspace_id = %I.workspace_id
            and wm.user_id = auth.uid()
            and coalesce(wm.status, ''active'') <> ''inactive''
        )
      )',
      tbl, tbl, tbl, tbl
    );

    execute format('drop policy if exists %I_insert_workspace on public.%I', tbl, tbl);
    execute format(
      'create policy %I_insert_workspace on public.%I for insert to authenticated with check (
        auth.role() = ''service_role''
        or exists (
          select 1
          from public.workspace_members wm
          where wm.workspace_id = %I.workspace_id
            and wm.user_id = auth.uid()
            and coalesce(wm.status, ''active'') <> ''inactive''
        )
      )',
      tbl, tbl, tbl
    );

    -- UPDATE e DELETE seguem a mesma lógica de workspace
    execute format('drop policy if exists %I_update_workspace on public.%I', tbl, tbl);
    execute format(
      'create policy %I_update_workspace on public.%I for update to authenticated using (
        auth.role() = ''service_role''
        or exists (
          select 1
          from public.workspace_members wm
          where wm.workspace_id = %I.workspace_id
            and wm.user_id = auth.uid()
            and coalesce(wm.status, ''active'') <> ''inactive''
        )
      )',
      tbl, tbl, tbl
    );

    execute format('drop policy if exists %I_delete_workspace on public.%I', tbl, tbl);
    execute format(
      'create policy %I_delete_workspace on public.%I for delete to authenticated using (
        auth.role() = ''service_role''
        or exists (
          select 1
          from public.workspace_members wm
          where wm.workspace_id = %I.workspace_id
            and wm.user_id = auth.uid()
            and coalesce(wm.status, ''active'') <> ''inactive''
        )
      )',
      tbl, tbl, tbl
    );
  end loop;
end $$;

-- Inserir Blueprint Padrão (POC atual de 3 agentes)
with new_blueprint as (
  insert into public.agent_mission_blueprints (workspace_id, title, description, category, flow_config)
  values (
    '00000000-0000-0000-0000-000000000000', -- UUID de sistema ou workspace default
    'Time de Produto (Padrão)',
    'Blueprint oficial para descoberta, escopo de MVP e arquitetura técnica.',
    'product',
    '[
      {"stepIndex": 1, "roleKey": "discovery", "stepName": "Descoberta e Requisitos", "artifactType": "requirements_brief"},
      {"stepIndex": 2, "roleKey": "product", "stepName": "Escopo e MVP", "artifactType": "product_scope"},
      {"stepIndex": 3, "roleKey": "architecture", "stepName": "Arquitetura Técnica", "artifactType": "technical_architecture"}
    ]'::jsonb
  )
  returning id
)
insert into public.agent_mission_blueprint_roles (blueprint_id, role_key, role_name, suggested_agent_id)
select id, 'discovery', 'Analista de Descoberta', 'poc-discovery-template' from new_blueprint
union all
select id, 'product', 'Estrategista de Produto', 'poc-product-template' from new_blueprint
union all
select id, 'architecture', 'Arquiteto Técnico', 'poc-architecture-template' from new_blueprint;
