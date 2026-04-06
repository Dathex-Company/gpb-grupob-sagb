-- ET 15 | Núcleo de Metodologias
-- Promoção dos blocos internos da estruturação para blocos canônicos do ativo

create table if not exists public.metodologias_blocos_canonicos (
  id uuid primary key default gen_random_uuid(),
  ativo_canonico_id uuid not null references public.metodologias_catalogo_canonico(id) on delete cascade,
  bloco_origem_estruturacao_id uuid not null references public.metodologias_blocos_estruturacao(id) on delete restrict,
  tipo_de_bloco text not null,
  titulo text not null,
  conteudo text not null default '',
  ordem int not null default 1,
  status_do_bloco text not null default 'ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metodologias_blocos_canonicos_tipo_check check (
    tipo_de_bloco in (
      'essencia',
      'principio',
      'etapa',
      'regra',
      'aplicacao',
      'checklist',
      'observacao_estrutural'
    )
  ),
  constraint metodologias_blocos_canonicos_status_check check (
    status_do_bloco in ('rascunho', 'ativo', 'arquivado')
  ),
  constraint metodologias_blocos_canonicos_ordem_check check (ordem > 0),
  constraint metodologias_blocos_canonicos_origem_unica unique (ativo_canonico_id, bloco_origem_estruturacao_id)
);

create index if not exists idx_metodologias_blocos_canonicos_ativo_ordem
  on public.metodologias_blocos_canonicos(ativo_canonico_id, ordem asc, created_at asc);

create index if not exists idx_metodologias_blocos_canonicos_origem_estruturacao
  on public.metodologias_blocos_canonicos(bloco_origem_estruturacao_id);

drop trigger if exists update_metodologias_blocos_canonicos_updated_at on public.metodologias_blocos_canonicos;
create trigger update_metodologias_blocos_canonicos_updated_at
before update on public.metodologias_blocos_canonicos
for each row execute function public.update_updated_at_column();

alter table public.metodologias_blocos_canonicos enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.metodologias_blocos_canonicos;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_blocos_canonicos;
create policy "Enable read access for authenticated users"
  on public.metodologias_blocos_canonicos for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_blocos_canonicos for all
  using (auth.role() = 'authenticated');
