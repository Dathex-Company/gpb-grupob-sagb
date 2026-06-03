export type MentoriaStatus = 'draft' | 'active' | 'archived';
export type MentoriaType = 'Carreira' | 'Técnica' | 'Produto' | 'Gestão' | 'Outro';
export type MaterialType = 'pdf' | 'video' | 'link' | 'notion' | 'figma' | 'github' | 'slide' | 'outro';

export interface MentoriaMaterial {
  id: string;
  mentoriaId: string;
  name: string;
  type: MaterialType;
  url: string;
  storagePath?: string;
  sizeBytes?: number;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentoriaSessao {
  id: string;
  mentoriaId: string;
  title: string;
  description?: string;
  order: number;
  durationMinutes?: number;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentoriaBloco {
  id: string;
  mentoriaId: string;
  title: string;
  content: string;
  order: number;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentoriaVersao {
  id: string;
  mentoriaId: string;
  version: string;
  changes?: string;
  authorId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MentoriaAgente {
  id: string;
  mentoriaId: string;
  name: string;
  role: string;
  avatarUrl?: string;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentoriaHistorico {
  id: string;
  mentoriaId: string;
  action: string;
  description?: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Mentoria {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: MentoriaStatus;
  version: string;
  type: MentoriaType;
  lastUpdate: string;
  isActive: boolean;
  payload?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
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
