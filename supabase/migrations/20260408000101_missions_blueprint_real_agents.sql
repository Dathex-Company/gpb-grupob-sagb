-- ET-01 | Missões com agentes reais por blueprint (marketing 3forB)

-- 1) Participantes reais da missão
create table if not exists public.agent_mission_participants (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  mission_id uuid not null references public.agent_missions(id) on delete cascade,
  blueprint_role_key text not null,
  blueprint_role_name text not null,
  agent_id text not null,
  agent_name text not null,
  agent_role text,
  linked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  payload jsonb not null default '{}'
);

create index if not exists idx_agent_mission_participants_workspace on public.agent_mission_participants(workspace_id, linked_at desc);
create index if not exists idx_agent_mission_participants_mission on public.agent_mission_participants(mission_id, linked_at asc);

-- 2) Ajuste dos tipos de evento (compatível com implementação)
do $$
begin
  if exists (select 1 from pg_type where typname = 'agent_mission_event_type') then
    alter type public.agent_mission_event_type add value if not exists 'mission_created';
    alter type public.agent_mission_event_type add value if not exists 'agent_linked';
    alter type public.agent_mission_event_type add value if not exists 'handoff_performed';
    alter type public.agent_mission_event_type add value if not exists 'mission_completed';
    alter type public.agent_mission_event_type add value if not exists 'mission_blocked';
  end if;
exception
  when duplicate_object then null;
end $$;

-- 3) RLS + grants para participants
alter table public.agent_mission_participants enable row level security;
grant select, insert, update, delete on table public.agent_mission_participants to authenticated;

drop policy if exists agent_mission_participants_select_workspace on public.agent_mission_participants;
create policy agent_mission_participants_select_workspace on public.agent_mission_participants
for select to authenticated
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = agent_mission_participants.workspace_id
      and wm.user_id = auth.uid()
      and coalesce(wm.status, 'active') <> 'inactive'
  )
);

drop policy if exists agent_mission_participants_insert_workspace on public.agent_mission_participants;
create policy agent_mission_participants_insert_workspace on public.agent_mission_participants
for insert to authenticated
with check (
  auth.role() = 'service_role'
  or exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = agent_mission_participants.workspace_id
      and wm.user_id = auth.uid()
      and coalesce(wm.status, 'active') <> 'inactive'
  )
);

drop policy if exists agent_mission_participants_update_workspace on public.agent_mission_participants;
create policy agent_mission_participants_update_workspace on public.agent_mission_participants
for update to authenticated
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = agent_mission_participants.workspace_id
      and wm.user_id = auth.uid()
      and coalesce(wm.status, 'active') <> 'inactive'
  )
)
with check (
  auth.role() = 'service_role'
  or exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = agent_mission_participants.workspace_id
      and wm.user_id = auth.uid()
      and coalesce(wm.status, 'active') <> 'inactive'
  )
);

drop policy if exists agent_mission_participants_delete_workspace on public.agent_mission_participants;
create policy agent_mission_participants_delete_workspace on public.agent_mission_participants
for delete to authenticated
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = agent_mission_participants.workspace_id
      and wm.user_id = auth.uid()
      and coalesce(wm.status, 'active') <> 'inactive'
  )
);

-- 4) Blueprint oficial de teste: Marketing 3forB (6 papéis, agentes reais)
with upsert_blueprint as (
  insert into public.agent_mission_blueprints (
    workspace_id,
    title,
    description,
    category,
    flow_config,
    is_active
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    'Marketing 3forB | Sprint de Campanha Integrada',
    'Blueprint inicial para validação real do módulo Missões com time de marketing 3forB usando agentes oficiais já cadastrados.',
    'marketing',
    '[
      {"stepIndex":1,"roleKey":"marketing_strategist","stepName":"Direcionamento Estratégico da Campanha","artifactType":"campaign_strategy","requiredFields":["campaign_goal","target_persona","offer_positioning","primary_channels","success_metrics"],"dependsOnStepIndexes":[],"checkpointRequired":false,"selectionRules":{"domain":"marketing","focus":"strategy"}},
      {"stepIndex":2,"roleKey":"content_planner","stepName":"Plano de Conteúdo e Narrativa","artifactType":"content_plan","requiredFields":["message_pillars","content_tracks","editorial_calendar","cta_map"],"dependsOnStepIndexes":[1],"checkpointRequired":false,"selectionRules":{"domain":"marketing","focus":"content"}},
      {"stepIndex":3,"roleKey":"media_analyst","stepName":"Plano de Mídia e Distribuição","artifactType":"media_plan","requiredFields":["channel_mix","budget_split","flight_plan","forecast"],"dependsOnStepIndexes":[1,2],"checkpointRequired":false,"selectionRules":{"domain":"marketing","focus":"media"}},
      {"stepIndex":4,"roleKey":"copywriter","stepName":"Peças de Copy da Campanha","artifactType":"campaign_copy_pack","requiredFields":["headline_options","primary_copy","cta_variants","objection_handlers"],"dependsOnStepIndexes":[2,3],"checkpointRequired":false,"selectionRules":{"domain":"marketing","focus":"copy"}},
      {"stepIndex":5,"roleKey":"crm_specialist","stepName":"Fluxo CRM e Nutrição","artifactType":"crm_flow","requiredFields":["segmentation_rules","automation_sequence","trigger_logic","conversion_events"],"dependsOnStepIndexes":[3,4],"checkpointRequired":false,"selectionRules":{"domain":"marketing","focus":"crm"}},
      {"stepIndex":6,"roleKey":"performance_lead","stepName":"Validação de Performance e Go/No-Go","artifactType":"performance_validation","requiredFields":["kpi_dashboard","risk_watchlist","launch_checklist","go_no_go_decision"],"dependsOnStepIndexes":[1,2,3,4,5],"checkpointRequired":true,"selectionRules":{"domain":"marketing","focus":"performance"}}
    ]'::jsonb,
    true
  )
  on conflict do nothing
  returning id
),
resolved_blueprint as (
  select id from upsert_blueprint
  union all
  select b.id
  from public.agent_mission_blueprints b
  where b.workspace_id = '00000000-0000-0000-0000-000000000000'
    and b.title = 'Marketing 3forB | Sprint de Campanha Integrada'
  limit 1
)
insert into public.agent_mission_blueprint_roles (
  blueprint_id,
  role_key,
  role_name,
  required_skills,
  suggested_agent_id,
  metadata
)
select
  rb.id,
  role_item.role_key,
  role_item.role_name,
  role_item.required_skills,
  null,
  jsonb_build_object('resolverMode','official_agent_only','team','marketing_3forb','requiredCount',6)
from resolved_blueprint rb
cross join (
  values
    ('marketing_strategist','Estrategista de Marketing', array['marketing','estratégia','campanha']::text[]),
    ('content_planner','Planejador de Conteúdo', array['conteúdo','narrativa','editorial']::text[]),
    ('media_analyst','Analista de Mídia', array['mídia','tráfego','canal']::text[]),
    ('copywriter','Copywriter', array['copy','persuasão','mensagem']::text[]),
    ('crm_specialist','Especialista de CRM', array['crm','automação','nutrição']::text[]),
    ('performance_lead','Líder de Performance', array['performance','kpi','otimização']::text[])
) as role_item(role_key, role_name, required_skills)
on conflict (blueprint_id, role_key) do update
set
  role_name = excluded.role_name,
  required_skills = excluded.required_skills,
  metadata = excluded.metadata;
