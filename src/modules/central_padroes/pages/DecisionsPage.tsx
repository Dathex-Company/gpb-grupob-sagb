import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';

const DecisionsPage: React.FC = () => {
  const { snapshot, refetch } = useCentralPadroes();
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = React.useState({ title: '', summary: '', areaId: 'pietro', impacts: 'central_padroes' });
  const submit = async () => {
    try {
      await centralPadroesCrudService.createDecision({ title: form.title, summary: form.summary, areaId: form.areaId, status: 'proposta', impacts: form.impacts.split(',').map((item) => item.trim()).filter(Boolean) });
      await refetch();
      setOpen(false);
      setToast({ message: 'Decisão registrada.', type: 'success' });
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };
  return (
    <CentralPageShell title="Decisões e Exceções" subtitle="Registro mestre de decisões arquiteturais e exceções futuras vinculadas a padrões.">
      <SectionPanel title="Decisões estruturais">
        <div className="mb-4"><button onClick={() => setOpen(true)} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">Nova Decisão</button></div>
        <div className="space-y-3">
          {snapshot?.decisions.map((decision) => (
            <article key={decision.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
              <div className="flex items-start justify-between gap-3"><h3 className="font-black text-sagb-text">{decision.title}</h3><StatusBadge value={decision.status} /></div>
              <p className="mt-2 text-[12px] text-sagb-muted">{decision.summary}</p>
              <p className="mt-2 text-[11px] text-sagb-muted">Impactos: {decision.impacts.join(', ')}</p>
            </article>
          ))}
        </div>
      </SectionPanel>
      <CrudModal title="Nova Decisão" open={open} onClose={() => setOpen(false)} footer={<button onClick={submit} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">Salvar</button>}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
          <FormField label="Área" value={form.areaId} onChange={(value) => setForm((prev) => ({ ...prev, areaId: value }))} />
          <FormField label="Impactos separados por vírgula" value={form.impacts} onChange={(value) => setForm((prev) => ({ ...prev, impacts: value }))} />
          <div className="md:col-span-2"><FormField label="Resumo" value={form.summary} onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))} textarea /></div>
        </div>
      </CrudModal>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};
export default DecisionsPage;
