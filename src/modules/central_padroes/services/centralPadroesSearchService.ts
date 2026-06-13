import { centralPadroesRepository } from './centralPadroesRepository';
import { CentralAgentRun, CentralBaseModule, CentralDecision, CentralDocument, CentralStandard, SearchResult, SearchResultEntityType } from '../types';
import { CentralGovernanceRecord, CentralTraceLog, centralPadroesGovernanceService } from './centralPadroesGovernanceService';
import { centralPadroesDocumentHubService } from './centralPadroesDocumentHubService';

export const centralPadroesSearchRoadmap = {
  currentMode: 'textual' as const,
  futureHybrid: 'Busca textual + filtros estruturados + reranking por embedding.',
  futureSemantic: 'Busca semântica com embeddings, pgvector e RAG para o agente Pietro Carbone.'
};

export type { SearchResult }; // re-export

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
  item.updatedAt,
  item.canonicalLevel || ''
]);

const documentText = (item: CentralDocument) => flattenText([
  item.title,
  item.path,
  item.pathRelative,
  item.pathAbsolute,
  item.category,
  item.areaId,
  item.owner,
  item.summary,
  item.tags,
  item.type,
  item.riskLevel,
  item.source,
  item.canonicalLevel,
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

const baseModuleText = (item: CentralBaseModule) => flattenText([
  item.name,
  item.moduleId,
  item.description,
  item.owner,
  item.areaId,
  item.status,
  item.moduleType,
  item.recommendedUse,
  item.reuseCriteria,
  item.linkedStandards,
  item.linkedProtocols
]);

const agentRunText = (item: CentralAgentRun) => flattenText([
  item.agentCode,
  item.agentName,
  item.block,
  item.status,
  item.deliverable
]);

const governanceRecordText = (item: CentralGovernanceRecord) => flattenText([
  item.title,
  item.type,
  item.category,
  item.status,
  item.riskLevel,
  item.owner,
  item.tags,
  item.pathAbsolute,
  item.pathRelative,
  item.summary,
  item.content,
  item.source,
  item.createdAt,
  item.updatedAt
]);

const traceLogText = (item: CentralTraceLog) => flattenText([
  item.executionId,
  item.project,
  item.module,
  item.executor,
  item.taskTitle,
  item.riskMax,
  item.status,
  item.summary,
  JSON.stringify(item.commandsJson),
  JSON.stringify(item.filesChangedJson),
  JSON.stringify(item.errorsJson),
  item.createdAt
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
    const hasQuery = Boolean(query.trim());
    const [hubDocuments, reports, audits, curadoria, traceLogs] = await Promise.all([
      centralPadroesDocumentHubService.listDocuments().catch(() => snapshot.documents),
      centralPadroesGovernanceService.listRecords('central_padroes_reports').catch(() => []),
      centralPadroesGovernanceService.listRecords('central_padroes_audits').catch(() => []),
      centralPadroesGovernanceService.listRecords('central_padroes_curadoria').catch(() => []),
      centralPadroesGovernanceService.listTraceLogs().catch(() => [])
    ]);
    
    snapshot.standards.forEach((item) => {
      const text = standardText(item);
      const score = scoreText(text, query);
      if (score > 0 || !hasQuery) results.push({ entityType: 'standard', entity: item, score, excerpt: `${item.key} • ${item.type} • ${item.status} • ${item.summary}` });
    });
    hubDocuments.forEach((item) => {
      const text = documentText(item);
      const score = scoreText(text, query);
      if (score > 0 || !hasQuery) results.push({
        entityType: 'document',
        entity: item,
        score,
        originLabel: item.source || 'Documento',
        excerpt: `${item.type || item.category} • ${item.status} • ${item.riskLevel || 'risco n/d'} • ${item.owner || 'sem owner'} • ${item.pathRelative || item.path}`,
        meta: {
          title: item.title,
          type: item.type,
          category: item.category,
          status: item.status,
          risk: item.riskLevel,
          owner: item.owner || undefined,
          tags: item.tags,
          pathAbsolute: item.pathAbsolute,
          pathRelative: item.pathRelative,
          summary: item.summary
        }
      });
    });
    snapshot.decisions.forEach((item) => {
      const text = decisionText(item);
      const score = scoreText(text, query);
      if (score > 0 || !hasQuery) results.push({ entityType: 'decision', entity: item, score, excerpt: `${item.status} • ${item.impacts.join(', ')} • ${item.summary}` });
    });
    // Busca expandida: BaseModule
    snapshot.baseModules.forEach((item) => {
      const text = baseModuleText(item);
      const score = scoreText(text, query);
      if (score > 0 || !hasQuery) results.push({ entityType: 'baseModule', entity: item, score, excerpt: `${item.name} • ${item.moduleType} • ${item.status} • ${item.description}` });
    });
    // Busca expandida: AgentRun
    snapshot.agents.forEach((item) => {
      const text = agentRunText(item);
      const score = scoreText(text, query);
      if (score > 0 || !hasQuery) results.push({ entityType: 'agentRun', entity: item, score, excerpt: `${item.agentName} • ${item.block} • ${item.status} • ${item.deliverable}` });
    });

    const pushGovernance = (items: CentralGovernanceRecord[], entityType: 'report' | 'audit' | 'curadoria', originLabel: string, routeId: string) => {
      items.forEach((item) => {
        const text = governanceRecordText(item);
        const score = scoreText(text, query);
        if (score > 0 || !hasQuery) {
          results.push({
            entityType,
            entity: item as unknown as Record<string, unknown>,
            score,
            routeId,
            originLabel,
            excerpt: `${item.type} • ${item.category} • ${item.status} • ${item.riskLevel} • ${item.owner || 'sem owner'} • ${item.pathRelative || item.pathAbsolute || 'sem caminho'} • ${item.summary || ''}`,
            meta: {
              title: item.title,
              type: item.type,
              category: item.category,
              status: item.status,
              risk: item.riskLevel,
              owner: item.owner || undefined,
              tags: item.tags,
              pathAbsolute: item.pathAbsolute,
              pathRelative: item.pathRelative,
              summary: item.summary
            }
          });
        }
      });
    };

    pushGovernance(reports, 'report', 'Relatórios', 'relatorios');
    pushGovernance(audits, 'audit', 'Auditorias', 'audits');
    pushGovernance(curadoria, 'curadoria', 'Curadoria', 'curadoria');

    traceLogs.forEach((item) => {
      const text = traceLogText(item);
      const score = scoreText(text, query);
      if (score > 0 || !hasQuery) {
        results.push({
          entityType: 'traceLog',
          entity: item as unknown as Record<string, unknown>,
          score,
          routeId: 'agent-mode',
          originLabel: 'LOZE-TRACE',
          excerpt: `${item.executionId} • ${item.status} • ${item.riskMax} • ${item.executor || 'sem executor'} • ${item.summary || item.taskTitle}`,
          meta: {
            title: item.taskTitle,
            type: 'loze-trace',
            category: item.module,
            status: item.status,
            risk: item.riskMax,
            owner: item.executor || undefined,
            tags: [item.project, item.module, item.executionId].filter(Boolean),
            summary: item.summary
          }
        });
      }
    });
    return results.sort(byScoreThenTitle).slice(0, limit);
  },

  async reindexAll(): Promise<void> {
    console.info('[central-padroes][search] reindexAll preparado para fase futura. ET-22 mantém busca textual ampliada; embeddings/pgvector ficam para ET posterior.', centralPadroesSearchRoadmap);
  }
};
