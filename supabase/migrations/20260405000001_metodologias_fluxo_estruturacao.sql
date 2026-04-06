-- ET 12 | Núcleo de Metodologias
-- Persistência mínima do fluxo: entrada bruta -> preview/conversão -> ativo em estruturação

create table if not exists public.metodologias_entradas_brutas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  tipo_de_entrada text not null,
  conteudo_bruto text not null,
  origem text not null,
  status_de_estruturacao text not null default 'bruto',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metodologias_entradas_brutas_tipo_check check (
    tipo_de_entrada in (
      'ideia_crua',
      'rascunho',
      'texto_livre',
      'bloco_doutrinario',
      'resumo_pdf',
      'framework_parcial',
      'processo_difuso'
    )
  ),
  constraint metodologias_entradas_brutas_status_check check (
    status_de_estruturacao in ('bruto', 'em_analise', 'estruturado_parcialmente', 'convertido_em_ativo')
  )
);

create table if not exists public.metodologias_ativos_em_estruturacao (
  id uuid primary key default gen_random_uuid(),
  entrada_bruta_id uuid not null references public.metodologias_entradas_brutas(id) on delete restrict,
  origem_preview_id text,
  nome text not null,
  resumo text not null,
  tipo_de_ativo text not null,
  definicao text not null,
  objetivo text not null,
  status_editorial text not null default 'em_estruturacao',
  maturidade_pratica text not null default 'conceitual',
  governanca_estado text not null default 'em_desenvolvimento',
  etapa_fluxo text not null default 'edicao_guiada',
  campos_auxiliares jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint metodologias_ativos_tipo_check check (
    tipo_de_ativo in ('metodologia', 'processo', 'protocolo', 'checklist', 'principio', 'aplicacao', 'ativo_derivado')
  ),
  constraint metodologias_ativos_status_editorial_check check (
    status_editorial in ('rascunho', 'em_estruturacao', 'em_revisao', 'aprovada', 'oficial', 'arquivada')
  ),
  constraint metodologias_ativos_maturidade_check check (
    maturidade_pratica in ('conceitual', 'modelada', 'testada', 'validada', 'escalavel')
  ),
  constraint metodologias_ativos_governanca_estado_check check (
    governanca_estado in ('em_desenvolvimento', 'em_revisao', 'oficial', 'arquivado', 'obsoleto')
  ),
  constraint metodologias_ativos_etapa_fluxo_check check (
    etapa_fluxo in ('preview_gerado', 'edicao_guiada', 'pronto_para_revisao_manual')
  )
);

create unique index if not exists idx_metodologias_ativos_entrada_unico
  on public.metodologias_ativos_em_estruturacao(entrada_bruta_id);

create index if not exists idx_metodologias_entradas_status
  on public.metodologias_entradas_brutas(status_de_estruturacao);

create index if not exists idx_metodologias_entradas_created_at
  on public.metodologias_entradas_brutas(created_at desc);

create index if not exists idx_metodologias_ativos_status_editorial
  on public.metodologias_ativos_em_estruturacao(status_editorial);

create index if not exists idx_metodologias_ativos_updated_at
  on public.metodologias_ativos_em_estruturacao(updated_at desc);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_metodologias_entradas_brutas_updated_at on public.metodologias_entradas_brutas;
create trigger update_metodologias_entradas_brutas_updated_at
before update on public.metodologias_entradas_brutas
for each row execute function public.update_updated_at_column();

drop trigger if exists update_metodologias_ativos_em_estruturacao_updated_at on public.metodologias_ativos_em_estruturacao;
create trigger update_metodologias_ativos_em_estruturacao_updated_at
before update on public.metodologias_ativos_em_estruturacao
for each row execute function public.update_updated_at_column();

alter table public.metodologias_entradas_brutas enable row level security;
alter table public.metodologias_ativos_em_estruturacao enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.metodologias_entradas_brutas;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_entradas_brutas;
create policy "Enable read access for authenticated users"
  on public.metodologias_entradas_brutas for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_entradas_brutas for all
  using (auth.role() = 'authenticated');

drop policy if exists "Enable read access for authenticated users" on public.metodologias_ativos_em_estruturacao;
drop policy if exists "Enable all access for authenticated users" on public.metodologias_ativos_em_estruturacao;
create policy "Enable read access for authenticated users"
  on public.metodologias_ativos_em_estruturacao for select
  using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users"
  on public.metodologias_ativos_em_estruturacao for all
  using (auth.role() = 'authenticated');
