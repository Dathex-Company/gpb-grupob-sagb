-- Rollback opcional da ET-02. Executar manualmente apenas se necessário.
drop function if exists public.central_padroes_sync_governance();
drop function if exists public.central_padroes_ingest_document(text, text, text, text);
drop table if exists public.central_padroes_standard_tags;
drop table if exists public.central_padroes_tags;
drop table if exists public.central_padroes_standard_history;
drop table if exists public.central_padroes_triagem;
drop table if exists public.central_padroes_ingestion_queue;
alter table if exists public.central_padroes_standards
  drop column if exists content_rich,
  drop column if exists approval_status,
  drop column if exists approval_requested_at,
  drop column if exists approval_decided_at,
  drop column if exists canonical,
  drop column if exists canonical_version;

