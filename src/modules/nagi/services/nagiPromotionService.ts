import {
  NagiItem,
  NagiPromotionStatus,
  isEligibleForPromotion,
} from '../domain/types';
import { nagiRepository } from '../repository/nagi.repository';

/* ──────────────────────────────────────────────
 * NAGI V2 — Serviço de Promoção (Triagem → Catálogo)
 * ────────────────────────────────────────────── */

/**
 * Verifica elegibilidade e retorna os itens prontos para promoção.
 */
export function getEligibleForPromotion(): NagiItem[] {
  const all = nagiRepository.getAll();
  return all.filter((i) => !i.isCatalog && isEligibleForPromotion(i));
}

/**
 * Promove um item da triagem para o catálogo oficial.
 * Regras:
 * 1. item precisa estar aprovado (governanceStatus === 'aprovada')
 * 2. item não pode ser do tipo 'ideia'
 * 3. item precisa ter score final >= 50
 * 4. item não pode já estar no catálogo
 */
export function promoteToCatalog(
  id: string,
  by: string,
  byUserId?: string,
): { success: boolean; reason?: string; item?: NagiItem } {
  const item = nagiRepository.getById(id);

  if (!item) return { success: false, reason: 'Item não encontrado.' };
  if (item.isCatalog) return { success: false, reason: 'Item já está no catálogo.' };

  const failures: string[] = [];

  if (item.governanceStatus !== 'aprovada') {
    failures.push('Item precisa estar aprovado pela governança.');
  }
  if (item.itemType === 'ideia') {
    failures.push('Ideias não podem ser promovidas diretamente para o catálogo.');
  }
  if (item.score.final < 50) {
    failures.push('Score final precisa ser no mínimo 50.');
  }

  if (failures.length > 0) {
    return { success: false, reason: failures.join(' ') };
  }

  /* Executa a promoção */
  const now = new Date().toISOString();

  item.isCatalog = true;
  item.promotionStatus = 'promovida';
  item.promotedAt = now;
  item.promotedBy = by;
  item.maturityStage = 'catalogada';
  item.governanceStatus = 'aprovada';
  item.updatedAt = now;

  item.decisionHistory.push({
    id: `promo_${Date.now()}`,
    at: now,
    by,
    byUserId,
    action: 'promover',
    rationale: `Item promovido ao catálogo oficial do ecossistema.`,
    fromStage: 'decisao',
    toStage: 'catalogada',
    fromGovernance: 'aprovada',
    toGovernance: 'aprovada',
  });

  nagiRepository.save(item);

  return { success: true, item };
}

/**
 * Rejeita a promoção (marca como não elegível para catálogo).
 */
export function rejectPromotion(
  id: string,
  rationale: string,
  by: string,
): NagiItem | null {
  const item = nagiRepository.getById(id);
  if (!item) return null;

  item.promotionStatus = 'rejeitada_catalogo';
  item.updatedAt = new Date().toISOString();

  item.decisionHistory.push({
    id: `rej_promo_${Date.now()}`,
    at: new Date().toISOString(),
    by,
    action: 'arquivar',
    rationale: `Promoção rejeitada: ${rationale}`,
  });

  nagiRepository.save(item);
  return item;
}

/**
 * Atualiza o status de elegibilidade de todos os itens da triagem.
 */
export function refreshEligibility(): void {
  const all = nagiRepository.getAll();
  let changed = false;

  for (const item of all) {
    if (item.isCatalog) continue;

    const eligible = isEligibleForPromotion(item);
    const newStatus: NagiPromotionStatus = eligible ? 'elegivel' : 'nao_elegivel';

    if (item.promotionStatus !== newStatus) {
      item.promotionStatus = newStatus;
      changed = true;
    }
  }

  if (changed) {
    nagiRepository.saveAll(all);
  }
}
