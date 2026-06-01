import { centralPadroesRepository } from './centralPadroesRepository';
import { CentralDecision, CentralDocument, CentralStandard } from '../types';

export interface SearchResult {
  entityType: 'standard' | 'document' | 'decision';
  entity: CentralStandard | CentralDocument | CentralDecision;
  score: number;
  excerpt: string;
}

export const centralPadroesSearchRoadmap = {
  currentMode: 'textual' as const,
  futureHybrid: 'Busca textual + filtros estruturados + reranking por embedding.',
  futureSemantic: 'Busca semântica com embeddings, pgvector e RAG para o agente Pietro Carbone.'
};

const normalize = (value: unknown) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const flattenText = (values: unknown[]) => values
  .flatMap((value) => Array.isArray(value) ? value : [value])
  .map(normalize)
  .join(' ');

const scoreText = (haystack: string, query: string) => {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;
  return terms.reduce((acc, term) => acc + (haystack.includes(term) ? 1 : 0), 0) / terms.length;
};

const standardText = (item: CentralStandard) => flattenText([
  item.key,
  item.title,
  item.summary,
  item.owner,
  item.areaId,
  item.status,
  item.type,
  item.risk,
  item.dependencies,
  item.relatedModules,
  item.updatedAt
]);

const documentText = (item: CentralDocument) => flattenText([
  item.title,
  item.path,
  item.category,
  item.areaId,
  item.status,
  item.shouldBecome
]);

const decisionText = (item: CentralDecision) => flattenText([
  item.title,
  item.summary,
  item.areaId,
  item.status,
  item.impacts
]);

const byScoreThenTitle = (a: SearchResult, b: SearchResult) => {
  if (b.score !== a.score) return b.score - a.score;
  const titleA = 'title' in a.entity ? a.entity.title : '';
  const titleB = 'title' in b.entity ? b.entity.title : '';
  return titleA.localeCompare(titleB);
};

export const centralPadroesSearchService = {
  async textSearch(query: string, limit = 20): Promise<SearchResult[]> {
    return this.hybridSearch(query, limit);
  },

  async semanticSearch(query: string, limit = 20): Promise<SearchResult[]> {
    console.info('[central-padroes][search] semanticSearch ainda não usa IA: retornando busca textual ampliada como fallback controlado.', centralPadroesSearchRoadmap);
    return this.hybridSearch(query, limit);
  },

  async hybridSearch(query: string, limit = 20): Promise<SearchResult[]> {
    const snapshot = await centralPadroesRepository.getSnapshot();
    const results: SearchResult[] = [];
    snapshot.standards.forEach((item) => {
      const text = standardText(item);
      const score = scoreText(text, query);
      if (score > 0 || !query) results.push({ entityType: 'standard', entity: item, score, excerpt: `${item.key} • ${item.type} • ${item.status} • ${item.summary}` });
    });
    snapshot.documents.forEach((item) => {
      const text = documentText(item);
      const score = scoreText(text, query);
      if (score > 0 || !query) results.push({ entityType: 'document', entity: item, score, excerpt: `${item.category} • ${item.status} • ${item.path}` });
    });
    snapshot.decisions.forEach((item) => {
      const text = decisionText(item);
      const score = scoreText(text, query);
      if (score > 0 || !query) results.push({ entityType: 'decision', entity: item, score, excerpt: `${item.status} • ${item.impacts.join(', ')} • ${item.summary}` });
    });
    return results.sort(byScoreThenTitle).slice(0, limit);
  },

  async reindexAll(): Promise<void> {
    console.info('[central-padroes][search] reindexAll preparado para fase futura. ET-22 mantém busca textual ampliada; embeddings/pgvector ficam para ET posterior.', centralPadroesSearchRoadmap);
  }
};
