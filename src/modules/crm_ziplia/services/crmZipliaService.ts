import { restFetch } from '../../../../services/supabase';
import { CrmLead, CrmStageConfig, CrmStats } from '../types';

const DEFAULT_STAGES: CrmStageConfig[] = [
  { status: 'Lead captado', probability: 0.15, recommendedDays: 2 },
  { status: 'Qualificado', probability: 0.25, recommendedDays: 3 },
  { status: 'Reunião marcada', probability: 0.4, recommendedDays: 4 },
  { status: 'Reunião feita', probability: 0.5, recommendedDays: 5 },
  { status: 'Proposta enviada', probability: 0.65, recommendedDays: 6 },
  { status: 'Negociação', probability: 0.8, recommendedDays: 8 },
  { status: 'Fechado ganho', probability: 1, recommendedDays: 0 },
  { status: 'Fechado perdido', probability: 0, recommendedDays: 0 }
];

const toIso = (value: unknown, fallback: string) => {
  if (typeof value === 'string' && value.trim()) return value;
  return fallback;
};

const safeNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const mapLead = (row: any): CrmLead => {
  const lastContact = toIso(row.last_contact, new Date().toISOString());
  const createdAt = toIso(row.created_at, new Date().toISOString());
  const daysInStage = Math.max(
    0,
    Math.floor((Date.now() - new Date(lastContact).getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? 'Sem nome'),
    company: String(row.company ?? 'Sem empresa'),
    phone: row.phone ? String(row.phone) : undefined,
    projectedCommission: safeNumber(row.projected_commission, 0),
    status: (row.status ?? 'Lead captado') as CrmLead['status'],
    lastContact,
    createdAt,
    nextAction: row.next_action ? String(row.next_action) : undefined,
    nextActionDate: row.next_action_date ? String(row.next_action_date) : undefined,
    daysInStage,
    uauScore: safeNumber(row.uau_score, 0),
    margin: safeNumber(row.margin, 0),
    isApproved: Boolean(row.is_approved)
  };
};

export const crmZipliaService = {
  async getLeads(): Promise<CrmLead[]> {
    const query = new URLSearchParams({
      select: [
        'id',
        'name',
        'company',
        'phone',
        'projected_commission',
        'status',
        'last_contact',
        'created_at',
        'next_action',
        'next_action_date',
        'uau_score',
        'margin',
        'is_approved'
      ].join(','),
      order: 'created_at.desc'
    });

    const rows = await restFetch('leads', { query });
    const list = Array.isArray(rows) ? rows : [];
    return list.map(mapLead);
  },

  async updateLead(leadId: string, updates: Partial<CrmLead>): Promise<void> {
    const body: Record<string, unknown> = {};
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.company !== undefined) body.company = updates.company;
    if (updates.phone !== undefined) body.phone = updates.phone;
    if (updates.projectedCommission !== undefined) body.projected_commission = updates.projectedCommission;
    if (updates.status !== undefined) body.status = updates.status;
    if (updates.lastContact !== undefined) body.last_contact = updates.lastContact;
    if (updates.nextAction !== undefined) body.next_action = updates.nextAction;
    if (updates.nextActionDate !== undefined) body.next_action_date = updates.nextActionDate;
    if (updates.uauScore !== undefined) body.uau_score = updates.uauScore;
    if (updates.margin !== undefined) body.margin = updates.margin;
    if (updates.isApproved !== undefined) body.is_approved = updates.isApproved;

    const query = new URLSearchParams({
      id: `eq.${leadId}`,
      select: 'id'
    });

    await restFetch('leads', {
      method: 'PATCH',
      query,
      body,
      headers: { Prefer: 'return=representation' }
    });
  },

  async getStages(): Promise<CrmStageConfig[]> {
    try {
      const query = new URLSearchParams({
        select: 'status,probability,recommended_days',
        order: 'recommended_days.asc'
      });
      const rows = await restFetch('stage_configs', { query });
      const list = Array.isArray(rows) ? rows : [];
      if (!list.length) return DEFAULT_STAGES;
      return list.map((row: any) => ({
        status: row.status as CrmStageConfig['status'],
        probability: safeNumber(row.probability, 0),
        recommendedDays: safeNumber(row.recommended_days, 0)
      }));
    } catch {
      return DEFAULT_STAGES;
    }
  },

  async getStats(): Promise<CrmStats> {
    const leads = await this.getLeads();
    const stageMap = new Map((await this.getStages()).map((s) => [s.status, s.probability]));

    const projected = leads.reduce((acc, l) => acc + l.projectedCommission, 0);
    const probable = leads.reduce((acc, l) => acc + (l.projectedCommission * (stageMap.get(l.status) ?? 0)), 0);
    const openLeads = leads.filter((l) => l.status !== 'Fechado ganho' && l.status !== 'Fechado perdido').length;

    return { projected, probable, openLeads };
  },

  async getWhatsAppConversations(limit = 50): Promise<any[]> {
    const query = new URLSearchParams({
      select: '*,whatsapp_contacts(*)',
      order: 'last_message_at.desc',
      limit: String(Math.min(Math.max(limit, 1), 100))
    });

    const rows = await restFetch('whatsapp_conversations', { query });
    return Array.isArray(rows) ? rows : [];
  },

  async getWhatsAppConversationMessages(conversationId: string, limit = 100): Promise<any[]> {
    const query = new URLSearchParams({
      select: '*',
      conversation_id: `eq.${conversationId}`,
      order: 'created_at.asc',
      limit: String(Math.min(Math.max(limit, 1), 200))
    });

    const rows = await restFetch('whatsapp_messages', { query });
    return Array.isArray(rows) ? rows : [];
  }
};
