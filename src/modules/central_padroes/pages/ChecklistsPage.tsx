import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { SectionPanel } from '../components/SectionPanel';
import { ChecklistPanel } from '../components/ChecklistPanel';
import { Toast } from '../components/Toast';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';

const ChecklistsPage: React.FC = () => {
  const { snapshot, refetch } = useCentralPadroes();
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = React.useState({ title: '', context: 'publicar_padrao', owner: 'Pietro Carboni', items: 'Validar owner\nChecar risco' });
  const submit = async () => {
    try {
      await centralPadroesCrudService.createChecklist({ title: form.title, context: form.context, owner: form.owner, items: form.items.split('\n').map((item) => item.trim()).filter(Boolean) });
      await refetch();
      setOpen(false);
      setToast({ message: 'Checklist criado.', type: 'success' });
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };
  return <CentralPageShell title="Matrizes e Checklists" subtitle="Checklists obrigatórios antes de criar módulo, tabela, API, integração, agente ou deploy."><SectionPanel title="Checklists V1"><div className="mb-4"><button onClick={() => setOpen(true)} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-bold text-white">Novo Checklist</button></div><ChecklistPanel checklists={snapshot?.checklists || []} /></SectionPanel><CrudModal title="Novo Checklist" open={open} onClose={() => setOpen(false)} footer={<button onClick={submit} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-bold text-white">Salvar</button>}><div className="grid grid-cols-1 gap-3 md:grid-cols-2"><FormField label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} /><FormField label="Contexto" value={form.context} onChange={(value) => setForm((prev) => ({ ...prev, context: value }))} /><FormField label="Owner" value={form.owner} onChange={(value) => setForm((prev) => ({ ...prev, owner: value }))} /><div className="md:col-span-2"><FormField label="Itens (um por linha)" value={form.items} onChange={(value) => setForm((prev) => ({ ...prev, items: value }))} textarea /></div></div></CrudModal><Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} /></CentralPageShell>;
};
export default ChecklistsPage;
