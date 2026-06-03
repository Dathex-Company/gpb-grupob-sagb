-- Central de Padrões V4 | Fase 2 — Ativação prática
-- Depende: V3 (20260602220001) aplicada primeiro

-- ============================================================
-- 1. Trigger: criar perfil automaticamente no signup
-- ============================================================
create or replace function public.handle_cp_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.central_padroes_user_profiles (user_id, email, display_name, profile_role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'leitor'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_cp on auth.users;
create trigger on_auth_user_created_cp
  after insert on auth.users
  for each row execute function public.handle_cp_new_user();

-- ============================================================
-- 2. Função: sincronizar todos os usuários existentes
-- ============================================================
create or replace function public.cp_sync_all_users()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted int := 0;
  skipped int := 0;
  r record;
begin
  for r in select id, email, raw_user_meta_data from auth.users loop
    insert into public.central_padroes_user_profiles (user_id, email, display_name, profile_role)
    values (
      r.id,
      coalesce(r.email, ''),
      coalesce(r.raw_user_meta_data ->> 'display_name', split_part(coalesce(r.email, ''), '@', 1)),
      'leitor'
    )
    on conflict (user_id) do nothing;
    if found then inserted := inserted + 1; else skipped := skipped + 1; end if;
  end loop;
  return format('Sincronizados: %d inseridos, %d já existentes', inserted, skipped);
end;
$$;

-- ============================================================
-- 3. Função RPC: alterar perfil de usuário (admin only)
-- ============================================================
create or replace function public.cp_set_user_role(
  target_email text,
  new_role text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_role text;
  target_id uuid;
begin
  -- Verificar se quem chamou é admin
  select profile_role into caller_role
  from public.central_padroes_user_profiles
  where user_id = auth.uid();

  if caller_role != 'administrador' then
    return jsonb_build_object('error', 'Apenas administradores podem alterar perfis');
  end if;

  -- Validar role
  if new_role not in ('leitor','editor','curador','aprovador','administrador','agente_autorizado','auditor') then
    return jsonb_build_object('error', format('Role inválida: %s', new_role));
  end if;

  -- Buscar usuário por email
  select id into target_id from auth.users where email = target_email;
  if target_id is null then
    return jsonb_build_object('error', format('Usuário %s não encontrado', target_email));
  end if;

  -- Atualizar
  update public.central_padroes_user_profiles
  set profile_role = new_role, updated_at = now()
  where user_id = target_id;

  return jsonb_build_object('success', true, 'user_id', target_id, 'new_role', new_role);
end;
$$;

-- ============================================================
-- 4. Função: verificar permissão do usuário atual (para uso no app)
-- ============================================================
create or replace function public.cp_check_permission(action_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  user_role text;
begin
  select profile_role into user_role
  from public.central_padroes_user_profiles
  where user_id = auth.uid();

  return case
    -- leitor
    when user_role = 'leitor' and action_name = 'visualizar' then true
    -- editor
    when user_role = 'editor' and action_name in ('visualizar','criar_rascunho','editar_rascunho_proprio') then true
    -- curador
    when user_role = 'curador' and action_name in ('visualizar','criar_rascunho','editar_rascunho_proprio','editar_padrao_oficial') then true
    -- aprovador
    when user_role = 'aprovador' and action_name in ('visualizar','criar_rascunho','editar_rascunho_proprio','editar_padrao_oficial','aprovar_padrao','publicar_padrao','ver_logs') then true
    -- administrador
    when user_role = 'administrador' then true
    -- agente_autorizado
    when user_role = 'agente_autorizado' and action_name in ('visualizar','executar_agente') then true
    -- auditor
    when user_role = 'auditor' and action_name in ('visualizar','ver_logs') then true
    else false
  end;
end;
$$;

-- ============================================================
-- 5. Índices adicionais para performance
-- ============================================================
create index if not exists idx_cp_standards_area_status
  on public.central_padroes_standards(area_id, status);

create index if not exists idx_cp_standards_owner
  on public.central_padroes_standards(owner_name);

create index if not exists idx_cp_standards_canonical
  on public.central_padroes_standards(canonical_level);

create index if not exists idx_cp_documents_area
  on public.central_padroes_documents(area_id);

create index if not exists idx_cp_decisions_area
  on public.central_padroes_decisions(area_id);

-- Índice de texto para busca
create index if not exists idx_cp_standards_search
  on public.central_padroes_standards using gin(
    to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(standard_key,''))
  );

create index if not exists idx_cp_documents_search
  on public.central_padroes_documents using gin(
    to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(category,''))
  );
