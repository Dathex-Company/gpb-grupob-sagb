import { MonitoringDashboardCard, MonitoringIntegrationMap, MonitoringPreset } from '../types';

const actions = [
  { id: 'ver-detalhes', label: 'Ver detalhes', visualOnly: true },
  { id: 'criar-task', label: 'Criar task no TaskZei', visualOnly: true },
  { id: 'enviar-bo', label: 'Enviar BO', visualOnly: true },
  { id: 'acionar-responsavel', label: 'Acionar responsável', visualOnly: true },
  { id: 'abrir-historico', label: 'Abrir histórico', visualOnly: true }
] as const;

const defaultIntegration: MonitoringIntegrationMap = {
  integrationStatus: 'mock',
  dataSourceModule: 'monitoramento',
  dataSourceType: 'observabilidade',
  requiredConnector: 'Contrato de Observabilidade do SagB',
  requiredValidationOwner: 'Pierre Zanulli / Noali Kessler',
  canTriggerTaskzei: true,
  canNotifyAgent: true,
  canOpenIncident: true
};

const integrationByCardId: Record<string, Partial<MonitoringIntegrationMap>> = {
  internet: { dataSourceType: 'infraestrutura', requiredConnector: 'agente local / script python', requiredValidationOwner: 'Sávio Codare' },
  'infra-maquinas': { dataSourceType: 'infraestrutura', requiredConnector: 'agente local de máquina', requiredValidationOwner: 'Sávio Codare' },
  'execucao-local': { dataSourceModule: 'sala-dev', dataSourceType: 'execução local', requiredConnector: 'coletor local de processos', requiredValidationOwner: 'Noali Kessler' },
  supabase: { integrationStatus: 'parcial', dataSourceModule: 'monitoramento / backend', dataSourceType: 'supabase', requiredConnector: 'Supabase Database Observatory', requiredValidationOwner: 'Noali Kessler' },
  'central-notificacoes': { dataSourceModule: 'taskzei / hub-integracao', dataSourceType: 'notificações', requiredConnector: 'fila de notificações + webhook', requiredValidationOwner: 'Pierre Zanulli / Alan Flow' },
  'responsaveis-acao': { dataSourceModule: 'taskzei / agentes', dataSourceType: 'responsabilidade operacional', requiredConnector: 'TaskZei action bridge', requiredValidationOwner: 'Pierre Zanulli' }
};

const nextStepByCardId: Record<string, string> = {
  'saude-geral': 'abrir War Room se o score cair abaixo de 75',
  internet: 'verificar conexão Tailscale e rota principal',
  'infra-maquinas': 'validar máquina com maior consumo de CPU/RAM',
  'execucao-local': 'investigar processo órfão ou job em retry',
  supabase: 'revisar latência e último deploy backend',
  'dados-memoria-acervo': 'abrir task no TaskZei para reduzir fila de refinamento',
  'ia-agentes': 'validar custo e latência por provedor',
  'sensor-qualidade': 'revisar logs recentes de eventos cognitivos',
  'automacoes-integracoes': 'acionar responsável técnico e revisar workflow com falha',
  'deploys-frontend': 'verificar último deploy e evidências de build',
  'custos-consumo': 'validar custo do provedor com maior pico',
  'seguranca-backup': 'validar último backup e permissões pendentes',
  'central-padroes': 'revisar padrões vencidos e documentos sem dono',
  'saude-modular': 'priorizar módulos sem owner ou com duplicação',
  'alertas-incidentes': 'abrir War Room e classificar incidentes críticos',
  'central-notificacoes': 'escalar notificações sem responsável e criar task visual',
  'responsaveis-acao': 'confirmar BO, TaskZei e retorno do responsável primário'
};

