/**
 * Contrato oficial do CID.
 *
 * O CID é uma camada de ingestão/preparação documental. Este arquivo centraliza
 * formatos, fontes, outputs técnicos e fronteiras para evitar que inteligência
 * profunda volte a ser acoplada ao módulo.
 */

export const CID_SUPPORTED_FORMATS = [
  'pdf', 'doc', 'docx', 'txt', 'md', 'csv', 'json', 'xml', 'yaml', 'yml',
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
  'mp3', 'wav', 'ogg', 'mp4', 'webm', 'avi', 'mov'
] as const;

export const CID_SUPPORTED_SOURCES = [
  'upload', 'local', 'api', 'webhook', 'email', 'integration'
] as const;

export const CID_ALLOWED_ACTIONS = [
  'store_only',
  'store_transcribe',
  'store_summarize',
  'store_transcribe_summarize'
] as const;

export const CID_LEGACY_ACTIONS = [
  'store_consolidate',
  'derivado_single',
  'derivado_consolidated'
] as const;

export const CID_TECHNICAL_OUTPUTS = [
  'extracted_text',
  'transcription',
  'metadata',
  'chunks',
  'summary_short',
  'summary_long'
] as const;

export const CID_NOT_RESPONSIBLE_FOR = [
  'semantic_analysis',
  'strategic_cross_reference',
  'decision_making',
  'agent_context_assembly',
  'business_recommendation',
  'radar_de_conexoes',
  'nico',
  'nagi'
] as const;

export const CID_MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024;

export const isCidLegacyAction = (value?: string | null) =>
  CID_LEGACY_ACTIONS.includes(String(value || '') as any);

export const isCidAllowedAction = (value?: string | null) =>
  CID_ALLOWED_ACTIONS.includes(String(value || '') as any);

export const cidBoundaryNotice =
  'CID prepara documentos. Cruzamentos, recomendações e inteligência profunda pertencem às camadas posteriores do SagB.';

