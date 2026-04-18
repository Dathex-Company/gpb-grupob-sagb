export const EMPRESA_STATUS_VALUES = ['IDEIA', 'DESENVOLVIMENTO', 'APROVADA', 'ATIVA', 'INATIVA'] as const;
export type EmpresaStatus = (typeof EMPRESA_STATUS_VALUES)[number];

export const EMPRESA_TIPO_VALUES = ['MARCA', 'PROJETO', 'UNIDADE_NEGOCIO', 'OUTRO'] as const;
export type EmpresaTipo = (typeof EMPRESA_TIPO_VALUES)[number];

export const EMPRESA_ESFERA_VALUES = ['GRUPOB', 'MERCADO', 'INTERNA', 'NAO_DEFINIDA'] as const;
export type EmpresaEsfera = (typeof EMPRESA_ESFERA_VALUES)[number];

/**
 * Entidade oficial do módulo Cadastro de Empresas.
 *
 * Linguagem canônica:
 * - Entidade principal: Empresa
 * - "venture", "business unit", "marca" e "projeto" não são entidade principal
 * - "marca", "projeto" e "unidade de negócio" passam a ser classificação (tipo)
 */
export interface EmpresaCadastro {
  id: string;
  nome: string;
  nomeCurto?: string;
  slug?: string;
  status: EmpresaStatus;
  tipo: EmpresaTipo;
  esfera: EmpresaEsfera;
  segmento?: string;
  nicho?: string;
  logoUrl: string;
  descricaoCurta?: string;
  siteUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  /**
   * Campo legado ainda aceito para ordenação em telas antigas.
   * Deve ser removido quando a migração de storage consolidar createdAt/updatedAt.
   */
  timestamp: Date;
  /** Campos extras estritamente cadastrais e não canônicos */
  camposAuxiliares?: Record<string, unknown>;
}

export type Empresa = EmpresaCadastro;

export interface EmpresaDraft extends Partial<EmpresaCadastro> {
  nome: string;
  logoUrl: string;
}

export type EmpresaFonteLegada = Record<string, unknown> & Partial<EmpresaCadastro>;

export interface EmpresaNormalizacaoRastro {
  termosLegadosDetectados: string[];
  camposOrigem: Record<string, string>;
}

export interface EmpresaNormalizada {
  empresa: EmpresaCadastro;
  rastro: EmpresaNormalizacaoRastro;
}
