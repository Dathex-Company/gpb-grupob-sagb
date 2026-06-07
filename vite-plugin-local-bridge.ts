/**
 * vite-plugin-local-bridge.ts
 * 
 * Bridge local para acesso ao filesystem Windows (Z:\)
 * Funciona exclusivamente em ambiente de desenvolvimento (npm run dev).
 * 
 * Endpoints:
 *   GET /api/local-fs/roots    → lista as raízes autorizadas
 *   GET /api/local-fs/list     → lista diretório
 *   GET /api/local-fs/read     → lê conteúdo de arquivo
 *   GET /api/local-fs/stat     → metadados de um caminho
 */
import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

// ─── RAÍZES AUTORIZADAS ────────────────────────────────
const ALLOWED_ROOTS: Record<string, string> = {
  '00_sagb':    'Z:/00_sagb',
  '01_empresasb': 'Z:/01_empresasb',
  '02_ventures':  'Z:/02_ventures',
  '03_metodos':   'Z:/03_metodos',
  '04_curadoria': 'Z:/04_curadoria',
};

const ALLOWED_ROOT_PATHS = Object.values(ALLOWED_ROOTS);

// ─── HELPERS ────────────────────────────────────────────
function parseQuery(url: string): Record<string, string> {
  const idx = url.indexOf('?');
  if (idx === -1) return {};
  const qs = url.slice(idx + 1);
  const result: Record<string, string> = {};
  qs.split('&').forEach((pair) => {
    const [k, v] = pair.split('=');
    if (k) result[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return result;
}

function isPathAllowed(targetPath: string): boolean {
  const normalized = targetPath.replace(/\\/g, '/').toLowerCase();
  return ALLOWED_ROOT_PATHS.some((root) => normalized.startsWith(root.replace(/\\/g, '/').toLowerCase()));
}

function mimeTypeForExt(ext: string): string {
  const mime: Record<string, string> = {
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.yml': 'text/yaml',
    '.yaml': 'text/yaml',
    '.csv': 'text/csv',
    '.log': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.ts': 'text/typescript',
    '.tsx': 'text/typescript',
    '.jsx': 'text/javascript',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.zip': 'application/zip',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };
  return mime[ext] || 'application/octet-stream';
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function sendError(res: ServerResponse, status: number, message: string) {
  sendJson(res, status, { error: message });
}

// ─── PLUGIN ─────────────────────────────────────────────
export function localBridgePlugin(): Plugin {
  return {
    name: 'vite-plugin-local-bridge',
    configureServer(server: ViteDevServer) {
      // ── GET /api/local-fs/roots ───────────────────────
      server.middlewares.use('/api/local-fs/roots', (_req: IncomingMessage, res: ServerResponse) => {
        const roots = Object.entries(ALLOWED_ROOTS).map(([name, rootPath]) => ({
          name,
          path: rootPath,
          label: name.replace(/^\d+_/, '').toUpperCase(),
        }));
        sendJson(res, 200, { roots });
      });

      // ── GET /api/local-fs/list?path=... ───────────────
      server.middlewares.use('/api/local-fs/list', async (req: IncomingMessage, res: ServerResponse) => {
        try {
          const query = parseQuery(req.url || '');
          const dirPath = query.path;
          if (!dirPath) return sendError(res, 400, 'Parâmetro "path" obrigatório.');
          if (!isPathAllowed(dirPath)) return sendError(res, 403, 'Acesso negado a este caminho.');

          const entries = await fs.readdir(dirPath, { withFileTypes: true });
          const items = (
            await Promise.all(
              entries
                .filter((e) => !e.name.startsWith('.') && e.name !== 'node_modules')
                .map(async (entry) => {
                  const fullPath = path.join(dirPath, entry.name);
                  try {
                    const stat = await fs.stat(fullPath);
                    return {
                      name: entry.name,
                      path: fullPath,
                      type: entry.isDirectory() ? 'directory' : 'file',
                      size: stat.size,
                      mtime: stat.mtime.toISOString(),
                      extension: entry.isDirectory() ? '' : path.extname(entry.name).toLowerCase(),
                    };
                  } catch {
                    return null;
                  }
                })
            )
          ).filter(Boolean);

          // Ordenar: diretórios primeiro, depois por nome
          items.sort((a: any, b: any) => {
            if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
            return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
          });

          sendJson(res, 200, { items, parentPath: path.dirname(dirPath) });
        } catch (err: any) {
          sendError(res, 500, err.message || 'Erro ao listar diretório.');
        }
      });

      // ── GET /api/local-fs/stat?path=... ──────────────
      server.middlewares.use('/api/local-fs/stat', async (req: IncomingMessage, res: ServerResponse) => {
        try {
          const query = parseQuery(req.url || '');
          const targetPath = query.path;
          if (!targetPath) return sendError(res, 400, 'Parâmetro "path" obrigatório.');
          if (!isPathAllowed(targetPath)) return sendError(res, 403, 'Acesso negado.');

          const stat = await fs.stat(targetPath);
          sendJson(res, 200, {
            name: path.basename(targetPath),
            path: targetPath,
            type: stat.isDirectory() ? 'directory' : 'file',
            size: stat.size,
            mtime: stat.mtime.toISOString(),
            extension: stat.isDirectory() ? '' : path.extname(targetPath).toLowerCase(),
          });
        } catch (err: any) {
          sendError(res, 500, err.message || 'Erro ao consultar caminho.');
        }
      });

      // ── GET /api/local-fs/read?path=... ──────────────
      server.middlewares.use('/api/local-fs/read', async (req: IncomingMessage, res: ServerResponse) => {
        try {
          const query = parseQuery(req.url || '');
          const filePath = query.path;
          if (!filePath) return sendError(res, 400, 'Parâmetro "path" obrigatório.');
          if (!isPathAllowed(filePath)) return sendError(res, 403, 'Acesso negado.');

          const ext = path.extname(filePath).toLowerCase();
          const textExts = new Set([
            '.txt', '.md', '.json', '.xml', '.yml', '.yaml', '.csv', '.log',
            '.html', '.css', '.js', '.ts', '.tsx', '.jsx', '.env', '.gitignore',
            '.ini', '.cfg', '.conf', '.toml', '.yaml', '.yml',
          ]);

          if (textExts.has(ext)) {
            // Arquivo texto: retorna conteúdo como texto
            const content = await fs.readFile(filePath, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(content);
          } else {
            // Arquivo binário: retorna base64
            const buffer = await fs.readFile(filePath);
            const base64 = buffer.toString('base64');
            sendJson(res, 200, {
              base64,
              mimeType: mimeTypeForExt(ext),
              size: buffer.length,
            });
          }
        } catch (err: any) {
          sendError(res, 500, err.message || 'Erro ao ler arquivo.');
        }
      });
    },
  };
}
