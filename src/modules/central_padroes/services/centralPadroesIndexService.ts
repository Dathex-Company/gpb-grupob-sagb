// ============================================================
// Serviço de Indexação Documental — Central de Padrões (T2.4)
// ============================================================
// Constrói e mantém um índice pesquisável de todos os documentos.
// Preparado para pgvector/embeddings em etapa futura.
// Respeita permissões na busca.

import { centralPadroesRepository } from './centralPadroesRepository';
import {
  CentralStandard,
  CentralProfileRole,
  DocumentIndexEntry,
  DocumentIndexSnapshot,
} from '../types';

let cachedIndex: DocumentIndexSnapshot | null = null;
let lastBuiltAt = 0;
const CACHE_TTL_MS = 60_000; // 1 minuto

/**
 * Gera um resumo/trecho de um standard.
 */
const generateSummary = (standard: CentralStandard): string => {
  return standard.summary || `Padrão ${standard.key}: ${standard.title}`;
};

/**
 * Divide conteúdo em chunks para indexação.
 */
const chunkText = (text: string, maxChars = 300): string[] => {
  if (!text) return [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if ((current + sentence).length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += ' ' + sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
};

/**
 * Extrai tags de um standard baseado em seus campos.
 */
const extractTags = (standard: CentralStandard): string[] => {
  const tags: string[] = [];
  tags.push(standard.type);
  tags.push(standard.areaId);
  tags.push(standard.risk);
  if (standard.agentAvailable) tags.push('agente');
  if (standard.dependencies?.length) tags.push('com_dependencia');
  if (standard.canonicalLevel) tags.push(standard.canonicalLevel);
  return [...new Set(tags)].filter(Boolean);
};

/**
 * Determina as roles que podem ver este item.
 */
const getAllowedRoles = (standard: CentralStandard): CentralProfileRole[] => {
  const roles: CentralProfileRole[] = ['leitor', 'editor', 'curador', 'aprovador', 'administrador', 'auditor'];
  if (standard.agentAvailable) roles.push('agente_autorizado');
  return roles;
};

/**
 * Constrói o índice a partir do snapshot do repositório.
 */
const buildIndexFromSnapshot = async (): Promise<DocumentIndexSnapshot> => {
  const snapshot = await centralPadroesRepository.getSnapshot();
  const entries: DocumentIndexEntry[] = [];

  // Indexar standards
  snapshot.standards.forEach((standard) => {
    const text = `${standard.key} ${standard.title} ${standard.summary} ${standard.type} ${standard.owner} ${standard.areaId}`;
    entries.push({
      id: standard.id,
      title: `${standard.key} — ${standard.title}`,
      summary: generateSummary(standard),
      chunks: chunkText(standard.summary || ''),
      tags: extractTags(standard),
      owner: standard.owner,
      status: standard.status,
      normativeType: standard.type,
      areaId: standard.areaId,
      route: `/central-padroes/standards/${standard.id}`,
      updatedAt: standard.updatedAt,
      canonicalLevel: standard.canonicalLevel || standard.status,
      allowedRoles: getAllowedRoles(standard),
    });
  });

  // Indexar documentos
  snapshot.documents.forEach((doc) => {
    entries.push({
      id: doc.id,
      title: doc.title,
      summary: `${doc.category} • ${doc.path} • ${doc.status}`,
      chunks: [`Categoria: ${doc.category}`, `Status: ${doc.status}`, `Área: ${doc.areaId}`],
      tags: [doc.status, doc.category, doc.shouldBecome].filter(Boolean),
      owner: doc.areaId || 'Desconhecido',
      status: doc.status as any,
      normativeType: 'documentacao_tecnica',
      areaId: doc.areaId,
      route: `/central-padroes/documents/${doc.id}`,
      updatedAt: '',
      canonicalLevel: doc.status as any,
      allowedRoles: ['leitor', 'editor', 'curador', 'aprovador', 'administrador', 'auditor'],
    });
  });

  // Indexar decisões
  snapshot.decisions.forEach((dec) => {
    entries.push({
      id: dec.id,
      title: dec.title,
      summary: dec.summary,
      chunks: chunkText(`${dec.summary} ${dec.impacts.join(', ')}`),
      tags: ['decisao', dec.status, dec.areaId].filter(Boolean),
      owner: dec.areaId || 'Desconhecido',
      status: dec.status as any,
      normativeType: 'decisao',
      areaId: dec.areaId,
      route: `/central-padroes/decisions/${dec.id}`,
      updatedAt: '',
      canonicalLevel: dec.status as any,
      allowedRoles: ['leitor', 'editor', 'curador', 'aprovador', 'administrador', 'auditor'],
    });
  });

  return {
    entries,
    builtAt: new Date().toISOString(),
    totalEntries: entries.length,
  };
};

export const centralPadroesIndexService = {
  /**
   * Constrói ou retorna o índice em cache.
   */
  async buildIndex(force = false): Promise<DocumentIndexSnapshot> {
    const now = Date.now();
    if (!force && cachedIndex && (now - lastBuiltAt) < CACHE_TTL_MS) {
      return cachedIndex;
    }
    cachedIndex = await buildIndexFromSnapshot();
    lastBuiltAt = now;
    console.info(`[central-padroes][index] Índice reconstruído: ${cachedIndex.totalEntries} entries`);
    return cachedIndex;
  },

  /**
   * Busca no índice respeitando o perfil do usuário.
   */
  async searchIndex(query: string, userRole: CentralProfileRole = 'leitor'): Promise<DocumentIndexEntry[]> {
    const index = await this.buildIndex();
    const normalizedQuery = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];

    // Filtrar por permissão e buscar
    const results = index.entries
      .filter((entry) => entry.allowedRoles.includes(userRole))
      .map((entry) => {
        const text = `${entry.title} ${entry.summary} ${entry.tags.join(' ')} ${entry.owner} ${entry.areaId} ${entry.normativeType}`
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        const matchCount = terms.filter((term) => text.includes(term)).length;
        const score = terms.length > 0 ? matchCount / terms.length : 0;
        return { entry, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((r) => r.entry);

    return results;
  },

  /**
   * Reindexa um item específico após alteração.
   */
  async reindexItem(id: string): Promise<void> {
    // Invalida cache para que o próximo buildIndex reconstrua
    cachedIndex = null;
    lastBuiltAt = 0;
    console.info(`[central-padroes][index] Cache invalidado para reindexação de ${id}`);
  },

  /**
   * Obtém estatísticas do índice.
   */
  async getStats(): Promise<{ totalEntries: number; builtAt: string }> {
    const index = await this.buildIndex();
    return {
      totalEntries: index.totalEntries,
      builtAt: index.builtAt,
    };
  },

  /**
   * Limpa o cache de índice.
   */
  clearCache(): void {
    cachedIndex = null;
    lastBuiltAt = 0;
  },
};
