import { Agent } from '../types';

export type AgentOperationalStatus = 'ESTRUTURAL' | 'DISPONIVEL' | 'ATIVO';

const clean = (value?: string | null) => String(value || '').trim();

export const hasAgentOperationalDna = (agent?: Partial<Agent> | null): boolean => {
  if (!agent) return false;

  const effectivePrompt = clean(agent.effectivePrompt);
  const dnaIndividualPrompt = clean(agent.dnaIndividualPrompt);
  const fullPrompt = clean(agent.fullPrompt);
  const reflectedDnaStatus = String(agent.dnaStatus || '').toUpperCase();

  if (effectivePrompt) return true;
  if (dnaIndividualPrompt) return true;

  // Compatibilidade com registros legados: aceita fullPrompt apenas quando há
  // indicação explícita de DNA completo. Na dúvida, cai no estado seguro.
  if (fullPrompt && reflectedDnaStatus === 'DNA_COMPLETO') return true;

  return false;
};

export const deriveOperationalStatus = (agent?: Partial<Agent> | null): AgentOperationalStatus => {
  if (!hasAgentOperationalDna(agent)) return 'ESTRUTURAL';

  const explicit = String(agent?.operationalStatus || '').toUpperCase();
  if (explicit === 'ATIVO') return 'ATIVO';
  if (explicit === 'DISPONIVEL') return 'DISPONIVEL';

  return String(agent?.status || '').toUpperCase() === 'ACTIVE' ? 'ATIVO' : 'DISPONIVEL';
};

export const isAgentOperationallyBlocked = (agent?: Partial<Agent> | null): boolean => {
  return deriveOperationalStatus(agent) === 'ESTRUTURAL';
};

export const isAgentOperationallyAvailable = (agent?: Partial<Agent> | null): boolean => {
  const status = deriveOperationalStatus(agent);
  return status === 'DISPONIVEL' || status === 'ATIVO';
};

export const isAgentOperationallyActive = (agent?: Partial<Agent> | null): boolean => {
  return deriveOperationalStatus(agent) === 'ATIVO' && String(agent?.status || '').toUpperCase() === 'ACTIVE';
};

export const getOperationalStatusLabel = (status?: string | null): string => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'ATIVO') return 'Ativo';
  if (normalized === 'DISPONIVEL') return 'Disponível';
  return 'Estrutural';
};