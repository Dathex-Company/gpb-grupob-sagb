-- ET 23 | Núcleo de Metodologias
-- Relações mínimas editáveis durante a estruturação (intenção estrutural, não canônica)

create table if not exists public.metodologias_relacoes_estruturacao (
  id uuid primary key default gen_random_uuid(),
  ativo_em_estruturacao_id uuid not null references public.metodologias_ativos_em_estruturacao(id) on delete cascade,
  ativo_relacionado_canonico_id uuid not null references public.metodologias_catalogo_canonico(id) on delete restrict,
  tipo_de_relacao text not null,
  direcao text not null default 'saida',
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metodologias_relacoes_estruturacao_tipo_check check (
    tipo_de_relacao in (
      'deriva_de',
      'complementa',
      'depende_de',
      'substitui',
      'especializa',
      'simplifica',
      'operacionaliza',
      'usa_como_base'
    )
  ),
  constraint metodologias_relacoes_estruturacao_direcao_check check (direcao in ('saida', 'entrada')),
  constraint metodologias_relacoes_estruturacao_unica unique (
    ativo_em_estruturacao_id,
    ativo_relacionado_canonico_id,
    tipo_de_relacao,
    direcao
  )
);

create index if not exists idx_metodologias_relacoes_estruturacao_ativo
  on public.metodologias_relacoes_estruturacao(ativo_em_estruturacao_id, created_at asc);

create index if not exists idx_metodologias_relacoes_estruturacao_relacionado
  on public.metodologias_relacoes_estruturacao(ativo_relacionado_canonico_id, created_at asc);

drop trigger if exists update_metodologias_relacoes_estruturacao_updated_at on public.metodologias_relacoes_estruturacao;
create trigger update_metodologias_relacoes_estruturacao_updated_at
before update on public.metodologias_relacoes_estruturacao
for each row execute function public.update_updated_at_column();

alter table public.metodologias_relacoes_estruturacao enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.metodologias_relacoes_estruturacao;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_relacoes_estruturacao;
create policy "Enable read access for authenticated users"
  on public.metodologias_relacoes_estruturacao for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_relacoes_estruturacao for all
  using (auth.role() = 'authenticated');
