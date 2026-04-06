-- ET 21 | Núcleo de Metodologias
-- Relações canônicas entre ativos para leitura visual e mapa de conexões

create table if not exists public.metodologias_relacoes_canonicas (
  id uuid primary key default gen_random_uuid(),
  ativo_canonico_id uuid not null references public.metodologias_catalogo_canonico(id) on delete cascade,
  tipo_de_relacao text not null,
  ativo_origem_id uuid not null references public.metodologias_catalogo_canonico(id) on delete cascade,
  ativo_destino_id uuid not null references public.metodologias_catalogo_canonico(id) on delete cascade,
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metodologias_relacoes_canonicas_tipo_check check (
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
  constraint metodologias_relacoes_canonicas_self_check check (ativo_origem_id <> ativo_destino_id)
);

create index if not exists idx_metodologias_relacoes_canonicas_origem
  on public.metodologias_relacoes_canonicas(ativo_origem_id, created_at asc);

create index if not exists idx_metodologias_relacoes_canonicas_destino
  on public.metodologias_relacoes_canonicas(ativo_destino_id, created_at asc);

create index if not exists idx_metodologias_relacoes_canonicas_ativo
  on public.metodologias_relacoes_canonicas(ativo_canonico_id, created_at asc);

drop trigger if exists update_metodologias_relacoes_canonicas_updated_at on public.metodologias_relacoes_canonicas;
create trigger update_metodologias_relacoes_canonicas_updated_at
before update on public.metodologias_relacoes_canonicas
for each row execute function public.update_updated_at_column();

alter table public.metodologias_relacoes_canonicas enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.metodologias_relacoes_canonicas;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_relacoes_canonicas;
create policy "Enable read access for authenticated users"
  on public.metodologias_relacoes_canonicas for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_relacoes_canonicas for all
  using (auth.role() = 'authenticated');
