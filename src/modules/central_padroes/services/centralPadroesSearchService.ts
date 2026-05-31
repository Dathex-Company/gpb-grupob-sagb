import { centralPadroesRepository } from './centralPadroesRepository';
import { CentralDecision, CentralDocument, CentralStandard } from '../types';

export interface SearchResult {
  entityType: 'standard' | 'document' | 'decision';
  entity: CentralStandard | CentralDocument | CentralDecision;
  score: number;
  excerpt: string;
}

const scoreText = (haystack: string, query: string) => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;
  const lower = haystack.toLowerCase();
  return terms.reduce((acc, term) => acc + (lower.includes(term) ? 1 : 0), 0) / terms.length;
};

export const centralPadroesSearchService = {
  async semanticSearch(query: string, limit = 20): Promise<SearchResult[]> {
    return this.hybridSearch(query, limit);
  },

  async hybridSearch(query: string, limit = 20): Promise<SearchResult[]> {
    const snapshot = await centralPadroesRepository.getSnapshot();
    const results: SearchResult[] = [];
    snapshot.standards.forEach((item) => {
      const text = `${item.key} ${item.title} ${item.summary} ${item.owner}`;
      const score = scoreText(text, query);
      if (score > 0 || !query) results.push({ entityType: 'standard', entity: item, score, excerpt: item.summary });
    });
    snapshot.documents.forEach((item) => {
      const text = `${item.title} ${item.path} ${item.category}`;
      const score = scoreText(text, query);
      if (score > 0 || !query) results.push({ entityType: 'document', entity: item, score, excerpt: item.path });
    });
    snapshot.decisions.forEach((item) => {
      const text = `${item.title} ${item.summary} ${item.impacts.join(' ')}`;
      const score = scoreText(text, query);
      if (score > 0 || !query) results.push({ entityType: 'decision', entity: item, score, excerpt: item.summary });
    });
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  },

  async reindexAll(): Promise<void> {
    console.info('[central-padroes][search] reindexAll fallback textual executado');
  }
};

