-- Central de Padrões — Document Hub V1 — schema rico de documentos
-- Data: 2026-06-13
-- Escopo: campos opcionais e índices. Não remove dados e evita constraints fortes nesta etapa.

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

create index if not exists idx_cp_documents_slug on public.central_padroes_documents(slug);
create index if not exists idx_cp_documents_type on public.central_padroes_documents(type);
create index if not exists idx_cp_documents_risk on public.central_padroes_documents(risk_level);
create index if not exists idx_cp_documents_owner on public.central_padroes_documents(owner);
create index if not exists idx_cp_documents_source on public.central_padroes_documents(source);
create index if not exists idx_cp_documents_canonical_level on public.central_padroes_documents(canonical_level);
create index if not exists idx_cp_documents_tags on public.central_padroes_documents using gin(tags);

comment on column public.central_padroes_documents.content is 'Conteúdo markdown curto. Arquivos grandes devem usar storage cp-documents.';
comment on column public.central_padroes_documents.source is 'Origem documental: supabase_live, md_indexado, manual, upload, external ou governance.';
comment on column public.central_padroes_documents.canonical_level is 'Nível de canonicidade documental: nao_canonico, candidato, operacional, oficial, legado, previsto.';

