// ============================================================
// Central de Padrões — Serviço de Permissões (T1.6)
// ============================================================
// Matriz de papéis: leitor, editor, curador, aprovador, admin, agente, auditor
// Verificação centralizada: can(userRole, action, item?)

import { auth } from '../../../../services/supabase';
import {
  CentralAction,
  CentralProfileRole,
  CentralStandard,
  CENTRAL_PERMISSION_MATRIX
} from '../types';

const getUserRole = (): CentralProfileRole => {
  const user = auth.currentUser as { email?: string; app_metadata?: { profile_role?: CentralProfileRole } } | null;
  return user?.app_metadata?.profile_role || 'leitor';
};

const getUserEmail = (): string => {
  const user = auth.currentUser as { email?: string } | null;
  return user?.email || 'unknown';
};

export const centralPadroesPermissionService = {
  /**
   * Retorna o perfil do usuário atual.
   */
  getCurrentRole(): CentralProfileRole {
    return getUserRole();
  },

  /**
   * Retorna o email do usuário atual.
   */
  getCurrentUser(): string {
    return getUserEmail();
  },

  /**
   * Verifica se um perfil tem permissão para uma ação.
   */
  can(role: CentralProfileRole, action: CentralAction): boolean {
    const allowed = CENTRAL_PERMISSION_MATRIX[role];
    return allowed?.includes(action) ?? false;
  },

  /**
   * Verifica se o usuário atual pode realizar uma ação.
   */
  canCurrent(action: CentralAction): boolean {
    return this.can(getUserRole(), action);
  },

  /**
   * Verifica se o usuário pode editar um padrão específico.
   * Regras:
   * - admin pode editar qualquer coisa
   * - curador pode editar não-canônico
   * - aprovador pode editar não-canônico
   * - editor só pode editar rascunho próprio
   */
  canEditStandard(role: CentralProfileRole, standard: CentralStandard): boolean {
    if (role === 'administrador') return true;
    if (role === 'curador' || role === 'aprovador') {
      return !['canonico_operacional', 'canonico_oficial', 'publicado'].includes(standard.canonicalLevel || standard.status);
    }
    if (role === 'editor') {
      const isOwner = standard.owner === getUserEmail() || standard.owner === getUserEmail();
      const isDraft = ['bruto', 'rascunho', 'em_revisao'].includes(standard.status);
      return isOwner && isDraft;
    }
    return false;
  },

  /**
   * Verifica se o agente pode consultar um padrão.
   * Agente autorizado pode ver, mas não pode editar nem aprovar.
   */
  canAgentAccess(role: CentralProfileRole): boolean {
    return role === 'agente_autorizado' || role === 'administrador';
  },

  /**
   * Verifica se o usuário pode aprovar este padrão.
   * Aprovador pode aprovar, admin pode aprovar.
   * Agente não pode aprovar o próprio output.
   */
  canApproveStandard(role: CentralProfileRole, standard: CentralStandard, agentCode?: string): boolean {
    if (agentCode && role === 'agente_autorizado') return false; // agente não aprova próprio output
    return role === 'aprovador' || role === 'administrador';
  },

  /**
   * Verifica se o usuário pode visualizar logs.
   */
  canViewLogs(role: CentralProfileRole): boolean {
    return ['auditor', 'administrador', 'aprovador'].includes(role);
  },

  /**
   * Verifica se o usuário pode publicar um padrão.
   */
  canPublishStandard(role: CentralProfileRole): boolean {
    return role === 'administrador';
  },

  /**
   * Retorna as ações permitidas para um perfil.
   */
  getAllowedActions(role: CentralProfileRole): CentralAction[] {
    return CENTRAL_PERMISSION_MATRIX[role] || [];
  },

  /**
   * Lança erro se o usuário não tiver permissão.
   */
  requirePermission(action: CentralAction): void {
    if (!this.canCurrent(action)) {
      throw new Error(`Acesso negado: você não tem permissão para "${action}". Seu perfil: ${getUserRole()}`);
    }
  },

  /**
   * Retorna funções de filtro para consultas (baseado no perfil).
   */
  getVisibilityFilter(): { deletedAt: null } {
    return { deletedAt: null };
  }
};
