import { Agente, AgenteDraft, AgenteTipo, AgenteStatus, AgenteNivelExperiencia, AgenteCanalAtendimento, AgenteFuncaoComercial } from '../types';

export interface IAgenteRepository {
  buscarAgentes(): Promise<Agente[]>;
  buscarAgentePorId(id: string): Promise<Agente | null>;
  criarAgente(draft: AgenteDraft): Promise<Agente>;
  atualizarAgente(id: string, dados: Partial<Agente>): Promise<Agente | null>;
  removerAgente(id: string): Promise<boolean>;
  filtrarPorStatus(status: AgenteStatus): Promise<Agente[]>;
  filtrarPorTipo(tipo: AgenteTipo): Promise<Agente[]>;
  clonarAgente(id: string, novoClienteId?: string): Promise<Agente | null>;
  obterEstatisticas(): Promise<{
    total: number;
    ativos: number;
    humanos: number;
    ia_hibrido: number;
    automaticos: number;
    capacidade_total: number;
    atendimentos_totais: number;
    roi_estimado?: number;
    custo_operacional?: number;
  }>;
}

const mockAgentes: Agente[] = [
  {
    id: '1',
    nome: 'Ricardo Silva',
    nome_exibicao: 'Ricardo (SDR)',
    email: 'ricardo.sdr@squadvendas.ia',
    telefone: '+55 11 91234-5678',
    tipo: 'IA_HIBRIDO',
    status: 'ATIVO',
    funcao: 'SDR',
    vertical: 'Odontologia',
    nivel_experiencia: 'SENIOR',
    canal_atendimento: 'MULTICANAL',
    especialidades: ['Qualificação de Leads', 'Agendamento', 'Script Odonto'],
    capacidade_concorrente: 20,
    fluxo_proximo_agente_id: '2', // Passa para Beatriz (Closer)
    config_economica: {
      custo_fixo_mensal: 500,
      custo_por_sessao: 0.50,
      receita_gerada: 12500
    },
    persona: {
      bio: 'Especialista em pré-vendas para clínicas odontológicas. Educado, persistente e focado em converter curiosidade em consulta agendada.',
      tom_voz: 'Profissional, empático e resolutivo.',
    },
    voz: {
      provider: 'ElevenLabs',
      voice_id: 'ricardo_v3',
      velocidade: 1.0,
      pitch: 1.0
    },
    metricas: {
      atendimentos_concluidos: 342,
      satisfacao_media: 4.9,
      tempo_medio_resposta: 45
    },
    foto_url: 'https://ui-avatars.com/api/?name=Ricardo+SDR&background=004e92&color=fff',
    created_at: new Date('2026-01-01'),
    updated_at: new Date(),
    ultimo_acesso: new Date()
  },
  {
    id: '2',
    nome: 'Beatriz Closer',
    nome_exibicao: 'Beatriz (Vendas)',
    email: 'beatriz.closer@squadvendas.ia',
    telefone: '+55 11 98888-7777',
    tipo: 'IA_HIBRIDO',
    status: 'ATIVO',
    funcao: 'CLOSER',
    vertical: 'Imobiliário',
    nivel_experiencia: 'ESPECIALISTA',
    canal_atendimento: 'VIDEO',
    especialidades: ['Fechamento', 'Contratos', 'Negociação de Alto Ticket'],
    capacidade_concorrente: 5,
    config_economica: {
      custo_fixo_mensal: 800,
      custo_por_sessao: 2.00,
      receita_gerada: 150000
    },
    persona: {
      bio: 'Focada em fechamento de vendas imobiliárias de alto padrão.',
      tom_voz: 'Persuasiva, confiante e técnica.',
    },
    voz: {
      provider: 'OpenAI',
      voice_id: 'beatriz_nova',
      velocidade: 1.05,
      pitch: 0.95
    },
    metricas: {
      atendimentos_concluidos: 89,
      satisfacao_media: 4.7,
      tempo_medio_resposta: 120
    },
    foto_url: 'https://ui-avatars.com/api/?name=Beatriz+Closer&background=6a11cb&color=fff',
    created_at: new Date('2026-02-15'),
    updated_at: new Date(),
    ultimo_acesso: new Date()
  }
];

