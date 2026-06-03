-- Central de Padrões | Hotfix: cp_rate_limit() — parâmetro action_name
-- O parâmetro action_name conflitava com a coluna action_name na tabela
-- central_padroes_rate_limits, causando erro 42702 (ambiguous column reference)
-- Correção: usar bloco nomeado <<func>> para prefixar parâmetro com func.action_name

drop function if exists public.cp_rate_limit(text, int, int);

create or replace function public.cp_rate_limit(
  action_name text,
  max_hits int default 60,
  window_seconds int default 60
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
<<func>>
declare
  current_user_id uuid := auth.uid();
  bucket timestamptz;
  current_hits int;
begin
  if current_user_id is null then
    return false;
  end if;

  bucket := to_timestamp(floor(extract(epoch from now()) / window_seconds) * window_seconds);

  insert into public.central_padroes_rate_limits(user_id, action_name, bucket_start, hit_count)
  values (current_user_id, func.action_name, bucket, 1)
  on conflict (user_id, action_name, bucket_start)
  do update set hit_count = public.central_padroes_rate_limits.hit_count + 1,
                updated_at = now()
  returning hit_count into current_hits;

  return current_hits <= max_hits;
end;
$$;