const baseMonitoringDashboardCards = [
  {
    id: 'saude-geral', title: 'Score Geral de Saúde', shortTitle: 'Saúde Geral', description: 'Síntese visual da operação SagB.', status: 'saudável', severity: 'baixo',
    mainMetric: { label: 'Saúde Geral', value: '87/100', trend: 'stable' },
    secondaryMetrics: [{ label: 'Críticos', value: '2' }, { label: 'Atenção', value: '7' }, { label: 'Resolvidos', value: '91%' }],
    alerts: [{ id: 'sg-1', label: 'Padrões com revisão pendente', severity: 'médio' }],
    responsible: { area: 'Orquestração', agent: 'Pierre Zanulli', backup: 'Noali Kessler', status: 'online', lastResponse: 'há 4 min' },
    sourceType: 'mock', relatedSubmoduleSlug: 'eventos', defaultSize: 'destaque', allowedSizes: ['médio', 'grande', 'destaque'], presetGroups: ['operacao-critica', 'visao-modular'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'agora', history: ['Score consolidado simulado', 'Sem integração real nesta etapa'], actions: [...actions]
  },
  {
    id: 'internet', title: 'Acesso à Internet', shortTitle: 'Internet', description: 'Latência, perda de pacote e qualidade de rota.', status: 'atenção', severity: 'médio', mainMetric: { label: 'Ping', value: '42 ms', trend: 'up' }, secondaryMetrics: [{ label: 'Perda', value: '1.2%' }, { label: 'Jitter', value: '8 ms' }, { label: 'Uptime', value: '99.1%' }], alerts: [{ id: 'net-1', label: 'Oscilação detectada', severity: 'médio' }], responsible: { area: 'Infraestrutura', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'online', lastResponse: 'há 9 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'infraestrutura', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['operacao-critica', 'infraestrutura-rede'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'há 1 min', history: ['Pico leve de latência', 'Rota principal operacional'], actions: [...actions]
  },
  {
    id: 'infra-maquinas', title: 'Infraestrutura e Máquinas', shortTitle: 'Máquinas', description: 'CPU, RAM, disco, temperatura e disponibilidade.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Uptime', value: '99.8%', trend: 'stable' }, secondaryMetrics: [{ label: 'CPU', value: '41%' }, { label: 'RAM', value: '62%' }, { label: 'Disco', value: '71%' }], alerts: [], responsible: { area: 'Infraestrutura', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'online', lastResponse: 'há 6 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'infraestrutura', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['infraestrutura-rede', 'execucao-local'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'há 2 min', history: ['Máquinas principais online', 'Sem temperatura crítica'], actions: [...actions]
  },
  {
    id: 'execucao-local', title: 'Execução Local', shortTitle: 'Local', description: 'Processos locais, filas e saúde da estação de operação.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Jobs OK', value: '24/25', trend: 'stable' }, secondaryMetrics: [{ label: 'Fila', value: '3' }, { label: 'Falhas', value: '1' }, { label: 'Tempo médio', value: '1m12s' }], alerts: [{ id: 'local-1', label: '1 job com retry', severity: 'baixo' }], responsible: { area: 'Sala Dev', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'online', lastResponse: 'há 12 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'saude-esteira', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['execucao-local', 'operacao-critica'], isV1: true, isCritical: false, isMock: true, lastUpdated: 'há 3 min', history: ['Execução local estável', 'Retry visual sem ação real'], actions: [...actions]
  },
  {
    id: 'supabase', title: 'Banco de Dados / Supabase', shortTitle: 'Supabase', description: 'Banco, storage e disponibilidade backend.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Latência', value: '118 ms', trend: 'stable' }, secondaryMetrics: [{ label: 'Leituras', value: '1.2k' }, { label: 'Escritas', value: '284' }, { label: 'Storage', value: 'OK' }], alerts: [], responsible: { area: 'Backend', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'online', lastResponse: 'há 8 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'backend', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['dados-supabase', 'operacao-critica'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'há 2 min', history: ['Sem consulta real ao Supabase', 'Resumo pronto para telemetria'], actions: [...actions]
  },
  {
    id: 'dados-memoria-acervo', title: 'Dados, Memória e Acervo', shortTitle: 'Memória', description: 'CID, memórias, acervo e consolidação.', status: 'atenção', severity: 'médio', mainMetric: { label: 'Pendências', value: '18', trend: 'up' }, secondaryMetrics: [{ label: 'Memórias', value: '2.4k' }, { label: 'Assets', value: '934' }, { label: 'Jobs', value: '7' }], alerts: [{ id: 'mem-1', label: 'Fila de refinamento alta', severity: 'médio' }], responsible: { area: 'CID', agent: 'Pierre Zanulli', backup: 'Noali Kessler', status: 'online', lastResponse: 'há 15 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'dados-memoria', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['dados-supabase', 'visao-modular'], isV1: true, isCritical: false, isMock: true, lastUpdated: 'há 5 min', history: ['Fila mockada em atenção', 'Sem escrita real'], actions: [...actions]
  },
  {
    id: 'ia-agentes', title: 'IA e Agentes', shortTitle: 'Agentes', description: 'APIs de IA, agentes ativos, custo e latência.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Agentes ativos', value: '12', trend: 'stable' }, secondaryMetrics: [{ label: 'Latência', value: '1.4s' }, { label: 'Tokens', value: '84k' }, { label: 'Custo', value: 'R$ 37' }], alerts: [], responsible: { area: 'IA', agent: 'Pierre Zanulli', backup: 'Noali Kessler', status: 'online', lastResponse: 'há 3 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'ia-agentes', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['agentes-ia', 'custos-consumo'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'há 1 min', history: ['Consumo simulado', 'Sem chamada de API real'], actions: [...actions]
  },
  {
    id: 'sensor-qualidade', title: 'Sensor de Qualidade', shortTitle: 'Qualidade', description: 'Eventos cognitivos, erros, acertos e saúde das APIs.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Qualidade', value: '92%', trend: 'stable' }, secondaryMetrics: [{ label: 'Eventos', value: '318' }, { label: 'Erros', value: '4' }, { label: 'Acertos', value: '96%' }], alerts: [], responsible: { area: 'Qualidade', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'online', lastResponse: 'há 11 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'sensor-qualidade', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['agentes-ia', 'governanca-padroes'], isV1: true, isCritical: false, isMock: true, lastUpdated: 'há 4 min', history: ['Qualidade dentro do esperado'], actions: [...actions]
  },
  {
    id: 'automacoes-integracoes', title: 'Automações e Integrações', shortTitle: 'Automações', description: 'Workflows, filas, webhooks e integrações.', status: 'alerta', severity: 'alto', mainMetric: { label: 'Falhas', value: '5', trend: 'up' }, secondaryMetrics: [{ label: 'Ativos', value: '17' }, { label: 'Fila', value: '21' }, { label: 'Webhooks', value: 'OK' }], alerts: [{ id: 'auto-1', label: 'Falhas recorrentes em workflow', severity: 'alto' }], responsible: { area: 'Automações', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'em_verificacao', lastResponse: 'há 18 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'automacoes', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['operacao-critica', 'notificacoes-incidentes'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'há 2 min', history: ['Falha visual simulada', 'Ação real bloqueada nesta etapa'], actions: [...actions]
  },
  {
    id: 'deploys-frontend', title: 'Deploys e Frontend', shortTitle: 'Deploys', description: 'Builds, versões publicadas e ambientes.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Último build', value: 'OK', trend: 'stable' }, secondaryMetrics: [{ label: 'Versão', value: '1.1.0' }, { label: 'Falhas', value: '0' }, { label: 'Ambientes', value: '2' }], alerts: [], responsible: { area: 'Frontend', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'online', lastResponse: 'há 20 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'frontend', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['execucao-local', 'visao-modular'], isV1: true, isCritical: false, isMock: true, lastUpdated: 'há 9 min', history: ['Build visual OK', 'Sem deploy executado'], actions: [...actions]
  },
  {
    id: 'custos-consumo', title: 'Custos e Consumo', shortTitle: 'Custos', description: 'APIs, storage, banco e orçamento.', status: 'atenção', severity: 'médio', mainMetric: { label: 'Mês', value: 'R$ 428', trend: 'up' }, secondaryMetrics: [{ label: 'Dia', value: 'R$ 31' }, { label: 'Pico', value: 'R$ 74' }, { label: 'Orçamento', value: '68%' }], alerts: [{ id: 'cost-1', label: 'Pico de consumo por agente', severity: 'médio' }], responsible: { area: 'Financeiro técnico', agent: 'Pierre Zanulli', backup: 'Noali Kessler', status: 'online', lastResponse: 'há 24 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'custos-consumo', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['custos-consumo', 'operacao-critica'], isV1: true, isCritical: false, isMock: true, lastUpdated: 'há 6 min', history: ['Custos mockados', 'Sem consulta a billing'], actions: [...actions]
  },
  {
    id: 'seguranca-backup', title: 'Segurança e Backup', shortTitle: 'Backup', description: 'Backups, permissões, riscos e recuperação.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Backup', value: 'OK', trend: 'stable' }, secondaryMetrics: [{ label: 'RLS', value: 'Verificar' }, { label: 'Permissões', value: '2' }, { label: 'Último', value: '02:00' }], alerts: [{ id: 'sec-1', label: 'Permissões para revisão', severity: 'baixo' }], responsible: { area: 'Segurança', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'online', lastResponse: 'há 31 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'conformidade-padroes', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['seguranca-backup', 'governanca-padroes'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'há 12 min', history: ['Sem alteração de RLS', 'Backup apenas visual'], actions: [...actions]
  },
  {
    id: 'central-padroes', title: 'Central de Padrões', shortTitle: 'Padrões', description: 'Conformidade, documentos, checklist e exceções.', status: 'atenção', severity: 'médio', mainMetric: { label: 'Conformidade', value: '81%', trend: 'stable' }, secondaryMetrics: [{ label: 'Vencidos', value: '3' }, { label: 'Sem dono', value: '5' }, { label: 'Exceções', value: '2' }], alerts: [{ id: 'pad-1', label: 'Padrões sem revisão', severity: 'médio' }], responsible: { area: 'Governança', agent: 'Pierre Zanulli', backup: 'Noali Kessler', status: 'online', lastResponse: 'há 14 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'conformidade-padroes', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['governanca-padroes', 'visao-modular'], isV1: true, isCritical: false, isMock: true, lastUpdated: 'há 7 min', history: ['Contrato de observabilidade preparado', 'Critérios virão da Central de Padrões'], actions: [...actions]
  },
  {
    id: 'saude-modular', title: 'Saúde Modular do SagB', shortTitle: 'Módulos', description: 'Módulos, reaproveitamento e dependências.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Módulos OK', value: '28/31', trend: 'stable' }, secondaryMetrics: [{ label: 'Duplicados', value: '2' }, { label: 'Sem dono', value: '1' }, { label: 'Obsoletos', value: '3' }], alerts: [{ id: 'mod-1', label: 'Oportunidades de padronização', severity: 'baixo' }], responsible: { area: 'Arquitetura', agent: 'Pierre Zanulli', backup: 'Noali Kessler', status: 'online', lastResponse: 'há 16 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'reaproveitamento-modular', defaultSize: 'médio', allowedSizes: ['pequeno', 'médio', 'grande'], presetGroups: ['visao-modular', 'governanca-padroes'], isV1: true, isCritical: false, isMock: true, lastUpdated: 'há 10 min', history: ['Mapa modular visual', 'Sem scan real de código'], actions: [...actions]
  },
  {
    id: 'alertas-incidentes', title: 'Alertas e Incidentes', shortTitle: 'Incidentes', description: 'Alertas críticos, incidentes e tempo aberto.', status: 'crítico', severity: 'crítico', mainMetric: { label: 'Críticos', value: '2', trend: 'up' }, secondaryMetrics: [{ label: 'Altos', value: '4' }, { label: 'Abertos', value: '9' }, { label: 'SLA', value: '72%' }], alerts: [{ id: 'inc-1', label: '2 incidentes críticos simulados', severity: 'crítico' }], responsible: { area: 'Monitoramento', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'em_verificacao', lastResponse: 'há 2 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'alertas', defaultSize: 'grande', allowedSizes: ['médio', 'grande', 'destaque'], presetGroups: ['operacao-critica', 'notificacoes-incidentes'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'agora', history: ['Incidentes mockados para painel operacional', 'Sem acionamento real'], actions: [...actions]
  },
  {
    id: 'central-notificacoes', title: 'Central de Notificações', shortTitle: 'Notificações', description: 'Envios, leitura, escalonamento e resolução.', status: 'alerta', severity: 'alto', mainMetric: { label: 'Abertas', value: '14', trend: 'up' }, secondaryMetrics: [{ label: 'Críticas', value: '3' }, { label: 'Não lidas', value: '6' }, { label: 'Sem resp.', value: '4' }, { label: 'Escaladas', value: '2' }, { label: 'Último envio', value: 'há 1 min' }, { label: 'Canal', value: 'WhatsApp' }, { label: 'Status', value: 'assumido' }], alerts: [{ id: 'not-1', label: 'Notificações sem responsável', severity: 'alto' }], responsible: { area: 'Notificações', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'online', lastResponse: 'há 1 min' }, sourceType: 'mock', relatedSubmoduleSlug: undefined, defaultSize: 'grande', allowedSizes: ['médio', 'grande', 'destaque'], presetGroups: ['notificacoes-incidentes', 'operacao-critica'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'agora', history: ['Enviado: 12', 'Recebido: 10', 'Lido: 8', 'Assumido: 4', 'Resolvido: 3'], actions: [...actions]
  },
  {
    id: 'responsaveis-acao', title: 'Responsáveis e Ação Inteligente', shortTitle: 'Ação', description: 'Owners, backups, resposta e encaminhamento visual.', status: 'saudável', severity: 'baixo', mainMetric: { label: 'Tempo médio', value: '6m', trend: 'stable' }, secondaryMetrics: [{ label: 'Áreas', value: '8' }, { label: 'Pendentes', value: '5' }, { label: 'Backups', value: 'OK' }], alerts: [{ id: 'resp-1', label: '2 áreas com fila pendente', severity: 'baixo' }], responsible: { area: 'Ação Inteligente', agent: 'Pierre Zanulli', backup: 'Noali Kessler', status: 'online', lastResponse: 'há 5 min' }, sourceType: 'mock', relatedSubmoduleSlug: 'acao-inteligente', defaultSize: 'grande', allowedSizes: ['médio', 'grande', 'destaque'], presetGroups: ['notificacoes-incidentes', 'visao-modular'], isV1: true, isCritical: true, isMock: true, lastUpdated: 'há 3 min', history: ['Botões são apenas visuais', 'TaskZei preparado para etapa futura'], actions: [...actions]
  },
  ...[
    'Relações e Dependências', 'Esteira e Metodologia', 'Silêncio Operacional', 'Fadiga de Alertas', 'Qualidade Decisória', 'Reaproveitamento Modular', 'Logs Técnicos', 'Logs de Segurança', 'Webhooks', 'MCPs e Bridges', 'Backups avançados', 'Mapa de owners', 'Maturidade modular', 'Conformidade visual', 'Contrato de Observabilidade'
  ].map((title, index) => ({
    id: `v2-${index + 1}`, title, shortTitle: title, description: 'Card preparado para V2 do painel operacional.', status: 'desconhecido' as const, severity: 'info' as const, mainMetric: { label: 'V2', value: 'Planejado' }, secondaryMetrics: [{ label: 'Estado', value: 'Catálogo' }], alerts: [], responsible: { area: 'Monitoramento', agent: 'Noali Kessler', backup: 'Pierre Zanulli', status: 'pausado' as const }, sourceType: 'mock' as const, relatedSubmoduleSlug: undefined, defaultSize: 'pequeno' as const, allowedSizes: ['pequeno', 'médio'] as const, presetGroups: ['v2'], isV1: false, isCritical: false, isMock: true, lastUpdated: 'planejado', history: ['Preparado no catálogo visual'], actions: [...actions]
  }))
];

export const monitoringDashboardCards: MonitoringDashboardCard[] = baseMonitoringDashboardCards.map((card) => ({
  ...card,
  nextStepSuggestion: nextStepByCardId[card.id] || 'definir validação e conector oficial para integração real',
  integration: {
    ...defaultIntegration,
    ...(integrationByCardId[card.id] || {}),
    integrationStatus: card.isV1 ? 'mock' : 'pendente'
  },
  notificationDetail: card.id === 'central-notificacoes'
    ? { recipient: 'Noali Kessler / Pierre Zanulli', channel: 'WhatsApp + painel SagB', status: 'assumido', elapsedTime: 'há 1 min', shouldEscalate: true }
    : undefined,
  actionFlow: card.id === 'responsaveis-acao'
    ? { problem: 'Alertas pendentes sem retorno completo', responsible: 'Pierre Zanulli', boStatus: 'BO visual preparado', taskZeiStatus: '5 tarefas abertas mockadas', returnStatus: 'aguardando retorno', averageResponseTime: '6m', openTasks: '5' }
    : undefined
}));

export const monitoringDashboardPresets: MonitoringPreset[] = [
  { id: 'war-room', label: 'War Room', description: 'Incidente crítico: risco, acionamento, responsáveis e próximo passo.', cardIds: ['alertas-incidentes', 'central-notificacoes', 'responsaveis-acao', 'saude-geral', 'internet', 'supabase', 'execucao-local', 'seguranca-backup', 'ia-agentes', 'automacoes-integracoes', 'dados-memoria-acervo', 'saude-modular'], defaultPanelCount: 12 },
  { id: 'tv-operacional', label: 'TV Operacional', description: 'Painel de parede para acompanhamento contínuo.', cardIds: ['saude-geral', 'internet', 'infra-maquinas', 'execucao-local', 'supabase', 'dados-memoria-acervo', 'ia-agentes', 'automacoes-integracoes', 'alertas-incidentes', 'central-notificacoes', 'custos-consumo', 'seguranca-backup'], defaultPanelCount: 12 },
  { id: 'operacao-critica', label: 'Operação Crítica', description: 'Painel de riscos e resposta rápida.', cardIds: ['alertas-incidentes', 'central-notificacoes', 'responsaveis-acao', 'saude-geral', 'internet', 'supabase', 'automacoes-integracoes', 'custos-consumo'], defaultPanelCount: 8 },
  { id: 'infraestrutura-rede', label: 'Infraestrutura e Rede', description: 'Rede, máquinas e estabilidade local.', cardIds: ['internet', 'infra-maquinas', 'execucao-local', 'seguranca-backup'], defaultPanelCount: 4 },
  { id: 'execucao-local', label: 'Execução Local', description: 'Processos locais, builds e estação.', cardIds: ['execucao-local', 'automacoes-integracoes', 'infra-maquinas', 'deploys-frontend'], defaultPanelCount: 4 },
  { id: 'dados-supabase', label: 'Dados e Supabase', description: 'Banco, memória e acervo.', cardIds: ['supabase', 'dados-memoria-acervo', 'seguranca-backup', 'saude-geral'], defaultPanelCount: 4 },
  { id: 'agentes-ia', label: 'Agentes e IA', description: 'Agentes, qualidade e APIs de IA.', cardIds: ['ia-agentes', 'sensor-qualidade', 'responsaveis-acao', 'custos-consumo'], defaultPanelCount: 4 },
  { id: 'governanca-padroes', label: 'Governança e Padrões', description: 'Conformidade, padrões e saúde modular.', cardIds: ['central-padroes', 'saude-modular', 'seguranca-backup', 'sensor-qualidade'], defaultPanelCount: 4 },
  { id: 'seguranca-backup', label: 'Segurança e Backup', description: 'Backups, permissões e risco operacional.', cardIds: ['seguranca-backup', 'alertas-incidentes', 'supabase', 'central-padroes'], defaultPanelCount: 4 },
  { id: 'custos-consumo', label: 'Custos e Consumo', description: 'Gastos técnicos e consumo por área.', cardIds: ['custos-consumo', 'ia-agentes', 'supabase', 'dados-memoria-acervo'], defaultPanelCount: 4 },
  { id: 'visao-modular', label: 'Visão Modular do SagB', description: 'Módulos, owners e padrões.', cardIds: ['saude-geral', 'saude-modular', 'central-padroes', 'responsaveis-acao', 'dados-memoria-acervo', 'deploys-frontend', 'sensor-qualidade', 'seguranca-backup'], defaultPanelCount: 8 },
  { id: 'notificacoes-incidentes', label: 'Notificações e Incidentes', description: 'Alertas, incidentes e encaminhamentos.', cardIds: ['alertas-incidentes', 'central-notificacoes', 'responsaveis-acao', 'automacoes-integracoes'], defaultPanelCount: 4 }
];
