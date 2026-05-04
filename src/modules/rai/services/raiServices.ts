import { RAIAgent, RAICapture, RAIReading, RAIAlert, RAIFilters } from '../types';

// Mock Services para o RAI
// No futuro, estes serviços chamarão a API do Supabase ou n8n

export const raiAgentsService = {
  getAgents: async (): Promise<RAIAgent[]> => {
    return [
      {
        id: 'agent-1',
        name: 'Sondagem de Mercado',
        theme: 'Mercado Financeiro',
        objective: 'Monitorar flutuações e tendências macroeconômicas',
        frequency: 'hourly',
        status: 'active',
        sources: [
          'https://www.bcb.gov.br/rss',
          'https://feeds.folha.uol.com.br/mercado/rss.xml',
          'https://www.infomoney.com.br/feed/'
        ],
        lastRun: new Date(Date.now() - 3600000),
        nextRun: new Date(Date.now() + 3600000)
      },
      {
        id: 'agent-2',
        name: 'Radar Tech',
        theme: 'Tecnologia & IA',
        objective: 'Captar avanços em LLMs e ferramentas de produtividade',
        frequency: 'real-time',
        status: 'active',
        sources: [
          'https://arxiv.org/rss/cs.AI',
          'https://news.ycombinator.com/rss',
          'https://blog.google/technology/rss/'
        ],
        lastRun: new Date(),
        nextRun: new Date(Date.now() + 600000)
      },
      {
        id: 'agent-3',
        name: 'Olheiro Competitivo',
        theme: 'Concorrência',
        objective: 'Acompanhar novos produtos de players do setor',
        frequency: 'daily',
        status: 'paused',
        sources: [
          'https://techcrunch.com/feed/',
          'https://producthunt.com/feed'
        ]
      }
    ];
  }
};

export const raiCapturesService = {
  getCaptures: async (filters?: RAIFilters): Promise<RAICapture[]> => {
    return [
      {
        id: 'cap-1',
        agentId: 'agent-2',
        title: 'OpenAI lança GPT-5 Preview',
        content: 'Detalhes sobre a nova arquitetura e capacidades de raciocínio avançado...',
        summary: 'Nova versão do GPT foca em lógica e redução de alucinações.',
        sourceUrl: 'https://openai.com/blog',
        sourceName: 'OpenAI Blog',
        relevance: 95,
        timestamp: new Date(),
        tags: ['IA', 'OpenAI', 'LLM'],
        category: 'Tecnologia',
        status: 'new'
      },
      {
        id: 'cap-2',
        agentId: 'agent-1',
        title: 'Taxa Selic mantida em 10.75%',
        content: 'Copom decide por unanimidade manter a taxa básica de juros...',
        sourceName: 'Banco Central',
        relevance: 80,
        timestamp: new Date(Date.now() - 7200000),
        tags: ['Economia', 'Brasil', 'Selic'],
        category: 'Financeiro',
        status: 'read'
      }
    ];
  }
};

export const raiInsightsService = {
  getReadings: async (): Promise<RAIReading[]> => {
    return [
      {
        id: 'read-1',
        title: 'Sinal: Aceleração em Agentes Autônomos',
        synthesis: 'Observamos um movimento coordenado de grandes tech players em direção a agentes que executam tarefas de ponta a ponta.',
        keyPoints: [
          'Interoperabilidade entre modelos aumentou',
          'Custo de inferência caiu 30% no último trimestre',
          'Foco mudou de chat para workflows'
        ],
        relatedCaptures: ['cap-1'],
        sentiment: 'positive',
        trend: 'up',
        timestamp: new Date()
      }
    ];
  },
  getAlerts: async (): Promise<RAIAlert[]> => {
    return [
      {
        id: 'alert-1',
        type: 'opportunity',
        title: 'Nova API de Baixa Latência',
        description: 'Possibilidade de integração em tempo real no módulo de Voz do SagB.',
        severity: 'high',
        timestamp: new Date(),
        isRead: false
      },
      {
        id: 'alert-2',
        type: 'emerging',
        title: 'Trend: Micro-SaaS de Nicho',
        description: 'Aumento de capturas sobre soluções ultra-especializadas para o setor jurídico.',
        severity: 'medium',
        timestamp: new Date(Date.now() - 86400000),
        isRead: true
      }
    ];
  }
};
