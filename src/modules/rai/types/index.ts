
export interface RAIAgent {
  id: string;
  name: string;
  theme: string;
  objective: string;
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  status: 'active' | 'paused' | 'error';
  lastRun?: Date;
  nextRun?: Date;
  metadata?: Record<string, any>;
}

export interface RAICapture {
  id: string;
  agentId: string;
  title: string;
  content: string;
  summary?: string;
  sourceUrl?: string;
  sourceName: string;
  relevance: number; // 0-100
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
  search?: string;
  startDate?: Date;
  endDate?: Date;
  agentId?: string;
  category?: string;
  minRelevance?: number;
  tags?: string[];
}
