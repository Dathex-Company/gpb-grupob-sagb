export const moduleDoc = {
  nomeOficial: 'Núcleo Conversacional Multiagente',
  objetivo: 'Conduzir as conversas do SagB com agentes, multi-provider, persistência, memória, handoff, anexos, áudio e instrumentação.',
  responsavelTecnico: 'Cássio Mendes',
  status: 'Ativo',
  tipo: 'Módulo Oficial',
  
  tabelasSupabase: [
    'chat_sessions',
    'chat_messages',
    'agent_memories',
    'agent_quality_events',
    'intelligence_flows',
    'intelligence_flow_steps',
    'agent_dna_effective'
  ],
  
  bucketsStorage: [
    'sagb_chat_attachments'
  ],

  integracoes: [
    'Gemini',
    'Deepseek',
    'LlamaLocal (via AI Proxy)',
    'Whisper Local (transcrição de áudio)'
  ],

  estruturasExclusivas: [
    'components/SystemicVision.tsx',
    'src/modules/nucleo-conversacional/components/ChatMessage.tsx',
    'src/modules/nucleo-conversacional/pages/ConversationsView.tsx',
    'src/modules/nucleo-conversacional/services/chatPersistence.ts',
    'src/modules/nucleo-conversacional/utils/observability.ts',
    'services/gemini.ts',
    'services/deepseek.ts',
    'services/llamaLocal.ts',
    'services/providerProxy.ts',
    'netlify/functions/ai.mjs'
  ],

  estruturasCompartilhadas: [
    'agents (tabela)',
    'agent_configs (tabela)',
    'governance_compliance_rules (tabela, via contextAssembler)'
  ],

  fluxosPrincipais: [
    'Abrir ou criar sessão',
    'Persistir mensagem do usuário',
    'Escolher provider/modelo',
    'Montar contexto de runtime com governança e DNA',
    'Gerar resposta simples ou multiagente',
    'Persistir mensagem bot',
    'Detectar qualidade e registrar eventos',
    'Criar ou atualizar fluxo de inteligência',
    'Sugerir título, tarefas ou consolidar memória'
  ],

  pendenciasPrincipais: [
    'Reduzir tamanho e complexidade do SystemicVision.tsx',
    'Isolar melhor regras de provider, UI e orquestração',
    'Fortalecer RAG além de heurísticas por palavra-chave',
    'Tornar prompts estruturais realmente preenchidos (data/prompts.ts)'
  ]
};
