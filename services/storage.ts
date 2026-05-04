const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SESSION_STORAGE_KEY = import.meta.env.VITE_SESSION_STORAGE_KEY || 'sagb_supabase_session_v1';

const getAccessToken = () => {
  if (typeof window === 'undefined') return '';
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return String(parsed?.access_token || '');
  } catch {
    return '';
  }
};

const sanitizePathSegment = (value: string) => {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

const buildStorageHeaders = (mimeType?: string) => {
  const token = getAccessToken();
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${token || supabaseAnonKey}`,
    'Content-Type': mimeType || 'application/octet-stream',
    'x-upsert': 'true'
  };
};

export const uploadBlobToSupabaseStorage = async (params: {
  bucket: string;
  path: string;
  blob: Blob;
  mimeType?: string;
}) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase storage indisponivel: variaveis de ambiente ausentes.');
  }

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${params.bucket}/${params.path}`, {
    method: 'POST',
    headers: buildStorageHeaders(params.mimeType),
    body: params.blob
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Falha ao enviar arquivo para storage (${response.status}).`);
  }
};

export const buildCidStoragePath = (params: {
  workspaceId: string;
  assetId: string;
  createdAt: Date;
  fileName: string;
}) => {
  const year = params.createdAt.getFullYear();
  const month = String(params.createdAt.getMonth() + 1).padStart(2, '0');
  const day = String(params.createdAt.getDate()).padStart(2, '0');
  const safeName = sanitizePathSegment(params.fileName) || `asset-${params.assetId}`;
  return `${params.workspaceId}/${year}/${month}/${day}/${params.assetId}/original/${safeName}`;
};

export const buildChatStoragePath = (params: {
  workspaceId: string;
  sessionId: string;
  fileName: string;
}) => {
  const safeSessionId = sanitizePathSegment(params.sessionId);
  const safeName = sanitizePathSegment(params.fileName) || `file-${Date.now()}`;
  return `${params.workspaceId}/${safeSessionId}/${Date.now()}-${safeName}`;
};

export const getSupabasePublicUrl = (bucket: string, path: string) => {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Faz download de um arquivo do Supabase Storage (bucket privado) e retorna como Blob.
 */
export const downloadBlobFromSupabaseStorage = async (params: {
  bucket: string;
  path: string;
}): Promise<Blob> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase storage indisponivel: variaveis de ambiente ausentes.');
  }

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${params.bucket}/${params.path}`, {
    method: 'GET',
    headers: buildStorageHeaders()
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Falha ao baixar arquivo do storage (${response.status}).`);
  }

  return await response.blob();
};

/**
 * Dispara o download de um Blob no navegador, simulando clique em link.
 */
export const triggerBlobDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
