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
import { CENTRAL_STATUS_LABELS, CentralDocument } from '../types';

const statusLabel: Record<string, string> = {
  canonico: 'Canônico',
  revisao: 'Revisão',
  bruto: 'Bruto',
  legado: 'Legado',
  externo: 'Externo',
  registro: 'Registro'
};

const statusOptions = ['todos', 'bruto', 'revisao', 'canonico', 'legado', 'externo', 'registro'] as const;

const DocumentsPage: React.FC = () => {
  const { snapshot, refetch, loading, error } = useCentralPadroes();
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = React.useState({ title: '', path: '', category: 'Governança', areaId: 'pietro' });
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<string>('todos');

  const documents = React.useMemo(() => {
    return (snapshot?.documents || []).filter((doc) => {
      const matchesStatus = status === 'todos' || doc.status === status;
      const haystack = `${doc.title} ${doc.path} ${doc.category} ${doc.areaId}`.toLowerCase();
      return matchesStatus && haystack.includes(query.toLowerCase());
    });
  }, [query, snapshot?.documents, status]);

  const ownerInitial = (areaId: string) => (areaId || 'P').slice(0, 1).toUpperCase();

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', path: '', category: 'Governança', areaId: 'pietro' });
    setOpen(true);
  };

  const openEdit = (id: string) => {
    const doc = snapshot?.documents.find((d) => d.id === id);
    if (!doc) return;
    setEditingId(id);
    setForm({ title: doc.title, path: doc.path, category: doc.category, areaId: doc.areaId });
    setOpen(true);
  };

  const submit = async () => {
    try {
      if (editingId) {
        await centralPadroesCrudService.updateDocument(editingId, { ...form });
        setToast({ message: 'Documento atualizado.', type: 'success' });
      } else {
        await centralPadroesCrudService.createDocument({ ...form, status: 'bruto', shouldBecome: 'apoio' });
        await centralPadroesStorageService.ingestDocument({ title: form.title, sourcePath: form.path, sourceKind: 'manual' }).catch(() => '');
        setToast({ message: 'Documento registrado e enviado para triagem.', type: 'success' });
      }
      await refetch();
      setOpen(false);
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  return (
    <CentralPageShell title="Biblioteca de Documentos" subtitle="Documentos canônicos, brutos, em revisão, legados, registros e externos com destino normativo sugerido.">
      {loading && <div className="cp-docs-inline-alert">Carregando documentos diretamente do Supabase...</div>}
      {error && <div className="cp-docs-inline-alert error">Falha ao carregar Supabase: {error}</div>}
      <section className="cp-docs-panel">
        <div className="cp-docs-toolbar">
          <label className="cp-docs-subtle-search">
            <span>⌕</span>
            <input placeholder="Pesquisar nesta página..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="cp-docs-filters">
            {statusOptions.map((item) => (
              <button key={item} type="button" onClick={() => setStatus(item)} className={`cp-docs-filter ${status === item ? 'active' : ''}`}>
                {item === 'todos' ? 'Todos' : statusLabel[item] || item}
              </button>
            ))}
          </div>
        </div>

        <section className="cp-docs-table">
          <div className="cp-docs-table-head"><span>Documentos</span><span>Status</span><span>Responsável</span><span>Destino</span><span>Ações</span></div>
          {documents.map((doc) => (
            <div key={doc.id} className="cp-docs-doc-row">
              <div className="cp-docs-doc-name"><span>📄</span><span>{doc.title}</span></div>
              <span><StatusBadge value={doc.status} /></span>
              <span className="cp-docs-person"><span className="cp-docs-owner-dot">{ownerInitial(doc.areaId)}</span>{doc.areaId}</span>
              <span>{doc.shouldBecome}</span>
              <span><button onClick={() => openEdit(doc.id)} className="rounded-lg bg-sagb-bg-2 px-2 py-1 text-[10px] font-black text-sagb-text">Editar</button></span>
            </div>
          ))}
          {!documents.length && (
            <div className="cp-docs-doc-row">
              <div className="cp-docs-doc-name"><span>∅</span><span>Nenhum documento encontrado</span></div>
              <span className="cp-docs-status revisao">Filtro</span>
              <span className="cp-docs-person"><span className="cp-docs-owner-dot">CP</span>Central</span>
              <span>—</span>
              <span>—</span>
            </div>
          )}
        </section>
      </section>

      <div className="cp-docs-new-line" onClick={openCreate}><span>+</span><span>Registrar novo documento nesta biblioteca</span></div>

      <button type="button" className="cp-docs-floating-add" onClick={openCreate}>+</button>
      <CrudModal title={editingId ? 'Editar Documento' : 'Registrar Documento'} open={open} onClose={() => setOpen(false)} footer={<button onClick={submit} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">{editingId ? 'Atualizar' : 'Salvar'}</button>}>
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
