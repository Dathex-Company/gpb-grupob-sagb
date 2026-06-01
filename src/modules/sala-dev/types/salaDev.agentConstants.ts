export const AGENT_18_IDS = [
  'ca-01',
  'ca-02',
  'ca-03',
  'ca-04',
  'ca-05',
  'ca-06',
  'ca-07',
  'ca-08',
  'ca-09',
  'ca-10',
  'ca-11',
  'ca-12',
  'ca-13',
  'ca-14',
  'ca-15',
  'ca-16',
  'ca-17',
  'ca-18'
] as const;

export type Agent18Id = typeof AGENT_18_IDS[number];
export type BlockNumber = 1 | 2 | 3 | 4 | 5;

export interface Agent18Config {
  id: Agent18Id;
  name: string;
  role: string;
  block: BlockNumber;
  avatarColor: string;
  specialty: string;
  skills: string[];
}

export const AGENT_18_MAP: Record<Agent18Id, Agent18Config> = {
  'ca-01': { id: 'ca-01', name: 'Orquestrador', role: 'Orquestrador Técnico', block: 1, avatarColor: '#10B981', specialty: 'Coordenação de run, handoffs e gates', skills: ['coordenação', 'handoffs', 'gates', 'priorização'] },
  'ca-02': { id: 'ca-02', name: 'Arquiteto', role: 'Arquiteto de Sistemas', block: 2, avatarColor: '#3B82F6', specialty: 'Arquitetura, contratos e estrutura técnica', skills: ['arquitetura', 'contratos', 'modularização'] },
  'ca-03': { id: 'ca-03', name: 'Tech Writer', role: 'Documentação Técnica', block: 2, avatarColor: '#A855F7', specialty: 'Documentação, ADRs e continuidade', skills: ['documentação', 'adr', 'changelog'] },
  'ca-04': { id: 'ca-04', name: 'Frontend Eng.', role: 'Front-end Engineer', block: 3, avatarColor: '#EC4899', specialty: 'React, UI e integração visual', skills: ['react', 'typescript', 'componentes'] },
  'ca-05': { id: 'ca-05', name: 'Backend Eng.', role: 'Back-end Engineer', block: 3, avatarColor: '#06B6D4', specialty: 'Services, repositories e regras de negócio', skills: ['services', 'repositories', 'regras'] },
  'ca-06': { id: 'ca-06', name: 'DB Engineer', role: 'Supabase / Database Engineer', block: 3, avatarColor: '#F97316', specialty: 'Supabase, migrations, RLS e dados', skills: ['supabase', 'sql', 'migrations', 'rls'] },
  'ca-07': { id: 'ca-07', name: 'Integrations', role: 'API & Integrations Engineer', block: 3, avatarColor: '#6366F1', specialty: 'APIs, webhooks e integrações', skills: ['api', 'webhooks', 'storage'] },
  'ca-08': { id: 'ca-08', name: 'Security Eng.', role: 'Segurança Técnica', block: 4, avatarColor: '#EF4444', specialty: 'Segurança, auth, RLS e threat model', skills: ['security', 'auth', 'rls', 'threat-model'] },
  'ca-09': { id: 'ca-09', name: 'DevOps Eng.', role: 'DevOps / Deploy Engineer', block: 5, avatarColor: '#64748B', specialty: 'Build, deploy, ambiente e rollback', skills: ['build', 'deploy', 'rollback'] },
  'ca-10': { id: 'ca-10', name: 'QA Reviewer', role: 'QA / Testes e Validação', block: 4, avatarColor: '#F59E0B', specialty: 'QA, testes e critérios de aceite', skills: ['qa', 'testes', 'validação'] },
  'ca-11': { id: 'ca-11', name: 'Logs Eng.', role: 'Logs e Observabilidade', block: 4, avatarColor: '#14B8A6', specialty: 'Logs, incidentes e rastreabilidade', skills: ['logs', 'observabilidade', 'incidentes'] },
  'ca-12': { id: 'ca-12', name: 'Versioning', role: 'Versionamento Técnico', block: 5, avatarColor: '#8B5CF6', specialty: 'Release, changelog e versionamento', skills: ['git', 'release', 'changelog'] },
  'ca-13': { id: 'ca-13', name: 'Cataloger', role: 'Catálogo Técnico', block: 1, avatarColor: '#84CC16', specialty: 'Inventário técnico e referências existentes', skills: ['catálogo', 'inventário', 'mapeamento'] },
  'ca-14': { id: 'ca-14', name: 'MCP/Autom.', role: 'Agentes / MCPs / Automações', block: 3, avatarColor: '#22D3EE', specialty: 'Automações, MCPs e bridges', skills: ['mcp', 'automação', 'bridges'] },
  'ca-15': { id: 'ca-15', name: 'Code Reviewer', role: 'Revisor de Código', block: 4, avatarColor: '#FB923C', specialty: 'Code review, dívida técnica e manutenção', skills: ['code-review', 'refatoração', 'manutenção'] },
  'ca-16': { id: 'ca-16', name: 'UX/UI Eng.', role: 'UX/UI Técnico', block: 2, avatarColor: '#C084FC', specialty: 'Fluxos, telas e experiência operacional', skills: ['ux', 'ui', 'jornada'] },
  'ca-17': { id: 'ca-17', name: 'Runbooks', role: 'Operação e Runbooks', block: 5, avatarColor: '#94A3B8', specialty: 'Operação, suporte e runbooks', skills: ['runbook', 'suporte', 'recuperação'] },
  'ca-18': { id: 'ca-18', name: 'Guardian', role: 'Guardião de Reaproveitamento', block: 1, avatarColor: '#2DD4BF', specialty: 'Reaproveitamento técnico e antduplicidade', skills: ['reaproveitamento', 'auditoria', 'duplicidade'] }
};

export const BLOCK_CONFIG: Record<BlockNumber, {
  id: string;
  name: string;
  shortName: string;
  order: BlockNumber;
  agents: Agent18Id[];
  description: string;
}> = {
  1: { id: 'block-1', name: 'Bloco 1 — Entrada e Organização', shortName: 'Entrada', order: 1, agents: ['ca-01', 'ca-18', 'ca-13'], description: 'Briefing, reaproveitamento e catálogo técnico.' },
  2: { id: 'block-2', name: 'Bloco 2 — Arquitetura e Documentação', shortName: 'Arquitetura', order: 2, agents: ['ca-02', 'ca-16', 'ca-03'], description: 'Arquitetura, UX/UI técnico e documentação inicial.' },
  3: { id: 'block-3', name: 'Bloco 3 — Construção Técnica', shortName: 'Construção', order: 3, agents: ['ca-06', 'ca-05', 'ca-07', 'ca-14', 'ca-04'], description: 'Banco, backend, integrações, automações e frontend.' },
  4: { id: 'block-4', name: 'Bloco 4 — Segurança e Qualidade', shortName: 'Qualidade', order: 4, agents: ['ca-15', 'ca-08', 'ca-10', 'ca-11'], description: 'Code review, segurança, QA e observabilidade.' },
  5: { id: 'block-5', name: 'Bloco 5 — Deploy e Operação', shortName: 'Operação', order: 5, agents: ['ca-12', 'ca-09', 'ca-17'], description: 'Versionamento, deploy e runbook operacional.' }
};

export function getAgent18List(): Agent18Config[] {
  return AGENT_18_IDS.map((id) => AGENT_18_MAP[id]);
}

