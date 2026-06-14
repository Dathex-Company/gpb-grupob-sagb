import React from 'react';
import { ApprovalBadge } from '../components/ApprovalBadge';
import { CentralPageShell } from '../components/CentralPageShell';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { SectionPanel } from '../components/SectionPanel';
import { Toast } from '../components/Toast';
import { ApprovalRequest, centralPadroesApprovalService } from '../services/centralPadroesApprovalService';

const ApprovalsPage: React.FC = () => {
  const [requests, setRequests] = React.useState<ApprovalRequest[]>([]);
  const [selected, setSelected] = React.useState<ApprovalRequest | null>(null);
  const [notes, setNotes] = React.useState('Aprovado para curadoria.');
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const load = React.useCallback(async () => {
    try {
      setRequests(await centralPadroesApprovalService.listPendingApprovals());
    } catch {
      setRequests([]);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const decide = async (action: 'approve' | 'reject') => {
    if (!selected) return;
    try {
      if (action === 'approve') await centralPadroesApprovalService.approve(selected.id, notes);
      else await centralPadroesApprovalService.reject(selected.id, notes);
      setToast({ message: action === 'approve' ? 'Solicitação aprovada.' : 'Solicitação rejeitada.', type: 'success' });
      setSelected(null);
      await load();
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  return (
    <CentralPageShell title="Aprovações e Revisões" subtitle="Fluxo de revisão: solicitar, aprovar/rejeitar, avançar para curadoria e publicar.">
      <SectionPanel title="Solicitações de aprovação">
        <div className="space-y-3">
          {requests.map((request) => (
            <article key={request.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sagb-muted">{request.standardId}</p>
                  <h3 className="font-bold text-sagb-text">Solicitado por {request.requestedBy}</h3>
                  <p className="mt-1 text-[12px] text-sagb-muted">Revisor: {request.assignedTo}</p>
                </div>
                <ApprovalBadge status={request.status} />
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setSelected(request)} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-bold text-white">Analisar</button>
              </div>
            </article>
          ))}
          {requests.length === 0 && <p className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4 text-[12px] text-sagb-muted">Nenhuma aprovação pendente.</p>}
        </div>
      </SectionPanel>
      <CrudModal title="Decisão de aprovação" open={Boolean(selected)} onClose={() => setSelected(null)} footer={<><button onClick={() => decide('reject')} className="rounded-xl bg-red-600 px-4 py-2 text-[12px] font-bold text-white">Rejeitar</button><button onClick={() => decide('approve')} className="rounded-xl bg-emerald-600 px-4 py-2 text-[12px] font-bold text-white">Aprovar</button></>}>
        <FormField label="Notas do revisor" value={notes} onChange={setNotes} textarea />
      </CrudModal>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default ApprovalsPage;

