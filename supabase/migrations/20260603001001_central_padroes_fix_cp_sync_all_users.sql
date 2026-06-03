-- Central de Padrões | Hotfix pós-V5
-- Corrige cp_sync_all_users(): PostgreSQL format() não aceita %d.

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

    if found then
      inserted := inserted + 1;
    else
      skipped := skipped + 1;
    end if;
  end loop;

  return 'Sincronizados: ' || inserted::text || ' inseridos, ' || skipped::text || ' já existentes';
end;
$$;
