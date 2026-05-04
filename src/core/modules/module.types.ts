import { ReactNode } from 'react';

export interface ModuleManifest {
  id: string; // The TabId string used in the system
  internalName: string;
  displayName: string;
  baseRoute: string;
  icon: string;
  initialStatus: 'active' | 'inactive';
  owner?: {
    type: 'agent' | 'human';
    id: string;
    displayName: string;
  };
}

export interface ModuleRoute {
  path: string;
  element: ReactNode;
  fullscreen?: boolean;
}

export interface PluggableModule {
  manifest: ModuleManifest;
  routes: ModuleRoute;
}

export interface ModuleDoc {
  /** Nome oficial de exibição do módulo */
  displayName: string;

  /** Propósito único do módulo (1-2 frases) */
  purpose: string;

  /** Versão semântica atual (deve bater com CHANGELOG.md) */
  version: string;

  /** Fronteiras: o que o módulo NÃO faz */
  boundaries?: string[];

  /** Integrações com outros módulos/sistemas */
  integrations?: {
    internal?: string[];
    external?: string[];
  };

  /** Dependências de dados */
  dataDependencies?: {
    supabaseTables?: string[];
    storageBuckets?: string[];
    localStorageKeys?: string[];
  };
}
