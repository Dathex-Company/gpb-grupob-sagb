import React from 'react';
import { ChatAttachment, UploadStatus } from '../types';
import { AlertTriangleIcon, CheckIcon, CloudUploadIcon, FileTextIcon, MicIcon, XIcon } from './ui/Icon';

interface ChatAttachmentCardProps {
  attachment: ChatAttachment;
  compact?: boolean;
  onRemove?: () => void;
}

const formatFileSize = (sizeBytes?: number) => {
  const size = Number(sizeBytes || 0);
  if (!size) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (durationSec?: number) => {
  const total = Math.max(0, Math.round(Number(durationSec || 0)));
  if (!total) return null;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getAttachmentKind = (mimeType?: string, name?: string) => {
  const mime = String(mimeType || '').toLowerCase();
  const ext = String(name?.split('.').pop() || '').toLowerCase();

  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.includes('pdf') || ext === 'pdf') return 'pdf';
  if (
    mime.includes('word') ||
    mime.includes('document') ||
    mime.includes('officedocument') ||
    ['doc', 'docx', 'txt', 'md', 'rtf', 'json', 'csv', 'xml', 'yaml', 'yml'].includes(ext)
  ) return 'document';

  return 'file';
};

const getStatusMeta = (status?: UploadStatus) => {
  switch (status) {
    case 'uploading':
      return {
        label: 'Enviando',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        accentClass: 'border-slate-200',
        dotClass: 'bg-slate-400',
        Icon: CloudUploadIcon,
      };
    case 'success':
      return {
        label: 'Enviado',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        accentClass: 'border-emerald-200',
        dotClass: 'bg-emerald-500',
        Icon: CheckIcon,
      };
    case 'error':
      return {
        label: 'Erro',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
        accentClass: 'border-red-200',
        dotClass: 'bg-red-500',
        Icon: AlertTriangleIcon,
      };
    case 'pending':
    default:
      return {
        label: 'Preparando',
        badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
        accentClass: 'border-gray-200',
        dotClass: 'bg-gray-400',
        Icon: CloudUploadIcon,
      };
  }
};

const ChatAttachmentCard: React.FC<ChatAttachmentCardProps> = ({ attachment, compact = false, onRemove }) => {
  const kind = getAttachmentKind(attachment.mimeType, attachment.name);
  const statusMeta = getStatusMeta(attachment.uploadStatus);
  const durationLabel = formatDuration(attachment.durationSec);

  const previewHeight = compact ? 'h-20' : 'h-28';
  const contentPadding = compact ? 'p-2.5' : 'p-3.5';

  const renderPreview = () => {
    if (kind === 'image') {
      return (
        <img
          src={attachment.url || attachment.preview}
          alt={attachment.name || 'Imagem anexada'}
          className={`w-full ${previewHeight} object-cover`}
        />
      );
    }

    if (kind === 'video') {
      return (
        <video
          src={attachment.url || attachment.preview}
          className={`w-full ${previewHeight} object-cover bg-black`}
          muted
          preload="metadata"
        />
      );
    }

    return (
      <div className={`w-full ${previewHeight} flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100`}>
        <div className="flex flex-col items-center gap-2 text-gray-500">
          {kind === 'audio' ? <MicIcon className="w-7 h-7" /> : <FileTextIcon className="w-7 h-7" />}
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">
            {kind === 'audio' ? 'Áudio' : kind === 'pdf' ? 'PDF' : kind === 'document' ? 'Documento' : 'Arquivo'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-[220px] max-w-full overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/[0.02] ${statusMeta.accentClass}`}>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-black"
          title="Remover anexo"
        >
          <XIcon className="w-3 h-3" />
        </button>
      )}

      <div className="relative">
        {renderPreview()}
        {attachment.uploadStatus === 'uploading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/45 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Processando</span>
            </div>
          </div>
        )}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/92 px-2 py-1 shadow-sm">
          <span className={`h-2 w-2 rounded-full ${statusMeta.dotClass}`}></span>
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-600">
            {kind === 'image' ? 'Imagem' : kind === 'video' ? 'Vídeo' : kind === 'audio' ? 'Áudio' : kind === 'pdf' ? 'PDF' : kind === 'document' ? 'Doc' : 'Arquivo'}
          </span>
        </div>
      </div>

      <div className={contentPadding}>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-black text-gray-800">
              {attachment.name || 'Arquivo sem nome'}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-400">
              <span>{formatFileSize(attachment.sizeBytes)}</span>
              {durationLabel && <span>{durationLabel}</span>}
            </div>
          </div>
          <div className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${statusMeta.badgeClass}`}>
            <statusMeta.Icon className="w-3 h-3" />
            {statusMeta.label}
          </div>
        </div>

        {attachment.uploadError && (
          <p className="text-[10px] font-bold text-red-500">
            {attachment.uploadError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatAttachmentCard;