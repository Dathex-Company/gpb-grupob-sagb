/**
 * localBridgeApi.ts
 * 
 * Cliente para a bridge local do Vite (vite-plugin-local-bridge).
 * Fornece acesso ao filesystem Windows Z:\ durante o desenvolvimento.
 * 
 * Uso:
 *   import { listDir, readFile, getRoots } from '../../utils/localBridgeApi';
 *   const { items } = await listDir('Z:/01_empresasb');
 */

export interface LocalFileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  mtime: string;
  extension: string;
}

export interface LocalRoot {
  name: string;
  path: string;
  label: string;
}

export interface ListDirResult {
  items: LocalFileEntry[];
  parentPath: string;
}

export interface ReadFileResult {
  base64: string;
  mimeType: string;
  size: number;
}

// ─── CONFIG ─────────────────────────────────────────────
const BASE_URL = '/api/local-fs';

// ─── API ────────────────────────────────────────────────

/** Lista as raízes autorizadas (Z:\00_sagb, Z:\01_empresasb, etc.) */
export async function getRoots(): Promise<LocalRoot[]> {
  const res = await fetch(`${BASE_URL}/roots`);
  if (!res.ok) throw new Error(`localBridge: falha ao listar raízes (${res.status})`);
  const data = await res.json();
  return data.roots || [];
}

/** Lista o conteúdo de um diretório */
export async function listDir(dirPath: string): Promise<ListDirResult> {
  const encoded = encodeURIComponent(dirPath);
  const res = await fetch(`${BASE_URL}/list?path=${encoded}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(`localBridge: ${err.error || `HTTP ${res.status}`}`);
  }
  return res.json();
}

/** Obtém metadados de um caminho */
export async function statPath(targetPath: string): Promise<LocalFileEntry> {
  const encoded = encodeURIComponent(targetPath);
  const res = await fetch(`${BASE_URL}/stat?path=${encoded}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(`localBridge: ${err.error || `HTTP ${res.status}`}`);
  }
  return res.json();
}

/** Lê o conteúdo de um arquivo.
 *  Para arquivos de texto, retorna o texto diretamente (response text).
 *  Para binários, retorna { base64, mimeType, size }.
 */
export async function readFile(filePath: string): Promise<string | ReadFileResult> {
  const encoded = encodeURIComponent(filePath);
  const res = await fetch(`${BASE_URL}/read?path=${encoded}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(`localBridge: ${err.error || `HTTP ${res.status}`}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.startsWith('text/')) {
    return res.text();
  }
  return res.json();
}

/** Verifica se a bridge local está disponível */
export async function isLocalBridgeAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/roots`, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Ícone para tipo de arquivo */
export const fileIcon = (ext: string): string => {
  const icons: Record<string, string> = {
    '.pdf': '📄',
    '.doc': '📝', '.docx': '📝',
    '.txt': '📃', '.md': '📃',
    '.json': '📋', '.xml': '📋', '.csv': '📋',
    '.png': '🖼', '.jpg': '🖼', '.jpeg': '🖼', '.gif': '🖼', '.svg': '🖼', '.webp': '🖼',
    '.mp3': '🎵', '.wav': '🎵', '.ogg': '🎵',
    '.mp4': '🎬', '.webm': '🎬', '.avi': '🎬', '.mov': '🎬',
    '.zip': '📦', '.rar': '📦', '.7z': '📦',
    '.exe': '⚙️', '.dll': '🔧',
    '.js': '🔶', '.ts': '🔷', '.tsx': '⚛️', '.jsx': '⚛️',
    '.html': '🌐', '.css': '🎨',
    '.xls': '📊', '.xlsx': '📊',
    '.pptx': '📽️', '.ppt': '📽️',
    '.env': '🔒',
  };
  return icons[ext] || '📄';
};
