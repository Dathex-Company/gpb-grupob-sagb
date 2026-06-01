import {
  NagiItem,
  NagiItemType,
  NagiEvidence,
} from '../domain/types';
import { nagiRepository } from '../repository/nagi.repository';

/* ──────────────────────────────────────────────
 * NAGI V2 — Ponte NIC → NAGI
 * Recepção de ideias vindas do NIC
 * ────────────────────────────────────────────── */

let uidCounter = Date.now();
function genId(): string {
  return `nagi_${++uidCounter}`;
}

export interface NicOutputPayload {
  title: string;
  summary: string;
  itemType: NagiItemType;
  category: string;
  tags?: string[];
  originRefId: string;
  originSnapshot: string;
  evidenceLabel?: string;
  evidenceExcerpt?: string;
  skipClassification?: boolean;
}

/**
 * Cria um item no NAGI a partir de uma saída do NIC.
 * A saída entra na triagem com:
 *  - originType = 'nic'
 *  - maturityStage = 'classificacao' (ou 'qualificacao' se skipClassification=true)
 *  - governanceStatus = 'em_analise'
 *  - Evidência vinculada ao NIC
 */
export function receiveFromNic(payload: NicOutputPayload): NagiItem {
  const now = new Date().toISOString();

  const evidences: NagiEvidence[] = [
    {
      id: `nic_ev_${Date.now()}`,
      type: 'doc',
      label: payload.evidenceLabel ?? 'Saída do NIC',
      excerpt: payload.evidenceExcerpt ?? payload.summary.substring(0, 120),
      uri: `#nic-output-${payload.originRefId}`,
      createdAt: now,
    },
  ];

  const item: NagiItem = {
    id: genId(),
    title: payload.title,
    summary: payload.summary,
    createdAt: now,
    updatedAt: now,
    originType: 'nic',
    originRefId: payload.originRefId,
    originSnapshot: payload.originSnapshot,
    itemType: payload.itemType,
    category: payload.category,
    tags: payload.tags ?? [],
    maturityStage: payload.skipClassification ? 'qualificacao' : 'classificacao',
    priority: 'media',
    score: {
      impact: 0,
      effort: 0,
      risk: 0,
      alignment: 0,
      final: 0,
      updatedAt: now,
    },
    operationalStatus: 'nao_iniciado',
    governanceStatus: 'em_analise',
    promotionStatus: 'nao_elegivel',
    evidences,
    decisionHistory: [
      {
        id: genId(),
        at: now,
        by: 'NIC',
        action: 'classificar',
        rationale: `Item oriundo do NIC (${payload.originRefId}). Classificado como ${payload.itemType}.`,
        toStage: payload.skipClassification ? 'qualificacao' : 'classificacao',
      },
    ],
    isCatalog: false,
  };

  nagiRepository.create(item);
  return item;
}

/**
 * Busca todos os itens que vieram do NIC.
 */
export function getNicOriginatedItems(): NagiItem[] {
  return nagiRepository.getAll().filter((i) => i.originType === 'nic');
}
