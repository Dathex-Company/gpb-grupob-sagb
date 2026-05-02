import { Agent } from '../../../../types';
import { AgentCatalogEntity } from '../types/salaDev.domain';
import { getSalaDevMockAgents, getSalaDevMockDomainSnapshot } from './salaDevMockService';

export const salaDevAgentCatalogAdapter = {
  /**
   * Converte o catálogo oficial de Agentes (App.tsx -> Agent[]) para o formato
   * estrito e focado na Sala Dev (AgentCatalogEntity[]).
   */
  adaptFromOfficial(officialAgents: Agent[] | undefined | null): AgentCatalogEntity[] {
    if (!officialAgents || !Array.isArray(officialAgents) || officialAgents.length === 0) {
      console.warn('[sala-dev][fallback->mock] Nenhum agente oficial fornecido via props. Usando mock como fallback para catálogo disponível.');
      return getSalaDevMockDomainSnapshot().availableAgents;
    }

    // Filtra apenas agentes em estado passível de execução (ignorando ESTRUTURAL/ARQUIVADO se possível)
    // Para a Onda 2A, aceitaremos qualquer agente ATIVO ou DISPONIVEL (via fallback lógico)
    const playableAgents = officialAgents.filter(a => {
       const status = String(a.status || '').toUpperCase();
       return status === 'ACTIVE' || status === 'STAGING' || status === 'PLANNED';
    });

    if (playableAgents.length === 0) {
      console.warn('[sala-dev][fallback->mock] Lista de agentes fornecida não contém agentes elegíveis para execução. Usando mock.');
      return getSalaDevMockDomainSnapshot().availableAgents;
    }

    return playableAgents.map((agent): AgentCatalogEntity => {
      // Regra de taxonomia de skills/necessidades (Onda 2A)
      // Como o cadastro oficial é focado no texto corrido (fullPrompt),
      // derivamos tags de skills das propriedades base do agente para fins de UI e match de esteira
      const derivedSkills = new Set<string>();
      if (agent.modelProvider) derivedSkills.add(agent.modelProvider);
      if (agent.area) derivedSkills.add(agent.area.toLowerCase());
      if (agent.tier === 'ESTRATÉGICO') derivedSkills.add('estratégia');
      if (agent.tier === 'TÁTICO') derivedSkills.add('coordenação');
      if (agent.tier === 'OPERACIONAL') derivedSkills.add('execução');

      const derivedTechnicalNeeds = [
        agent.baseRoleUniversal || agent.officialRole || 'Apoio técnico',
        agent.tier || 'OPERACIONAL'
      ];

      return {
        // ID real da tabela public.agents (UUID)
        agentId: agent.id, 
        name: agent.name || 'Agente Desconhecido',
        role: agent.officialRole || agent.functionName || agent.baseRoleUniversal || 'Assessor',
        specialty: agent.area || agent.sector || agent.division || 'Geral',
        // Fallback genérico para UI. Um motor de IA real poderia fazer "matching" entre a especialidade e as macrocamadas da Sala
        suggestedMacroLayerId: undefined, 
        availability: agent.status === 'ACTIVE' ? 'available' : agent.status === 'STAGING' ? 'limited' : 'unavailable',
        technicalNeeds: derivedTechnicalNeeds.filter(Boolean),
        skills: Array.from(derivedSkills),
        complexityFit: agent.tier === 'ESTRATÉGICO' ? 'high' : agent.tier === 'TÁTICO' ? 'medium' : 'low',
        // Marcador crítico de rastreabilidade (Onda 2C)
        isOfficialAgentReference: true,
        dnaVersionId: agent.version || undefined
      };
    });
  }
};
