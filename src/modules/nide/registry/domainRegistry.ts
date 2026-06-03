import { NideDomainManifest } from './domain.types';

/**
 * Registry interno de domínios plugáveis do NIDE.
 *
 * Cada domínio representa uma área de conhecimento ou estrutura que pode ser
 * ativada/desativada dentro do NIDE.
 *
 * Regras:
 * - Não importar módulos externos (metodologias, mentorias, etc.)
 * - Apenas manifests planejados ou placeholders
 * - Metodologias e Mentorias aparecem como 'planned' até serem migrados
 * - Missões é o core funcional atual (migrado na ET 03)
 *
 * Categorias:
 * - core: domínios fundacionais (missões)
 * - estrutura: estruturas de desenvolvimento (metodologias)
 * - ensino: capacitação (mentorias, treinamentos, cursos)
 * - aplicacao: aplicação prática (programas, jornadas)
 * - processo: processos e fluxogramas (frameworks, processos)
 * - governanca: governança (protocolos, ferramentas, padrões)
 * - negocio: negócios (arquitetura de negócios)
 * - futuro: planejados sem previsão
 */
export const domainRegistry: NideDomainManifest[] = [
  // ─── Core ───────────────────────────────────────────────
  {
    id: 'missoes',
    displayName: 'Missões',
    description: 'Core funcional do NIDE. Gerencia missões, etapas, handoffs e artefatos.',
    icon: 'PlayIcon',
    basePath: '/nide',
    status: 'active',
    order: 0,
    category: 'core',
    owner: { type: 'auto', id: 'nide-core', displayName: 'NIDE Core' },
    tags: ['core', 'missoes', 'etapas', 'handoffs'],
    isCore: true,
    isPlanned: false,
    isEnabledByDefault: true
  },

  // ─── Estrutura ──────────────────────────────────────────
  {
    id: 'metodologias',
    displayName: 'Metodologias',
    description: 'Domínio especialista para estruturação, governança, versionamento e aplicação de metodologias proprietárias do SagB dentro do NIDE. Migrado como domínio plugável na ET 05/08.',
    icon: 'BookIcon',
    basePath: '/nide/metodologias',
    status: 'active',
    order: 10,
    category: 'estrutura',
    owner: { type: 'agent', id: 'metodologias-agent', displayName: 'Agente de Metodologias' },
    tags: ['estrutura', 'metodologias', 'proprietario', 'canonico'],
    isCore: false,
    isPlanned: false,
    isEnabledByDefault: true
  },

  // ─── Ensino ─────────────────────────────────────────────
  {
    id: 'mentorias',
    displayName: 'Central de Mentorias',
    description: 'Domínio especialista para estruturação, aplicação, acompanhamento, versionamento e evolução de mentorias dentro do NIDE. Migrado como domínio plugável na ET 06/08.',
    icon: 'MicIcon',
    basePath: '/nide/mentorias',
    status: 'active',
    order: 20,
    category: 'ensino',
    owner: { type: 'agent', id: 'mentorias-agent', displayName: 'Agente de Mentorias' },
    tags: ['ensino', 'mentorias', 'capacitacao', 'biblioteca'],
    isCore: false,
    isPlanned: false,
    isEnabledByDefault: true
  },
  {
    id: 'treinamentos',
    displayName: 'Treinamentos',
    description: 'Treinamentos estruturados e programas de capacitação do SagB.',
    icon: 'BookOpenIcon',
    basePath: '/nide/treinamentos',
    status: 'planned',
    order: 30,
    category: 'ensino',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['ensino', 'treinamentos', 'capacitacao'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },
  {
    id: 'cursos',
    displayName: 'Cursos',
    description: 'Cursos desenvolvidos pelo GrupoB para capacitação interna e externa.',
    icon: 'AcademicCapIcon',
    basePath: '/nide/cursos',
    status: 'planned',
    order: 40,
    category: 'ensino',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['ensino', 'cursos', 'capacitacao'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },

  // ─── Aplicação ──────────────────────────────────────────
  {
    id: 'programas',
    displayName: 'Programas',
    description: 'Programas estruturados de desenvolvimento e aceleração.',
    icon: 'TemplateIcon',
    basePath: '/nide/programas',
    status: 'planned',
    order: 50,
    category: 'aplicacao',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['aplicacao', 'programas'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },
  {
    id: 'jornadas',
    displayName: 'Jornadas',
    description: 'Jornadas de aprendizado e desenvolvimento contínuo.',
    icon: 'MapIcon',
    basePath: '/nide/jornadas',
    status: 'planned',
    order: 60,
    category: 'aplicacao',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['aplicacao', 'jornadas'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },

  // ─── Processo ──────────────────────────────────────────
  {
    id: 'frameworks',
    displayName: 'Frameworks',
    description: 'Frameworks proprietários de desenvolvimento, governança e gestão.',
    icon: 'CubeIcon',
    basePath: '/nide/frameworks',
    status: 'planned',
    order: 70,
    category: 'processo',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['processo', 'frameworks'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },
  {
    id: 'processos_fluxogramas',
    displayName: 'Processos e Fluxogramas',
    description: 'Modelagem, documentação e gestão de processos e fluxogramas.',
    icon: 'ShareIcon',
    basePath: '/nide/processos-fluxogramas',
    status: 'planned',
    order: 80,
    category: 'processo',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['processo', 'fluxogramas', 'bpmn'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },

  // ─── Governança ────────────────────────────────────────
  {
    id: 'protocolos',
    displayName: 'Protocolos',
    description: 'Protocolos operacionais, de segurança e de comunicação do SagB.',
    icon: 'ShieldCheckIcon',
    basePath: '/nide/protocolos',
    status: 'planned',
    order: 90,
    category: 'governanca',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['governanca', 'protocolos', 'seguranca'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },
  {
    id: 'ferramentas',
    displayName: 'Ferramentas',
    description: 'Ferramentas, utilities e recursos de suporte ao desenvolvimento.',
    icon: 'WrenchIcon',
    basePath: '/nide/ferramentas',
    status: 'planned',
    order: 100,
    category: 'governanca',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['governanca', 'ferramentas', 'utilities'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },
  {
    id: 'padroes_entrega',
    displayName: 'Padrões de Entrega',
    description: 'Padrões, checklists e templates para entregas do SagB.',
    icon: 'ClipboardCheckIcon',
    basePath: '/nide/padroes-entrega',
    status: 'planned',
    order: 110,
    category: 'governanca',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['governanca', 'padroes', 'entrega'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  },

  // ─── Negócio ──────────────────────────────────────────
  {
    id: 'negocios_ventures',
    displayName: 'Arquitetura de Negócios e Ventures',
    description: 'Arquitetura de negócios, ventures, spin-offs e novos empreendimentos do GrupoB.',
    icon: 'BriefcaseIcon',
    basePath: '/nide/negocios-ventures',
    status: 'planned',
    order: 120,
    category: 'negocio',
    owner: { type: 'auto', id: 'nide-futuro', displayName: 'NIDE (futuro)' },
    tags: ['negocio', 'ventures', 'arquitetura'],
    isCore: false,
    isPlanned: true,
    isEnabledByDefault: false
  }
];

/** Retorna o manifesto completo de todos os domínios registrados */
export function getDomainRegistry(): NideDomainManifest[] {
  return domainRegistry;
}

/** Retorna um domínio pelo ID */
export function getDomainManifestById(id: string): NideDomainManifest | undefined {
  return domainRegistry.find(d => d.id === id);
}
