-- ET 14 | Núcleo de Metodologias
-- Base de promoção assistida: ativo em estruturação -> ativo canônico

create table if not exists public.metodologias_catalogo_canonico (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  nome text not null,
  resumo text not null,
  definicao text not null,
  objetivo text not null,
  tipo_de_ativo text not null,
  status_editorial text not null default 'em_revisao',
  maturidade_pratica text not null,
  governanca_estado text not null,
  versao_atual text not null default '1.0.0',
  origem_entrada_bruta_id uuid not null references public.metodologias_entradas_brutas(id) on delete restrict,
  origem_ativo_em_estruturacao_id uuid not null references public.metodologias_ativos_em_estruturacao(id) on delete restrict,
  promovido_em timestamptz not null default now(),
  promovido_por text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metodologias_catalogo_canonico_slug_unique unique (slug),
  constraint metodologias_catalogo_canonico_tipo_check check (
    tipo_de_ativo in ('metodologia', 'processo', 'protocolo', 'checklist', 'principio', 'aplicacao', 'ativo_derivado')
  ),
  constraint metodologias_catalogo_canonico_status_editorial_check check (
    status_editorial in ('rascunho', 'em_estruturacao', 'em_revisao', 'aprovada', 'oficial', 'arquivada')
  ),
  constraint metodologias_catalogo_canonico_maturidade_check check (
    maturidade_pratica in ('conceitual', 'modelada', 'testada', 'validada', 'escalavel')
  ),
  constraint metodologias_catalogo_canonico_governanca_check check (
    governanca_estado in ('em_desenvolvimento', 'em_revisao', 'oficial', 'arquivado', 'obsoleto')
  )
);

create index if not exists idx_metodologias_catalogo_canonico_created_at
  on public.metodologias_catalogo_canonico(created_at desc);

create index if not exists idx_metodologias_catalogo_canonico_origem_entrada
  on public.metodologias_catalogo_canonico(origem_entrada_bruta_id);

create index if not exists idx_metodologias_catalogo_canonico_origem_estruturacao
  on public.metodologias_catalogo_canonico(origem_ativo_em_estruturacao_id);

drop trigger if exists update_metodologias_catalogo_canonico_updated_at on public.metodologias_catalogo_canonico;
create trigger update_metodologias_catalogo_canonico_updated_at
before update on public.metodologias_catalogo_canonico
for each row execute function public.update_updated_at_column();

alter table public.metodologias_catalogo_canonico enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.metodologias_catalogo_canonico;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_catalogo_canonico;
create policy "Enable read access for authenticated users"
  on public.metodologias_catalogo_canonico for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_catalogo_canonico for all
  using (auth.role() = 'authenticated');
