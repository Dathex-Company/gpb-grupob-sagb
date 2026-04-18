export const AGENTE_TIPO_VALUES = ['HUMANO', 'IA_HIBRIDO', 'AUTOMATICO', 'OUTRO'] as const;
export type AgenteTipo = (typeof AGENTE_TIPO_VALUES)[number];

export const AGENTE_STATUS_VALUES = ['ATIVO', 'INATIVO', 'EM_TREINAMENTO', 'EM_FERIAS', 'AUSENTE'] as const;
export type AgenteStatus = (typeof AGENTE_STATUS_VALUES)[number];

export const AGENTE_NIVEL_EXPERIENCIA_VALUES = ['JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA'] as const;
export type AgenteNivelExperiencia = (typeof AGENTE_NIVEL_EXPERIENCIA_VALUES)[number];

export const AGENTE_CANAL_ATENDIMENTO_VALUES = ['TELEFONE', 'EMAIL', 'CHAT', 'VIDEO', 'PRESENCIAL', 'MULTICANAL'] as const;
export type AgenteCanalAtendimento = (typeof AGENTE_CANAL_ATENDIMENTO_VALUES)[number];

export const AGENTE_FUNCAO_COMERCIAL_VALUES = ['SDR', 'CLOSER', 'FARMER', 'CRC', 'GDR', 'OUTRO'] as const;
export type AgenteFuncaoComercial = (typeof AGENTE_FUNCAO_COMERCIAL_VALUES)[number];

/**
 * Entidade oficial do módulo Agentes Comerciais.
 *
 * Linguagem canônica:
 * - Entidade principal: AgenteComercial
 * - "atendente", "operador" não são entidade principal
 * - "humano", "ia_hibrido", "automatico" passam a ser classificação (tipo)
 */
export interface AgenteComercial {
  id: string;
  nome: string;
  nome_exibicao?: string;
  email: string;
  telefone?: string;
  tipo: AgenteTipo;
  status: AgenteStatus;
  nivel_experiencia: AgenteNivelExperiencia;
  canal_atendimento: AgenteCanalAtendimento;
  funcao: AgenteFuncaoComercial;
  vertical?: string; // ex: "Odontologia", "Imobiliário"
  especialidades?: string[];
  capacidade_concorrente: number;
  
  persona?: {
    bio: string;
    tom_voz: string;
    objetivos?: string[];
  };

  voz?: {
    provider: string; // ex: "ElevenLabs", "OpenAI"
    voice_id: string;
    velocidade: number;
    pitch: number;
  };

  // Inteligência de Squad e Conectividade
  fluxo_proximo_agente_id?: string; // ID do agente que recebe o lead (ex: SDR -> Closer)
  
  config_economica?: {
    custo_fixo_mensal: number;
    custo_por_sessao: number;
    receita_gerada: number;
  };

  metadata_squad?: {
    cliente_id: string;
    squad_id: string;
    is_template: boolean;
  };

  metricas?: {
    atendimentos_concluidos: number;
    satisfacao_media: number;
    tempo_medio_resposta: number; // em segundos
  };
  foto_url?: string;
  created_at: Date;
  updated_at: Date;
  ultimo_acesso?: Date;
}

export type Agente = AgenteComercial;

export interface AgenteDraft extends Partial<AgenteComercial> {
  nome: string;
  email: string;
  tipo: AgenteTipo;
  status: AgenteStatus;
}

export type AgenteFonteLegada = Record<string, unknown> & Partial<AgenteComercial>;

export interface AgenteNormalizacaoRastro {
  termos_legados_detectados: string[];
  campos_origem: Record<string, string>;
}

export interface AgenteNormalizado {
  agente: AgenteComercial;
  rastro: AgenteNormalizacaoRastro;
}