/**
 * Tipos para o módulo Telas Avançadas
 * Central V3: Biblioteca + Estúdio + Referências + Preview/Exportação/Publicação
 */

export type TelaAvancadaType = 'external_url' | 'html_file' | 'html_code';
export type TelaCategoria =
  | 'mapa_termico'
  | 'esteira_agentes'
  | 'network'
  | 'dashboard'
  | 'cockpit'
  | 'timeline'
  | 'demo_comercial'
  | 'laboratorio'
  | 'outro';

export type TelaStatus =
  | 'rascunho'
  | 'em_construcao'
  | 'em_teste'
  | 'publicado'
  | 'arquivado';

export interface TelaAvancadaBase {
  id: string;
  title: string;
  type: TelaAvancadaType;
  category?: TelaCategoria;
  status?: TelaStatus;
  source?: 'biblioteca_manual' | 'studio_export';
  projectId?: string;
  version?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TelaAvancadaExternalUrl extends TelaAvancadaBase {
  type: 'external_url';
  url: string;
}

export interface TelaAvancadaHtmlFile extends TelaAvancadaBase {
  type: 'html_file';
  fileName: string;
  htmlContent: string;
  fileSize?: number;
  fileType?: string;
}

export interface TelaAvancadaHtmlCode extends TelaAvancadaBase {
  type: 'html_code';
  htmlContent: string;
}

export type TelaAvancada = 
  | TelaAvancadaExternalUrl 
  | TelaAvancadaHtmlFile 
  | TelaAvancadaHtmlCode;

export interface TelaAvancadaFormDataExternalUrl {
  type: 'external_url';
  title: string;
  url: string;
}

export interface TelaAvancadaFormDataHtmlFile {
  type: 'html_file';
  title: string;
  file: File;
}

export interface TelaAvancadaFormDataHtmlCode {
  type: 'html_code';
  title: string;
  htmlContent: string;
}

export type TelaAvancadaFormData = 
  | TelaAvancadaFormDataExternalUrl 
  | TelaAvancadaFormDataHtmlFile 
  | TelaAvancadaFormDataHtmlCode;

export interface TelasAvancadasState {
  telas: TelaAvancada[];
  isLoading: boolean;
  error: string | null;
}

export interface TelasAvancadasStore {
  telas: TelaAvancada[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addTela: (formData: TelaAvancadaFormData) => Promise<TelaAvancada>;
  removeTela: (id: string) => Promise<void>;
  loadTelas: () => Promise<void>;
  getTelaById: (id: string) => TelaAvancada | null;
  updateTela: (id: string, updates: Partial<TelaAvancada>) => Promise<TelaAvancada>;
  clearError: () => void;
}

export type EstudioProjetoStatus = 'rascunho' | 'em_construcao' | 'em_teste' | 'publicado' | 'arquivado';
export type IntensidadeVisual = 'baixa' | 'media' | 'alta';
export type IntensidadeMotion = 'suave' | 'moderada' | 'alta';
export type ReferenciaTipo =
  | 'layout'
  | 'motion'
  | 'conector'
  | 'card'
  | 'painel'
  | 'mapa'
  | 'cor_paleta'
  | 'demo_comercial'
  | 'outro';

export type BlocoTelaTipo =
  | 'entrada_ideia'
  | 'card_agente'
  | 'conector'
  | 'painel_lateral'
  | 'logs'
  | 'artefatos'
  | 'gates'
  | 'nucleo_central'
  | 'mapa_termico'
  | 'timeline'
  | 'indicadores'
  | 'capsula'
  | 'bloco_final_entrega';

export type EfeitoVisualPreset =
  | 'pulso'
  | 'linha_viva'
  | 'glow_ativo'
  | 'card_respirando'
  | 'bolha_handoff'
  | 'spotlight'
  | 'pausa_gate'
  | 'flash_conclusao'
  | 'particulas_sutis'
  | 'giro_orbital'
  | 'zoom_foco'
  | 'demo_mode';

export interface ProjetoTela {
  id: string;
  nome: string;
  slug: string;
  categoria: TelaCategoria;
  objetivo: string;
  publico: string;
  contexto: string;
  status: EstudioProjetoStatus;
  versao: string;
  tomVisual: string;
  intensidadeVisual: IntensidadeVisual;
  intensidadeMotion: IntensidadeMotion;
  modoDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlueprintTela {
  projetoId: string;
  narrativa: string;
  fluxoPrincipal: string;
  zonas: string[];
  blocos: BlocoTelaTipo[];
  efeitos: EfeitoVisualPreset[];
  densidade: IntensidadeVisual;
  modoDemo: boolean;
  observacoes: string;
}

export interface ReferenciaTela {
  id: string;
  projetoId: string;
  tipo: ReferenciaTipo;
  origem: 'link' | 'texto' | 'html' | 'interna';
  titulo: string;
  descricao: string;
  conteudo: string;
  tags: string[];
  createdAt: Date;
}

export interface BlocoTela {
  id: string;
  projetoId: string;
  tipo: BlocoTelaTipo;
  config: Record<string, string | number | boolean>;
  ordem: number;
  visivel: boolean;
}

export interface ExportacaoTela {
  id: string;
  projetoId: string;
  nomeArquivo: string;
  htmlGerado: string;
  versao: string;
  status: 'gerado' | 'publicado';
  createdAt: Date;
}

export interface CentralTab {
  id: 'biblioteca' | 'estudio' | 'referencias' | 'preview';
  label: string;
}

// Helper type guards
export const isExternalUrl = (tela: TelaAvancada): tela is TelaAvancadaExternalUrl => 
  tela.type === 'external_url';

export const isHtmlFile = (tela: TelaAvancada): tela is TelaAvancadaHtmlFile => 
  tela.type === 'html_file';

export const isHtmlCode = (tela: TelaAvancada): tela is TelaAvancadaHtmlCode => 
  tela.type === 'html_code';

// Migration helper for V1 data
export interface LegacyTelaAvancada {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
}

export const migrateLegacyTela = (legacy: LegacyTelaAvancada): TelaAvancadaExternalUrl => ({
  ...legacy,
  type: 'external_url',
  updatedAt: legacy.createdAt
});
