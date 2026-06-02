import { ModuleDoc } from '../../core/modules/module.types';

export const moduleDoc: ModuleDoc = {
  id: 'monitoramento',
  internalName: 'monitoramento',
  displayName: 'Monitoramento',
  description: 'Módulo oficial de monitoramento sistêmico do SagB, responsável por coletar, agregar e exibir métricas operacionais, de infraestrutura, custos e saúde dos serviços.',
  
  owner: {
    displayName: 'Noali Kessler',
    role: 'Agente Responsável pelo Monitoramento',
    email: 'noali@dathex.company',
    backup: 'Pierre Zanulli (Agente Mestre da Orquestração)'
  },

  version: {
    platform: '1.8.1',
    module: '1.0.0',
    releasedAt: '2026-04-13'
  },

  fronteiras: {
    dentro: [
      'Coleta de métricas de infraestrutura (CPU, RAM, disco, rede)',
      'Monitoramento de serviços backend (Supabase, APIs, storage)',
      'Monitoramento de frontend (builds, deploys, ambientes)',
      'Monitoramento de automações (n8n, workflows, filas)',
      'Monitoramento de IA e agentes (APIs, tokens, custos)',
      'Monitoramento de transcrições e gravações (OBS, processamento)',
      'Monitoramento de dados e memória (CID, assets, jobs)',
      'Sensor de qualidade (saúde de APIs, eventos cognitivos)',
      'Monitoramento de custos e consumo (Google Cloud, APIs pagas)',
      'Sistema de alertas (críticos, altos, incidentes)',
      'Registro de eventos (reinícios, falhas, deploys)',
      'Monitoramento de ideias e produção (conversão em ativos)',
      'Ação inteligente (agentes responsáveis, encaminhamento)',
      'Conformidade com Padrões',
      'Saúde da Esteira',
      'Reaproveitamento Modular',
      'Qualidade Decisória',
      'Fadiga de Alertas',
      'Base tipada do Contrato de Observabilidade do SagB'
    ],
    fora: [
      'Execução direta de workflows (responsabilidade do n8n)',
      'Gestão de usuários e permissões (responsabilidade do auth)',
      'Orquestração de módulos (responsabilidade da orquestração principal)',
      'Governança documental (responsabilidade da central de padrões)',
      'Persistência de logs brutos infinitos dentro da Central de Monitoramento',
      'Criação direta de tarefas corretivas fora do TaskZei',
      'Execução de ações destrutivas, deploys ou alterações de banco'
    ]
  },

  fontes_de_dados: {
    supabase_tabelas: [
      'system_metrics',
      'service_health',
      'cost_tracking',
      'alert_logs',
      'event_stream'
    ],
    storage_local: [
      'logs/',
      'metrics/',
      'alerts/'
    ],
    integracoes_externas: [
      'Google Cloud Monitoring',
      'Supabase Realtime',
      'n8n Webhooks',
      'OBS Studio WebSocket',
      'Tailscale API'
    ]
  },

  ativos_reutilizaveis: [
    'Componente MetricCard',
    'Componente AlertBadge',
    'Serviço de coleta de métricas',
    'Serviço de agregação de alertas',
    'Dashboard de monitoramento executivo',
    'Contrato de Observabilidade tipado em types/index.ts'
  ],

  riscos_duplicacao: [
    'Métricas de infraestrutura podem ser coletadas por múltiplos agentes',
    'Alertas podem ser gerados por diferentes serviços sem centralização',
    'Custos podem ser rastreados em sistemas paralelos (Google Cloud vs APIs)'
  ],

  dependencias: [
    'supabase',
    'services/providerHealth',
    'services/qualitySensor',
    'components/MetricCard',
    'components/MonitoramentoView'
  ],

  status: 'ativo',
  categoria: 'operacional'
};
