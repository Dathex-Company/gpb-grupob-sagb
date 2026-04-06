-- ET 13 | Núcleo de Metodologias
-- Blocos internos editáveis do ativo em estruturação

create table if not exists public.metodologias_blocos_estruturacao (
  id uuid primary key default gen_random_uuid(),
  ativo_em_estruturacao_id uuid not null references public.metodologias_ativos_em_estruturacao(id) on delete cascade,
  tipo_de_bloco text not null,
  titulo text not null,
  conteudo text not null default '',
  ordem int not null default 1,
  status_do_bloco text not null default 'ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metodologias_blocos_estruturacao_tipo_check check (
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
  constraint metodologias_blocos_estruturacao_status_check check (
    status_do_bloco in ('rascunho', 'ativo', 'arquivado')
  ),
  constraint metodologias_blocos_estruturacao_ordem_check check (ordem > 0)
);

create index if not exists idx_metodologias_blocos_ativo_ordem
  on public.metodologias_blocos_estruturacao(ativo_em_estruturacao_id, ordem asc, created_at asc);

create index if not exists idx_metodologias_blocos_tipo
  on public.metodologias_blocos_estruturacao(tipo_de_bloco);

drop trigger if exists update_metodologias_blocos_estruturacao_updated_at on public.metodologias_blocos_estruturacao;
create trigger update_metodologias_blocos_estruturacao_updated_at
before update on public.metodologias_blocos_estruturacao
for each row execute function public.update_updated_at_column();

alter table public.metodologias_blocos_estruturacao enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.metodologias_blocos_estruturacao;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_blocos_estruturacao;
create policy "Enable read access for authenticated users"
  on public.metodologias_blocos_estruturacao for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_blocos_estruturacao for all
  using (auth.role() = 'authenticated');
