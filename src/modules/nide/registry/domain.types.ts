/** Categorias de domínio interno do NIDE */
export type NideDomainCategory =
  | 'core'        // Domínio core/fundacional (ex: missões)
  | 'estrutura'   // Estruturas de desenvolvimento (ex: metodologias)
  | 'ensino'      // Capacitação e treinamento
  | 'aplicacao'   // Aplicação prática
  | 'negocio'     // Negócios e ventures
  | 'processo'    // Processos e fluxogramas
  | 'governanca'  // Governança e padrões
  | 'futuro'      // Planejado, sem implementação

/** Status de desenvolvimento de um domínio */
export type NideDomainStatus =
  | 'planned'       // Planejado, ainda não implementado
  | 'in-progress'   // Em implementação
  | 'active'        // Ativo e funcional
  | 'paused'        // Pausado temporariamente
  | 'deprecated'    // Substituído ou obsoleto

/** Owner de um domínio */
export interface NideDomainOwner {
  type: 'agent' | 'user' | 'team' | 'auto';
  id: string;
  displayName: string;
}

/**
 * Manifesto de um domínio interno plugável do NIDE.
 *
 * Cada domínio representa uma área de conhecimento ou estrutura
 * que pode ser ativada/desativada dentro do NIDE.
 */
export interface NideDomainManifest {
  /** Identificador único do domínio (ex: 'metodologias') */
  id: string;
  /** Nome de exibição (ex: 'Metodologias') */
  displayName: string;
  /** Descrição curta do propósito do domínio */
  description: string;
  /** Ícone (nome do componente ou identificador) */
  icon: string;
  /** Caminho base dentro do NIDE (ex: '/nide/metodologias') */
  basePath: string;
  /** Status atual de desenvolvimento */
  status: NideDomainStatus;
  /** Ordem de exibição (menor = primeiro) */
  order: number;
  /** Categoria do domínio */
  category: NideDomainCategory;
  /** Owner responsável */
  owner: NideDomainOwner;
  /** Tags para filtro/busca */
  tags: string[];
  /** Se true, é um domínio core (não pode ser desativado) */
  isCore: boolean;
  /** Se true, é apenas planejado (sem implementação) */
  isPlanned: boolean;
  /** Se true, deve ser ativado por padrão quando disponível */
  isEnabledByDefault: boolean;
}

/** Rota de um domínio interno */
export interface NideDomainRoute {
  path: string;
  element?: React.ReactNode;
  /** Se true, este domínio tem rota própria */
  hasRoute: boolean;
  /** Se não tem rota, mensagem de placeholder */
  placeholderMessage?: string;
}

/** Estado de ativação de um domínio */
export interface NideDomainActivationState {
  domainId: string;
  isActive: boolean;
  isEnabled: boolean;
  activatedAt?: string;
}

/** Domínio completo (manifest + estado de ativação) */
export interface NideDomain {
  manifest: NideDomainManifest;
  activation: NideDomainActivationState;
}
