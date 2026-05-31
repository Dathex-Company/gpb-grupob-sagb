-- Central de Padrões ET-06 | Busca Semântica
-- Pode falhar em ambientes sem pgvector; aplicação possui fallback textual.

create extension if not exists vector;

create table if not exists public.central_padroes_embeddings (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  content_text text not null,
  embedding vector(1536),
  model text not null default 'text-embedding-3-small',
  created_at timestamptz not null default now()
);

create index if not exists idx_cp_embeddings_entity on public.central_padroes_embeddings(entity_type, entity_id);
create index if not exists idx_cp_embeddings_text on public.central_padroes_embeddings using gin (to_tsvector('portuguese', content_text));

alter table public.central_padroes_embeddings enable row level security;

drop policy if exists "cp_authenticated_read_central_padroes_embeddings" on public.central_padroes_embeddings;
create policy "cp_authenticated_read_central_padroes_embeddings" on public.central_padroes_embeddings for select using (auth.role() = 'authenticated');

drop policy if exists "cp_authenticated_write_central_padroes_embeddings" on public.central_padroes_embeddings;
create policy "cp_authenticated_write_central_padroes_embeddings" on public.central_padroes_embeddings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

