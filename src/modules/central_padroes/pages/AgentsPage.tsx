import React from 'react';
import { AgentRunBoard } from '../components/AgentRunBoard';
import { CentralPageShell } from '../components/CentralPageShell';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { CentralTraceLog } from '../services/centralPadroesGovernanceService';
import { centralPadroesTraceLogsService } from '../services/centralPadroesTraceLogsService';

const initialTraceForm = {
  executionId: `trace-${new Date().toISOString().slice(0, 10)}`,
  taskTitle: '',
  executor: 'Central de Padrões',
  riskMax: 'R2',
  status: 'registro',
  command: '',
  files: '',
  errors: '',
  summary: ''
};

const AgentsPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  const [logs, setLogs] = React.useState<CentralTraceLog[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [riskMax, setRiskMax] = React.useState('todos');
  const [status, setStatus] = React.useState('todos');
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState(initialTraceForm);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadLogs = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLogs(await centralPadroesTraceLogsService.list({ query, riskMax, status }));
    } catch (err) {
      setError(String((err as Error)?.message || err));
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [query, riskMax, status]);

  React.useEffect(() => { void loadLogs(); }, [loadLogs]);

  const saveTrace = async () => {
    try {
      await centralPadroesTraceLogsService.create({
        executionId: form.executionId,
        taskTitle: form.taskTitle,
        executor: form.executor,
        riskMax: form.riskMax,
        status: form.status,
        summary: form.summary,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        commandsJson: form.command ? [{ command: form.command, result: 'registrado via UI' }] : [],
        filesChangedJson: form.files.split(',').map((file) => file.trim()).filter(Boolean),
        errorsJson: form.errors ? [{ error: form.errors }] : []
      });
      setToast({ message: 'LOZE-TRACE registrado.', type: 'success' });
      setOpen(false);
      setForm(initialTraceForm);
      await loadLogs();
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  return (
    <CentralPageShell
      title="Execuções LOZE-TRACE"
      subtitle="Execução rastreável de agentes, comandos, riscos, evidências e entregáveis operacionais."
      icon="⚙️"
      status="informacao"
      guidance="Use esta tela para acompanhar execuções técnicas. Toda execução relevante deve informar comando, pasta, risco R0-R6, resultado e erro. Se a execução alterar Supabase remoto, classifique como R5 antes de aplicar."
    >
      <SectionPanel title="Esteira dos agentes e execuções">
        <AgentRunBoard agents={snapshot?.agents || []} />
      </SectionPanel>

      {loading && <div className="cp-docs-inline-alert">Carregando LOZE-TRACE do Supabase...</div>}
      {error && <div className="cp-docs-inline-alert error">Supabase indisponível ou migration pendente: {error}</div>}

      <SectionPanel title="Registros LOZE-TRACE" description="Listagem dedicada de execuções técnicas com risco, status, executor e comandos.">
        <div className="cp-docs-toolbar">
          <label className="cp-docs-subtle-search"><span>🔎</span><input placeholder="Buscar por execução, tarefa, executor ou resumo..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <div className="cp-docs-filters">
            {['todos', 'registro', 'sucesso', 'falha', 'bloqueado'].map((item) => <button key={item} type="button" className={`cp-docs-filter ${status === item ? 'active' : ''}`} onClick={() => setStatus(item)}>{item}</button>)}
            {['todos', 'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map((item) => <button key={item} type="button" className={`cp-docs-filter ${riskMax === item ? 'active' : ''}`} onClick={() => setRiskMax(item)}>{item}</button>)}
          </div>
          <button type="button" className="cp-docs-top-link primary" onClick={() => setOpen(true)}>Registrar LOZE-TRACE</button>
        </div>
        <div className="cp-docs-table">
          <div className="cp-docs-table-head"><span>Execução</span><span>Status</span><span>Risco</span><span>Executor</span><span>Resumo</span></div>
          {logs.map((log) => (
            <div key={log.id} className="cp-docs-doc-row">
              <div className="cp-docs-doc-name"><span>⚙️</span><span>{log.executionId} · {log.taskTitle}</span></div>
              <span><StatusBadge value={log.status as any} /></span>
              <span className="cp-visual-badge attention">{log.riskMax}</span>
              <span>{log.executor || '—'}</span>
              <span>{log.summary || '—'}</span>
            </div>
          ))}
          {!loading && logs.length === 0 && <div className="cp-docs-doc-row"><div className="cp-docs-doc-name"><span>∅</span><span>Nenhum LOZE-TRACE encontrado. Registre o primeiro ou aplique a migration se o Supabase retornar erro.</span></div><span>—</span><span>—</span><span>—</span><span>—</span></div>}
        </div>
      </SectionPanel>

      <CrudModal title="Registrar LOZE-TRACE" open={open} onClose={() => setOpen(false)} footer={<button type="button" className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-bold text-white" onClick={saveTrace}>Salvar</button>}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField label="Execution ID" value={form.executionId} onChange={(value) => setForm((prev) => ({ ...prev, executionId: value }))} />
          <FormField label="Tarefa" value={form.taskTitle} onChange={(value) => setForm((prev) => ({ ...prev, taskTitle: value }))} />
          <FormField label="Executor" value={form.executor} onChange={(value) => setForm((prev) => ({ ...prev, executor: value }))} />
          <FormField label="Risco máximo" value={form.riskMax} onChange={(value) => setForm((prev) => ({ ...prev, riskMax: value }))} />
          <FormField label="Status" value={form.status} onChange={(value) => setForm((prev) => ({ ...prev, status: value }))} />
          <FormField label="Arquivos alterados" value={form.files} onChange={(value) => setForm((prev) => ({ ...prev, files: value }))} placeholder="arquivo1.ts, arquivo2.md" />
          <div className="md:col-span-2"><FormField label="Comando" value={form.command} onChange={(value) => setForm((prev) => ({ ...prev, command: value }))} textarea /></div>
          <div className="md:col-span-2"><FormField label="Erros" value={form.errors} onChange={(value) => setForm((prev) => ({ ...prev, errors: value }))} textarea /></div>
          <div className="md:col-span-2"><FormField label="Resumo" value={form.summary} onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))} textarea /></div>
        </div>
      </CrudModal>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default AgentsPage;
