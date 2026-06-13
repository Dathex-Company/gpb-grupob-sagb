-- Central de Padrões — Document Hub V1 — RLS documental action-based
-- Data: 2026-06-13
-- Observação: policies usam perfis em app_metadata.profile_role quando disponível.

alter table public.central_padroes_documents enable row level security;

drop policy if exists cp_documents_select on public.central_padroes_documents;
drop policy if exists cp_documents_insert on public.central_padroes_documents;
drop policy if exists cp_documents_update_metadata on public.central_padroes_documents;
drop policy if exists cp_documents_update_content on public.central_padroes_documents;
drop policy if exists cp_documents_archive on public.central_padroes_documents;
drop policy if exists cp_documents_restore on public.central_padroes_documents;
drop policy if exists cp_documents_publish on public.central_padroes_documents;

create policy cp_documents_select
on public.central_padroes_documents
for select
to authenticated
using (deleted_at is null or (auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('curador', 'aprovador', 'administrador', 'auditor'));

create policy cp_documents_insert
on public.central_padroes_documents
for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('editor', 'curador', 'aprovador', 'administrador'));

create policy cp_documents_update_metadata
on public.central_padroes_documents
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('curador', 'aprovador', 'administrador'))
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('curador', 'aprovador', 'administrador'));

create policy cp_documents_update_content
on public.central_padroes_documents
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('curador', 'aprovador', 'administrador'))
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('curador', 'aprovador', 'administrador'));

-- Archive/restore/publish são diferenciados semanticamente no service/RPC.
-- PostgreSQL não separa UPDATE por coluna em policy sem WITH CHECK granular complexo nesta etapa.
create policy cp_documents_archive
on public.central_padroes_documents
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('curador', 'aprovador', 'administrador'))
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('curador', 'aprovador', 'administrador'));

create policy cp_documents_restore
on public.central_padroes_documents
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'profile_role') = 'administrador')
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') = 'administrador');

create policy cp_documents_publish
on public.central_padroes_documents
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('aprovador', 'administrador'))
with check ((auth.jwt() -> 'app_metadata' ->> 'profile_role') in ('aprovador', 'administrador'));

