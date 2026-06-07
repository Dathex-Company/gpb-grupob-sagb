import { CidAsset, CidAssetFile } from '../../../types';

export const cidToDate = (value: any): Date => {
  if (value instanceof Date) return value;
  const parsed = new Date(value || Date.now());
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const cidFormatDate = (value: any) => cidToDate(value).toLocaleString('pt-BR');

export const cidFormatBytes = (value?: number | null) => {
  if (value === undefined || value === null || !Number.isFinite(value)) return '-';
  if (value < 1024) return `${value} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let size = value / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) { size /= 1024; unitIndex += 1; }
  return `${size.toLocaleString('pt-BR', { maximumFractionDigits: size >= 100 ? 0 : 1 })} ${units[unitIndex]}`;
};

export const cidResolveAssetSizeBytes = (asset?: CidAsset | null, files: CidAssetFile[] = []) => {
  const fileSize = files.find((file) => Number(file.sizeBytes || 0) > 0)?.sizeBytes;
  if (fileSize !== undefined && fileSize !== null) return Number(fileSize);
  const payloadSize = asset?.payload?.originalSizeBytes;
  if (payloadSize !== undefined && payloadSize !== null && Number.isFinite(Number(payloadSize))) return Number(payloadSize);
  return null;
};

export const cidStatusBadge = (value: any) => {
  const v = String(value || '').toLowerCase();
  if (v === 'completed' || v === 'ready') return 'bg-emerald-100 text-emerald-700';
  if (v === 'completed_warning') return 'bg-amber-100 text-amber-700';
  if (v === 'error') return 'bg-red-100 text-red-700';
  if (['processing','fragmenting','transcribing','summarizing','consolidating'].includes(v)) return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-600';
};

export const cidMaterialIcon: Record<string, string> = {
  pdf: '📄', doc: '📝', docx: '📝', txt: '📃',
  spreadsheet: '📊', image: '🖼', audio: '🎵', video: '🎬', other: '📁'
};

export const cidLabels: Record<string, string> = {
  completed: 'Concluído', completed_warning: 'Concluído com aviso', ready: 'Pronto',
  error: 'Erro', processing: 'Processando', fragmenting: 'Fragmentando',
  transcribing: 'Transcrevendo', summarizing: 'Resumindo', consolidating: 'Consolidando',
  queued: 'Na fila', received: 'Recebido', paused: 'Pausado', cancelled: 'Cancelado',
  extracted_text: 'Texto extraído', transcription: 'Transcrição',
  summary_short: 'Resumo curto', summary_long: 'Resumo longo',
  consolidation: 'Consolidação', keywords: 'Palavras-chave',
  store_only: 'Só armazenar', store_transcribe: 'Armazenar + transcrever',
  store_summarize: 'Armazenar + resumir', store_transcribe_summarize: 'Armazenar + transcrever + resumir',
  store_consolidate: 'Legado: consolidar'
};

export const cidToLabel = (value: any) => {
  const raw = String(value || '').replace(/[_-]+/g, ' ').trim().toLowerCase();
  if (cidLabels[raw]) return cidLabels[raw];
  return raw ? raw[0].toUpperCase() + raw.slice(1) : '-';
};

