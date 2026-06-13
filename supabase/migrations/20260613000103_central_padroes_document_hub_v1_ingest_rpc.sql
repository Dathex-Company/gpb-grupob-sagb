-- Central de Padrões — Document Hub V1 — RPC de ingestão expandida
-- Data: 2026-06-13

create or replace function public.central_padroes_ingest_document(
  p_title text,
  p_source_path text default null,
  p_raw_content text default null,
  p_source_kind text default 'manual',
  p_storage_bucket text default null,
  p_storage_path text default null,
  p_owner text default null,
  p_tags text[] default '{}',
  p_risk_level text default 'baixo',
  p_module text default null,
  p_division text default null,
  p_create_document boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_queue_id uuid;
  v_document_id uuid;
  v_warnings text[] := '{}';
  v_source text := coalesce(nullif(p_source_kind, ''), 'manual');
begin
  if p_title is null or length(trim(p_title)) = 0 then
    raise exception 'p_title é obrigatório';
  end if;

  insert into public.central_padroes_ingestion_queue (
    title,
    source_path,
    raw_content,
    source_kind,
    suggested_destination,
    confidence,
    status,
    created_at,
    updated_at
  ) values (
    p_title,
    coalesce(p_storage_path, p_source_path),
    p_raw_content,
    v_source,
    'apoio',
    70,
    case when p_create_document then 'accepted' else 'queued' end,
    now(),
    now()
  ) returning id into v_queue_id;

  if p_create_document then
    insert into public.central_padroes_documents (
      title,
      source_path,
      status,
      category,
      destination_type,
      slug,
      type,
      risk_level,
      owner,
      tags,
      summary,
      content,
      path_relative,
      source,
      module,
      division,
      canonical_level,
      created_by,
      updated_by,
      created_at,
      updated_at
    ) values (
      p_title,
      coalesce(p_storage_path, p_source_path),
      'bruto',
      'Documentos',
      'apoio',
      lower(regexp_replace(trim(p_title), '[^a-zA-Z0-9]+', '-', 'g')),
      'apoio',
      p_risk_level,
      p_owner,
      p_tags,
      left(coalesce(p_raw_content, ''), 500),
      p_raw_content,
      coalesce(p_storage_path, p_source_path),
      v_source,
      p_module,
      p_division,
      'nao_canonico',
      auth.uid(),
      auth.uid(),
      now(),
      now()
    ) returning id into v_document_id;
  end if;

  if p_storage_bucket is not null and p_storage_bucket not in ('cp-documents', 'cp-evidence') then
    v_warnings := array_append(v_warnings, 'Bucket informado não é oficial do Document Hub V1.');
  end if;

  return jsonb_build_object(
    'queue_id', v_queue_id,
    'document_id', v_document_id,
    'status', case when p_create_document then 'created' else 'queued' end,
    'warnings', v_warnings,
    'source', v_source
  );
end;
$$;

grant execute on function public.central_padroes_ingest_document(text, text, text, text, text, text, text, text[], text, text, text, boolean) to authenticated;
