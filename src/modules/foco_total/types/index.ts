export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface FocusSession {
  id: string;
  task: string;
  durationMinutes: number;
  timeRemainingSeconds: number;
  status: SessionStatus;
  startTime?: number;
  logs: SessionLog[];
}

export interface SessionLog {
  id: string;
  timestamp: number;
  type: 'start' | 'pause' | 'resume' | 'stop' | 'checkpoint' | 'agent_message';
  message: string;
}
