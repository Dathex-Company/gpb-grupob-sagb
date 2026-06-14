/**
 * Manifesto consolidado de documentos da Central de Padrões.
 * 
 * Inclui:
 * - Planos e registros de desenvolvimento (01.xx)
 * - Documentos oficiais indexados da pasta estrutura-de-documentos-oficiais
 * 
 * Fonte canônica para documentos oficiais: officialDocumentsIndex.ts
 * Auditoria de paridade: docs/audits/00.14-auditoria-paridade...md
 */

import { CentralDocument } from '../types';
import { officialDocumentsIndex } from './officialDocumentsIndex';

const legacyPlans: CentralDocument[] = [
  {
    id: 'md-plan-01-12',
    title: 'Plano 01.12 — Execução Consolidada Document Hub V1',
    path: 'src/modules/central_padroes/docs/plans/01.12-plano-execucao-consolidado-document-hub-v1-13-06-2026.md',
    pathRelative: 'docs/plans/01.12-plano-execucao-consolidado-document-hub-v1-13-06-2026.md',
    status: 'registro',
    officialStatus: 'legado',
    category: 'Planejamento',
    areaId: 'savio',
    shouldBecome: 'registro',
    type: 'plano',
    source: 'md_indexado',
    owner: 'Sávio Codare',
    tags: ['document-hub', 'planejamento', 'p0-p1-p2'],
    summary: 'Plano consolidado para execução do Document Hub V1 sem R5 e com R5 separado.',
    riskLevel: 'medio',
    canonicalLevel: 'candidato'
  },
  {
    id: 'md-plan-01-13',
    title: 'Plano 01.13 — R5 Document Hub V1',
    path: 'src/modules/central_padroes/docs/plans/01.13-plano-r5-document-hub-13-06-2026.md',
    pathRelative: 'docs/plans/01.13-plano-r5-document-hub-13-06-2026.md',
    status: 'registro',
    officialStatus: 'legado',
    category: 'R5',
    areaId: 'savio',
    shouldBecome: 'registro',
    type: 'plano',
    source: 'md_indexado',
    owner: 'Sávio Codare',
    tags: ['document-hub', 'r5', 'supabase'],
    summary: 'Plano R5 para schema, storage, RLS, RPC e persistência.',
    riskLevel: 'critico',
    canonicalLevel: 'candidato'
  },
  {
    id: 'md-plan-01-14',
    title: 'Plano 01.14 — Recomendações Pré-R5',
    path: 'src/modules/central_padroes/docs/plans/01.14-recomendacoes-pre-r5-13-06-2026.md',
    pathRelative: 'docs/plans/01.14-recomendacoes-pre-r5-13-06-2026.md',
    status: 'registro',
    officialStatus: 'legado',
    category: 'R5',
    areaId: 'savio',
    shouldBecome: 'registro',
    type: 'plano',
    source: 'md_indexado',
    owner: 'Sávio Codare',
    tags: ['document-hub', 'pre-r5', 'auditoria'],
    summary: 'Recomendações pré-R5 removendo itens já executados em migrations anteriores.',
    riskLevel: 'alto',
    canonicalLevel: 'candidato'
  },
  {
    id: 'md-plan-01-15',
    title: 'Plano 01.15 — Mega Tarefa Document Hub V1 Completo',
    path: 'src/modules/central_padroes/docs/plans/01.15-mega-tarefa-document-hub-v1-completo.md',
    pathRelative: 'docs/plans/01.15-mega-tarefa-document-hub-v1-completo.md',
    status: 'registro',
    officialStatus: 'legado',
    category: 'Mega Tarefa',
    areaId: 'savio',
    shouldBecome: 'registro',
    type: 'plano',
    source: 'md_indexado',
    owner: 'Sávio Codare',
    tags: ['document-hub', 'mega-tarefa', 'continuidade'],
    summary: 'Plano mestre com ondas, checkpoints e protocolo de continuidade sequencial.',
    riskLevel: 'alto',
    canonicalLevel: 'candidato'
  },
];

/**
 * Manifesto de documentos completo: planos de desenvolvimento + documentos oficiais indexados.
 * 
 * Nota: DM-00 e DM-01 estavam previamente duplicados aqui e no officialDocumentsIndex.
 * Agora o officialDocumentsIndex é a única fonte para documentos oficiais.
 */
export const centralDocumentsManifest: CentralDocument[] = [
  ...legacyPlans,
  ...officialDocumentsIndex,
];
