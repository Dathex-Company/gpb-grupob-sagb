/**
 * Tipos para o módulo Telas Avançadas
 * V2: Suporte a URL externa, arquivo HTML e código HTML
 */

export type TelaAvancadaType = 'external_url' | 'html_file' | 'html_code';

export interface TelaAvancadaBase {
  id: string;
  title: string;
  type: TelaAvancadaType;
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
  addTela: (formData: TelaAvancadaFormData) => Promise<void>;
  removeTela: (id: string) => Promise<void>;
  loadTelas: () => Promise<void>;
  clearError: () => void;
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