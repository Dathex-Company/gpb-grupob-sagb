import { CentralRepositorySnapshot } from '../types';

export const centralPadroesFallbackData: CentralRepositorySnapshot = {
  areas: [
    { id: 'pietro', name: 'Governança Geral', owner: 'Pietro Carboni', focus: 'Curadoria normativa e conflitos' },
    { id: 'savio', name: 'Sistemas e Arquitetura', owner: 'Sávio Codare', focus: 'Código, APIs, Supabase e deploy' },
    { id: 'alice', name: 'UX/UI', owner: 'Alice Montini', focus: 'Design system e experiência' },
    { id: 'pedro', name: 'Segurança', owner: 'Pedro Gazan', focus: 'Risco, acessos e proteção' },
    { id: 'pierre', name: 'Agentes e Orquestração', owner: 'Pierre Zanulli', focus: 'Agentes, MCPs e automações' },
    { id: 'klaus', name: 'Modelos IA/RAI', owner: 'Klaus Wagen', focus: 'Modelos, RAI e fornecedores' },
    { id: 'yuri', name: 'Processos e Registros', owner: 'Yuri Sague', focus: 'Execução, TaskZei e registros' },
    { id: 'noah', name: 'Naming e Marcas', owner: 'Noah Verdili', focus: 'Nomenclatura e disponibilidade' },
    { id: 'dante', name: 'Exploração de Ideias', owner: 'Dante Montoya', focus: 'Triagem e incubação inicial' },
    { id: 'nilo', name: 'Metodologias', owner: 'Nilo Barret', focus: 'Frameworks e propriedade intelectual' },
    { id: 'julio', name: 'AcadB', owner: 'Júlio Mosqueira', focus: 'Cursos, trilhas e mentorias' },
    { id: 'cesar', name: 'Ventures', owner: 'César Tulli', focus: 'Negócios, planos e empresas B' }
  ],
  standards: [
    {
      id: 'std-001',
      key: 'CP-GOV-001',
      title: 'Antes de construir, verificar o que já existe',
      type: 'principio',
      status: 'publicado',
      areaId: 'pietro',
      owner: 'Pietro Carboni',
      summary: 'Regra mestra para impedir retrabalho e duplicidade no SagB.',
      risk: 'critico',
      version: 1,
      agentAvailable: true,
      dependencies: [],
      relatedModules: ['central_padroes', 'sala-dev'],
      updatedAt: '2026-05-31'
    },
    {
      id: 'std-002',
      key: 'CP-TEC-001',
      title: 'Padrão de Módulos Plugáveis SagB',
      type: 'padrao',
      status: 'aprovado',
      areaId: 'savio',
      owner: 'Sávio Codare',
      summary: 'Contrato mínimo para manifest, module-doc, routes e registry.',
      risk: 'alto',
      version: 1,
      agentAvailable: true,
      dependencies: ['CP-GOV-001'],
      relatedModules: ['central_padroes'],
      updatedAt: '2026-05-31'
    },
    {
      id: 'std-003',
      key: 'CP-UX-001',
      title: 'Design System SagB',
      type: 'padrao',
      status: 'aprovado',
      areaId: 'alice',
      owner: 'Alice Montini',
      summary: 'Tokens, superfícies e consistência visual do SagB.',
      risk: 'medio',
      version: 1,
      agentAvailable: false,
      dependencies: ['CP-GOV-001'],
      relatedModules: ['central_padroes'],
      updatedAt: '2026-05-31'
    },
    {
      id: 'std-004',
      key: 'CP-SEC-001',
      title: 'Classificação de documento sensível',
      type: 'politica',
      status: 'revisao',
      areaId: 'pedro',
      owner: 'Pedro Gazan',
      summary: 'Documento sensível não pode ser publicado sem revisão de segurança.',
      risk: 'critico',
      version: 1,
      agentAvailable: true,
      dependencies: ['CP-GOV-001'],
      relatedModules: ['central_padroes'],
      updatedAt: '2026-05-31'
    }
  ],
  documents: [
    { id: 'doc-001', title: 'Arquitetura Mestra e Governança v1', path: '02_documentos_atuais/00_pietro...', status: 'canonico', category: 'Governança', areaId: 'pietro', shouldBecome: 'padrao' },
    { id: 'doc-002', title: 'Auditoria Sávio — Sistemas', path: '02_documentos_atuais/01_savio...', status: 'bruto', category: 'Técnico', areaId: 'savio', shouldBecome: 'padrao' },
    { id: 'doc-003', title: 'Design System', path: 'docs/design-system.md', status: 'canonico', category: 'UX/UI', areaId: 'alice', shouldBecome: 'padrao' },
    { id: 'doc-004', title: 'Deploy, ambientes e esteira', path: 'docs/deploy-ambientes-e-esteira.md', status: 'revisao', category: 'Deploy', areaId: 'savio', shouldBecome: 'checklist' },
    { id: 'doc-005', title: 'QUARENTENA_TECNICA', path: 'docs/QUARENTENA_TECNICA.md', status: 'legado', category: 'Riscos', areaId: 'savio', shouldBecome: 'arquivo_morto' }
  ],
  checklists: [
    { id: 'chk-001', title: 'Antes de criar módulo novo', context: 'criar_modulo', owner: 'Sávio Codare', items: ['Consultar Biblioteca de Módulos Base', 'Verificar módulo parecido no registry', 'Confirmar padrão técnico aplicável', 'Registrar decisão se houver exceção'] },
    { id: 'chk-002', title: 'Antes de criar tabela Supabase', context: 'criar_tabela', owner: 'Sávio Codare', items: ['Verificar tabela existente', 'Validar naming', 'Definir RLS', 'Criar rollback', 'Registrar migration'] },
    { id: 'chk-003', title: 'Antes de publicar padrão', context: 'publicar_padrao', owner: 'Pietro Carboni', items: ['Validar tipo normativo', 'Definir owner', 'Checar dependências', 'Checar risco', 'Aprovar curadoria'] }
  ],
  decisions: [
    { id: 'dec-001', title: 'Supabase como fonte primária de governança', status: 'aceita', areaId: 'savio', summary: 'Regras oficiais vivem no Supabase e são materializadas em docs.', impacts: ['governance_rules', 'sync documental'] },
    { id: 'dec-002', title: 'Central como embrião Loze Docs', status: 'aceita', areaId: 'pietro', summary: 'Central de Padrões consolida padrões e decisões.', impacts: ['ADRs', 'docs'] }
  ],
  modules: [
    { id: 'mod-001', moduleId: 'central_padroes', moduleName: 'Central de Padrões', kind: 'plugavel', status: 'parcial', standards: ['CP-GOV-001', 'CP-TEC-001'] },
    { id: 'mod-002', moduleId: 'sala-dev', moduleName: 'Sala Dev', kind: 'plugavel', status: 'revisar', standards: ['CP-GOV-001'] },
    { id: 'mod-003', moduleId: 'auth_core', moduleName: 'Auth Core', kind: 'base_reutilizavel', status: 'sem_vinculo', standards: [] },
    { id: 'mod-004', moduleId: 'audit_logs_core', moduleName: 'Audit Logs Core', kind: 'base_reutilizavel', status: 'sem_vinculo', standards: [] }
  ],
  agents: [
    { id: 'ca-01', agentCode: 'CA-01', agentName: 'Orquestrador Técnico', block: 'Entrada e Organização', status: 'executado', deliverable: 'Plano de run e coordenação' },
    { id: 'ca-18', agentCode: 'CA-18', agentName: 'Guardião de Reaproveitamento', block: 'Entrada e Organização', status: 'executado', deliverable: 'Parecer de reaproveitamento' },
    { id: 'ca-13', agentCode: 'CA-13', agentName: 'Catálogo Técnico', block: 'Entrada e Organização', status: 'executado', deliverable: 'Inventário de ativos existentes' },
    { id: 'ca-02', agentCode: 'CA-02', agentName: 'Arquiteto de Sistemas', block: 'Arquitetura e Documentação', status: 'executado', deliverable: 'Schema e decisões arquiteturais' },
    { id: 'ca-16', agentCode: 'CA-16', agentName: 'UX/UI Técnico', block: 'Arquitetura e Documentação', status: 'executado', deliverable: 'Mapa de telas e fluxos' },
    { id: 'ca-03', agentCode: 'CA-03', agentName: 'Documentação Técnica', block: 'Arquitetura e Documentação', status: 'executado', deliverable: 'ADRs, README e changelog' },
    { id: 'ca-06', agentCode: 'CA-06', agentName: 'Supabase Database Engineer', block: 'Construção Técnica', status: 'executado', deliverable: 'Migration V1' },
    { id: 'ca-05', agentCode: 'CA-05', agentName: 'Back-end Engineer', block: 'Construção Técnica', status: 'executado', deliverable: 'Services e hooks' },
    { id: 'ca-04', agentCode: 'CA-04', agentName: 'Front-end Engineer', block: 'Construção Técnica', status: 'executado', deliverable: 'Páginas, sidebar e componentes' },
    { id: 'ca-07', agentCode: 'CA-07', agentName: 'API & Integrations Engineer', block: 'Construção Técnica', status: 'executado', deliverable: 'Spec de integrações e buckets' },
    { id: 'ca-14', agentCode: 'CA-14', agentName: 'Agentes/MCPs/Automações', block: 'Construção Técnica', status: 'planejado', deliverable: 'Automação de triagem' },
    { id: 'ca-08', agentCode: 'CA-08', agentName: 'Segurança Técnica', block: 'Segurança e Qualidade', status: 'executado', deliverable: 'RLS e checklist de segurança' },
    { id: 'ca-15', agentCode: 'CA-15', agentName: 'Revisor de Código', block: 'Segurança e Qualidade', status: 'planejado', deliverable: 'Code review' },
    { id: 'ca-10', agentCode: 'CA-10', agentName: 'QA/Testes', block: 'Segurança e Qualidade', status: 'planejado', deliverable: 'Checklist QA' },
    { id: 'ca-11', agentCode: 'CA-11', agentName: 'Logs e Observabilidade', block: 'Segurança e Qualidade', status: 'planejado', deliverable: 'Observabilidade' },
    { id: 'ca-12', agentCode: 'CA-12', agentName: 'Versionamento Técnico', block: 'Deploy e Operação', status: 'planejado', deliverable: 'Commit, tag e release notes' },
    { id: 'ca-09', agentCode: 'CA-09', agentName: 'DevOps/Deploy', block: 'Deploy e Operação', status: 'planejado', deliverable: 'Build e deploy' },
    { id: 'ca-17', agentCode: 'CA-17', agentName: 'Operação e Runbooks', block: 'Deploy e Operação', status: 'planejado', deliverable: 'Runbook' }
  ]
};

