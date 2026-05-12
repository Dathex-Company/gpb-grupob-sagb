// ============================================================================
// doc_nlp_adapter.ts — Ponte de Leitura Semântica (TipTap JSONB → Plain Text)
// ET D16 — IA Contextual e Interação Inteligente com Documentos
// ============================================================================
// Consome content_json (DocContentInput[]) dos documentos vinculados a tarefas
// e compila para texto plano limpo, pronto para injeção em prompts de IA.
// ============================================================================

import { docService } from './doc_service';
import type { DocContentInput, DocContentInline, EntityLinkType } from '../types/doc_types';

// ─── Constantes ─────────────────────────────────────────────────────────────

/** Limite de caracteres para payload único enviado à IA (Gemini). */
const DEFAULT_PAYLOAD_LIMIT = 48_000;

/** Limite de caracteres para chunking (documentos muito longos). */
const CHUNK_SIZE = 40_000;

/** Tamanho do overlap entre chunks para manter contexto. */
const CHUNK_OVERLAP = 1_000;

// ─── Tipos Exportados ───────────────────────────────────────────────────────

export interface CompiledDocument {
  nodeId: string;
  title: string;
  plainText: string;
  charCount: number;
  truncated: boolean;
  chunkCount: number;
}

export interface CompiledDocumentChunk {
  nodeId: string;
  title: string;
  chunkIndex: number;
  totalChunks: number;
  text: string;
  charCount: number;
}

export interface LinkedDocsContext {
  docs: CompiledDocument[];
  combinedText: string;
  totalCharCount: number;
  truncated: boolean;
}

// ─── Compilação TipTap → Plain Text ─────────────────────────────────────────

/**
 * Extrai o texto inline de um bloco, lidando com marks (bold, italic, etc.).
 * Retorna apenas o texto puro, sem notação de marcação.
 */
function extractInlineText(content: DocContentInline[] | undefined): string {
  if (!content || content.length === 0) return '';
  return content
    .map((c) => c.text || '')
    .join('')
    .trim();
}

/**
 * Compila um único bloco TipTap para sua representação em plain text
 * com formatação markdown-like (para contexto de IA).
 */
function compileBlock(block: DocContentInput): string {
  const text = extractInlineText(block.content);

  switch (block.blockType) {
    case 'heading': {
      const level = (block.attrs?.level as number) || 1;
      const prefix = '#'.repeat(Math.min(level, 6));
      return `${prefix} ${text}\n`;
    }

    case 'bulletList': {
      if (!text) return '';
      return `- ${text}\n`;
    }

    case 'orderedList': {
      // O número da ordenação será adicionado na compilação geral
      if (!text) return '';
      return `- ${text}\n`; // placeholder, reordenamos pós-processo
    }

    case 'checkList': {
      const checked = Boolean(block.attrs?.checked);
      const checkbox = checked ? '[x]' : '[ ]';
      return `${checkbox} ${text}\n`;
    }

    case 'blockquote': {
      if (!text) return '';
      return `> ${text}\n`;
    }

    case 'codeBlock': {
      const language = (block.attrs?.language as string) || '';
      const langTag = language ? `${language}` : '';
      return `\`\`\`${langTag}\n${text}\n\`\`\`\n`;
    }

    case 'divider': {
      return `---\n`;
    }

    case 'image': {
      const alt = (block.attrs?.alt as string) || (block.attrs?.src as string) || 'imagem';
      return `[Imagem: ${alt}]\n`;
    }

    case 'paragraph':
    default: {
      return `${text}\n`;
    }
  }
}

/**
 * Reordena itens de lista ordenada (numbered lists).
 * Detecta blocos orderedList consecutivos e adiciona numeração.
 */
function renumberOrderedLists(blocks: DocContentInput[]): string {
  const lines: string[] = [];
  let orderedCounter = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const text = extractInlineText(block.content);

    if (block.blockType === 'orderedList' && text) {
      orderedCounter++;
      lines.push(`${orderedCounter}. ${text}`);
    } else {
      // Reset counter when leaving ordered list
      if (orderedCounter > 0) {
        orderedCounter = 0;
      }
      // Re-compile non-ordered blocks normally
      if (block.blockType !== 'orderedList') {
        lines.push(compileBlock(block).trimEnd());
      }
    }
  }

  return lines.join('\n');
}

