/** Status de domínio interno do NIDE */
export type DomainStatus = 'planned' | 'in-progress' | 'active' | 'paused' | 'archived';

/** Representação de um domínio interno do NIDE */
export interface NideDomain {
  id: string;
  name: string;
  description: string;
  status: DomainStatus;
  slug: string;
}

/** Estado geral do contexto do NIDE */
export interface NideContextState {
  activeDomain: NideDomain | null;
  isFullscreen: boolean;
  version: string;
}

/** Ação para o reducer do NideProvider */
export type NideAction =
  | { type: 'SET_ACTIVE_DOMAIN'; payload: NideDomain | null }
  | { type: 'SET_FULLSCREEN'; payload: boolean };
