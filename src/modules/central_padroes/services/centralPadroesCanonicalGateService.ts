// ============================================================
// Gate de Canonicidade — Central de Padrões (T3.5)
// ============================================================
// Regras de transição entre status. Cada passagem exige:
// responsável, evidência, justificativa, aprovador, log, data de revisão futura.

import {
  CanonicalGate,
  CentralStandard,
  CentralStandardStatus,
  CentralProfileRole,
  CANONICAL_GATES,
} from '../types';
import { centralPadroesPermissionService } from './centralPadroesPermissionService';
import { centralPadroesAuditService } from './centralPadroesAuditService';

export interface GateValidationResult {
  allowed: boolean;
  gate: CanonicalGate | null;
  errors: string[];
  warnings: string[];
}

export const centralPadroesCanonicalGateService = {
  /**
   * Encontra o gate para uma transição específica.
   */
  findGate(from: CentralStandardStatus, to: CentralStandardStatus): CanonicalGate | undefined {
    return CANONICAL_GATES.find((g) => g.from === from && g.to === to);
  },

  /**
   * Valida se uma transição de status é permitida.
   */
  validateTransition(
    standard: CentralStandard,
    toStatus: CentralStandardStatus,
    userRole: CentralProfileRole,
    options?: { evidenceId?: string; reason?: string }
  ): GateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Se for o mesmo status, permitir
    if (standard.status === toStatus) {
      return { allowed: true, gate: null, errors: [], warnings: ['Status permanece o mesmo.'] };
    }

    // Encontrar o gate
    const gate = this.findGate(standard.status, toStatus);
    if (!gate) {
      // Verificar se a transição é possível como retrocesso
      const reverseGate = this.findGate(toStatus, standard.status);
      if (reverseGate) {
        return {
          allowed: false,
          gate: null,
          errors: [`Transição ${standard.status} → ${toStatus} não é direta. Caminho sugerido: ${toStatus} → ${standard.status} (reverso).`],
          warnings: [],
        };
      }
      return {
        allowed: false,
        gate: null,
        errors: [`Transição de ${standard.status} para ${toStatus} não é uma transição válida.`],
        warnings: [],
      };
    }

    // Verificar permissão
    const canUserAdvance = centralPadroesPermissionService.can(userRole, 'editar_padrao_oficial')
      || (gate.requiredRole === 'editor' && userRole === 'editor')
      || (gate.requiredRole === 'curador' && ['curador', 'aprovador', 'administrador'].includes(userRole))
      || (['aprovador', 'administrador'].includes(userRole) && ['aprovador', 'administrador'].includes(gate.requiredRole));

    if (!canUserAdvance) {
      errors.push(`Você precisa do perfil "${gate.requiredRole}" para esta transição. Seu perfil atual: ${userRole}`);
    }

    // Verificar exigência de evidência
    if (gate.requiresEvidence && !options?.evidenceId) {
      errors.push('Esta transição exige uma evidência vinculada. Forneça o ID da evidência.');
    }

    // Verificar exigência de aprovação
    if (gate.requiresApproval) {
      warnings.push('Esta transição exige aprovação. Um approval request será necessário.');
    }

    // Verificar exigência de evidência visual
    if (gate.requiresVisualEvidence && standard.requiresVisualEvidence && !standard.visualEvidenceUrl) {
      errors.push('Este padrão exige evidência visual obrigatória antes da transição.');
    }

    // Verificar justificativa para padrão canônico
    if (standard.canonicalLevel === 'canonico_operacional' || standard.canonicalLevel === 'canonico_oficial') {
      if (!options?.reason) {
        errors.push('Alteração em padrão canônico exige justificativa por escrito.');
      }
    }

    return {
      allowed: errors.length === 0,
      gate,
      errors,
      warnings,
    };
  },

  /**
   * Executa a transição de status se validada.
   */
  async executeTransition(
    standard: CentralStandard,
    toStatus: CentralStandardStatus,
    options?: { evidenceId?: string; reason?: string; approvedBy?: string }
  ): Promise<{ success: boolean; standard?: CentralStandard; error?: string }> {
    const userRole = centralPadroesPermissionService.getCurrentRole();
    const validation = this.validateTransition(standard, toStatus, userRole, options);

    if (!validation.allowed) {
      return { success: false, error: validation.errors.join('; ') };
    }

    const fromStatus = standard.status;

    try {
      // Registrar log de auditoria
      await centralPadroesAuditService.logStatusChange(
        'standard',
        standard.id,
        fromStatus,
        toStatus,
        standard as any,
        options?.reason
      );

      console.info(`[canonical-gate] Transição executada: ${standard.key} (${fromStatus} → ${toStatus})`);
      return {
        success: true,
        standard: { ...standard, status: toStatus, canonicalLevel: toStatus },
      };
    } catch (err) {
      return { success: false, error: `Falha ao executar transição: ${(err as Error).message}` };
    }
  },

  /**
   * Retorna todos os status válidos para um dado status de origem.
   */
  getAvailableTransitions(fromStatus: CentralStandardStatus): { to: CentralStandardStatus; gate: CanonicalGate }[] {
    return CANONICAL_GATES
      .filter((g) => g.from === fromStatus)
      .map((g) => ({ to: g.to, gate: g }));
  },
};
