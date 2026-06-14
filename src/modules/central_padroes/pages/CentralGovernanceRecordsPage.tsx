import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import {
  CentralGovernanceRecord,
  CentralGovernanceTable,
  centralPadroesGovernanceService
} from '../services/centralPadroesGovernanceService';

type Props = { table: CentralGovernanceTable; title: string; subtitle: string; icon: string; recordType: string; defaultCategory: string; guidance: string };

const initialForm = (recordType: string, category: string) => ({ title: '', type: recordType, category, status: 'registro', riskLevel: 'R2', pathAbsolute: '', pathRelative: '', summary: '', content: '', owner: 'Central de Padrões', tags: '' });

export const CentralGovernanceRecordsPage: React.FC<Props> = ({ table, title, subtitle, icon, recordType, defaultCategory, guidance }) => {
  const [records, setRecords] = React.useState<CentralGovernanceRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('todos');
  const [riskLevel, setRiskLevel] = React.useState('todos');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CentralGovernanceRecord | null>(null);
  const [form, setForm] = React.useState(initialForm(recordType, defaultCategory));
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRecords(await centralPadroesGovernanceService.listRecords(table, { query, status, riskLevel, type: 'todos' }));
    } catch (err) {
      setError(String((err as Error)?.message || err));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [query, riskLevel, status, table]);

  React.useEffect(() => { void load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(initialForm(recordType, defaultCategory)); setOpen(true); };
  const openEdit = (record: CentralGovernanceRecord) => { setEditing(record); setForm({ title: record.title, type: record.type, category: record.category, status: record.status, riskLevel: record.riskLevel, pathAbsolute: record.pathAbsolute || '', pathRelative: record.pathRelative || '', summary: record.summary || '', content: record.content || '', owner: record.owner || '', tags: record.tags.join(', ') }); setOpen(true); };

  const save = async () => {
    try {
      const input = { ...form, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) };
      if (editing) await centralPadroesGovernanceService.updateRecord(table, editing.id, input);
      else await centralPadroesGovernanceService.createRecord(table, input);
      setToast({ message: editing ? 'Registro atualizado.' : 'Registro criado.', type: 'success' });
      setOpen(false);
      await load();
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  const copyPath = async (value: string | null) => {
    if (!value) {
      setToast({ message: 'Este registro ainda não possui caminho cadastrado.', type: 'error' });
      return;
    }
    await navigator.clipboard?.writeText(value).catch(() => undefined);
    setToast({ message: 'Caminho copiado.', type: 'success' });
  };

  return (
    <CentralPageShell title={title} subtitle={subtitle} icon={icon} status="informacao" guidance={guidance}>
      {loading && <div className="cp-docs-inline-alert">Carregando dados do Supabase...</div>}
      {error && <div className="cp-docs-inline-alert error">Supabase indisponível ou migration pendente: {error}</div>}
      <SectionPanel title="CRUD dedicado" description="Listar, buscar, criar, editar metadados, status, risco, owner e caminhos.">
        <div className="cp-docs-toolbar"><label className="cp-docs-subtle-search"><span>🔎</span><input placeholder="Buscar por título, resumo, owner ou caminho..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="cp-docs-filters">{['todos', 'registro', 'aberta', 'triagem', 'aprovado', 'bloqueado'].map((item) => <button key={item} type="button" className={`cp-docs-filter ${status === item ? 'active' : ''}`} onClick={() => setStatus(item)}>{item}</button>)}{['todos', 'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map((item) => <button key={item} type="button" className={`cp-docs-filter ${riskLevel === item ? 'active' : ''}`} onClick={() => setRiskLevel(item)}>{item}</button>)}</div><button type="button" className="cp-docs-top-link primary" onClick={openCreate}>Criar registro</button></div>
        <div className="cp-docs-table"><div className="cp-docs-table-head"><span>Título</span><span>Status</span><span>Risco</span><span>Owner</span><span>Caminho</span></div>{records.map((record) => <div key={record.id} className="cp-docs-doc-row"><button type="button" className="cp-docs-doc-name text-left" onClick={() => openEdit(record)}><span>{icon}</span><span>{record.title}</span></button><span><StatusBadge value={record.status as any} /></span><span className="cp-visual-badge attention">{record.riskLevel}</span><span>{record.owner || '—'}</span><button type="button" className="cp-docs-mini-btn" onClick={() => copyPath(record.pathAbsolute || record.pathRelative)}>{record.pathRelative || 'Copiar caminho'}</button></div>)}{!loading && records.length === 0 && <div className="cp-docs-doc-row"><div className="cp-docs-doc-name"><span>∅</span><span>Nenhum registro encontrado. Crie o primeiro ou aplique a migration se o Supabase retornar erro.</span></div><span>—</span><span>—</span><span>—</span><span>—</span></div>}</div>
      </SectionPanel>
      <CrudModal title={editing ? 'Editar registro' : 'Novo registro'} open={open} onClose={() => setOpen(false)} footer={<button type="button" className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-bold text-white" onClick={save}>Salvar</button>}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2"><FormField label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} /><FormField label="Tipo" value={form.type} onChange={(value) => setForm((prev) => ({ ...prev, type: value }))} /><FormField label="Categoria" value={form.category} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} /><FormField label="Status" value={form.status} onChange={(value) => setForm((prev) => ({ ...prev, status: value }))} /><FormField label="Risco" value={form.riskLevel} onChange={(value) => setForm((prev) => ({ ...prev, riskLevel: value }))} /><FormField label="Owner" value={form.owner} onChange={(value) => setForm((prev) => ({ ...prev, owner: value }))} /><FormField label="Caminho absoluto" value={form.pathAbsolute} onChange={(value) => setForm((prev) => ({ ...prev, pathAbsolute: value }))} /><FormField label="Caminho relativo" value={form.pathRelative} onChange={(value) => setForm((prev) => ({ ...prev, pathRelative: value }))} /><FormField label="Tags" value={form.tags} onChange={(value) => setForm((prev) => ({ ...prev, tags: value }))} placeholder="governanca, supabase" /><div className="md:col-span-2"><FormField label="Resumo" value={form.summary} onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))} textarea /></div><div className="md:col-span-2"><FormField label="Conteúdo" value={form.content} onChange={(value) => setForm((prev) => ({ ...prev, content: value }))} textarea /></div></div>
      </CrudModal>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default CentralGovernanceRecordsPage;
