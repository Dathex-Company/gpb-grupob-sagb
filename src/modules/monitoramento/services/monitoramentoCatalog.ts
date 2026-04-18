import { MonitoramentoSubmodulo } from '../types';

export const monitoramentoSubmodulos: MonitoramentoSubmodulo[] = [
  {
    id: 'infraestrutura',
    label: 'Infraestrutura',
    slug: 'infraestrutura',
    items: [
      'CPU',
      'GPU',
      'RAM',
      'Disco',
      'Temperatura',
      'Internet',
      'Ping',
      'Jitter',
      'Download',
      'Upload',
      'Perda de pacote',
      'Picos de latência',
      'Uptime da máquina',
      'Tailscale / VPN',
      'Status da VPN',
      'Latência da malha',
      'Máquinas conectadas',
      'Máquinas offline',
      'Última desconexão',
      'Qualidade da rota'
    ]
  },
  {
    id: 'backend',
    label: 'Backend',
    slug: 'backend',
    items: [
      'Supabase',
      'Banco de dados',
      'Storage',
      'Leituras',
      'Escritas',
      'Uploads',
      'Latência',
      'Integridade de gravação',
      'Tabelas relevantes',
      'Monitoramento de Tabelas'
    ]
  },
  {
    id: 'frontend',
    label: 'Frontend',
    slug: 'frontend',
    items: [
      'Deploys',
      'Builds',
      'Versões publicadas',
      'Falhas de publicação',
      'Ambientes ativos',
      'Netlify'
    ]
  },
  {
    id: 'automacoes',
    label: 'Automações',
    slug: 'automacoes',
    items: [
      'n8n',
      'Workflows ativos',
      'Execuções',
      'Filas',
      'Falhas',
      'Workflows órfãos',
      'Gargalos'
    ]
  },
  {
    id: 'ia-agentes',
    label: 'IA e Agentes',
    slug: 'ia-agentes',
    items: [
      'APIs de IA',
      'Latência por provedor',
      'Tokens',
      'Custo',
      'Agentes ativos',
      'Falhas',
      'Travamentos',
      'Consumo por modelo'
    ]
  },
  {
    id: 'transcricoes-gravacoes',
    label: 'Transcrições e Gravações',
    slug: 'transcricoes-gravacoes',
    items: [
      'OBS',
      'Gravação ativa',
      'Timer',
      'Arquivos gerados',
      'Transcrição em andamento',
      'Delay entre áudio e texto',
      'Perdas de captura',
      'Fila de processamento'
    ]
  },
  {
    id: 'dados-memoria',
    label: 'Dados e Memória',
    slug: 'dados-memoria',
    items: [
      'Total de memórias',
      'Memórias brutas',
      'Memórias refinadas',
      'Pendências de refinamento',
      'Chunks de áudio',
      'Delay de consolidação',
      'Integridade de escrita',
      'Timeline de escritas',
      'Ativos no CID',
      'Assets brutos',
      'Assets derivados',
      'Jobs',
      'Outputs'
    ]
  },
  {
    id: 'sensor-qualidade',
    label: 'Sensor de Qualidade',
    slug: 'sensor-qualidade',
    items: [
      'Saúde das APIs',
      'Tokens por conversa',
      'Custo por conversa',
      'Top agentes',
      'Top tipos de erro',
      'Eventos cognitivos',
      'Erros e acertos',
      'Últimos eventos'
    ]
  },
  {
    id: 'custos-consumo',
    label: 'Custos e Consumo',
    slug: 'custos-consumo',
    items: [
      'Custo do dia',
      'Custo do mês',
      'Custo acumulado',
      'Gasto por plataforma',
      'Gasto por provedor',
      'Google Cloud',
      'APIs pagas',
      'Storage',
      'Banco',
      'Uso por agente',
      'Uso por fluxo',
      'Picos de consumo',
      'Comparação com orçamento'
    ]
  },
  {
    id: 'alertas',
    label: 'Alertas',
    slug: 'alertas',
    items: [
      'Alertas críticos',
      'Alertas altos',
      'Falhas abertas',
      'Sinais de risco',
      'Incidentes em andamento',
      'Severidade',
      'Origem do alerta',
      'Tempo aberto',
      'Queda de internet',
      'Oscilação forte',
      'Perda de pacote alta',
      'VPN desconectada',
      'Nó fora da malha',
      'Latência anormal da rede'
    ]
  },
  {
    id: 'eventos',
    label: 'Eventos',
    slug: 'eventos',
    items: [
      'Reinícios',
      'Falhas',
      'Deploys',
      'Quedas',
      'Erros',
      'Gravações iniciadas',
      'Gravações encerradas',
      'Eventos de agentes',
      'Eventos de backend',
      'Linha do tempo operacional'
    ]
  },
  {
    id: 'ideias-producao',
    label: 'Ideias e Produção',
    slug: 'ideias-producao',
    items: [
      'Ideias geradas',
      'Iniciativas criadas',
      'Produção por período',
      'Pendências',
      'Conversão de ideia em ativo'
    ]
  },
  {
    id: 'acao-inteligente',
    label: 'Ação Inteligente',
    slug: 'acao-inteligente',
    items: [
      'Agente responsável por área',
      'Abrir reunião',
      'Criar task no TaskZei',
      'Enviar BO',
      'Encaminhar para responsável',
      'Histórico da decisão'
    ]
  }
];
