-- Hotfix: Drop and recreate cp_import_document com p_category default
drop function if exists public.cp_import_document;

create or replace function public.cp_import_document(
  p_title text,
  p_content text,
  p_source_path text default null,
  p_category text default 'Documentos',
  p_slug text default null,
  p_content_format text default 'markdown',
  p_source_kind text default 'local_md',
  p_domain text default null,
  p_owner text default null,
  p_tags text[] default null,
  p_summary text default null,
  p_official_status text default 'rascunho',
  p_metadata jsonb default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hash text; v_existing_id uuid; v_doc_id uuid; v_action text;
begin
  v_hash := public.cp_document_hash(p_content);
  if p_source_path is not null then
    select id into v_existing_id from public.central_padroes_documents
    where source_path = p_source_path limit 1;
  end if;
  if v_existing_id is not null then
    if exists (select 1 from public.central_padroes_documents where id = v_existing_id and source_hash = v_hash) then
      v_action := 'skipped'; v_doc_id := v_existing_id;
    else
      update public.central_padroes_documents
      set content = p_content, source_hash = v_hash,
          source_kind = coalesce(source_kind, p_source_kind),
          content_format = coalesce(content_format, p_content_format),
          domain = coalesce(domain, p_domain),
          category = coalesce(category, p_category),
          owner = coalesce(owner, p_owner), tags = coalesce(tags, p_tags),
          summary = coalesce(summary, p_summary),
          official_status = coalesce(official_status, p_official_status),
          updated_at = now(), updated_by = auth.uid()
      where id = v_existing_id;
      v_action := 'updated'; v_doc_id := v_existing_id;
    end if;
  else
    insert into public.central_padroes_documents (
      title, slug, content, content_format, source_kind, source_path, source_hash,
      category, domain, owner, tags, summary, official_status, metadata,
      created_by, updated_by
    ) values (
      p_title, coalesce(p_slug, lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '-+$', ''))),
      p_content, p_content_format, p_source_kind, p_source_path, v_hash,
      p_category, p_domain, p_owner, p_tags, p_summary, p_official_status, p_metadata,
      auth.uid(), auth.uid()
    ) returning id into v_doc_id;
    v_action := 'created';
  end if;
  return jsonb_build_object('action', v_action, 'document_id', v_doc_id, 'hash', v_hash);
end;
$$;
