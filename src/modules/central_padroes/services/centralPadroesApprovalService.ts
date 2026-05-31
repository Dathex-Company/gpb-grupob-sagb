import { auth, restFetch } from '../../../../services/supabase';
import { CentralStandardStatus } from '../types';
import { centralPadroesCrudService } from './centralPadroesCrudService';

export interface ApprovalRequest {
  id: string;
  standardId: string;
  requestedBy: string;
  assignedTo: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string | null;
  createdAt: string;
}

const currentUser = () => {
  const user = auth.currentUser as { id?: string; email?: string } | null;
  return user?.email || user?.id || 'unknown';
};

const mapRequest = (row: any): ApprovalRequest => ({
  id: row.id,
  standardId: row.standard_id,
  requestedBy: row.requested_by,
  assignedTo: row.assigned_to,
  status: row.status,
  reviewNotes: row.review_notes,
  createdAt: row.created_at
});

const statusMap: Record<string, CentralStandardStatus> = {
  review: 'revisao',
  curation: 'curadoria',
  approved: 'aprovado',
  published: 'publicado',
  rejected: 'rascunho',
  deprecated: 'deprecado',
  replaced: 'substituido'
};

export const centralPadroesApprovalService = {
  async requestApproval(standardId: string, requestedBy = currentUser(), assignedTo = 'Pietro Carboni'): Promise<void> {
    await restFetch('central_padroes_approval_requests', {
      method: 'POST',
      body: { standard_id: standardId, requested_by: requestedBy, assigned_to: assignedTo, status: 'pending' }
    });
    await this.transitionStandard(standardId, 'review');
    console.info('[central-padroes][approval] request', { standardId, requestedBy, assignedTo });
  },

  async approve(approvalRequestId: string, reviewerNotes: string): Promise<void> {
    const request = await this.getRequest(approvalRequestId);
    if (!request) throw new Error('Solicitação de aprovação não encontrada.');
    const query = new URLSearchParams({ id: `eq.${approvalRequestId}` });
    await restFetch('central_padroes_approval_requests', { method: 'PATCH', query, body: { status: 'approved', review_notes: reviewerNotes, decided_at: new Date().toISOString() } });
    await this.transitionStandard(request.standardId, 'curation');
    console.info('[central-padroes][approval] approved', { approvalRequestId, reviewerNotes });
  },

  async reject(approvalRequestId: string, reason: string): Promise<void> {
    const request = await this.getRequest(approvalRequestId);
    if (!request) throw new Error('Solicitação de aprovação não encontrada.');
    const query = new URLSearchParams({ id: `eq.${approvalRequestId}` });
    await restFetch('central_padroes_approval_requests', { method: 'PATCH', query, body: { status: 'rejected', review_notes: reason, decided_at: new Date().toISOString() } });
    await this.transitionStandard(request.standardId, 'rejected');
    console.info('[central-padroes][approval] rejected', { approvalRequestId, reason });
  },

  async listPendingApprovals(): Promise<ApprovalRequest[]> {
    const query = new URLSearchParams({ select: '*', order: 'created_at.desc' });
    const data = await restFetch('central_padroes_approval_requests', { method: 'GET', query });
    return Array.isArray(data) ? data.map(mapRequest) : [];
  },

  async getApprovalHistory(standardId: string): Promise<ApprovalRequest[]> {
    const query = new URLSearchParams({ select: '*', standard_id: `eq.${standardId}`, order: 'created_at.desc' });
    const data = await restFetch('central_padroes_approval_requests', { method: 'GET', query });
    return Array.isArray(data) ? data.map(mapRequest) : [];
  },

  async publishStandard(standardId: string): Promise<void> {
    await this.transitionStandard(standardId, 'approved');
    await centralPadroesCrudService.updateStandard(standardId, { status: 'publicado' });
    console.info('[central-padroes][approval] published', { standardId });
  },

  async deprecateStandard(standardId: string, replacementId?: string): Promise<void> {
    await centralPadroesCrudService.updateStandard(standardId, { status: replacementId ? 'substituido' : 'deprecado' });
    console.info('[central-padroes][approval] deprecated', { standardId, replacementId });
  },

  async getRequest(id: string): Promise<ApprovalRequest | null> {
    const query = new URLSearchParams({ select: '*', id: `eq.${id}` });
    const data = await restFetch('central_padroes_approval_requests', { method: 'GET', query });
    return Array.isArray(data) && data[0] ? mapRequest(data[0]) : null;
  },

  async transitionStandard(standardId: string, next: keyof typeof statusMap): Promise<void> {
    const query = new URLSearchParams({ id: `eq.${standardId}` });
    await restFetch('central_padroes_standards', {
      method: 'PATCH',
      query,
      body: {
        status: statusMap[next],
        approval_status: next,
        approval_requested_at: next === 'review' ? new Date().toISOString() : undefined,
        approval_decided_at: ['approved', 'published', 'rejected'].includes(next) ? new Date().toISOString() : undefined
      }
    });
  }
};

