/**
 * Serviço de carregamento de conteúdo Markdown real dos arquivos .md locais.
 * 
 * Usa import.meta.glob do Vite para mapear todos os arquivos .md da pasta docs/
 * e carregá-los como strings raw. Isso permite que o Document Hub exiba o conteúdo
 * real dos documentos oficiais, não apenas metadados.
 * 
 * Precedência:
 * 1. Conteúdo do Supabase (rascunho/publicado), se existir
 * 2. Conteúdo real do arquivo .md local (este serviço)
 * 3. null (documento sem conteúdo disponível)
 */

// Mapeia todos os arquivos .md sob docs/ como raw strings
const mdModules = import.meta.glob<string>('../docs/**/*.md', { query: '?raw', import: 'default', eager: true });

/**
 * Normaliza um path para a chave usada no glob.
 * O glob usa paths relativos ao diretório do serviço.
 */
const normalizeGlobKey = (path: string): string => {
  // Remove prefixo src/modules/central_padroes/ se existir
  let rel = path.replace(/^src\/modules\/central_padroes\//, '');
  // Garante que comece com ../
  if (!rel.startsWith('../')) {
    rel = '../' + rel.replace(/^\.?\//, '');
  }
  // Normaliza separadores
  return rel.replace(/\\/g, '/');
};

/**
 * Cache de paths normalizados para conteúdo.
 */
const contentCache = new Map<string, string | null>();

/**
 * Inicializa o cache com todos os paths disponíveis.
 */
const initCache = () => {
  if (contentCache.size > 0) return;
  for (const [key, loader] of Object.entries(mdModules)) {
    const normalized = key.replace(/\\/g, '/');
    contentCache.set(normalized, typeof loader === 'string' ? loader : null);
  }
};

export const centralPadroesMarkdownContentService = {
  /**
   * Retorna o conteúdo Markdown real para um path de arquivo.
   */
  getContentByPath(path: string): string | null {
    initCache();
    const key = normalizeGlobKey(path);
    // Tentativa direta
    const direct = contentCache.get(key);
    if (direct !== undefined) return direct;

    // Tentativa com variações de path
    const altKeys = [
      key,
      key.replace(/^\.\.\//, ''),
      '../' + key.replace(/^\.\.\//, ''),
      key.replace(/\/\//g, '/'),
    ];

    for (const alt of altKeys) {
      const found = contentCache.get(alt);
      if (found !== undefined) return found;
    }

    return null;
  },

  /**
   * Retorna o conteúdo para um documento, usando seus paths.
   */
  getContentForDocument(doc: { path?: string | null; pathRelative?: string | null; pathAbsolute?: string | null }): string | null {
    const paths = [doc.path, doc.pathRelative, doc.pathAbsolute].filter(Boolean) as string[];
    for (const p of paths) {
      const content = this.getContentByPath(p);
      if (content) return content;
    }
    return null;
  },

  /**
   * Verifica se o conteúdo Markdown está disponível para um path.
   */
  hasContent(path: string): boolean {
    return this.getContentByPath(path) !== null;
  },

  /**
   * Enriquece um documento com conteúdo real do filesystem.
   * Preserva conteúdo existente (Supabase) se já preenchido.
   */
  enrichWithContent<T extends { content?: string | null; path?: string | null; pathRelative?: string | null; pathAbsolute?: string | null }>(doc: T): T {
    if (doc.content?.trim()) return doc; // Já tem conteúdo (Supabase)
    const localContent = this.getContentForDocument(doc);
    if (localContent) {
      return { ...doc, content: localContent };
    }
    return doc;
  },

  /**
   * Lista todos os paths disponíveis no cache.
   */
  listAvailablePaths(): string[] {
    initCache();
    return Array.from(contentCache.keys());
  },
};
