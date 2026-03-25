export type MentoriaStatus = 'draft' | 'active' | 'archived';

export interface MentoriaMaterial {
  id: string;
  name: string;
  type: string;
  url: string;
  createdAt: string;
}

export interface MentoriaSessao {
  id: string;
  title: string;
  description?: string;
  order: number;
  duration?: number; // em minutos
}

export interface MentoriaBloco {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface MentoriaVersao {
  id: string;
  version: string;
  changes: string;
  createdAt: string;
  authorId: string;
}

export interface MentoriaAgente {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface MentoriaHistorico {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  userId: string;
}

export interface Mentoria {
  id: string;
  title: string;
  description: string;
  status: MentoriaStatus;
  version: string;
  type: string;
  lastUpdate: string;
  blocks?: MentoriaBloco[];
  materials?: MentoriaMaterial[];
  sessions?: MentoriaSessao[];
  versions?: MentoriaVersao[];
  agents?: MentoriaAgente[];
  history?: MentoriaHistorico[];
}

export interface MentoriasState {
  mentorias: Mentoria[];
  isLoading: boolean;
  error: string | null;
}
