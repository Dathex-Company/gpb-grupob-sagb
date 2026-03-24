-- CID V1 - Camada de Inteligencia e Prompts Reutilizaveis

-- Tabela de Prompts da Biblioteca
create table if not exists public.cid_prompts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  title text not null,
  description text,
  system_prompt text not null,
  user_prompt_template text not null,
  prompt_type text not null default 'extract', -- extract, summarize, classify, structure, rewrite
  output_format text not null default 'markdown', -- plain_text, bullets, markdown, json
  execution_mode text not null default 'sync', -- sync, async
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid
);

-- Tabela de Execucoes/Runs
create table if not exists public.cid_prompt_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  prompt_id uuid references public.cid_prompts(id) on delete set null,
  execution_scope text not null, -- 'single', 'batch', 'consolidated'
  status text not null default 'queued', -- queued, processing, completed, error
  
  -- Versionamento e Snapshot
  prompt_snapshot jsonb not null,
  prompt_snapshot_version int default 1,
  
  -- Rastreabilidade de Truncamento
  source_total_chars int,
  source_processed_chars int,
  was_truncated boolean default false,
  warning_message text,
  
  -- Resultados Consolidados / Single
  result_text text,
  result_json jsonb,
  error_message text,
  
  -- Rastreabilidade Financeira e de Uso
  model_used text,
  tokens_in int,
  tokens_out int,
  estimated_cost_usd numeric(10,6),
  latency_ms int,
  
  -- Resiliencia
  retry_count int not null default 0,
  
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid
);

-- Itens da Execucao (Assets envolvidos)
create table if not exists public.cid_prompt_run_items (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.cid_prompt_runs(id) on delete cascade,
  asset_id uuid not null references public.cid_assets(id) on delete cascade,
  
  -- Ordem para Lotes/Consolidacoes
  sequence_order int not null default 0,
  
  status text not null default 'queued',
  
  -- Rastreabilidade de Truncamento Individual
  source_text_excerpt text,
  source_total_chars int,
  source_processed_chars int,
  was_truncated boolean default false,
  warning_message text,
  
  -- Resultados Individuais (Modo Batch)
  result_text text,
  result_json jsonb,
  error_message text,
  
  -- Rastreabilidade Financeira Individual
  tokens_in int,
  tokens_out int,
  latency_ms int,
  
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indices para Performance
create index if not exists idx_cid_prompts_workspace on public.cid_prompts(workspace_id);
create index if not exists idx_cid_prompt_runs_workspace on public.cid_prompt_runs(workspace_id);
create index if not exists idx_cid_prompt_runs_prompt on public.cid_prompt_runs(prompt_id);
create index if not exists idx_cid_prompt_runs_status on public.cid_prompt_runs(status);
create index if not exists idx_cid_prompt_run_items_run on public.cid_prompt_run_items(run_id);
create index if not exists idx_cid_prompt_run_items_asset on public.cid_prompt_run_items(asset_id);
create index if not exists idx_cid_prompt_run_items_status on public.cid_prompt_run_items(status);
create index if not exists idx_cid_prompt_run_items_order on public.cid_prompt_run_items(run_id, sequence_order);

-- Seguranca: Row Level Security (RLS)
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'cid_prompts',
    'cid_prompt_runs',
    'cid_prompt_run_items'
  ]
  loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', tbl);

    -- Tabela cid_prompt_run_items herda workspace_id do run_id via join, 
    -- mas para simplificar e garantir seguranca, vamos adicionar workspace_id nela tambem se ainda der tempo
    -- Como a migration já foi escrita acima sem workspace_id em items, ajustaremos as policies de acordo.

    if tbl = 'cid_prompt_run_items' then
       execute format('drop policy if exists %I_select_workspace on public.%I', tbl, tbl);
       execute format(
          'create policy %I_select_workspace on public.%I for select to authenticated using (
             auth.role() = ''service_role''
             or exists (
               select 1 from public.cid_prompt_runs pr
               join public.workspace_members wm on wm.workspace_id = pr.workspace_id
               where pr.id = %I.run_id
                 and wm.user_id = auth.uid()
                 and coalesce(wm.status, ''active'') <> ''inactive''
             )
          )',
          tbl, tbl, tbl
       );

       execute format('drop policy if exists %I_insert_workspace on public.%I', tbl, tbl);
       execute format(
          'create policy %I_insert_workspace on public.%I for insert to authenticated with check (
             auth.role() = ''service_role''
             or exists (
               select 1 from public.cid_prompt_runs pr
               join public.workspace_members wm on wm.workspace_id = pr.workspace_id
               where pr.id = run_id
                 and wm.user_id = auth.uid()
                 and coalesce(wm.status, ''active'') <> ''inactive''
             )
          )',
          tbl, tbl
       );

       execute format('drop policy if exists %I_update_workspace on public.%I', tbl, tbl);
       execute format(
          'create policy %I_update_workspace on public.%I for update to authenticated using (
             auth.role() = ''service_role''
             or exists (
               select 1 from public.cid_prompt_runs pr
               join public.workspace_members wm on wm.workspace_id = pr.workspace_id
               where pr.id = %I.run_id
                 and wm.user_id = auth.uid()
                 and coalesce(wm.status, ''active'') <> ''inactive''
             )
          )',
          tbl, tbl, tbl
       );
    else
        execute format('drop policy if exists %I_select_workspace on public.%I', tbl, tbl);
        execute format(
          'create policy %I_select_workspace on public.%I for select to authenticated using (
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
    end if;
  end loop;
end $$;