export const agenteService: IAgenteRepository = {
  async buscarAgentes(): Promise<Agente[]> {
    return new Promise(resolve => setTimeout(() => resolve([...mockAgentes]), 300));
  },

  async buscarAgentePorId(id: string): Promise<Agente | null> {
    return new Promise(resolve => setTimeout(() => resolve(mockAgentes.find(a => a.id === id) || null), 200));
  },

  async criarAgente(draft: AgenteDraft): Promise<Agente> {
    return new Promise(resolve => {
      setTimeout(() => {
        const novoAgente: Agente = {
          id: `agente_${Date.now()}`,
          nome: draft.nome,
          nome_exibicao: draft.nome_exibicao || draft.nome,
          email: draft.email,
          telefone: draft.telefone || '',
          tipo: draft.tipo || 'IA_HIBRIDO',
          status: draft.status || 'ATIVO',
          funcao: draft.funcao || 'SDR',
          vertical: draft.vertical || 'Geral',
          nivel_experiencia: draft.nivel_experiencia || 'PLENO',
          canal_atendimento: draft.canal_atendimento || 'MULTICANAL',
          capacidade_concorrente: draft.capacidade_concorrente || 10,
          created_at: new Date(),
          updated_at: new Date(),
          ...draft
        } as Agente;
        mockAgentes.push(novoAgente);
        resolve(novoAgente);
      }, 400);
    });
  },

  async atualizarAgente(id: string, dados: Partial<Agente>): Promise<Agente | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockAgentes.findIndex(a => a.id === id);
        if (index === -1) return resolve(null);
        mockAgentes[index] = { ...mockAgentes[index], ...dados, updated_at: new Date() };
        resolve(mockAgentes[index]);
      }, 400);
    });
  },

  async removerAgente(id: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockAgentes.findIndex(a => a.id === id);
        if (index === -1) return resolve(false);
        mockAgentes.splice(index, 1);
        resolve(true);
      }, 300);
    });
  },

  async clonarAgente(id: string, novoClienteId?: string): Promise<Agente | null> {
    const original = mockAgentes.find(a => a.id === id);
    if (!original) return null;
    
    const clone: Agente = {
      ...original,
      id: `clone_${Date.now()}`,
      nome: `${original.nome} (Cópia)`,
      metricas: {
        atendimentos_concluidos: 0,
        satisfacao_media: 0,
        tempo_medio_resposta: 0
      },
      metadata_squad: {
        ...original.metadata_squad,
        cliente_id: novoClienteId || 'new_client',
        is_template: false
      },
      created_at: new Date(),
      updated_at: new Date()
    };
    
    mockAgentes.push(clone);
    return clone;
  },

  async filtrarPorStatus(status: AgenteStatus): Promise<Agente[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockAgentes.filter(a => a.status === status)), 200));
  },

  async filtrarPorTipo(tipo: AgenteTipo): Promise<Agente[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockAgentes.filter(a => a.tipo === tipo)), 200));
  },

  async obterEstatisticas() {
    const agentes = await this.buscarAgentes();
    const receitaTotal = agentes.reduce((sum, a) => sum + (a.config_economica?.receita_gerada || 0), 0);
    const custoTotal = agentes.reduce((sum, a) => sum + (a.config_economica?.custo_fixo_mensal || 0), 0);
    
    return {
      total: agentes.length,
      ativos: agentes.filter(a => a.status === 'ATIVO').length,
      humanos: agentes.filter(a => a.tipo === 'HUMANO').length,
      ia_hibrido: agentes.filter(a => a.tipo === 'IA_HIBRIDO').length,
      automaticos: agentes.filter(a => a.tipo === 'AUTOMATICO').length,
      capacidade_total: agentes.reduce((sum, a) => sum + a.capacidade_concorrente, 0),
      atendimentos_totais: agentes.reduce((sum, a) => sum + (a.metricas?.atendimentos_concluidos || 0), 0),
      roi_estimado: receitaTotal > 0 ? (receitaTotal - custoTotal) / (custoTotal || 1) : 0,
      custo_operacional: custoTotal
    };
  }
};