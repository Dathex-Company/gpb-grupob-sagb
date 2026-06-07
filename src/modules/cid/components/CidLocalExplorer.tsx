/**
 * CidLocalExplorer.tsx
 *
 * Explorador local moderno do CID.
 * Navega nas raízes Z:\ autorizadas pela bridge local do Vite.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LocalFileEntry,
  LocalRoot,
  fileIcon,
  getRoots,
  isLocalBridgeAvailable,
  listDir,
  readFile,
} from '../../../utils/localBridgeApi';

interface CidLocalExplorerProps {
  workspaceId?: string | null;
  rootFilter?: string;
  onImport?: (filePath: string, fileName: string) => void;
}

type ViewMode = 'dashboard' | 'browse' | 'preview';
type ExplorerPanel = 'files' | 'dashboard' | 'terminal' | 'copilot';

interface PreviewState {
  path: string;
  name: string;
  content: string | null;
  mimeType: string;
  isLoading: boolean;
}

const PREVIEWABLE_EXTS = new Set([
  '.txt', '.md', '.json', '.xml', '.yml', '.yaml', '.csv', '.log', '.html', '.css', '.js', '.ts', '.tsx', '.jsx', '.env', '.gitignore', '.ini', '.cfg', '.conf', '.toml',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.pdf',
]);

const TEXT_EXTS = new Set([
  '.txt', '.md', '.json', '.xml', '.yml', '.yaml', '.csv', '.log', '.html', '.css', '.js', '.ts', '.tsx', '.jsx', '.env', '.gitignore', '.ini', '.cfg', '.conf', '.toml',
]);

const ROOT_SKIN: Record<string, { icon: string; title: string; subtitle: string; accent: string }> = {
  '00_sagb': { icon: '🧠', title: 'SagB Core', subtitle: 'Sistema, módulos e documentação operacional', accent: 'from-indigo-500 to-blue-500' },
  '01_empresasb': { icon: '🏢', title: 'Empresas B', subtitle: 'Clientes, empresas, dossiês e materiais comerciais', accent: 'from-cyan-500 to-blue-500' },
  '02_ventures': { icon: '🚀', title: 'Ventures', subtitle: 'Novos negócios, ativos e projetos em evolução', accent: 'from-fuchsia-500 to-violet-500' },
  '03_metodos': { icon: '📋', title: 'Métodos', subtitle: 'Playbooks, frameworks, métodos e inteligência operacional', accent: 'from-amber-500 to-orange-500' },
  '04_curadoria': { icon: '🎯', title: 'Curadoria', subtitle: 'Referências, insumos, pesquisas e materiais brutos', accent: 'from-emerald-500 to-teal-500' },
};

const formatBytes = (bytes: number): string => {
  if (!bytes || bytes === 0) return '-';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let size = bytes / 1024;
  let unitIdx = 0;
  while (size >= 1024 && unitIdx < units.length - 1) { size /= 1024; unitIdx++; }
  return `${size.toFixed(size >= 100 ? 0 : 1)} ${units[unitIdx]}`;
};

const fmtDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
};

const rootNameFromSidebarKey = (value?: string) => String(value || '').replace(/^local_/, '');

const extensionLabel = (extension: string) => extension || 'sem extensão';

const CidLocalExplorer: React.FC<CidLocalExplorerProps> = ({ rootFilter, onImport }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [roots, setRoots] = useState<LocalRoot[]>([]);
  const [currentRoot, setCurrentRoot] = useState<LocalRoot | null>(null);
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState<LocalFileEntry[]>([]);
  const [parentPath, setParentPath] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [bridgeAvailable, setBridgeAvailable] = useState<boolean | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [activePanel, setActivePanel] = useState<ExplorerPanel>('files');
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [terminalInput, setTerminalInput] = useState('/stats');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'CID Terminal pronto. Comandos: /stats, /tree, /types, /largest, /recent, /import pdf, /clear',
  ]);

  const [rootStats, setRootStats] = useState<Record<string, { folders: number; files: number; bytes: number; lastModified: string }>>({});
  const [isScanningAll, setIsScanningAll] = useState(false);

  const navigateTo = useCallback(async (dirPath: string, root?: LocalRoot) => {
    setIsLoading(true);
    setError('');
    setPreview(null);
    try {
      const result = await listDir(dirPath);
      setItems(result.items);
      setParentPath(result.parentPath);
      setCurrentPath(dirPath);
      setSearchQuery('');
      setSelectedPaths(new Set());
      if (root) setCurrentRoot(root);
      setViewMode('browse');
    } catch (err: any) {
      setError(err.message || 'Erro ao listar diretório.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scanAllRoots = useCallback(async (allRoots: LocalRoot[]) => {
    setIsScanningAll(true);
    const statsMap: Record<string, { folders: number; files: number; bytes: number; lastModified: string }> = {};
    for (const root of allRoots) {
      try {
        const result = await listDir(root.path);
        const folders = result.items.filter((i: LocalFileEntry) => i.type === 'directory').length;
        const files = result.items.filter((i: LocalFileEntry) => i.type === 'file').length;
        const bytes = result.items.reduce((sum: number, i: LocalFileEntry) => sum + (i.type === 'file' ? Number(i.size || 0) : 0), 0);
        const sorted = [...result.items].sort((a: LocalFileEntry, b: LocalFileEntry) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime());
        statsMap[root.name] = { folders, files, bytes, lastModified: sorted[0]?.mtime || '' };
      } catch {
        statsMap[root.name] = { folders: 0, files: 0, bytes: 0, lastModified: '' };
      }
    }
    setRootStats(statsMap);
    setIsScanningAll(false);
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const available = await isLocalBridgeAvailable();
      setBridgeAvailable(available);
      if (!available) {
        setIsLoading(false);
        return;
      }

      try {
        const allRoots = await getRoots();
        setRoots(allRoots);
        const normalizedRootName = rootNameFromSidebarKey(rootFilter);

        if (normalizedRootName && allRoots.find((r) => r.name === normalizedRootName)) {
          const selected = allRoots.find((r) => r.name === normalizedRootName)!;
          await navigateTo(selected.path, selected);
        } else {
          // Sem rootFilter — mostra o mega dashboard geral
          setViewMode('dashboard');
          scanAllRoots(allRoots);
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao inicializar explorador local.');
        setIsLoading(false);
      }
    })();
  }, [rootFilter, navigateTo, scanAllRoots]);

  const globalStats = useMemo(() => {
    const entries = Object.values(rootStats);
    return {
      folders: entries.reduce((s, r) => s + r.folders, 0),
      files: entries.reduce((s, r) => s + r.files, 0),
      bytes: entries.reduce((s, r) => s + r.bytes, 0),
      roots: roots.length,
      lastModified: entries.map((r) => r.lastModified).filter(Boolean).sort().reverse()[0] || '',
    };
  }, [rootStats, roots.length]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q) || item.path.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const stats = useMemo(() => {
    const folders = items.filter((item) => item.type === 'directory').length;
    const files = items.filter((item) => item.type === 'file').length;
    const bytes = items.reduce((sum, item) => sum + (item.type === 'file' ? Number(item.size || 0) : 0), 0);
    const processable = items.filter((item) => item.type === 'file' && ['.pdf', '.doc', '.docx', '.txt', '.md', '.mp3', '.wav', '.mp4', '.webm'].includes(item.extension)).length;
    const lastModified = [...items].sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime())[0]?.mtime || '';
    return { folders, files, bytes, processable, lastModified };
  }, [items]);

  const fileItems = useMemo(() => items.filter((item) => item.type === 'file'), [items]);

  const selectedFiles = useMemo(() => fileItems.filter((item) => selectedPaths.has(item.path)), [fileItems, selectedPaths]);

  const extensionStats = useMemo(() => {
    const map = new Map<string, { extension: string; count: number; bytes: number }>();
    for (const item of fileItems) {
      const key = extensionLabel(item.extension);
      const current = map.get(key) || { extension: key, count: 0, bytes: 0 };
      current.count += 1;
      current.bytes += Number(item.size || 0);
      map.set(key, current);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [fileItems]);

  const largestFiles = useMemo(() => [...fileItems].sort((a, b) => Number(b.size || 0) - Number(a.size || 0)).slice(0, 8), [fileItems]);

  const recentFiles = useMemo(() => [...fileItems].sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime()).slice(0, 8), [fileItems]);

  const pathSegments = useMemo(() => {
    if (!currentRoot) return [];
    const relative = currentPath.replace(currentRoot.path, '').replace(/\\/g, '/').split('/').filter(Boolean);
    return relative;
  }, [currentPath, currentRoot]);

  const goToDashboard = useCallback(() => {
    setViewMode('dashboard');
    setCurrentRoot(null);
    setCurrentPath('');
    setItems([]);
    setPreview(null);
    setSearchQuery('');
    setSelectedPaths(new Set());
    if (roots.length > 0) scanAllRoots(roots);
  }, [roots, scanAllRoots]);

  const goUp = useCallback(() => {
    if (!currentRoot) return;
    if (!parentPath || parentPath === currentPath) return;
    if (!parentPath.replace(/\\/g, '/').toLowerCase().startsWith(currentRoot.path.replace(/\\/g, '/').toLowerCase())) return;
    navigateTo(parentPath, currentRoot);
  }, [currentRoot, currentPath, parentPath, navigateTo]);

  const openPreview = useCallback(async (entry: LocalFileEntry) => {
    setPreview({ path: entry.path, name: entry.name, content: null, mimeType: '', isLoading: true });
    setViewMode('preview');
    try {
      const result = await readFile(entry.path);
      if (typeof result === 'string') {
        setPreview({ path: entry.path, name: entry.name, content: result, mimeType: 'text/plain', isLoading: false });
      } else {
        const dataUri = `data:${result.mimeType};base64,${result.base64}`;
        setPreview({ path: entry.path, name: entry.name, content: dataUri, mimeType: result.mimeType, isLoading: false });
      }
    } catch (err: any) {
      setPreview({ path: entry.path, name: entry.name, content: `Erro: ${err.message}`, mimeType: 'text/plain', isLoading: false });
    }
  }, []);

  const handleEntryClick = (entry: LocalFileEntry) => {
    if (entry.type === 'directory') {
      navigateTo(entry.path, currentRoot || undefined);
      return;
    }
    if (PREVIEWABLE_EXTS.has(entry.extension)) openPreview(entry);
  };

  const toggleSelected = useCallback((entry: LocalFileEntry) => {
    if (entry.type !== 'file') return;
    setSelectedPaths((current) => {
      const next = new Set(current);
      if (next.has(entry.path)) next.delete(entry.path);
      else next.add(entry.path);
      return next;
    });
  }, []);

  const selectAllFiles = useCallback(() => {
    setSelectedPaths(new Set(filteredItems.filter((item) => item.type === 'file').map((item) => item.path)));
  }, [filteredItems]);

  const clearSelection = useCallback(() => setSelectedPaths(new Set()), []);

  const importSelected = useCallback(() => {
    selectedFiles.forEach((entry) => onImport?.(entry.path, entry.name));
    setTerminalOutput((current) => [`Importação em lote enviada: ${selectedFiles.length} arquivo(s).`, ...current].slice(0, 24));
  }, [onImport, selectedFiles]);

  const runTerminalCommand = useCallback(() => {
    const command = terminalInput.trim().toLowerCase();
    const lines: string[] = [];
    if (!command) return;

    if (command === '/clear') {
      setTerminalOutput([]);
      return;
    }

    if (command === '/stats') {
      lines.push(`Pasta atual: ${currentPath || '-'}`);
      lines.push(`Pastas: ${stats.folders} | Arquivos: ${stats.files} | Volume: ${formatBytes(stats.bytes)} | Processáveis: ${stats.processable}`);
    } else if (command === '/tree') {
      lines.push(`Árvore imediata de ${currentRoot?.name || 'local'}:`);
      items.slice(0, 40).forEach((item) => lines.push(`${item.type === 'directory' ? '📁' : '📄'} ${item.name}`));
      if (items.length > 40) lines.push(`... +${items.length - 40} item(ns)`);
    } else if (command === '/types') {
      lines.push('Distribuição por tipo:');
      extensionStats.forEach((stat) => lines.push(`${stat.extension}: ${stat.count} arquivo(s), ${formatBytes(stat.bytes)}`));
    } else if (command === '/largest') {
      lines.push('Maiores arquivos:');
      largestFiles.forEach((item) => lines.push(`${formatBytes(item.size)} — ${item.name}`));
    } else if (command === '/recent') {
      lines.push('Arquivos recentes:');
      recentFiles.forEach((item) => lines.push(`${fmtDate(item.mtime)} — ${item.name}`));
    } else if (command.startsWith('/import ')) {
      const ext = command.replace('/import ', '').trim().replace(/^\./, '');
      const matches = fileItems.filter((item) => item.extension.replace(/^\./, '') === ext);
      matches.forEach((item) => onImport?.(item.path, item.name));
      lines.push(`Importação enviada para ${matches.length} arquivo(s) .${ext}.`);
    } else {
      lines.push(`Comando não reconhecido: ${terminalInput}`);
      lines.push('Use: /stats, /tree, /types, /largest, /recent, /import pdf, /clear');
    }

    setTerminalOutput((current) => [`> ${terminalInput}`, ...lines, ...current].slice(0, 40));
  }, [currentPath, currentRoot?.name, extensionStats, fileItems, items, largestFiles, onImport, recentFiles, stats, terminalInput]);

  if (bridgeAvailable === false) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="max-w-md text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="text-5xl mb-4">🔌</div>
          <h2 className="text-lg font-black text-slate-900">Bridge local indisponível</h2>
          <p className="text-sm text-slate-500 mt-2">Rode o SagB em ambiente local com npm run dev na porta 7000.</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'dashboard') {
    return (
      <div className="h-full flex flex-col overflow-auto bg-slate-100">
        {/* Header impactante */}
        <div className="shrink-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white px-6 md:px-10 pt-8 pb-10 shadow-lg">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-indigo-300/80">CID Local Workspace</p>
              <h1 className="text-3xl md:text-4xl font-black mt-1 leading-tight">Explorador de Arquivos</h1>
              <p className="text-sm text-indigo-200/80 mt-2 max-w-xl">Navegue, visualize e importe documentos das raízes autorizadas do ambiente local.</p>
            </div>
            <div className="hidden md:grid grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-center border border-white/10">
                <p className="text-2xl font-black">{globalStats.roots}</p>
                <p className="text-[9px] uppercase font-bold text-indigo-300 mt-0.5">raízes</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-center border border-white/10">
                <p className="text-2xl font-black">{globalStats.folders}</p>
                <p className="text-[9px] uppercase font-bold text-indigo-300 mt-0.5">pastas</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-center border border-white/10">
                <p className="text-2xl font-black">{globalStats.files}</p>
                <p className="text-[9px] uppercase font-bold text-indigo-300 mt-0.5">arquivos</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-center border border-white/10">
                <p className="text-2xl font-black">{formatBytes(globalStats.bytes)}</p>
                <p className="text-[9px] uppercase font-bold text-indigo-300 mt-0.5">volume</p>
              </div>
            </div>
          </div>
          {globalStats.lastModified && (
            <p className="text-[11px] text-indigo-300/60 mt-4">Última atividade: {fmtDate(globalStats.lastModified)}</p>
          )}
        </div>

        {/* Cards de raízes */}
        <div className="flex-1 p-6 md:p-10">
          {isScanningAll ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {roots.map((root) => (
                <div key={root.name} className="h-48 rounded-[2rem] bg-white border border-slate-200 animate-pulse p-6 flex flex-col justify-end">
                  <div className="h-4 w-24 bg-slate-200 rounded-full" />
                  <div className="h-3 w-40 bg-slate-100 rounded-full mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roots.map((root) => {
                  const skin = ROOT_SKIN[root.name] || ROOT_SKIN['00_sagb'];
                  const rStats = rootStats[root.name] || { folders: 0, files: 0, bytes: 0, lastModified: '' };
                  return (
                    <button key={root.name} onClick={() => navigateTo(root.path, root)}
                      className="group text-left rounded-[2rem] bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/60 transition-all overflow-hidden flex flex-col">
                      {/* Topo com gradiente */}
                      <div className={`bg-gradient-to-r ${skin.accent} px-6 pt-5 pb-4`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-lg">{skin.icon}</div>
                          <div className="min-w-0">
                            <h3 className="text-white font-black truncate text-sm">{skin.title}</h3>
                            <p className="text-[10px] text-white/70 truncate">{root.name}</p>
                          </div>
                        </div>
                      </div>
                      {/* Corpo */}
                      <div className="flex-1 px-6 py-4 space-y-3">
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{skin.subtitle}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="font-black text-slate-800">{rStats.folders} <span className="font-normal text-slate-400">pastas</span></span>
                          <span className="font-black text-slate-800">{rStats.files} <span className="font-normal text-slate-400">arquivos</span></span>
                          <span className="font-black text-slate-800">{formatBytes(rStats.bytes)}</span>
                        </div>
                        {rStats.lastModified && <p className="text-[10px] text-slate-400">última alteração: {fmtDate(rStats.lastModified)}</p>}
                      </div>
                      {/* Rodapé */}
                      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">{root.path}</span>
                        <span className="text-xs font-black text-indigo-600 group-hover:translate-x-1 transition-transform">Explorar →</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Dica rápida */}
              <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-6 py-4 flex items-center gap-3 text-xs text-indigo-700">
                <span className="text-lg">💡</span>
                <span className="font-semibold">Clique em qualquer raiz para navegar. Use o terminal (<code className="bg-indigo-100 px-1.5 py-0.5 rounded text-[10px]">/stats</code>) para análise aprofundada.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === 'preview' && preview) {
    const isImage = preview.mimeType.startsWith('image/');
    const isPdf = preview.mimeType === 'application/pdf';
    const isText = (preview.mimeType.startsWith('text/') || TEXT_EXTS.has(`.${preview.name.split('.').pop()}`)) && preview.content && !preview.content.startsWith('data:');

    return (
      <div className="h-full flex flex-col bg-slate-950 text-white overflow-hidden">
        <div className="h-16 shrink-0 px-5 flex items-center justify-between border-b border-white/10 bg-slate-950/95 backdrop-blur">
          <div className="min-w-0 flex items-center gap-3">
            <button onClick={() => setViewMode('browse')} className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold transition-colors">← Voltar</button>
            <div className="min-w-0">
              <p className="text-sm font-black truncate">{preview.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{preview.path}</p>
            </div>
          </div>
          <button onClick={() => onImport?.(preview.path, preview.name)} className="h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-xs font-black transition-colors">Importar para CID</button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {preview.isLoading ? (
            <div className="h-full flex items-center justify-center text-slate-400">Carregando preview...</div>
          ) : isImage ? (
            <div className="h-full flex items-center justify-center"><img src={preview.content!} alt={preview.name} className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain" /></div>
          ) : isPdf ? (
            <iframe src={preview.content!} title={preview.name} className="w-full h-[82vh] rounded-2xl bg-white border border-white/10" />
          ) : isText ? (
            <pre className="max-w-6xl mx-auto whitespace-pre-wrap text-xs leading-6 text-slate-100 bg-slate-900 border border-white/10 rounded-2xl p-5 overflow-auto">{preview.content}</pre>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md">
                <div className="text-5xl mb-4">📦</div>
                <h2 className="font-black">Preview não disponível</h2>
                <p className="text-sm text-slate-400 mt-2">Tipo detectado: {preview.mimeType || 'desconhecido'}</p>
                <button onClick={() => onImport?.(preview.path, preview.name)} className="mt-5 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-xs font-black">Importar mesmo assim</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const skin = currentRoot ? ROOT_SKIN[currentRoot.name] || ROOT_SKIN['00_sagb'] : ROOT_SKIN['00_sagb'];
  const canGoUp = Boolean(currentRoot && parentPath && parentPath !== currentPath && parentPath.replace(/\\/g, '/').toLowerCase().startsWith(currentRoot.path.replace(/\\/g, '/').toLowerCase()));

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-100">
      <div className={`shrink-0 bg-gradient-to-r ${skin.accent} text-white px-5 pt-5 pb-4 shadow-sm`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/18 backdrop-blur flex items-center justify-center text-2xl shadow-inner">{skin.icon}</div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] font-black text-white/70">CID Local Workspace</p>
              <h1 className="text-xl font-black truncate">{skin.title}</h1>
              <p className="text-xs text-white/80 truncate mt-0.5">{skin.subtitle}</p>
              <p className="inline-flex mt-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">MEGA EXPLORER v2 ativo</p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/15 px-4 py-2"><p className="text-lg font-black">{stats.folders}</p><p className="text-[9px] uppercase font-bold text-white/70">pastas</p></div>
            <div className="rounded-2xl bg-white/15 px-4 py-2"><p className="text-lg font-black">{stats.files}</p><p className="text-[9px] uppercase font-bold text-white/70">arquivos</p></div>
            <div className="rounded-2xl bg-white/15 px-4 py-2"><p className="text-lg font-black">{formatBytes(stats.bytes)}</p><p className="text-[9px] uppercase font-bold text-white/70">volume</p></div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 py-3 bg-white border-b border-slate-200 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs min-w-0">
          <button onClick={goToDashboard} className="font-black text-slate-700 hover:text-indigo-600 transition-colors">Local</button>
          {currentRoot && <><span className="text-slate-300">/</span><button onClick={() => navigateTo(currentRoot.path, currentRoot)} className="font-black text-slate-700 hover:text-indigo-600 transition-colors">{currentRoot.name}</button></>}
          {pathSegments.map((segment, index) => (
            <React.Fragment key={`${segment}-${index}`}>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-500 truncate max-w-[150px]">{segment}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button disabled={!canGoUp} onClick={goUp} className="h-10 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-xs font-black text-slate-700 transition-colors">↑ Subir</button>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Buscar nesta pasta por nome ou caminho..." className="w-full h-10 rounded-2xl bg-slate-100 border border-slate-200 pl-9 pr-3 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white transition-colors" />
          </div>
          {selectedFiles.length > 0 && (
            <button onClick={importSelected} className="h-10 px-4 rounded-2xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition-colors">
              Importar {selectedFiles.length}
            </button>
          )}
          <button onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')} className="h-10 px-3 rounded-2xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors">{layout === 'grid' ? 'Lista' : 'Cards'}</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['files', 'dashboard', 'terminal', 'copilot'] as ExplorerPanel[]).map((panel) => (
            <button key={panel} onClick={() => setActivePanel(panel)}
              className={`h-8 px-3 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${activePanel === panel ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {panel === 'files' ? 'Arquivos' : panel === 'dashboard' ? 'Dashboard' : panel === 'terminal' ? 'Terminal' : 'Copilot'}
            </button>
          ))}
          <div className="flex-1" />
          <button onClick={selectAllFiles} className="h-8 px-3 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-slate-200 transition-colors">Selecionar arquivos</button>
          <button onClick={clearSelection} className="h-8 px-3 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-slate-200 transition-colors">Limpar</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => <div key={index} className="h-32 rounded-3xl bg-white border border-slate-200 animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center"><div className="bg-white border border-red-200 text-red-700 rounded-3xl p-8 text-center max-w-lg"><h2 className="font-black">Erro ao abrir pasta</h2><p className="text-sm mt-2">{error}</p></div></div>
        ) : activePanel === 'dashboard' ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="rounded-3xl bg-white border border-slate-200 p-5"><p className="text-[10px] font-black uppercase text-slate-400">Pastas</p><p className="text-3xl font-black text-slate-900 mt-2">{stats.folders}</p></div>
              <div className="rounded-3xl bg-white border border-slate-200 p-5"><p className="text-[10px] font-black uppercase text-slate-400">Arquivos</p><p className="text-3xl font-black text-slate-900 mt-2">{stats.files}</p></div>
              <div className="rounded-3xl bg-white border border-slate-200 p-5"><p className="text-[10px] font-black uppercase text-slate-400">Volume</p><p className="text-3xl font-black text-slate-900 mt-2">{formatBytes(stats.bytes)}</p></div>
              <div className="rounded-3xl bg-white border border-slate-200 p-5"><p className="text-[10px] font-black uppercase text-slate-400">Processáveis</p><p className="text-3xl font-black text-indigo-600 mt-2">{stats.processable}</p></div>
              <div className="rounded-3xl bg-white border border-slate-200 p-5"><p className="text-[10px] font-black uppercase text-slate-400">Última alteração</p><p className="text-sm font-black text-slate-900 mt-3">{stats.lastModified ? fmtDate(stats.lastModified) : '-'}</p></div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="rounded-3xl bg-white border border-slate-200 p-5">
                <h3 className="text-sm font-black text-slate-900 mb-4">Distribuição por tipo</h3>
                <div className="space-y-3">
                  {extensionStats.slice(0, 10).map((stat) => (
                    <div key={stat.extension}>
                      <div className="flex justify-between text-xs font-bold text-slate-600"><span>{stat.extension}</span><span>{stat.count}</span></div>
                      <div className="h-2 rounded-full bg-slate-100 mt-1 overflow-hidden"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.max(8, (stat.count / Math.max(1, stats.files)) * 100)}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-white border border-slate-200 p-5">
                <h3 className="text-sm font-black text-slate-900 mb-4">Maiores arquivos</h3>
                <div className="space-y-2">{largestFiles.map((item) => <div key={item.path} className="flex items-center justify-between gap-3 text-xs"><span className="font-bold text-slate-700 truncate">{item.name}</span><span className="font-black text-slate-400">{formatBytes(item.size)}</span></div>)}</div>
              </div>
              <div className="rounded-3xl bg-white border border-slate-200 p-5">
                <h3 className="text-sm font-black text-slate-900 mb-4">Mais recentes</h3>
                <div className="space-y-2">{recentFiles.map((item) => <div key={item.path} className="text-xs"><p className="font-bold text-slate-700 truncate">{item.name}</p><p className="text-[10px] text-slate-400">{fmtDate(item.mtime)}</p></div>)}</div>
              </div>
            </div>
          </div>
        ) : activePanel === 'terminal' ? (
          <div className="rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between"><h3 className="text-sm font-black">CID Terminal Visual</h3><span className="text-[10px] text-slate-500">diretório atual</span></div>
            <div className="p-5 space-y-3 max-h-[55vh] overflow-auto font-mono text-xs">
              {terminalOutput.map((line, index) => <p key={`${line}-${index}`} className={line.startsWith('>') ? 'text-indigo-300' : 'text-slate-300'}>{line}</p>)}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') runTerminalCommand(); }} className="flex-1 h-11 rounded-2xl bg-white/10 border border-white/10 px-4 outline-none text-sm text-white placeholder:text-slate-500" placeholder="/stats" />
              <button onClick={runTerminalCommand} className="h-11 px-5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-xs font-black transition-colors">Executar</button>
            </div>
          </div>
        ) : activePanel === 'copilot' ? (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-2xl rounded-[2rem] bg-white border border-slate-200 p-8 text-center shadow-sm">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-xl font-black text-slate-900">CID Copilot operacional</h2>
              <p className="text-sm text-slate-500 mt-3 leading-6">Estrutura preparada para a próxima frente: perguntas sobre a pasta atual, resumo operacional de arquivos, sugestão de tags e comandos seguros de ingestão. Esta aba ainda não chama IA para evitar uso acidental antes da aprovação do prompt de fronteira.</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-900">Perguntar</p><p className="text-[11px] text-slate-500 mt-1">"O que existe nesta pasta?"</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-900">Triar</p><p className="text-[11px] text-slate-500 mt-1">sugerir arquivos importáveis</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-900">Preparar</p><p className="text-[11px] text-slate-500 mt-1">tags, tipos e metadados</p></div>
              </div>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-full flex items-center justify-center"><div className="text-center"><div className="text-6xl mb-4">🗂️</div><h2 className="text-lg font-black text-slate-800">Nada encontrado aqui</h2><p className="text-sm text-slate-500 mt-1">Tente outra pasta ou ajuste o filtro.</p></div></div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredItems.map((entry) => {
              const isFolder = entry.type === 'directory';
              return (
                <button key={entry.path} onClick={() => handleEntryClick(entry)} className={`group text-left rounded-3xl bg-white border ${selectedPaths.has(entry.path) ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'} hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60 transition-all p-4 min-h-[150px] flex flex-col ${isFolder ? 'cursor-pointer' : PREVIEWABLE_EXTS.has(entry.extension) ? 'cursor-pointer' : 'cursor-default'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isFolder ? 'bg-amber-50' : 'bg-slate-100'}`}>{isFolder ? '📁' : fileIcon(entry.extension)}</div>
                    <div className="flex items-center gap-2">
                      {entry.type === 'file' && <span onClick={(event) => { event.stopPropagation(); toggleSelected(entry); }} className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black ${selectedPaths.has(entry.path) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>{selectedPaths.has(entry.path) ? '✓' : '+'}</span>}
                      <span className={`text-[9px] font-black uppercase rounded-full px-2 py-1 ${isFolder ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{isFolder ? 'Pasta' : entry.extension || 'arquivo'}</span>
                    </div>
                  </div>
                  <div className="mt-4 min-w-0 flex-1">
                    <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2 break-words">{entry.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-2 truncate">{entry.path}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500">{isFolder ? 'Abrir pasta' : formatBytes(entry.size)}</span>
                    {entry.type === 'file' ? <span onClick={(event) => { event.stopPropagation(); onImport?.(entry.path, entry.name); }} className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full px-3 py-1 transition-colors">Importar</span> : <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">→</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-[1fr_110px_140px_90px] gap-3 px-4 py-3 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <span>Nome</span><span>Tamanho</span><span>Modificado</span><span>Ação</span>
            </div>
            {filteredItems.map((entry) => (
                <div key={entry.path} onClick={() => handleEntryClick(entry)} className={`grid grid-cols-[1fr_110px_140px_90px] gap-3 px-4 py-3 border-t border-slate-100 hover:bg-indigo-50/40 cursor-pointer transition-colors items-center ${selectedPaths.has(entry.path) ? 'bg-indigo-50/70' : ''}`}>
                <div className="min-w-0 flex items-center gap-3">{entry.type === 'file' && <span onClick={(event) => { event.stopPropagation(); toggleSelected(entry); }} className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black ${selectedPaths.has(entry.path) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>{selectedPaths.has(entry.path) ? '✓' : '+'}</span>}<span className="text-xl">{entry.type === 'directory' ? '📁' : fileIcon(entry.extension)}</span><div className="min-w-0"><p className="text-sm font-black text-slate-900 truncate">{entry.name}</p><p className="text-[11px] text-slate-400 truncate">{entry.path}</p></div></div>
                <span className="text-xs font-bold text-slate-500">{entry.type === 'directory' ? '-' : formatBytes(entry.size)}</span>
                <span className="text-xs text-slate-500">{fmtDate(entry.mtime)}</span>
                {entry.type === 'file' ? <button onClick={(event) => { event.stopPropagation(); onImport?.(entry.path, entry.name); }} className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full px-3 py-1 transition-colors">Importar</button> : <span className="text-xs font-bold text-slate-400">Abrir</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CidLocalExplorer;
