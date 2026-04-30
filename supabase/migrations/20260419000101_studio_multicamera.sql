-- Studio multicamera v2 (compatível com legado em payload)

create table if not exists public.studio_session_cameras (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.studio_sessions(id) on delete cascade,
  workspace_id uuid not null,
  camera_id text not null,
  device_id text,
  label text not null,
  order_index int not null default 0,
  width int,
  height int,
  fps int,
  status text not null default 'ready',
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint studio_session_cameras_unique unique (session_id, camera_id)
);

create table if not exists public.studio_camera_files (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.studio_sessions(id) on delete cascade,
  workspace_id uuid not null,
  camera_id text not null,
  device_id text,
  storage_path text not null,
  mime_type text not null,
  duration_seconds numeric(12,3) not null default 0,
  status text not null default 'uploaded',
  error_message text,
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_audio_tracks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.studio_sessions(id) on delete cascade,
  workspace_id uuid not null,
  track_role text not null default 'master',
  storage_path text not null,
  mime_type text not null,
  duration_seconds numeric(12,3) not null default 0,
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_studio_session_cameras_workspace on public.studio_session_cameras(workspace_id);
create index if not exists idx_studio_session_cameras_session on public.studio_session_cameras(session_id, order_index);
create index if not exists idx_studio_camera_files_workspace on public.studio_camera_files(workspace_id);
create index if not exists idx_studio_camera_files_session on public.studio_camera_files(session_id);
create index if not exists idx_studio_audio_tracks_workspace on public.studio_audio_tracks(workspace_id);
create index if not exists idx_studio_audio_tracks_session on public.studio_audio_tracks(session_id);

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'studio_session_cameras',
    'studio_camera_files',
    'studio_audio_tracks'
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

