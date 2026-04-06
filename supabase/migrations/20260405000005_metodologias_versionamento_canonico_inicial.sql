-- ET 17 | Núcleo de Metodologias
-- Base de versionamento inicial da manutenção canônica

create table if not exists public.metodologias_versoes_canonicas (
  id uuid primary key default gen_random_uuid(),
  ativo_canonico_id uuid not null references public.metodologias_catalogo_canonico(id) on delete cascade,
  numero_versao text not null,
  titulo text,
  resumo_da_versao text not null,
  status_da_versao text not null default 'rascunho',
  publicada_em timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint metodologias_versoes_canonicas_status_check check (
    status_da_versao in ('vigente', 'superada', 'rascunho')
  ),
  constraint metodologias_versoes_canonicas_numero_unico unique (ativo_canonico_id, numero_versao)
);

create index if not exists idx_metodologias_versoes_canonicas_ativo_publicada
  on public.metodologias_versoes_canonicas(ativo_canonico_id, publicada_em desc, created_at desc);

alter table public.metodologias_versoes_canonicas enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.metodologias_versoes_canonicas;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_versoes_canonicas;
create policy "Enable read access for authenticated users"
  on public.metodologias_versoes_canonicas for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_versoes_canonicas for all
  using (auth.role() = 'authenticated');

create table if not exists public.metodologias_eventos_manutencao_canonica (
  id uuid primary key default gen_random_uuid(),
  ativo_canonico_id uuid not null references public.metodologias_catalogo_canonico(id) on delete cascade,
  bloco_canonico_id uuid references public.metodologias_blocos_canonicos(id) on delete set null,
  tipo_de_evento text not null,
  descricao text not null,
  ocorrido_em timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint metodologias_eventos_manutencao_canonica_tipo_check check (
    tipo_de_evento in (
      'ativo_canonico_atualizado',
      'bloco_canonico_atualizado',
      'bloco_canonico_criado',
      'bloco_canonico_removido',
      'versao_canonica_criada'
    )
  )
);

create index if not exists idx_metodologias_eventos_manutencao_canonica_ativo_ocorrido
  on public.metodologias_eventos_manutencao_canonica(ativo_canonico_id, ocorrido_em desc, created_at desc);

create index if not exists idx_metodologias_eventos_manutencao_canonica_bloco
  on public.metodologias_eventos_manutencao_canonica(bloco_canonico_id);

alter table public.metodologias_eventos_manutencao_canonica enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.metodologias_eventos_manutencao_canonica;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_eventos_manutencao_canonica;
create policy "Enable read access for authenticated users"
  on public.metodologias_eventos_manutencao_canonica for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_eventos_manutencao_canonica for all
  using (auth.role() = 'authenticated');
