-- Studio scaffold

do $$
begin
  if not exists (select 1 from pg_type where typname = 'studio_session_status') then
    create type public.studio_session_status as enum (
      'recording',
      'processing',
      'completed',
      'error'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'studio_chunk_status') then
    create type public.studio_chunk_status as enum (
      'pending',
      'transcribing',
      'completed',
      'error'
    );
  end if;
end $$;

create table if not exists public.studio_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  title text not null,
  capture_mode text not null default 'audio_video',
  source text not null default 'live', -- 'live' ou 'upload'
  chunk_interval_min int not null default 5,
  status public.studio_session_status not null default 'recording',
  raw_video_path text,
  total_duration_seconds numeric(12,3) not null default 0,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload jsonb
);

create table if not exists public.studio_chunks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.studio_sessions(id) on delete cascade,
  workspace_id uuid not null,
  chunk_index int not null,
  status public.studio_chunk_status not null default 'pending',
  audio_path text,
  duration_seconds numeric(12,3) not null default 0,
  transcription_text text,
  cid_asset_id uuid,
  started_at timestamptz,
  ended_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload jsonb,
  constraint studio_chunks_unique unique (session_id, chunk_index)
);

create index if not exists idx_studio_sessions_workspace on public.studio_sessions(workspace_id);
create index if not exists idx_studio_sessions_created on public.studio_sessions(created_at desc);

create index if not exists idx_studio_chunks_workspace on public.studio_chunks(workspace_id);
create index if not exists idx_studio_chunks_session on public.studio_chunks(session_id, chunk_index);
create index if not exists idx_studio_chunks_created on public.studio_chunks(created_at desc);

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'studio_sessions',
    'studio_chunks'
  ]
  loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', tbl);

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

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'buckets') then
    insert into storage.buckets (id, name, public, file_size_limit)
    values ('studio', 'studio', false, 1073741824) -- 1GB limit for videos
    on conflict (id) do nothing;
  end if;
end $$;

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'objects') then
    execute 'drop policy if exists studio_storage_select on storage.objects';
    execute 'drop policy if exists studio_storage_insert on storage.objects';
    execute 'drop policy if exists studio_storage_update on storage.objects';
    execute 'drop policy if exists studio_storage_delete on storage.objects';

    execute $policy$
      create policy studio_storage_select on storage.objects
      for select to authenticated
      using (
        bucket_id = 'studio'
        and (
          auth.role() = 'service_role'
          or exists (
            select 1
            from public.workspace_members wm
            where wm.workspace_id::text = split_part(name, '/', 1)
              and wm.user_id = auth.uid()
              and coalesce(wm.status, 'active') <> 'inactive'
          )
        )
      )
    $policy$;

    execute $policy$
      create policy studio_storage_insert on storage.objects
      for insert to authenticated
      with check (
        bucket_id = 'studio'
        and (
          auth.role() = 'service_role'
          or exists (
            select 1
            from public.workspace_members wm
            where wm.workspace_id::text = split_part(name, '/', 1)
              and wm.user_id = auth.uid()
              and coalesce(wm.status, 'active') <> 'inactive'
          )
        )
      )
    $policy$;

    execute $policy$
      create policy studio_storage_update on storage.objects
      for update to authenticated
      using (
        bucket_id = 'studio'
        and (
          auth.role() = 'service_role'
          or exists (
            select 1
            from public.workspace_members wm
            where wm.workspace_id::text = split_part(name, '/', 1)
              and wm.user_id = auth.uid()
              and coalesce(wm.status, 'active') <> 'inactive'
          )
        )
      )
    $policy$;

    execute $policy$
      create policy studio_storage_delete on storage.objects
      for delete to authenticated
      using (
        bucket_id = 'studio'
        and (
          auth.role() = 'service_role'
          or exists (
            select 1
            from public.workspace_members wm
            where wm.workspace_id::text = split_part(name, '/', 1)
              and wm.user_id = auth.uid()
              and coalesce(wm.status, 'active') <> 'inactive'
          )
        )
      )
    $policy$;
  end if;
end $$;