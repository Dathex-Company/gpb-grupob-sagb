import { CentralDocument } from '../types';

/**
 * Índice completo de documentos oficiais da Central de Padrões.
 * 
 * Fonte canônica: src/modules/central_padroes/docs/estrutura-de-documentos-oficiais/
 * 
 * Todos os arquivos da pasta oficial devem estar indexados aqui.
 * Este índice alimenta o centralDocumentsManifest e, por consequência,
 * a tela Documentos (Document Hub V2).
 * 
 * Auditoria de paridade: 00.14-auditoria-paridade-documentos-oficiais-central-padroes-14-06-2026.md
 * Data da indexação completa: 14-06-2026
 */

const BASE = 'src/modules/central_padroes/docs/estrutura-de-documentos-oficiais';

export const officialDocumentsIndex: CentralDocument[] = [
  /* ═══════════════════════════════════════════════════════════════════
     00 — GOVERNANÇA CENTRAL DE PADRÕES
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-00-gov',
    title: 'Documento Mestre — Governança Central de Padrões',
    path: `${BASE}/00-governanca-central-padroes/dm-00-gov-documento-mestre-governanca-central-padroes-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/00-governanca-central-padroes/dm-00-gov-documento-mestre-governanca-central-padroes-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Governança',
    areaId: 'pietro',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Pietro Carboni',
    tags: ['documento-mestre', 'governanca', 'central-padroes', 'oficial'],
    summary: 'Documento mestre de governança da Central de Padrões.',
    riskLevel: 'alto',
    canonicalLevel: 'oficial'
  },
  {
    id: 'gov-mtz-001',
    title: 'Matriz de Fonte da Verdade (previsto)',
    path: `${BASE}/00-governanca-central-padroes/gov-mtz-001-fonte-verdade-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/00-governanca-central-padroes/gov-mtz-001-fonte-verdade-previsto.md',
    status: 'previsto',
    officialStatus: 'rascunho',
    category: 'Governança',
    areaId: 'pietro',
    shouldBecome: 'matriz',
    type: 'matriz',
    source: 'md_indexado',
    owner: 'Pietro Carboni',
    tags: ['matriz', 'fonte-verdade', 'previsto', 'governanca'],
    summary: 'Matriz de fonte da verdade para governança (previsto).',
    riskLevel: 'alto',
    canonicalLevel: 'candidato'
  },
  {
    id: 'gov-pad-001',
    title: 'Travas de Linguagem GrupoB (previsto)',
    path: `${BASE}/00-governanca-central-padroes/gov-pad-001-travas-linguagem-grupob-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/00-governanca-central-padroes/gov-pad-001-travas-linguagem-grupob-previsto.md',
    status: 'previsto',
    officialStatus: 'rascunho',
    category: 'Governança',
    areaId: 'pietro',
    shouldBecome: 'padrao',
    type: 'padrao',
    source: 'md_indexado',
    owner: 'Pietro Carboni',
    tags: ['padrao', 'linguagem', 'grupob', 'previsto', 'governanca'],
    summary: 'Travas de linguagem oficiais do GrupoB (previsto).',
    riskLevel: 'medio',
    canonicalLevel: 'candidato'
  },

  /* ═══════════════════════════════════════════════════════════════════
     01 — PADRÕES TÉCNICOS LOZE
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-01-tec',
    title: 'Documento Mestre — Padrões Técnicos Loze',
    path: `${BASE}/01-padroes-tecnicos-loze/dm-01-tec-loze-documento-mestre-padroes-tecnicos-loze-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/01-padroes-tecnicos-loze/dm-01-tec-loze-documento-mestre-padroes-tecnicos-loze-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Técnico',
    areaId: 'savio',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Sávio Codare',
    tags: ['documento-mestre', 'loze', 'padroes-tecnicos', 'oficial'],
    summary: 'Documento mestre de padrões técnicos Loze.',
    riskLevel: 'critico',
    canonicalLevel: 'oficial'
  },
  {
    id: 'tec-pad-002',
    title: 'Idempotência em Tool Calls (previsto)',
    path: `${BASE}/01-padroes-tecnicos-loze/tec-pad-002-idempotencia-tool-calls-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/01-padroes-tecnicos-loze/tec-pad-002-idempotencia-tool-calls-previsto.md',
    status: 'previsto',
    officialStatus: 'rascunho',
    category: 'Técnico',
    areaId: 'savio',
    shouldBecome: 'padrao',
    type: 'padrao',
    source: 'md_indexado',
    owner: 'Sávio Codare',
    tags: ['padrao', 'idempotencia', 'tool-calls', 'previsto', 'tecnico'],
    summary: 'Padrão de idempotência em tool calls (previsto).',
    riskLevel: 'alto',
    canonicalLevel: 'candidato'
  },
  {
    id: 'tec-pad-003',
    title: 'Versionamento (previsto)',
    path: `${BASE}/01-padroes-tecnicos-loze/tec-pad-003-versionamento-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/01-padroes-tecnicos-loze/tec-pad-003-versionamento-previsto.md',
    status: 'previsto',
    officialStatus: 'rascunho',
    category: 'Técnico',
    areaId: 'savio',
    shouldBecome: 'padrao',
    type: 'padrao',
    source: 'md_indexado',
    owner: 'Sávio Codare',
    tags: ['padrao', 'versionamento', 'previsto', 'tecnico'],
    summary: 'Padrão de versionamento (previsto).',
    riskLevel: 'medio',
    canonicalLevel: 'candidato'
  },

  /* ═══════════════════════════════════════════════════════════════════
     02 — PROCESSOS, EXECUÇÃO E REGISTROS OPERACIONAIS
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-02-proc',
    title: 'Documento Mestre — Processos, Execução e Registros Operacionais',
    path: `${BASE}/02-processos-execucao-registros-operacionais/dm-02-proc-documento-mestre-processos-execucao-registros-operacionais-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/02-processos-execucao-registros-operacionais/dm-02-proc-documento-mestre-processos-execucao-registros-operacionais-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Processos',
    areaId: 'yuri',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Yuri Sague',
    tags: ['documento-mestre', 'processos', 'execucao', 'taskzei', 'oficial'],
    summary: 'Documento mestre de processos, execução e registros operacionais.',
    riskLevel: 'alto',
    canonicalLevel: 'oficial'
  },
  {
    id: 'proc-pad-002',
    title: 'Registro de Decisão Estruturado (previsto)',
    path: `${BASE}/02-processos-execucao-registros-operacionais/proc-pad-002-registro-decisao-estruturado-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/02-processos-execucao-registros-operacionais/proc-pad-002-registro-decisao-estruturado-previsto.md',
    status: 'previsto',
    officialStatus: 'rascunho',
    category: 'Processos',
    areaId: 'yuri',
    shouldBecome: 'padrao',
    type: 'padrao',
    source: 'md_indexado',
    owner: 'Yuri Sague',
    tags: ['padrao', 'registro-decisao', 'previsto', 'processos'],
    summary: 'Padrão de registro de decisão estruturado (previsto).',
    riskLevel: 'medio',
    canonicalLevel: 'candidato'
  },

  /* ═══════════════════════════════════════════════════════════════════
     03 — SEGURANÇA DIGITAL, RISCO E PROTEÇÃO
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-03-seg',
    title: 'Documento Mestre — Segurança Digital, Risco e Proteção',
    path: `${BASE}/03-seguranca-digital-risco-protecao/dm-03-seg-documento-mestre-seguranca-digital-risco-protecao-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/03-seguranca-digital-risco-protecao/dm-03-seg-documento-mestre-seguranca-digital-risco-protecao-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Segurança',
    areaId: 'pedro',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Pedro Gazan',
    tags: ['documento-mestre', 'seguranca', 'risco', 'protecao', 'oficial'],
    summary: 'Documento mestre de segurança digital, risco e proteção.',
    riskLevel: 'critico',
    canonicalLevel: 'oficial'
  },

  /* ═══════════════════════════════════════════════════════════════════
     04 — UX/UI, EXPERIÊNCIA E INTERFACE
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-04-ux',
    title: 'Documento Mestre — UX/UI, Experiência e Interface',
    path: `${BASE}/04-ux-ui-experiencia-interface/dm-04-ux-documento-mestre-ux-ui-experiencia-interface-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/04-ux-ui-experiencia-interface/dm-04-ux-documento-mestre-ux-ui-experiencia-interface-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'UX/UI',
    areaId: 'alice',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Alice Montini',
    tags: ['documento-mestre', 'ux', 'ui', 'design-system', 'oficial'],
    summary: 'Documento mestre de UX/UI, experiência e interface.',
    riskLevel: 'alto',
    canonicalLevel: 'oficial'
  },

  /* ═══════════════════════════════════════════════════════════════════
     05 — AGENTES AUTÔNOMOS, IA E ORQUESTRAÇÃO
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-05-agt',
    title: 'Documento Mestre — Agentes Autônomos, IA e Orquestração',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/dm-05-agt-documento-mestre-agentes-autonomos-ia-orquestracao-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/dm-05-agt-documento-mestre-agentes-autonomos-ia-orquestracao-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Agentes',
    areaId: 'pierre',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Pierre Zanulli',
    tags: ['documento-mestre', 'agentes', 'ia', 'orquestracao', 'oficial'],
    summary: 'Documento mestre de agentes autônomos, IA e orquestração.',
    riskLevel: 'critico',
    canonicalLevel: 'oficial'
  },
  {
    id: 'agt-mtz-002',
    title: 'Matriz de Autonomia 0-6 (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-mtz-002-matriz-autonomia-0-6-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-mtz-002-matriz-autonomia-0-6-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'matriz', type: 'matriz', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['matriz', 'autonomia', 'previsto', 'agentes'], summary: 'Matriz de autonomia 0-6 para agentes (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-mtz-003',
    title: 'Alçada de Veto (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-mtz-003-alcada-veto-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-mtz-003-alcada-veto-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'matriz', type: 'matriz', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['matriz', 'veto', 'previsto', 'agentes'], summary: 'Alçada de veto para agentes (previsto).', riskLevel: 'critico', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-pad-002',
    title: 'Memória Governada (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-pad-002-memoria-governada-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-pad-002-memoria-governada-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'padrao', type: 'padrao', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['padrao', 'memoria', 'previsto', 'agentes'], summary: 'Padrão de memória governada para agentes (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-pol-002',
    title: 'Integridade do Agente (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-pol-002-integridade-agente-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-pol-002-integridade-agente-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'politica', type: 'politica', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['politica', 'integridade', 'previsto', 'agentes'], summary: 'Política de integridade do agente (previsto).', riskLevel: 'critico', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-pol-003',
    title: 'Tool Use Seguro (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-pol-003-tool-use-seguro-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-pol-003-tool-use-seguro-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'politica', type: 'politica', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['politica', 'tool-use', 'previsto', 'agentes'], summary: 'Política de tool use seguro para agentes (previsto).', riskLevel: 'critico', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-pri-003',
    title: 'Viés Positivo (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-pri-003-vies-positivo-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-pri-003-vies-positivo-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'principio', type: 'principio', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['principio', 'vies', 'previsto', 'agentes'], summary: 'Princípio de viés positivo para agentes (previsto).', riskLevel: 'medio', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-pro-001',
    title: 'Fronteira de Escopo (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-pro-001-fronteira-escopo-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-pro-001-fronteira-escopo-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'escopo', 'previsto', 'agentes'], summary: 'Protocolo de fronteira de escopo para agentes (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-001',
    title: 'Handoff entre Agentes (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-001-handoff-agentes-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-001-handoff-agentes-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'handoff', 'previsto', 'agentes'], summary: 'Protocolo de handoff entre agentes (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-002',
    title: 'Incidente e Kill Switch (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-002-incidente-kill-switch-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-002-incidente-kill-switch-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'kill-switch', 'previsto', 'agentes'], summary: 'Protocolo de incidente e kill switch (previsto).', riskLevel: 'critico', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-003',
    title: 'Decisão Estratégica (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-003-decisao-estrategica-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-003-decisao-estrategica-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'decisao', 'previsto', 'agentes'], summary: 'Protocolo de decisão estratégica (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-005',
    title: 'Rotina Diária (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-005-rotina-diaria-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-005-rotina-diaria-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'rotina', 'previsto', 'agentes'], summary: 'Protocolo de rotina diária (previsto).', riskLevel: 'medio', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-006',
    title: 'Interpretação Contextual (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-006-interpretacao-contextual-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-006-interpretacao-contextual-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'contexto', 'previsto', 'agentes'], summary: 'Protocolo de interpretação contextual (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-007',
    title: 'Poda de Assunto (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-007-poda-assunto-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-007-poda-assunto-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'poda', 'previsto', 'agentes'], summary: 'Protocolo de poda de assunto (previsto).', riskLevel: 'medio', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-008',
    title: 'Fechamento Obrigatório (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-008-fechamento-obrigatorio-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-008-fechamento-obrigatorio-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'fechamento', 'previsto', 'agentes'], summary: 'Protocolo de fechamento obrigatório (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-009',
    title: 'Interfone Rodrigues (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-009-interfone-rodrigues-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-009-interfone-rodrigues-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'interfone', 'previsto', 'agentes'], summary: 'Protocolo interfone Rodrigues (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-010',
    title: 'Presença UAU (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-010-presenca-uau-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-010-presenca-uau-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'uau', 'previsto', 'agentes'], summary: 'Protocolo de presença UAU (previsto).', riskLevel: 'medio', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-011',
    title: 'Comunicação entre Agentes (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-011-comunicacao-agentes-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-011-comunicacao-agentes-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'comunicacao', 'previsto', 'agentes'], summary: 'Protocolo de comunicação entre agentes (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-prt-012',
    title: 'Redirecionamento (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-prt-012-redir-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-prt-012-redir-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'protocolo', type: 'protocolo', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['protocolo', 'redir', 'previsto', 'agentes'], summary: 'Protocolo de redirecionamento (previsto).', riskLevel: 'medio', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-reg-001',
    title: 'Teto de Custo (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-reg-001-teto-custo-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-reg-001-teto-custo-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'regra', type: 'regra', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['regra', 'custo', 'previsto', 'agentes'], summary: 'Regra de teto de custo para agentes (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-reg-002',
    title: 'Regra de Reabertura (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-reg-002-regra-reabertura-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-reg-002-regra-reabertura-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'regra', type: 'regra', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['regra', 'reabertura', 'previsto', 'agentes'], summary: 'Regra de reabertura para agentes (previsto).', riskLevel: 'medio', canonicalLevel: 'candidato'
  },
  {
    id: 'agt-reg-003',
    title: 'Coerência Contextual (previsto)',
    path: `${BASE}/05-agentes-autonomos-ia-orquestracao/agt-reg-003-coerencia-contextual-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/05-agentes-autonomos-ia-orquestracao/agt-reg-003-coerencia-contextual-previsto.md',
    status: 'previsto', officialStatus: 'rascunho', category: 'Agentes', areaId: 'pierre', shouldBecome: 'regra', type: 'regra', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['regra', 'coerencia', 'previsto', 'agentes'], summary: 'Regra de coerência contextual (previsto).', riskLevel: 'alto', canonicalLevel: 'candidato'
  },

  /* ═══════════════════════════════════════════════════════════════════
     06 — MODELOS DE IA, RAI E RADAR TECNOLÓGICO
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-06-ia',
    title: 'Documento Mestre — Modelos de IA, RAI e Radar Tecnológico',
    path: `${BASE}/06-modelos-ia-radar-tecnologico-governanca-ia/dm-06-ia-documento-mestre-modelos-ia-radar-tecnologico-governanca-ia-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/06-modelos-ia-radar-tecnologico-governanca-ia/dm-06-ia-documento-mestre-modelos-ia-radar-tecnologico-governanca-ia-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Modelos IA',
    areaId: 'klaus',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Klaus Wagen',
    tags: ['documento-mestre', 'modelos-ia', 'rai', 'radar', 'oficial'],
    summary: 'Documento mestre de modelos de IA, RAI e radar tecnológico.',
    riskLevel: 'alto',
    canonicalLevel: 'oficial'
  },

  /* ═══════════════════════════════════════════════════════════════════
     07 — NAMING, DISPONIBILIDADE E BANCO DE MARCAS
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-07-nam',
    title: 'Documento Mestre — Naming, Disponibilidade e Banco de Marcas',
    path: `${BASE}/07-naming-disponibilidade-banco-marcas/dm-07-nam-documento-mestre-naming-disponibilidade-banco-marcas-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/07-naming-disponibilidade-banco-marcas/dm-07-nam-documento-mestre-naming-disponibilidade-banco-marcas-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Naming',
    areaId: 'noah',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Noah Verdili',
    tags: ['documento-mestre', 'naming', 'marcas', 'oficial'],
    summary: 'Documento mestre de naming, disponibilidade e banco de marcas.',
    riskLevel: 'alto',
    canonicalLevel: 'oficial'
  },
  {
    id: 'nam-pad-002',
    title: 'Dicionário de Normalização de Áudio (previsto)',
    path: `${BASE}/07-naming-disponibilidade-banco-marcas/nam-pad-002-dicionario-normalizacao-audio-previsto.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/07-naming-disponibilidade-banco-marcas/nam-pad-002-dicionario-normalizacao-audio-previsto.md',
    status: 'previsto',
    officialStatus: 'rascunho',
    category: 'Naming',
    areaId: 'noah',
    shouldBecome: 'padrao',
    type: 'padrao',
    source: 'md_indexado',
    owner: 'Noah Verdili',
    tags: ['padrao', 'dicionario', 'audio', 'previsto', 'naming'],
    summary: 'Dicionário de normalização de áudio (previsto).',
    riskLevel: 'medio',
    canonicalLevel: 'candidato'
  },

  /* ═══════════════════════════════════════════════════════════════════
     08 — EXPLORAÇÃO, CLASSIFICAÇÃO INICIAL DE IDEIAS
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-08-ide',
    title: 'Documento Mestre — Exploração, Classificação Inicial de Ideias',
    path: `${BASE}/08-exploracao-classificacao-inicial-ideias/dm-08-ide-documento-mestre-exploracao-classificacao-inicial-ideias-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/08-exploracao-classificacao-inicial-ideias/dm-08-ide-documento-mestre-exploracao-classificacao-inicial-ideias-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Exploração',
    areaId: 'dante',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Dante Montoya',
    tags: ['documento-mestre', 'exploracao', 'ideias', 'oficial'],
    summary: 'Documento mestre de exploração e classificação inicial de ideias.',
    riskLevel: 'medio',
    canonicalLevel: 'oficial'
  },

  /* ═══════════════════════════════════════════════════════════════════
     09 — METODOLOGIAS, FRAMEWORKS E ESTRUTURAS INTELECTUAIS
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-09-met',
    title: 'Documento Mestre — Metodologias, Frameworks e Estruturas Intelectuais',
    path: `${BASE}/09-metodologias-frameworks-estruturas-intelectuais/dm-09-met-documento-mestre-metodologias-frameworks-estruturas-intelectuais-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/09-metodologias-frameworks-estruturas-intelectuais/dm-09-met-documento-mestre-metodologias-frameworks-estruturas-intelectuais-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Metodologias',
    areaId: 'nilo',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Nilo Barret',
    tags: ['documento-mestre', 'metodologias', 'frameworks', 'oficial'],
    summary: 'Documento mestre de metodologias, frameworks e estruturas intelectuais.',
    riskLevel: 'alto',
    canonicalLevel: 'oficial'
  },

  /* ═══════════════════════════════════════════════════════════════════
     10 — EDUCAÇÃO, MENTORIAS, CURSOS E TRILHAS
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-10-edu',
    title: 'Documento Mestre — Educação, Mentorias, Cursos e Trilhas',
    path: `${BASE}/10-educacao-mentorias-cursos-trilhas-programas-formacao/dm-10-edu-documento-mestre-educacao-mentorias-cursos-trilhas-programas-formacao-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/10-educacao-mentorias-cursos-trilhas-programas-formacao/dm-10-edu-documento-mestre-educacao-mentorias-cursos-trilhas-programas-formacao-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Educação',
    areaId: 'julio',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'Júlio Mosqueira',
    tags: ['documento-mestre', 'educacao', 'mentorias', 'cursos', 'oficial'],
    summary: 'Documento mestre de educação, mentorias, cursos e trilhas.',
    riskLevel: 'medio',
    canonicalLevel: 'oficial'
  },

  /* ═══════════════════════════════════════════════════════════════════
     11 — MARCAS, EMPRESAS, VENTURES E PLANOS DE NEGÓCIO
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'dm-11-neg',
    title: 'Documento Mestre — Marcas, Empresas, Ventures e Planos de Negócio',
    path: `${BASE}/11-marcas-empresas-ventures-planos-negocio/dm-11-neg-documento-mestre-marcas-empresas-ventures-planos-negocio-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/11-marcas-empresas-ventures-planos-negocio/dm-11-neg-documento-mestre-marcas-empresas-ventures-planos-negocio-v3.0-07-06-2026.md',
    status: 'canonico',
    officialStatus: 'oficial_ativo',
    category: 'Negócios',
    areaId: 'cesar',
    shouldBecome: 'padrao',
    type: 'documento_mestre',
    source: 'md_indexado',
    owner: 'César Tulli',
    tags: ['documento-mestre', 'marcas', 'empresas', 'ventures', 'oficial'],
    summary: 'Documento mestre de marcas, empresas, ventures e planos de negócio.',
    riskLevel: 'alto',
    canonicalLevel: 'oficial'
  },

  /* ═══════════════════════════════════════════════════════════════════
     98 — FONTES ORIGINAIS V1/V2
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'src-pietro-v1',
    title: 'Fonte Original V1 — Pietro Carboni — Padrões, Metodologias e Estruturas',
    path: `${BASE}/98-fontes-originais-v1-v2/00_pietro_carboni_divisao_padroes_metodologias_estruturas_oficiais_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/00_pietro_carboni_divisao_padroes_metodologias_estruturas_oficiais_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'pietro', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['fonte-bruta', 'v1', 'pietro', 'governanca'], summary: 'Fonte original V1 de governança por Pietro Carboni.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-savio-v1',
    title: 'Fonte Original V1 — Sávio Codare — Sistemas e Arquitetura',
    path: `${BASE}/98-fontes-originais-v1-v2/01_savio_codare_divisao_sistemas_arquitetura_tecnica_programacao_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/01_savio_codare_divisao_sistemas_arquitetura_tecnica_programacao_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'savio', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Sávio Codare', tags: ['fonte-bruta', 'v1', 'savio', 'tecnico'], summary: 'Fonte original V1 de sistemas por Sávio Codare.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-savio-v2',
    title: 'Fonte Original V2 — Sávio Codare — Sistemas e Arquitetura',
    path: `${BASE}/98-fontes-originais-v1-v2/01_savio_codare_divisao_sistemas_arquitetura_tecnica_programacao_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/01_savio_codare_divisao_sistemas_arquitetura_tecnica_programacao_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'savio', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Sávio Codare', tags: ['fonte-bruta', 'v2', 'savio', 'tecnico'], summary: 'Fonte original V2 de sistemas por Sávio Codare.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-yuri-v1',
    title: 'Fonte Original V1 — Yuri Sague — Processos e TaskZei',
    path: `${BASE}/98-fontes-originais-v1-v2/02_yuri_sague_divisao_processos_execucao_registros_taskzei_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/02_yuri_sague_divisao_processos_execucao_registros_taskzei_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'yuri', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Yuri Sague', tags: ['fonte-bruta', 'v1', 'yuri', 'processos'], summary: 'Fonte original V1 de processos por Yuri Sague.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-yuri-v2',
    title: 'Fonte Original V2 — Yuri Sague — Processos e TaskZei',
    path: `${BASE}/98-fontes-originais-v1-v2/02_yuri_sague_divisao_processos_execucao_registros_taskzei_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/02_yuri_sague_divisao_processos_execucao_registros_taskzei_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'yuri', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Yuri Sague', tags: ['fonte-bruta', 'v2', 'yuri', 'processos'], summary: 'Fonte original V2 de processos por Yuri Sague.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-pedro-v1',
    title: 'Fonte Original V1 — Pedro Gazan — Segurança Digital',
    path: `${BASE}/98-fontes-originais-v1-v2/03_pedro_gazan_divisao_seguranca_digital_risco_protecao_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/03_pedro_gazan_divisao_seguranca_digital_risco_protecao_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'pedro', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Pedro Gazan', tags: ['fonte-bruta', 'v1', 'pedro', 'seguranca'], summary: 'Fonte original V1 de segurança por Pedro Gazan.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-pedro-v2',
    title: 'Fonte Original V2 — Pedro Gazan — Segurança Digital',
    path: `${BASE}/98-fontes-originais-v1-v2/03_pedro_gazan_divisao_seguranca_digital_risco_protecao_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/03_pedro_gazan_divisao_seguranca_digital_risco_protecao_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'pedro', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Pedro Gazan', tags: ['fonte-bruta', 'v2', 'pedro', 'seguranca'], summary: 'Fonte original V2 de segurança por Pedro Gazan.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-alice-v1',
    title: 'Fonte Original V1 — Alice Montini — UX/UI',
    path: `${BASE}/98-fontes-originais-v1-v2/04_alice_montini_divisao_ux_ui_experiencia_interface_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/04_alice_montini_divisao_ux_ui_experiencia_interface_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'alice', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Alice Montini', tags: ['fonte-bruta', 'v1', 'alice', 'ux'], summary: 'Fonte original V1 de UX/UI por Alice Montini.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-alice-v2',
    title: 'Fonte Original V2 — Alice Montini — UX/UI',
    path: `${BASE}/98-fontes-originais-v1-v2/04_alice_montini_divisao_ux_ui_experiencia_interface_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/04_alice_montini_divisao_ux_ui_experiencia_interface_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'alice', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Alice Montini', tags: ['fonte-bruta', 'v2', 'alice', 'ux'], summary: 'Fonte original V2 de UX/UI por Alice Montini.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-pierre-v1',
    title: 'Fonte Original V1 — Pierre Zanulli — Agentes e IA',
    path: `${BASE}/98-fontes-originais-v1-v2/05_pierre_zanulli_divisao_agentes_autonomos_ia_orquestracao_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/05_pierre_zanulli_divisao_agentes_autonomos_ia_orquestracao_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'pierre', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['fonte-bruta', 'v1', 'pierre', 'agentes'], summary: 'Fonte original V1 de agentes por Pierre Zanulli.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-pierre-v2',
    title: 'Fonte Original V2 — Pierre Zanulli — Agentes e IA',
    path: `${BASE}/98-fontes-originais-v1-v2/05_pierre_zanulli_divisao_agentes_autonomos_ia_orquestracao_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/05_pierre_zanulli_divisao_agentes_autonomos_ia_orquestracao_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'pierre', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['fonte-bruta', 'v2', 'pierre', 'agentes'], summary: 'Fonte original V2 de agentes por Pierre Zanulli.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-klaus-v1',
    title: 'Fonte Original V1 — Klaus Wagen — Modelos IA e RAI',
    path: `${BASE}/98-fontes-originais-v1-v2/06_klaus_wagen_divisao_modelos_ia_rai_radar_tecnologico_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/06_klaus_wagen_divisao_modelos_ia_rai_radar_tecnologico_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'klaus', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Klaus Wagen', tags: ['fonte-bruta', 'v1', 'klaus', 'ia'], summary: 'Fonte original V1 de modelos IA por Klaus Wagen.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-klaus-v2',
    title: 'Fonte Original V2 — Klaus Wagen — Modelos IA e RAI',
    path: `${BASE}/98-fontes-originais-v1-v2/06_klaus_wagen_divisao_modelos_ia_rai_radar_tecnologico_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/06_klaus_wagen_divisao_modelos_ia_rai_radar_tecnologico_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'klaus', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Klaus Wagen', tags: ['fonte-bruta', 'v2', 'klaus', 'ia'], summary: 'Fonte original V2 de modelos IA por Klaus Wagen.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-noah-v1',
    title: 'Fonte Original V1 — Noah Verdili — Naming e Marcas',
    path: `${BASE}/98-fontes-originais-v1-v2/07_noah_verdili_divisao_naming_disponibilidade_banco_marcas_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/07_noah_verdili_divisao_naming_disponibilidade_banco_marcas_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'noah', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Noah Verdili', tags: ['fonte-bruta', 'v1', 'noah', 'naming'], summary: 'Fonte original V1 de naming por Noah Verdili.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-noah-v2',
    title: 'Fonte Original V2 — Noah Verdili — Naming e Marcas',
    path: `${BASE}/98-fontes-originais-v1-v2/07_noah_verdili_divisao_naming_disponibilidade_banco_marcas_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/07_noah_verdili_divisao_naming_disponibilidade_banco_marcas_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'noah', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Noah Verdili', tags: ['fonte-bruta', 'v2', 'noah', 'naming'], summary: 'Fonte original V2 de naming por Noah Verdili.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-dante-v1',
    title: 'Fonte Original V1 — Dante Montoya — Exploração de Ideias',
    path: `${BASE}/98-fontes-originais-v1-v2/08_dante_montoya_divisao_exploracao_classificacao_inicial_ideias_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/08_dante_montoya_divisao_exploracao_classificacao_inicial_ideias_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'dante', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Dante Montoya', tags: ['fonte-bruta', 'v1', 'dante', 'ideias'], summary: 'Fonte original V1 de exploração por Dante Montoya.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-dante-v2',
    title: 'Fonte Original V2 — Dante Montoya — Exploração de Ideias',
    path: `${BASE}/98-fontes-originais-v1-v2/08_dante_montoya_divisao_exploracao_classificacao_inicial_ideias_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/08_dante_montoya_divisao_exploracao_classificacao_inicial_ideias_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'dante', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Dante Montoya', tags: ['fonte-bruta', 'v2', 'dante', 'ideias'], summary: 'Fonte original V2 de exploração por Dante Montoya.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-nilo-v1',
    title: 'Fonte Original V1 — Nilo Barret — Metodologias',
    path: `${BASE}/98-fontes-originais-v1-v2/09_nilo_barret_divisao_metodologias_frameworks_estruturas_intelectuais_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/09_nilo_barret_divisao_metodologias_frameworks_estruturas_intelectuais_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'nilo', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Nilo Barret', tags: ['fonte-bruta', 'v1', 'nilo', 'metodologias'], summary: 'Fonte original V1 de metodologias por Nilo Barret.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-nilo-v2',
    title: 'Fonte Original V2 — Nilo Barret — Metodologias',
    path: `${BASE}/98-fontes-originais-v1-v2/09_nilo_barret_divisao_metodologias_frameworks_estruturas_intelectuais_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/09_nilo_barret_divisao_metodologias_frameworks_estruturas_intelectuais_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'nilo', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Nilo Barret', tags: ['fonte-bruta', 'v2', 'nilo', 'metodologias'], summary: 'Fonte original V2 de metodologias por Nilo Barret.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-julio-v1',
    title: 'Fonte Original V1 — Júlio Mosqueira — AcadB e Educação',
    path: `${BASE}/98-fontes-originais-v1-v2/10_julio_mosqueira_divisao_acadb_mentorias_cursos_trilhas_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/10_julio_mosqueira_divisao_acadb_mentorias_cursos_trilhas_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'julio', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Júlio Mosqueira', tags: ['fonte-bruta', 'v1', 'julio', 'educacao'], summary: 'Fonte original V1 de educação por Júlio Mosqueira.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-julio-v2',
    title: 'Fonte Original V2 — Júlio Mosqueira — AcadB e Educação',
    path: `${BASE}/98-fontes-originais-v1-v2/10_julio_mosqueira_divisao_acadb_mentorias_cursos_trilhas_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/10_julio_mosqueira_divisao_acadb_mentorias_cursos_trilhas_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'julio', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'Júlio Mosqueira', tags: ['fonte-bruta', 'v2', 'julio', 'educacao'], summary: 'Fonte original V2 de educação por Júlio Mosqueira.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-cesar-v1',
    title: 'Fonte Original V1 — César Tulli — Ventures e Negócios',
    path: `${BASE}/98-fontes-originais-v1-v2/11_cesar_tulli_divisao_startyb_marcas_empresas_ventures_documento_geral_v1.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/11_cesar_tulli_divisao_startyb_marcas_empresas_ventures_documento_geral_v1.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'cesar', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'César Tulli', tags: ['fonte-bruta', 'v1', 'cesar', 'negocios'], summary: 'Fonte original V1 de negócios por César Tulli.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'src-cesar-v2',
    title: 'Fonte Original V2 — César Tulli — Ventures e Negócios',
    path: `${BASE}/98-fontes-originais-v1-v2/11_cesar_tulli_divisao_startyb_marcas_empresas_ventures_documento_geral_v2.0.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/98-fontes-originais-v1-v2/11_cesar_tulli_divisao_startyb_marcas_empresas_ventures_documento_geral_v2.0.md',
    status: 'legado', officialStatus: 'fonte_bruta', category: 'Fontes Originais', areaId: 'cesar', shouldBecome: 'arquivo_morto', type: 'fonte_bruta', source: 'md_indexado', owner: 'César Tulli', tags: ['fonte-bruta', 'v2', 'cesar', 'negocios'], summary: 'Fonte original V2 de negócios por César Tulli.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },

  /* ═══════════════════════════════════════════════════════════════════
     99 — CURADORIA
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'cur-97-0',
    title: '97.0 — Tarefa: Organizar MD Central de Padrões e Gerar DMs',
    path: `${BASE}/99-curadoria/97.0-tarefa-organizar-md-central-de-padroes-e-gerar-documentos-mestres-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/97.0-tarefa-organizar-md-central-de-padroes-e-gerar-documentos-mestres-v3.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'tarefa', 'dm'], summary: 'Tarefa de organizar MD e gerar DMs.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-97-1',
    title: '97.1 — Tarefa: Auditar e Enriquecer Documentos Mestres',
    path: `${BASE}/99-curadoria/97.1-tarefa-auditar-e-enriquecer-documentos-mestres-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/97.1-tarefa-auditar-e-enriquecer-documentos-mestres-v3.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'auditoria', 'dm'], summary: 'Auditoria e enriquecimento de DMs.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-97-2',
    title: '97.2 — Tarefa: Curadoria Profunda Linha a Linha',
    path: `${BASE}/99-curadoria/97.2-tarefa-curadoria-profunda-linha-a-linha-documentos-mestres-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/97.2-tarefa-curadoria-profunda-linha-a-linha-documentos-mestres-v3.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'linha-a-linha', 'dm'], summary: 'Curadoria profunda linha a linha.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-97-3',
    title: '97.3 — Tarefa: Curadoria Final Máxima',
    path: `${BASE}/99-curadoria/97.3-tarefa-curadoria-final-maxima-documentos-mestres-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/97.3-tarefa-curadoria-final-maxima-documentos-mestres-v3.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'final', 'dm'], summary: 'Curadoria final máxima.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-98-0',
    title: '98.0 — Plano de Geração de Documentos Mestres v3.0',
    path: `${BASE}/99-curadoria/98.0-plano-geracao-documentos-mestres-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/98.0-plano-geracao-documentos-mestres-v3.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'plano', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'plano', 'dm'], summary: 'Plano de geração de DMs v3.0.', riskLevel: 'medio', canonicalLevel: 'historico'
  },
  {
    id: 'cur-98-1',
    title: '98.1 — Relatório de Auditoria e Enriquecimento',
    path: `${BASE}/99-curadoria/98.1-relatorio-auditoria-enriquecimento-documentos-mestres-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/98.1-relatorio-auditoria-enriquecimento-documentos-mestres-v3.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'relatorio', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'auditoria', 'dm'], summary: 'Relatório de auditoria e enriquecimento.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-98-2',
    title: '98.2 — Relatório de Curadoria Profunda',
    path: `${BASE}/99-curadoria/98.2-relatorio-curadoria-profunda-linha-a-linha-documentos-mestres-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/98.2-relatorio-curadoria-profunda-linha-a-linha-documentos-mestres-v3.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'relatorio', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'profunda', 'dm'], summary: 'Relatório de curadoria profunda.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-98-3',
    title: '98.3 — Relatório de Curadoria Final Máxima',
    path: `${BASE}/99-curadoria/98.3-relatorio-curadoria-final-maxima-documentos-mestres-v3.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/98.3-relatorio-curadoria-final-maxima-documentos-mestres-v3.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'relatorio', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'final', 'dm'], summary: 'Relatório de curadoria final.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-doc-base-v1',
    title: 'Documento Base para Criação de DMs v1.0',
    path: `${BASE}/99-curadoria/99-documento-base-padrao-para-criacao-de-documentos-mestres-v1.0-07-06-2026.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/99-documento-base-padrao-para-criacao-de-documentos-mestres-v1.0-07-06-2026.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'template', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'template', 'dm'], summary: 'Template base para criação de DMs.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-doc-base-v2',
    title: 'Documento Base para Criação de DMs (cópia)',
    path: `${BASE}/99-curadoria/99-documento-base-padrao-para-criacao-de-documentos-mestres.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/99-documento-base-padrao-para-criacao-de-documentos-mestres.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'template', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'template', 'dm'], summary: 'Template base para criação de DMs (cópia).', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-analise-nassar',
    title: 'Análise: Documentos Nassar Extraídos do DeepSeek',
    path: `${BASE}/99-curadoria/analise-documentos-nassar-extraidos-de-deepseek.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/analise-documentos-nassar-extraidos-de-deepseek.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'analise', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'nassar', 'deepseek'], summary: 'Análise dos documentos Nassar extraídos do DeepSeek.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-analise-protocolos',
    title: 'Análise: Protocolos GrupoB SagB Geral',
    path: `${BASE}/99-curadoria/analise-protocolos-grupob-sagb-geral.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/analise-protocolos-grupob-sagb-geral.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'analise', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'protocolos', 'grupob'], summary: 'Análise dos protocolos GrupoB.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-convocacao-pierre',
    title: 'Convocação Pierre Zanulli — Validação DM-05',
    path: `${BASE}/99-curadoria/convocacao-pierre-zanulli-validacao-dm-05-agt.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/convocacao-pierre-zanulli-validacao-dm-05-agt.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pierre', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'pierre', 'dm-05'], summary: 'Convocação para validação do DM-05 Agentes.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-devolutiva-pierre',
    title: 'Devolutiva Pierre — Reclassificação AGT',
    path: `${BASE}/99-curadoria/devolutiva-pierre-reclassificacao-agt-reclass-001.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/devolutiva-pierre-reclassificacao-agt-reclass-001.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pierre', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pierre Zanulli', tags: ['curadoria', 'pierre', 'reclassificacao'], summary: 'Devolutiva de reclassificação de agentes.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-devolutiva-protocolos',
    title: 'Devolutiva Protocolos SagB para Pierre',
    path: `${BASE}/99-curadoria/devolutiva-protocolos-sagb-para-pierre-zanulli.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/devolutiva-protocolos-sagb-para-pierre-zanulli.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pierre', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'protocolos', 'pierre'], summary: 'Devolutiva de protocolos para Pierre.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-lacunas-nassar',
    title: 'Lacunas Pendentes — Documento Nassar',
    path: `${BASE}/99-curadoria/lacunas-pendentes-documento-nassar-apos-extracoes.md`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/lacunas-pendentes-documento-nassar-apos-extracoes.md',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'nassar', 'lacunas'], summary: 'Lacunas pendentes após extrações do documento Nassar.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
  {
    id: 'cur-protocolos-reclassificado',
    title: 'Protocolos GrupoB SagB Geral — Reclassificado',
    path: `${BASE}/99-curadoria/Protocolos GrupoB - SagB Geral — Reclassificado`,
    pathRelative: 'docs/estrutura-de-documentos-oficiais/99-curadoria/Protocolos GrupoB - SagB Geral — Reclassificado',
    status: 'registro', officialStatus: 'curadoria', category: 'Curadoria', areaId: 'pietro', shouldBecome: 'registro', type: 'registro', source: 'md_indexado', owner: 'Pietro Carboni', tags: ['curadoria', 'protocolos', 'reclassificado'], summary: 'Protocolos reclassificados.', riskLevel: 'baixo', canonicalLevel: 'historico'
  },
];
