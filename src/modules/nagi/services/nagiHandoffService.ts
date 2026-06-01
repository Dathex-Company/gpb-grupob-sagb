import { TabId } from '../../../../types';
import {
  NagiItem,
  NagiHandoffStatus,
  HANDOFF_STATUS_LABELS,
} from '../domain/types';
import { nagiRepository } from '../repository/nagi.repository';

/* ──────────────────────────────────────────────
 * NAGI V2 — Serviço de Handoff (Encaminhamento para Especialistas)
 * ────────────────────────────────────────────── */

export interface HandoffRequest {
  itemId: string;
  targetTab: TabId;
  targetLabel: string;
  reason: string;
  by: string;
  byUserId?: string;
}

/**
 * Encaminha um item para um módulo especialista.
 * Regras:
 *  - item precisa estar aprovado ou incubado
 *  - item não pode já estar encaminhado para o mesmo módulo
 */
export function sendToSpecialist(req: HandoffRequest): { success: boolean; reason?: string; item?: NagiItem } {
  const item = nagiRepository.getById(req.itemId);
  if (!item) return { success: false, reason: 'Item não encontrado.' };

  if (item.governanceStatus !== 'aprovada' && item.governanceStatus !== 'incubada') {
    return { success: false, reason: 'Apenas itens aprovados ou incubados podem ser encaminhados.' };
  }

  if (item.handoffRecord?.status !== 'nao_encaminhado' && item.handoffRecord) {
    if (item.handoffRecord.targetModuleTab === req.targetTab) {
      return { success: false, reason: `Item já foi encaminhado para ${req.targetLabel}.` };
    }
  }

  const now = new Date().toISOString();

  item.specialistTarget = {
    tab: req.targetTab,
    label: req.targetLabel,
    routingReason: req.reason,
    routedAt: now,
  };

  item.handoffRecord = {
    targetModuleTab: req.targetTab,
    targetModuleLabel: req.targetLabel,
    routedAt: now,
    status: 'encaminhado',
  };

  item.maturityStage = 'encaminhada';
  item.updatedAt = now;

  item.decisionHistory.push({
    id: `handoff_${Date.now()}`,
    at: now,
    by: req.by,
    byUserId: req.byUserId,
    action: 'encaminhar',
    rationale: `Encaminhado para ${req.targetLabel}: ${req.reason}`,
    toStage: 'encaminhada',
  });

  nagiRepository.save(item);
  return { success: true, item };
}

/**
 * Atualiza o status do handoff (recebido, processado, finalizado).
 */
export function updateHandoffStatus(
  itemId: string,
  status: Exclude<NagiHandoffStatus, 'nao_encaminhado'>,
  note?: string,
  by?: string,
): NagiItem | null {
  const item = nagiRepository.getById(itemId);
  if (!item) return null;
  if (!item.handoffRecord) return null;

  const now = new Date().toISOString();
  item.handoffRecord.status = status;
  if (note) item.handoffRecord.specialistNote = note;

  if (status === 'recebido') item.handoffRecord.receivedAt = now;
  if (status === 'processado') item.handoffRecord.processedAt = now;

  item.updatedAt = now;

  const actionMap: Record<string, 'receber_handoff' | 'processar_handoff' | 'finalizar_handoff'> = {
    recebido: 'receber_handoff',
    processado: 'processar_handoff',
    finalizado: 'finalizar_handoff',
  };

  item.decisionHistory.push({
    id: `handoff_status_${Date.now()}`,
    at: now,
    by: by ?? 'Sistema',
    action: actionMap[status],
    rationale: note ?? `Handoff atualizado para: ${HANDOFF_STATUS_LABELS[status]}`,
  });

  nagiRepository.save(item);
  return item;
}

/**
 * Busca itens pelo status de handoff.
 */
export function getItemsByHandoffStatus(status: NagiHandoffStatus): NagiItem[] {
  return nagiRepository
    .getAll()
    .filter((i) => i.handoffRecord?.status === status);
}

/**
 * Busca itens encaminhados para um módulo específico.
 */
export function getItemsRoutedToModule(tab: TabId): NagiItem[] {
  return nagiRepository
    .getAll()
    .filter((i) => i.handoffRecord?.targetModuleTab === tab);
}