// ─── API Pública ────────────────────────────────────────────────────────────

/**
 * Compila o conteúdo de um documento (todos os blocos TipTap) para texto plano.
 *
 * @param nodeId - ID do nó do documento
 * @param payloadLimit - Limite máximo de caracteres (default: 48k)
 * @returns CompiledDocument com o texto compilado e metadados
 */
export async function compileDocContent(
  nodeId: string,
  payloadLimit: number = DEFAULT_PAYLOAD_LIMIT
): Promise<CompiledDocument> {
  // Carrega os blocos de conteúdo do documento
  const contents = await docService.loadContents(nodeId);

  // Carrega metadados do nó (título)
  const node = await docService.getNodeById(nodeId);
  const title = node?.title || 'Documento sem título';

  if (!contents || contents.length === 0) {
    return {
      nodeId,
      title,
      plainText: '',
      charCount: 0,
      truncated: false,
      chunkCount: 0,
    };
  }

  // Ordena por sortOrder
  const sorted = [...contents].sort((a, b) => a.sortOrder - b.sortOrder);

  // Compila blocos com reordenação de listas ordenadas
  let rawText = renumberOrderedLists(sorted);

  // Normaliza espaçamento (remove linhas em branco excessivas)
  rawText = rawText.replace(/\n{3,}/g, '\n\n').trim();

  const charCount = rawText.length;
  const truncated = charCount > payloadLimit;

  // Trunca se necessário
  if (truncated) {
    rawText = rawText.slice(0, payloadLimit) + '\n\n[CONTEÚDO TRUNCADO — o documento excede o limite de caracteres.]';
  }

  // Calcula número de chunks
  const chunkCount = Math.max(1, Math.ceil(charCount / CHUNK_SIZE));

  return {
    nodeId,
    title,
    plainText: rawText,
    charCount,
    truncated,
    chunkCount,
  };
}

/**
 * Divide um documento longo em chunks para processamento incremental.
 *
 * @param nodeId - ID do nó do documento
 * @returns Array de CompiledDocumentChunk
 */
export async function compileDocContentChunks(nodeId: string): Promise<CompiledDocumentChunk[]> {
  const contents = await docService.loadContents(nodeId);
  const node = await docService.getNodeById(nodeId);
  const title = node?.title || 'Documento sem título';

  if (!contents || contents.length === 0) {
    return [];
  }

  const sorted = [...contents].sort((a, b) => a.sortOrder - b.sortOrder);
  const fullText = renumberOrderedLists(sorted).replace(/\n{3,}/g, '\n\n').trim();

  if (fullText.length <= CHUNK_SIZE) {
    return [
      {
        nodeId,
        title,
        chunkIndex: 0,
        totalChunks: 1,
        text: fullText,
        charCount: fullText.length,
      },
    ];
  }

  // Divide em chunks com overlap
  const chunks: CompiledDocumentChunk[] = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < fullText.length) {
    const end = Math.min(start + CHUNK_SIZE, fullText.length);
    const chunkText = fullText.slice(start, end);
    chunks.push({
      nodeId,
      title,
      chunkIndex,
      totalChunks: 0, // será atualizado após contagem
      text: chunkText,
      charCount: chunkText.length,
    });
    start = end - CHUNK_OVERLAP;
    chunkIndex++;
  }

  // Atualiza totalChunks
  const total = chunks.length;
  for (const chunk of chunks) {
    chunk.totalChunks = total;
  }

  return chunks;
}

/**
 * Compila todos os documentos vinculados a uma entidade (ex: tarefa) via entity_links.
 *
 * @param entityType - Tipo da entidade ('task' | 'meeting' | etc.)
 * @param entityId - ID da entidade
 * @param payloadLimit - Limite máximo de caracteres combinados
 * @returns LinkedDocsContext com o texto compilado de todos os docs vinculados
 */
