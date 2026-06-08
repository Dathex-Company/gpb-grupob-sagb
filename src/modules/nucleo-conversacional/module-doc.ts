export const moduleDoc = {
  nomeOficial: 'Núcleo Conversacional Multiagente',
  objetivo: 'Conduzir as conversas do SagB com agentes, multi-provider, persistência, memória, handoff, anexos, áudio e instrumentação.',
  responsavelTecnico: 'Cássio Mendes',
  status: 'Ativo — V1 (estabilização funcional)',
  tipo: 'Módulo Oficial — Núcleo de Execução Conversacional',

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

  modulosRelacionados: [
    {
      nome: 'Núcleo de Agentes',
      id: 'nucleo_de_agentes',
      relacao: 'Fonte principal de memória contínua, DNA efetivo, documentos globais e contexto cognitivo dos agentes. O Conversacional consome esses dados para montar o contexto de cada turno.',
      contratoAtual: 'Parcial — agents e agent_memories já são usados. knowledge.ts e contextAssembler.ts estão no codebase como serviços compartilhados.',
      contratoDesejado: 'AgentContextProvider formal que hidrata identidade, prompt, DNA, documentos e memória antes de cada turno.'
    },
    {
      nome: 'Quadro de Elite (Núcleo de Identidades)',
      id: 'quadro_de_elite',
      relacao: 'Fonte única de cadastro, identidade, status operacional, modelo preferencial e prompt efetivo dos agentes.',
      contratoAtual: 'Parcial — o Conversacional recebe a lista de agentes por props e consome campos como id, name, status, modelProvider, effectivePrompt.',
      contratoDesejado: 'Contrato AgentRuntimeProfile formal com bloqueio de agentes PLANNED/BLOCKED sem prompt.'
    },
    {
      nome: 'CID (Centro de Ingestão Documental)',
      id: 'cid',
      relacao: 'Documentos preparados (chunks e outputs) usados como evidência no turno conversacional.',
      contratoAtual: 'Inexistente — anexos do chat usam bucket sagb_chat_attachments separado do pipeline CID.',
      contratoDesejado: 'Seletor de ativos CID por sessão + promoção de anexo de chat para ativo CID.'
    },
    {
      nome: 'NAGI',
      id: 'nagi',
      relacao: 'Destino de ideias, decisões, oportunidades e hipóteses que emergem da conversa e viram pipeline governado.',
      contratoAtual: 'Indireto — intelligence_flows e intelligence_flow_steps são criados a partir de sugestões de pauta/tarefa.',
      contratoDesejado: 'Contrato ConversationToNagiCandidate com criação de item de triagem vinculado à sessão.'
    },
    {
      nome: 'Central de Padrões',
      id: 'central_padroes',
      relacao: 'Regras de governança aplicáveis ao turno e registro de evidências de decisão.',
      contratoAtual: 'Indireto — governança_compliance_rules pode ser consultado via contextAssembler.',
      contratoDesejado: 'Consulta de regras antes do turno + snapshot de contexto + envio de evidências de decisão.'
    },
    {
      nome: 'Cadastro de Empresas',
      id: 'cadastro-empresas',
      relacao: 'Contexto empresarial da conversa: empresa, unidade de negócio, venture, segmento.',
      contratoAtual: 'Indireto — workspaceId, buId e ventureId são usados para filtrar contexto.',
      contratoDesejado: 'BusinessContext formal injetado antes do turno com dados de empresa, unidade, contatos e restrições.'
    }
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
    'governance_compliance_rules (tabela, via contextAssembler)',
    'services/knowledge.ts (RAG lite)',
    'services/contextAssembler.ts (montagem de contexto de missão)',
    'services/continuousMemory.ts (memória contínua do Núcleo de Agentes)'
  ],

  fluxosPrincipais: [
    'Abrir ou criar sessão com agente',
    'Persistir mensagem do usuário',
    'Escolher provider/modelo',
    'Montar contexto de runtime com governança, DNA e documentos',
    'Gerar resposta simples ou multiagente com streaming',
    'Persistir mensagem bot',
    'Detectar qualidade e registrar eventos',
    'Criar ou atualizar fluxo de inteligência',
    'Sugerir título, tarefas ou consolidar memória',
    'Handoff de decisões/ideias para NAGI ou outros módulos'
  ],

  objetivosProduto: [
    'Produto standalone vendável — módulo independente de tipos, UI e serviços raiz do SagB',
    'Camada de execução conversacional viva que conecta agentes, documentos, memória e governança'
  ],

  pendenciasPrincipais: [
    '[STANDALONE] Camada 1 — Tipos locais (types.ts) ✅',
    '[STANDALONE] Camada 2 — UI local (ícones, Avatar)',
    '[STANDALONE] Camada 3 — Abstração de providers (banco + LLM)',
    '[STANDALONE] Camada 4 — Extrair TitleSuggestionPanel + TaskSuggestionPanel do SystemicVision',
    'Reduzir tamanho e complexidade do SystemicVision.tsx',
    'Fortalecer RAG além de heurísticas por palavra-chave',
    'Tornar prompts estruturais realmente preenchidos (data/prompts.ts)',
    'Criar AgentContextProvider integrado ao Núcleo de Agentes',
    'Criar DocumentContextProvider integrado ao CID',
    'Criar contrato de handoff para NAGI',
    'Criar integração com Central de Padrões para regras e evidências',
    'Integrar contexto empresarial do Cadastro de Empresas'
  ]
};
