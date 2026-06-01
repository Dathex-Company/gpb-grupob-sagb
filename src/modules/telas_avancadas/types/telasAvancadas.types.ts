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

// ── Estúdio Steps ──
export type StudioStepId =
  | 'informacoes'
  | 'objetivo'
  | 'blueprint'
  | 'blocos'
  | 'efeitos'
  | 'direcao_visual'
  | 'preview_exportacao';

export interface StudioStep {
  id: StudioStepId;
  label: string;
  subtitle: string;
  icon: string;
}

// ── Blueprint Editor Expandido ──
export interface BlueprintEditorFields {
  comunicacao: string;       // o que a tela precisa comunicar
  fluxoPrincipal: string;    // qual é o fluxo principal
  areas: string[];           // quais áreas precisam existir
  elementosVivos: string;    // quais elementos precisam parecer vivos
  motionAjuda: string;       // onde o motion ajuda
  efeitosDesejados: string;  // quais efeitos são desejados
  evitar: string;            // o que deve ser evitado
  observacoes: string;       // observações de direção visual
}

// ── Efeitos Agrupados ──
export type EfeitoGroupId = 'energia' | 'conectores' | 'foco' | 'feedback' | 'conclusao' | 'demo';

export interface EfeitoGroup {
  id: EfeitoGroupId;
  label: string;
  descricao: string;
}

export interface EfeitoMeta {
  preset: EfeitoVisualPreset;
  nome: string;
  descricao: string;
  uso: string;
  intensidade: 'suave' | 'media' | 'forte';
  group: EfeitoGroupId;
}

// ── Bloco Metadata ──
export interface BlocoMeta {
  tipo: BlocoTelaTipo;
  nome: string;
  descricao: string;
  ajuda: string;
  icone: string;
  categoria: 'entrada' | 'processamento' | 'exibicao' | 'conexao' | 'entrega';
}

// ── Direção Visual ──
export interface VisualDirectionConfig {
  paleta: string;
  densidadeVisual: IntensidadeVisual;
  intensidadeMotion: IntensidadeMotion;
  estiloBorda: 'arredondada' | 'reto' | 'minimal';
  grid: 'ativa' | 'oculta';
  glass: boolean;
  modoDemo: boolean;
  tomVisual: string;
}

export type LayoutModelo =
  | 'lateral_direita'
  | 'lateral_esquerda'
  | 'centro_orbitais'
  | 'esteira_horizontal'
  | 'dashboard_grid'
  | 'mapa_central_paineis'
  | 'fluxo_vertical';

export type TelaTemplateId =
  | 'esteira_agentes'
  | 'mapa_termico'
  | 'network_avancado'
  | 'cockpit_dashboard'
  | 'timeline_dinamica'
  | 'demo_comercial'
  | 'fluxo_operacional'
  | 'mapa_geografico';

export interface TelaTemplate {
  id: TelaTemplateId;
  nome: string;
  descricao: string;
  categoria: TelaCategoria;
  layout: LayoutModelo;
  paletaBase: string;
  orientacao: string;
  objetivoBase: string;
  fluxoBase: string;
  blocosSugeridos: BlocoTelaTipo[];
  efeitosSugeridos: EfeitoVisualPreset[];
}

export type StudioPresetId =
  | 'dark_tech_premium'
  | 'demo_cinematografica'
  | 'mapa_vivo_operacional'
  | 'fluxo_handoff'
  | 'painel_executivo';

export interface StudioPreset {
  id: StudioPresetId;
  nome: string;
  descricao: string;
  visual: Partial<VisualDirectionConfig>;
  efeitos: EfeitoVisualPreset[];
  blocos: BlocoTelaTipo[];
}

// ── Quick Edit ──
export interface QuickEditData {
  title?: string;
  status?: TelaStatus;
  category?: TelaCategoria;
  source?: 'biblioteca_manual' | 'studio_export';
  version?: string;
  observacao?: string;
}
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
  templateId?: TelaTemplateId;
  presetId?: StudioPresetId;
  layout: LayoutModelo;
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

export interface ProjectVisualConfig extends VisualDirectionConfig {
  projetoId: string;
  presetId?: StudioPresetId;
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
  grupo?: string;
  presetId?: string;
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
