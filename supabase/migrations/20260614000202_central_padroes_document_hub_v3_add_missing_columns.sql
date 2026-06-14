-- Central de Padrões — Hotfix: Adicionar TODAS colunas faltantes do V1 + V3
-- Data: 2026-06-14
-- As migrations V1 (20260613000101) estavam marcadas como aplicadas mas nunca rodaram.
-- Este hotfix aplica as colunas que realmente faltam em produção.

alter table public.central_padroes_documents
  add column if not exists slug text,
  add column if not exists type text,
  add column if not exists risk_level text,
  add column if not exists owner text,
  add column if not exists tags text[],
  add column if not exists summary text,
  add column if not exists content text,
  add column if not exists path_absolute text,
  add column if not exists path_relative text,
  add column if not exists source text,
  add column if not exists module text,
  add column if not exists division text,
  add column if not exists canonical_level text,
  add column if not exists created_by uuid references auth.users(id),
  add column if not exists updated_by uuid references auth.users(id);

-- Aplica novamente source_path se não existir (a migration original pode ter nome diferente)
alter table public.central_padroes_documents
  add column if not exists source_path text;

-- Atualiza RPC cp_document_hash com convert_to para encoding seguro
create or replace function public.cp_document_hash(content text)
returns text
language sql
security definer
set search_path = ''
as $$
  select encode(extensions.digest(convert_to(coalesce(content, ''), 'UTF8'), 'sha256'), 'hex');
$$;
