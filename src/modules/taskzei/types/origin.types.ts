export type OriginSystem = 'sagb' | 'clickup' | 'whatsapp' | 'email' | 'inbox' | 'manual';

export interface TaskOrigin {
  system: OriginSystem;
  ref?: string;
  metadata?: Record<string, unknown>;
}
