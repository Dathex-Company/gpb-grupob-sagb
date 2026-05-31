import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { SectionPanel } from '../components/SectionPanel';
import { StandardTable } from '../components/StandardTable';
import { Toast } from '../components/Toast';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { centralPadroesApprovalService } from '../services/centralPadroesApprovalService';
import { CentralNormativeType } from '../types';

const StandardsPage: React.FC = () => {
  const { snapshot, loading, operation, createStandard, updateStandard, deleteStandard } = useCentralPadroes();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = React.useState({ key: '', title: '', summary: '', owner: 'Pietro Carboni', areaId: 'pietro', type: 'padrao', contentMd: '' });

  const openCreate = () => {
    setEditingId(null);
    setForm({ key: '', title: '', summary: '', owner: 'Pietro Carboni', areaId: 'pietro', type: 'padrao', contentMd: '' });
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    const standard = snapshot?.standards.find((item) => item.id === id);
    if (!standard) return;
    setEditingId(id);
    setForm({ key: standard.key, title: standard.title, summary: standard.summary, owner: standard.owner, areaId: standard.areaId, type: standard.type, contentMd: standard.summary });
    setModalOpen(true);
  };

  const submit = async () => {
    try {
      if (editingId) {
        await updateStandard(editingId, { ...form, type: form.type as CentralNormativeType });
        setToast({ message: 'Padrão atualizado.', type: 'success' });
      } else {
        await createStandard({ ...form, type: form.type as CentralNormativeType, status: 'rascunho', risk: 'medio', agentAvailable: false, dependencies: [], relatedModules: [] });
        setToast({ message: 'Padrão criado.', type: 'success' });
      }
      setModalOpen(false);
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStandard(deleteId);
      setToast({ message: 'Padrão excluído.', type: 'success' });
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  const requestApproval = async (id: string) => {
    try {
      await centralPadroesApprovalService.requestApproval(id);
      setToast({ message: 'Aprovação solicitada.', type: 'success' });
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  return (
    <CentralPageShell title="Biblioteca de Padrões" subtitle="Padrões, regras, políticas, protocolos e contratos que formam o sistema nervoso normativo do SagB.">
      {loading && <p className="text-[12px] text-sagb-muted">Carregando padrões...</p>}
      {operation.loading && <p className="rounded-2xl border border-sagb-line bg-sagb-panel p-3 text-[12px] text-sagb-muted">Processando operação...</p>}
      {snapshot && (
        <SectionPanel title="Todos os padrões registrados">
          <div className="mb-4 flex flex-wrap gap-2">
            <button onClick={openCreate} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">Novo Padrão</button>
          </div>
          <StandardTable standards={snapshot.standards} onEdit={openEdit} onDelete={setDeleteId} onRequestApproval={requestApproval} />
        </SectionPanel>
      )}
      <CrudModal title={editingId ? 'Editar Padrão' : 'Novo Padrão'} open={modalOpen} onClose={() => setModalOpen(false)} footer={<button onClick={submit} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">Salvar</button>}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField label="Chave" value={form.key} onChange={(value) => setForm((prev) => ({ ...prev, key: value }))} placeholder="CP-GOV-002" />
          <FormField label="Tipo" value={form.type} onChange={(value) => setForm((prev) => ({ ...prev, type: value }))} placeholder="padrao" />
          <FormField label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
          <FormField label="Owner" value={form.owner} onChange={(value) => setForm((prev) => ({ ...prev, owner: value }))} />
          <FormField label="Área" value={form.areaId} onChange={(value) => setForm((prev) => ({ ...prev, areaId: value }))} />
          <FormField label="Resumo" value={form.summary} onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))} textarea />
          <div className="md:col-span-2"><FormField label="Conteúdo" value={form.contentMd} onChange={(value) => setForm((prev) => ({ ...prev, contentMd: value }))} textarea /></div>
        </div>
      </CrudModal>
      <ConfirmDialog open={Boolean(deleteId)} title="Excluir padrão" message="Confirma a exclusão deste padrão?" onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
      <Toast message={toast?.message || operation.error} type={toast?.type || 'error'} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default StandardsPage;
