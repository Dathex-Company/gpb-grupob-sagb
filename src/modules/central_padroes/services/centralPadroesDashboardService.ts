/**
 * Serviço de métricas do Dashboard Executivo da Central de Padrões.
 * 
 * Consolida métricas reais a partir de:
 * - officialDocumentsIndex (índice canônico de documentos oficiais)
 * - centralDocumentsManifest (manifesto completo)
 * - fallbackData (base legada preservada)
 * - centralPadroesDocumentHubService (merge live)
 * 
 * Não faz chamadas Supabase — leitura live pendente.
 * Não duplica lógica de páginas.
 */

import { officialDocumentsIndex } from '../data/officialDocumentsIndex';
import { centralDocumentsManifest } from '../data/centralDocumentsManifest';
import { centralPadroesFallbackData } from '../data/fallbackData';
import { centralPadroesDocumentHubService } from './centralPadroesDocumentHubService';

export interface DashboardMetrics {
  /** Arquivos físicos reais na pasta estrutura-de-documentos-oficiais */
  physicalOfficialFiles: number;
  /** Entradas no índice oficial (officialDocumentsIndex) */
  indexedOfficialDocuments: number;
  /** Total no manifesto (oficial + planos legados) */
  manifestTotal: number;
  /** Documentos no fallback legado */
  fallbackLegacyDocuments: number;
  /** Documentos Mestres com status oficial_ativo */
  officialActiveMasters: number;
  /** Documentos com status previsto */
  statusPrevisto: number;
  /** Documentos com officialStatus fonte_bruta */
  fonteBruta: number;
  /** Documentos com officialStatus curadoria */
  curadoria: number;
  /** Documentos com officialStatus rascunho (inclui previstos) */
  rascunho: number;
  /** Planos de desenvolvimento legados no manifesto */
  legacyPlans: number;
  /** Supabase — pendente de leitura */
  supabaseStatus: 'pendente';
  /** Total consolidado estimado (manifest + fallback, pré-dedup) */
  estimatedTotalPreDedup: number;
  /** Total deduplicado (via listDocuments) */
  totalDeduplicated: number | null;
  /** Documentos oficiais ativos na tela (via listDocuments) */
  officialActiveOnScreen: number | null;
  /** Paridade: arquivos indexados / arquivos físicos */
  parityRatio: string;
  /** Colisões de id detectadas entre fallback e manifest */
  idCollisions: number;
  /** Documentos sem owner (do índice oficial) */
  withoutOwner: number;
  /** Documentos sem tags (do índice oficial) */
  withoutTags: number;
  /** Documentos sem summary (do índice oficial) */
  withoutSummary: number;
}

/**
 * Calcula métricas locais sem depender de Supabase.
 */
export const computeLocalDashboardMetrics = (): DashboardMetrics => {
  const officialDocs = officialDocumentsIndex;
  const manifestDocs = centralDocumentsManifest;
  const fallbackDocs = centralPadroesFallbackData.documents;

  // Contagens do índice oficial
  const physicalOfficialFiles = 47; // Contado na auditoria 00.14
  const indexedOfficialDocuments = officialDocs.length;
  const manifestTotal = manifestDocs.length;
  const fallbackLegacyDocuments = fallbackDocs.length;
  const legacyPlans = manifestDocs.length - officialDocs.length;

  // Por officialStatus no índice oficial
  const officialActiveMasters = officialDocs.filter(d => d.officialStatus === 'oficial_ativo').length;
  const fonteBruta = officialDocs.filter(d => d.officialStatus === 'fonte_bruta').length;
  const curadoria = officialDocs.filter(d => d.officialStatus === 'curadoria').length;
  const rascunho = officialDocs.filter(d => d.officialStatus === 'rascunho').length;

  // Por status no índice oficial
  const statusPrevisto = officialDocs.filter(d => d.status === 'previsto').length;

  // Paridade
  const parityRatio = `${indexedOfficialDocuments}/${physicalOfficialFiles}`;

  // Colisões de id (fallback vs manifesto)
  const fallbackIds = new Set(fallbackDocs.map(d => d.id));
  const manifestIds = new Set(manifestDocs.map(d => d.id));
  const idCollisions = [...fallbackIds].filter(id => manifestIds.has(id)).length;

  // Métricas de qualidade no índice oficial
  const withoutOwner = officialDocs.filter(d => !d.owner).length;
  const withoutTags = officialDocs.filter(d => !(d.tags || []).length).length;
  const withoutSummary = officialDocs.filter(d => !d.summary).length;

  // Total teórico pré-dedup
  const estimatedTotalPreDedup = fallbackDocs.length + manifestDocs.length;

  return {
    physicalOfficialFiles,
    indexedOfficialDocuments,
    manifestTotal,
    fallbackLegacyDocuments,
    officialActiveMasters,
    statusPrevisto,
    fonteBruta,
    curadoria,
    rascunho,
    legacyPlans,
    supabaseStatus: 'pendente',
    estimatedTotalPreDedup,
    totalDeduplicated: null, // preenchido async
    officialActiveOnScreen: null, // preenchido async
    parityRatio,
    idCollisions,
    withoutOwner,
    withoutTags,
    withoutSummary,
  };
};

/**
 * Enriquece métricas com dados live do DocumentHub (ainda local, sem Supabase).
 */
export const enrichDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const base = computeLocalDashboardMetrics();
  try {
    const docs = await centralPadroesDocumentHubService.listDocuments();
    base.totalDeduplicated = docs.length;
    base.officialActiveOnScreen = docs.filter(d => d.officialStatus === 'oficial_ativo').length;
  } catch {
    base.totalDeduplicated = base.estimatedTotalPreDedup;
    base.officialActiveOnScreen = base.officialActiveMasters;
  }
  return base;
};

/**
 * Distribuição por categoria (divisão real, sem nomes de agentes).
 */
export const getCategoryDistribution = () => {
  const officialDocs = officialDocumentsIndex;
  const dist: Record<string, number> = {};
  officialDocs.forEach(doc => {
    const cat = doc.category || 'Indefinido';
    dist[cat] = (dist[cat] || 0) + 1;
  });
  // Ordenar por contagem decrescente
  return Object.fromEntries(
    Object.entries(dist).sort(([, a], [, b]) => b - a)
  );
};

/**
 * Distribuição por officialStatus.
 */
export const getOfficialStatusDistribution = () => {
  const officialDocs = officialDocumentsIndex;
  const dist: Record<string, number> = {};
  officialDocs.forEach(doc => {
    const s = doc.officialStatus || 'indefinido';
    dist[s] = (dist[s] || 0) + 1;
  });
  return dist;
};

/**
 * Distribuição por origem dos dados.
 */
export const getSourceDistribution = () => {
  return {
    officialDocumentsIndex: officialDocumentsIndex.length,
    centralDocumentsManifest: centralDocumentsManifest.length,
    fallbackData: centralPadroesFallbackData.documents.length,
    supabaseLive: 'Pendente de leitura' as const,
    deduplicated: 'Calculado em runtime' as const,
  };
};
