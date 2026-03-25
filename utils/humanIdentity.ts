import { Agent } from '../types';

export type HumanAccessStatus = 'ESTRUTURAL' | 'AUTENTICAVEL' | 'AUTENTICADO';

const normalizeEmail = (value?: string | null) => String(value || '').trim().toLowerCase();

export const isHumanStructuralEntity = (agent?: Partial<Agent> | null): boolean => {
  const entityType = String(agent?.entityType || '').toUpperCase();
  const collaboratorType = String(agent?.collaboratorType || '').toUpperCase();
  return entityType === 'HUMANO' || entityType === 'HIBRIDO' || collaboratorType === 'HUMANO' || collaboratorType === 'HIBRIDO';
};

export const getAgentAuthEmail = (agent?: Partial<Agent> | null): string => {
  if (!agent) return '';
  return normalizeEmail(
    agent.email
  );
};

export const resolveHumanAccessStatus = (
  agent?: Partial<Agent> | null,
  authUsersByEmail: Record<string, { id: string; email: string }> = {},
  activeSessionEmail?: string | null
): HumanAccessStatus => {
  if (!isHumanStructuralEntity(agent)) return 'ESTRUTURAL';

  const authEmail = getAgentAuthEmail(agent);
  
  // Se tem authUserId definido e bate com o email ativo, é autenticado
  // Como não passamos sessionUid aqui, vamos basear no email ou apenas reportar se está autenticável
  const hasStrongLink = Boolean(agent?.authUserId);
  
  if (!authEmail && !hasStrongLink) return 'ESTRUTURAL';

  // Verifica se o email de fato tem usuário no Auth
  const linkedAuthUser = authEmail ? authUsersByEmail[authEmail] : null;
  
  // Se não tem link forte nem conta existente, não tem como autenticar
  if (!linkedAuthUser?.id && !hasStrongLink) return 'ESTRUTURAL';

  // Se o email em uso bate com o do agente
  if (authEmail && activeSessionEmail && normalizeEmail(activeSessionEmail) === authEmail) {
    return 'AUTENTICADO';
  }

  return 'AUTENTICAVEL';
};

export const getHumanAccessStatusLabel = (status?: string | null): string => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'AUTENTICADO') return 'Autenticado';
  if (normalized === 'AUTENTICAVEL') return 'Autenticável';
  return 'Estrutural';
};