
/**
 * Configuração de radar de um agente do SagB.
 * Não é um cadastro paralelo — cada RAIConfig referencia um Agent existente.
 */
export interface RAIConfig {
  id: string;
  agentId: string;        // FK → agents(id) do SagB
  workspaceId: string;
  theme: string;
  objective: string;
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  status: 'active' | 'paused' | 'error';
  sources: string[];       // URLs ou identificadores das fontes monitoradas
  lastRun?: Date;
  nextRun?: Date;
  metadata?: Record<string, any>;
}

/**
 * RAIAgent = agente do SagB enriquecido com configuração de radar.
 * Usado nos hooks e componentes para exibir agentes com status RAI.
 */
export interface RAIAgent {
  /** ID do agent no SagB (agents.id) */
  id: string;
  /** Nome vindo do Agent do SagB */
  name: string;
  /** Configuração RAI vinculada (null se o agente não tem radar configurado) */
  config: RAIConfig | null;
  // Atalhos para acesso direto (delegam para config quando existente)
  theme: string;
  objective: string;
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  status: 'active' | 'paused' | 'error';
  sources: string[];
  lastRun?: Date;
  nextRun?: Date;
}

export interface RAICapture {
  id: string;
  agentId: string;         // FK → agents(id) do SagB
  configId?: string;       // FK → rai_configs(id) (opcional)
  title: string;
  content: string;
  summary?: string;
  sourceUrl?: string;
  sourceName: string;
  relevance: number;       // 0-100
  timestamp: Date;
  tags: string[];
  category: string;
  status: 'new' | 'read' | 'archived' | 'converted';
  payload?: Record<string, any>;
}

export interface RAIReading {
  id: string;
  title: string;
  synthesis: string;
  keyPoints: string[];
  relatedCaptures: string[]; // IDs das capturas
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  trend: 'up' | 'stable' | 'down';
  timestamp: Date;
  authorId?: string;
}

export interface RAIAlert {
  id: string;
  type: 'critical' | 'opportunity' | 'emerging';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  relatedEntityId?: string; // Pode ser capture ou reading
  timestamp: Date;
  isRead: boolean;
}

export interface RAIFilters {
  query?: string;
  startDate?: Date;
  endDate?: Date;
  agentId?: string;        // Filtro por agent do SagB
  category?: string;
  status?: RAICapture['status'];
  minRelevance?: number;
  tags?: string[];
}
