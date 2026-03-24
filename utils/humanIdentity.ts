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
  if (!authEmail) return 'ESTRUTURAL';

  const linkedAuthUser = authUsersByEmail[authEmail];
  if (!linkedAuthUser?.id) return 'ESTRUTURAL';

  return normalizeEmail(activeSessionEmail) === authEmail ? 'AUTENTICADO' : 'AUTENTICAVEL';
};

export const getHumanAccessStatusLabel = (status?: string | null): string => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'AUTENTICADO') return 'Autenticado';
  if (normalized === 'AUTENTICAVEL') return 'Autenticável';
  return 'Estrutural';
};