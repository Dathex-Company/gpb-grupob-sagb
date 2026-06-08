import { Agent } from '../../../../types';
import { Agent18Id, AGENT_18_IDS, AGENT_18_MAP, BLOCK_CONFIG, Agent18Config } from '../types/salaDev.agentConstants';

/**
 * Prefixo canônico para os agentes oficiais da Sala Dev no Quadro de Elite.
 * Exemplo de canonicalId: "sagb_sala_ca_001", "sagb_sala_ca_018"
 */
const SALA_DEV_AGENT_CANONICAL_PREFIX = 'sagb_sala_ca_';

/**
 * Converte um ID canônico do QE para o ID interno da Sala Dev (ex: "ca-01").
 * Exemplo: "sagb_sala_ca_001" → "ca-01"
 */
function canonicalIdToAgent18Id(canonicalId: string): Agent18Id | null {
  const normalized = canonicalId.toLowerCase().trim();
  if (!normalized.startsWith(SALA_DEV_AGENT_CANONICAL_PREFIX)) return null;
  const sequence = normalized.replace(SALA_DEV_AGENT_CANONICAL_PREFIX, '');
  const num = parseInt(sequence, 10);
  if (isNaN(num) || num < 1 || num > 18) return null;
  const padded = num.toString().padStart(2, '0');
  const candidate = `ca-${padded}` as Agent18Id;
  if (AGENT_18_IDS.includes(candidate)) return candidate;
  return null;
}

/**
 * Extrai metadados de bloco e ordem de um agente do QE.
 * Usa campos como `configs` ou `metadata` se existirem, senão usa o padrão do AGENT_18_MAP.
 */
function extractBlockMeta(agent: Agent, internalId: Agent18Id): {
  blockNumber: number;
  blockId: string;
  blockName: string;
  orderInBlock: number;
  avatarColor: string;
  skills: string[];
} {
  const defaults = AGENT_18_MAP[internalId];
  const blockConfig = BLOCK_CONFIG[defaults.block];
  const agentIndexInBlock = blockConfig.agents.indexOf(internalId);

  return {
    blockNumber: defaults.block,
    blockId: blockConfig.id,
    blockName: blockConfig.name,
    orderInBlock: agentIndexInBlock >= 0 ? agentIndexInBlock + 1 : 0,
    avatarColor: defaults.avatarColor,
    skills: defaults.skills
  };
}

export const quadroDeEliteConnector = {
  /**
   * Filtra os agentes oficiais recebidos do App (Quadro de Elite → Supabase)
   * para retornar apenas os 18 agentes CA-01 a CA-18 da Sala Dev.
   *
   * A filtragem é feita pelo campo `canonicalId` seguindo o padrão "sagb_sala_ca_NNN".
   * Se nenhum agente for encontrado, retorna fallback mock com os dados do AGENT_18_MAP.
   */
  filterSalaDevAgents(officialAgents: Agent[] | undefined | null): Agent[] {
    if (!officialAgents || !Array.isArray(officialAgents) || officialAgents.length === 0) {
      return [];
    }

    const salaDevAgents = officialAgents.filter((agent) => {
      const cid = agent.canonicalId || '';
      return canonicalIdToAgent18Id(cid) !== null;
    });

    return salaDevAgents;
  },

  /**
   * Mapeia um agente do QE para os dados de configuração que a Sala Dev precisa
   * (bloco, cor, skills, etc.). Se o agente não tiver canonicalId reconhecido,
   * usa o fallback do AGENT_18_MAP.
   */
  enrichAgentFromQe(agent: Agent): Agent18Config {
    const internalId = canonicalIdToAgent18Id(agent.canonicalId || '');
    const baseConfig = internalId ? AGENT_18_MAP[internalId] : null;

    if (!baseConfig) {
      // Fallback: usa o nome do agente para tentar encontrar no mapa
      const matched = AGENT_18_IDS.find(
        (id) => AGENT_18_MAP[id].name.toLowerCase() === (agent.name || '').toLowerCase()
      );
      return matched ? AGENT_18_MAP[matched] : AGENT_18_MAP['ca-01'];
    }

    return baseConfig;
  },

  /**
   * Verifica se um agente oficial é um agente da Sala Dev
   * (identificado pelo canonicalId com prefixo "sagb_sala_ca_").
   */
  isSalaDevAgent(agent: Agent): boolean {
    return canonicalIdToAgent18Id(agent.canonicalId || '') !== null;
  },

  /**
   * Retorna o ID interno da Sala Dev (ex: "ca-07") a partir de um agente oficial.
   */
  getInternalAgentId(agent: Agent): Agent18Id | null {
    return canonicalIdToAgent18Id(agent.canonicalId || '');
  },

  /**
   * Obtém a configuração de bloco para um agente, seja ele real do QE ou fallback.
   */
  getBlockConfigForAgent(agentOrId: Agent | Agent18Id): {
    blockNumber: number;
    blockId: string;
    blockName: string;
    agentsInBlock: Agent18Id[];
  } | null {
    let internalId: Agent18Id | null;

    if (typeof agentOrId === 'string') {
      internalId = AGENT_18_IDS.includes(agentOrId as Agent18Id) ? (agentOrId as Agent18Id) : null;
    } else {
      internalId = this.getInternalAgentId(agentOrId);
    }

    if (!internalId) return null;
    const config = AGENT_18_MAP[internalId];
    const blockConfig = BLOCK_CONFIG[config.block];

    return {
      blockNumber: config.block,
      blockId: blockConfig.id,
      blockName: blockConfig.name,
      agentsInBlock: blockConfig.agents
    };
  },

  /**
   * Retorna a configuração completa de blocos (BLOCK_CONFIG) para uso externo.
   */
  getBlockConfigs() {
    return BLOCK_CONFIG;
  },

  /**
   * Retorna a lista completa de IDs de agentes da Sala Dev
   */
  getAgent18Ids(): readonly Agent18Id[] {
    return AGENT_18_IDS;
  }
};

export type QuadroDeEliteConnector = typeof quadroDeEliteConnector;
