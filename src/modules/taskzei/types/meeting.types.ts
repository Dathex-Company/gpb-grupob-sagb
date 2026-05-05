export type MeetingStatus = 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
export type AgendaItemStatus = 'pendente' | 'discutido' | 'adiado';
export type DecisionStatus = 'aberta' | 'em_andamento' | 'concluida' | 'cancelada';

export interface MeetingAgendaItem {
  id: string;
  meetingId: string;
  title: string;
  description?: string;
  sortOrder: number;
  durationMinutes?: number;
  status: AgendaItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Decision {
  id: string;
  meetingId?: string;
  agendaItemId?: string;
  title: string;
  description?: string;
  responsible?: string;
  deadline?: string;
  status: DecisionStatus;
  relatedTaskId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  meetingDate?: string;
  startTime?: string;
  durationMinutes?: number;
  status: MeetingStatus;
  notes?: string;
  agendaItems?: MeetingAgendaItem[];
  decisions?: Decision[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