export async function compileLinkedDocs(
  entityType: EntityLinkType,
  entityId: string,
  payloadLimit: number = DEFAULT_PAYLOAD_LIMIT
): Promise<LinkedDocsContext> {
  // Busca os links da entidade
  const links = await docService.getLinksForEntity(entityType, entityId);

  // Filtra apenas links para documentos
  const docLinks = links.filter((link) => link.targetType === 'document');

  if (docLinks.length === 0) {
    return {
      docs: [],
      combinedText: '',
      totalCharCount: 0,
      truncated: false,
    };
  }

  // Compila cada documento vinculado
  const perDocLimit = Math.floor(payloadLimit / docLinks.length);
  const compiledDocs: CompiledDocument[] = [];

  for (const link of docLinks) {
    try {
      const compiled = await compileDocContent(link.targetId, perDocLimit);
      compiledDocs.push(compiled);
    } catch (err) {
      console.warn(`[doc_nlp_adapter] Erro ao compilar doc ${link.targetId}:`, err);
      // Continua com os demais documentos
    }
  }

  // Monta o texto combinado com separadores
  const parts: string[] = [];
  let totalChars = 0;

  for (const doc of compiledDocs) {
    const header = `--- DOCUMENTO: ${doc.title} (${doc.charCount} caracteres)${doc.truncated ? ' [TRUNCADO]' : ''} ---`;
    const docBlock = `${header}\n${doc.plainText}\n`;
    parts.push(docBlock);
    totalChars += docBlock.length;
  }

  const combinedText = parts.join('\n');
  const truncated = totalChars > payloadLimit;

  return {
    docs: compiledDocs,
    combinedText: truncated ? combinedText.slice(0, payloadLimit) + '\n\n[CONTEXTO TRUNCADO — muitos documentos vinculados.]' : combinedText,
    totalCharCount: totalChars,
    truncated,
  };
}

/**
 * Trunca um texto para o limite especificado, preservando a última frase completa
 * quando possível.
 */
export function truncateToLimit(text: string, limit: number = DEFAULT_PAYLOAD_LIMIT): string {
  if (text.length <= limit) return text;

  const truncated = text.slice(0, limit);
  // Tenta cortar no último ponto final ou quebra de linha
  const lastPeriod = truncated.lastIndexOf('.');
  const lastNewline = truncated.lastIndexOf('\n');

  const cutPoint = Math.max(lastPeriod, lastNewline);
  if (cutPoint > limit * 0.8) {
    return text.slice(0, cutPoint + 1) + '\n\n[CONTEÚDO TRUNCADO]';
  }

  return truncated + '\n\n[CONTEÚDO TRUNCADO]';
}

/**
 * Extrai palavras-chave relevantes do texto compilado para sugerir termos de busca
 * ou categorização.
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Remove markdown syntax e pontuação
  const clean = text
    .replace(/[#*_`>\[\]]/g, '')
    .replace(/[^\w\sÀ-ÿ-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  // Splita em palavras e filtra stopwords básicas
  const stopwords = new Set([
    'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas',
    'para', 'por', 'com', 'sem', 'sob', 'sobre', 'entre', 'após',
    'um', 'uma', 'uns', 'umas', 'o', 'a', 'os', 'as',
    'é', 'são', 'foi', 'foram', 'ser', 'estar', 'ter', 'tem',
    'seu', 'sua', 'seus', 'suas', 'meu', 'minha', 'nosso',
    'que', 'como', 'mais', 'mas', 'porque', 'pois', 'quando',
    'e', 'ou', 'nem', 'também', 'ainda', 'já', 'não', 'sim',
    'isto', 'isso', 'aquele', 'esta', 'esse', 'este',
    'vai', 'pode', 'podem', 'deve', 'devem', 'será',
  ]);

  const words = clean.split(/\s+/).filter((w) => w.length > 2 && !stopwords.has(w));

  // Conta frequência
  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  // Ordena por frequência
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}
