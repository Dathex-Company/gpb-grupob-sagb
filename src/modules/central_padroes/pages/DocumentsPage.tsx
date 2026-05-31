import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';
import { centralPadroesStorageService } from '../services/centralPadroesStorageService';

const DocumentsPage: React.FC = () => {
  const { snapshot, refetch } = useCentralPadroes();
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = React.useState({ title: '', path: '', category: 'Governança', areaId: 'pietro' });

  const submit = async () => {
    try {
      await centralPadroesCrudService.createDocument({ ...form, status: 'bruto', shouldBecome: 'apoio' });
      await centralPadroesStorageService.ingestDocument({ title: form.title, sourcePath: form.path, sourceKind: 'manual' }).catch(() => '');
      await refetch();
      setOpen(false);
      setToast({ message: 'Documento registrado e enviado para triagem.', type: 'success' });
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  return (
    <CentralPageShell title="Biblioteca de Documentos" subtitle="Documentos canônicos, brutos, em revisão, legados e externos com destino normativo sugerido.">
      <SectionPanel title="Inventário documental V1">
        <div className="mb-4"><button onClick={() => setOpen(true)} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">Upload / Registrar Documento</button></div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {snapshot?.documents.map((doc) => (
            <article key={doc.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
              <div className="flex items-start justify-between gap-3"><h3 className="font-black text-sagb-text">{doc.title}</h3><StatusBadge value={doc.status} /></div>
              <p className="mt-2 font-mono text-[11px] text-sagb-muted">{doc.path}</p>
              <p className="mt-2 text-[12px] text-sagb-muted">Categoria: {doc.category} · Destino: {doc.shouldBecome}</p>
            </article>
          ))}
        </div>
      </SectionPanel>
      <CrudModal title="Registrar Documento" open={open} onClose={() => setOpen(false)} footer={<button onClick={submit} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">Salvar</button>}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
          <FormField label="Caminho/Origem" value={form.path} onChange={(value) => setForm((prev) => ({ ...prev, path: value }))} />
          <FormField label="Categoria" value={form.category} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} />
          <FormField label="Área" value={form.areaId} onChange={(value) => setForm((prev) => ({ ...prev, areaId: value }))} />
        </div>
      </CrudModal>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentsPage;
