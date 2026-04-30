export type CrmLeadStatus =
  | 'Lead captado'
  | 'Qualificado'
  | 'Reunião marcada'
  | 'Reunião feita'
  | 'Proposta enviada'
  | 'Negociação'
  | 'Fechado ganho'
  | 'Fechado perdido';

export interface CrmLead {
  id: string;
  name: string;
  company: string;
  phone?: string;
  projectedCommission: number;
  status: CrmLeadStatus;
  lastContact: string;
  createdAt: string;
  nextAction?: string;
  nextActionDate?: string;
  daysInStage: number;
  uauScore: number;
  margin: number;
  isApproved: boolean;
}

export interface CrmStageConfig {
  status: CrmLeadStatus;
  probability: number;
  recommendedDays: number;
}

export interface CrmStats {
  projected: number;
  probable: number;
  openLeads: number;
}

