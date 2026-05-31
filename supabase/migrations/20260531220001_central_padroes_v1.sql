-- Central de Padrões V1 | ET 01 a ET 08
-- Preserva public.governance_rules e adiciona arquitetura normativa expandida.

create table if not exists public.central_padroes_areas (
  id text primary key,
  name text not null,
  owner_name text not null,
  focus text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.central_padroes_standards (
  id uuid primary key default gen_random_uuid(),
  standard_key text not null unique,
  title text not null,
  normative_type text not null,
  status text not null default 'rascunho',
  area_id text not null references public.central_padroes_areas(id),
  owner_name text not null,
  summary text not null,
  content_md text not null default '',
  risk_level text not null default 'medio',
  version int not null default 1,
  agent_available boolean not null default false,
  replaced_by uuid null references public.central_padroes_standards(id),
  -- Referência lógica opcional ao embrião governance_rules.
  -- Não usa FK porque alguns ambientes remotos ainda não possuem public.governance_rules aplicado.
  source_governance_rule_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.central_padroes_standard_dependencies (
  id uuid primary key default gen_random_uuid(),
  standard_id uuid not null references public.central_padroes_standards(id) on delete cascade,
  depends_on_standard_id uuid not null references public.central_padroes_standards(id) on delete cascade,
  relation_type text not null default 'depends_on',
  created_at timestamptz not null default now(),
  unique (standard_id, depends_on_standard_id, relation_type)
);

create table if not exists public.central_padroes_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_path text not null,
  status text not null default 'bruto',
  category text not null,
  area_id text references public.central_padroes_areas(id),
  destination_type text not null default 'apoio',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.central_padroes_decisions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'proposta',
  area_id text references public.central_padroes_areas(id),
  summary text not null,
  impacts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.central_padroes_checklists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  context text not null,
  owner_name text not null,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.central_padroes_module_links (
  id uuid primary key default gen_random_uuid(),
  module_id text not null,
  module_name text not null,
  kind text not null default 'plugavel',
  status text not null default 'sem_vinculo',
  standards jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.central_padroes_agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_code text not null,
  agent_name text not null,
  block_name text not null,
  status text not null default 'planejado',
  deliverable text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.central_padroes_approval_requests (
  id uuid primary key default gen_random_uuid(),
  standard_id uuid references public.central_padroes_standards(id) on delete cascade,
  requested_by text not null,
  assigned_to text not null,
  status text not null default 'pending',
  review_notes text null,
  decided_at timestamptz null,
  created_at timestamptz not null default now()
);

create table if not exists public.central_padroes_evidence_records (
  id uuid primary key default gen_random_uuid(),
  related_entity_type text not null,
  related_entity_id text not null,
  title text not null,
  storage_path text null,
  severity text not null default 'medio',
  created_by text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_cp_standards_key on public.central_padroes_standards(standard_key);
create index if not exists idx_cp_standards_status on public.central_padroes_standards(status);
create index if not exists idx_cp_standards_area on public.central_padroes_standards(area_id);
create index if not exists idx_cp_documents_status on public.central_padroes_documents(status);
create index if not exists idx_cp_module_links_module on public.central_padroes_module_links(module_id);

alter table public.central_padroes_areas enable row level security;
alter table public.central_padroes_standards enable row level security;
alter table public.central_padroes_standard_dependencies enable row level security;
alter table public.central_padroes_documents enable row level security;
alter table public.central_padroes_decisions enable row level security;
alter table public.central_padroes_checklists enable row level security;
alter table public.central_padroes_module_links enable row level security;
alter table public.central_padroes_agent_runs enable row level security;
alter table public.central_padroes_approval_requests enable row level security;
alter table public.central_padroes_evidence_records enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'central_padroes_areas', 'central_padroes_standards', 'central_padroes_standard_dependencies',
    'central_padroes_documents', 'central_padroes_decisions', 'central_padroes_checklists',
    'central_padroes_module_links', 'central_padroes_agent_runs', 'central_padroes_approval_requests',
    'central_padroes_evidence_records'
  ]
  loop
    execute format('drop policy if exists "cp_authenticated_read_%s" on public.%I', t, t);
    execute format('create policy "cp_authenticated_read_%s" on public.%I for select using (auth.role() = ''authenticated'')', t, t);
    execute format('drop policy if exists "cp_authenticated_write_%s" on public.%I', t, t);
    execute format('create policy "cp_authenticated_write_%s" on public.%I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t, t);
  end loop;
end $$;

insert into public.central_padroes_areas (id, name, owner_name, focus) values
  ('pietro', 'Governança Geral', 'Pietro Carboni', 'Curadoria normativa e conflitos'),
  ('savio', 'Sistemas e Arquitetura', 'Sávio Codare', 'Código, APIs, Supabase e deploy'),
  ('alice', 'UX/UI', 'Alice Montini', 'Design system e experiência'),
  ('pedro', 'Segurança', 'Pedro Gazan', 'Risco, acessos e proteção'),
  ('pierre', 'Agentes e Orquestração', 'Pierre Zanulli', 'Agentes, MCPs e automações'),
  ('klaus', 'Modelos IA/RAI', 'Klaus Wagen', 'Modelos, RAI e fornecedores'),
  ('yuri', 'Processos e Registros', 'Yuri Sague', 'Execução, TaskZei e registros'),
  ('noah', 'Naming e Marcas', 'Noah Verdili', 'Nomenclatura e disponibilidade'),
  ('dante', 'Exploração de Ideias', 'Dante Montoya', 'Triagem e incubação inicial'),
  ('nilo', 'Metodologias', 'Nilo Barret', 'Frameworks e propriedade intelectual'),
  ('julio', 'AcadB', 'Júlio Mosqueira', 'Cursos, trilhas e mentorias'),
  ('cesar', 'Ventures', 'César Tulli', 'Negócios, planos e empresas B')
on conflict (id) do update set name = excluded.name, owner_name = excluded.owner_name, focus = excluded.focus;

insert into public.central_padroes_standards (standard_key, title, normative_type, status, area_id, owner_name, summary, content_md, risk_level, agent_available) values
  ('CP-GOV-001', 'Antes de construir, verificar o que já existe', 'principio', 'publicado', 'pietro', 'Pietro Carboni', 'Regra mestra para impedir retrabalho e duplicidade no SagB.', '# CP-GOV-001\n\nAntes de construir, verificar o que já existe.', 'critico', true),
  ('CP-TEC-001', 'Padrão de Módulos Plugáveis SagB', 'padrao', 'aprovado', 'savio', 'Sávio Codare', 'Contrato mínimo para manifest, module-doc, routes e registry.', '# CP-TEC-001\n\nManifest, module-doc, routes e registro no moduleRegistry.', 'alto', true),
  ('CP-UX-001', 'Design System SagB', 'padrao', 'aprovado', 'alice', 'Alice Montini', 'Tokens, superfícies e consistência visual do SagB.', '# CP-UX-001\n\nUso obrigatório de tokens semânticos.', 'medio', false),
  ('CP-SEC-001', 'Classificação de documento sensível', 'politica', 'revisao', 'pedro', 'Pedro Gazan', 'Documento sensível não pode ser publicado sem revisão de segurança.', '# CP-SEC-001\n\nClassificação interna, sensível, externável e pública.', 'critico', true)
on conflict (standard_key) do update set title = excluded.title, status = excluded.status, summary = excluded.summary, content_md = excluded.content_md;

insert into public.central_padroes_checklists (title, context, owner_name, items) values
  ('Antes de criar módulo novo', 'criar_modulo', 'Sávio Codare', '["Consultar Biblioteca de Módulos Base", "Verificar módulo parecido no registry", "Confirmar padrão técnico aplicável", "Registrar decisão se houver exceção"]'::jsonb),
  ('Antes de criar tabela Supabase', 'criar_tabela', 'Sávio Codare', '["Verificar tabela existente", "Validar naming", "Definir RLS", "Criar rollback", "Registrar migration"]'::jsonb),
  ('Antes de publicar padrão', 'publicar_padrao', 'Pietro Carboni', '["Validar tipo normativo", "Definir owner", "Checar dependências", "Checar risco", "Aprovar curadoria"]'::jsonb)
on conflict do nothing;
