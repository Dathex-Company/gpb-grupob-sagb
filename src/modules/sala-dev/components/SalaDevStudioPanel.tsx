import React, { useEffect, useMemo, useState } from 'react';
import type { SalaDevStudioSession } from '../types/salaDev.studio';
import {
  appendStudioEvent,
  clearStudioSession,
  createStudioSession,
  loadStudioSession,
  saveStudioSession,
} from '../services/salaDevStudioSessionStorage';

interface SalaDevStudioPanelProps {
  runId: string;
  projectName: string;
  currentStage?: string;
}

const statusLabel: Record<SalaDevStudioSession['status'], string> = {
  draft: 'Rascunho',
  planning: 'Planejando',
  waiting_approval: 'Aguardando aprovação',
  approved: 'Aprovado',
  simulated: 'Simulado',
  completed: 'Concluído',
};

const riskClass = {
  low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  medium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  high: 'border-red-500/30 bg-red-500/10 text-red-300',
};

export const SalaDevStudioPanel: React.FC<SalaDevStudioPanelProps> = ({ runId, projectName, currentStage }) => {
  const initialSession = useMemo(() => (
    loadStudioSession(runId) || createStudioSession({ runId, projectName, objective: currentStage })
  ), [runId, projectName, currentStage]);

  const [session, setSession] = useState<SalaDevStudioSession>(initialSession);
  const [command, setCommand] = useState('Implementar próxima etapa do Studio com segurança e auditoria.');

  useEffect(() => {
    saveStudioSession(session);
  }, [session]);

  const updateSession = (next: SalaDevStudioSession) => setSession({ ...next, updatedAt: new Date().toISOString() });

  const handleGeneratePlan = () => {
    const next = appendStudioEvent(
      {
        ...session,
        status: 'waiting_approval',
        planSteps: session.planSteps.map((step, index) => ({
          ...step,
          status: index === 0 ? 'completed' : 'pending',
        })),
      },
      { type: 'plan', message: `Plano gerado a partir do comando: ${command}` },
    );
    updateSession(next);
  };

  const handleApprovePlan = () => {
    const next = appendStudioEvent(
      {
        ...session,
        status: 'approved',
        approvals: session.approvals.map((approval) => (
          approval.label.includes('plano')
            ? { ...approval, status: 'approved', decidedAt: new Date().toISOString() }
            : approval
        )),
        planSteps: session.planSteps.map((step) => ({ ...step, status: step.status === 'pending' ? 'approved' : step.status })),
      },
      { type: 'approval', message: 'Plano de execução aprovado no Studio.' },
    );
    updateSession(next);
  };

  const handleApplySimulatedDiff = () => {
    const next = appendStudioEvent(
      {
        ...session,
        status: 'simulated',
        diffs: session.diffs.map((diff) => ({ ...diff, status: 'applied_simulated' })),
        approvals: session.approvals.map((approval) => (
          approval.label.includes('diff')
            ? { ...approval, status: 'approved', decidedAt: new Date().toISOString() }
            : approval
        )),
      },
      { type: 'diff', message: 'Diff aplicado em modo simulado. Nenhum arquivo real foi alterado.' },
    );
    updateSession(next);
  };

  const handleRunBuildSimulation = () => {
    const next = appendStudioEvent(
      {
        ...session,
        status: 'completed',
        commandLogs: session.commandLogs.map((log) => ({
          ...log,
          status: 'success',
          output: [
            '> npm run build',
            '✓ Simulação de build concluída.',
            '✓ Próximo ciclo: backend seguro + sandbox para execução real.',
          ].join('\n'),
        })),
        planSteps: session.planSteps.map((step) => ({ ...step, status: 'completed' })),
      },
      { type: 'command', message: 'Build simulado concluído com sucesso.' },
    );
    updateSession(next);
  };

  const handleReset = () => {
    clearStudioSession(runId);
    setSession(createStudioSession({ runId, projectName, objective: currentStage }));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0B1121] text-white">
      <div className="border-b border-slate-800 bg-[#0F172A] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">Sala Dev Studio</p>
            <h2 className="mt-1 text-lg font-black text-white">IDE assistida dentro da Sala Dev</h2>
            <p className="mt-1 text-xs text-slate-400">
              Sessão vinculada a <span className="font-bold text-slate-200">{session.projectName}</span> · {statusLabel[session.status]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
              Mock seguro
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:border-red-700 hover:text-red-300"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[360px_minmax(0,1fr)_360px] overflow-hidden">
        <aside className="flex min-h-0 flex-col border-r border-slate-800 bg-[#0F172A]">
          <div className="border-b border-slate-800 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Comando da sessão</p>
            <textarea
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              className="mt-2 h-28 w-full resize-none rounded-xl border border-slate-700 bg-[#0B1121] p-3 text-xs text-slate-100 outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={handleGeneratePlan}
              className="mt-3 w-full rounded-xl bg-cyan-500 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-950 hover:bg-cyan-400"
            >
              Gerar plano no Studio
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Timeline</p>
            <div className="space-y-2">
              {session.events.map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400">{event.type}</span>
                    <span className="text-[9px] text-slate-600">
                      {new Date(event.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">{event.message}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-h-0 overflow-y-auto p-5">
          <section className="rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Plano de execução</p>
                <h3 className="text-sm font-black text-white">Etapas operacionais CA-01 → CA-18</h3>
              </div>
              <button
                type="button"
                onClick={handleApprovePlan}
                className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20"
              >
                Aprovar plano
              </button>
            </div>
            <div className="space-y-3">
              {session.planSteps.map((step, index) => (
                <div key={step.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Passo {index + 1} · {step.ownerAgent}</p>
                      <h4 className="mt-1 text-sm font-black text-white">{step.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.description}</p>
                    </div>
                    <span className="rounded-full border border-slate-700 px-2 py-1 text-[9px] font-black uppercase text-slate-400">{step.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-cyan-300">Arquivos impactados</p>
              <div className="space-y-2">
                {session.impactedFiles.map((file) => (
                  <div key={file.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <code className="truncate text-[11px] font-bold text-slate-200">{file.path}</code>
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${riskClass[file.risk]}`}>{file.risk}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{file.reason}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-slate-600">{file.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Diff simulado</p>
                <button
                  type="button"
                  onClick={handleApplySimulatedDiff}
                  className="rounded-lg border border-cyan-600/50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-cyan-300 hover:bg-cyan-500/10"
                >
                  Aplicar simulado
                </button>
              </div>
              {session.diffs.map((diff) => (
                <div key={diff.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <code className="truncate text-[11px] font-bold text-slate-200">{diff.filePath}</code>
                    <span className="text-[9px] font-black uppercase text-slate-500">{diff.status}</span>
                  </div>
                  <pre className="max-h-52 overflow-auto rounded-lg border border-slate-800 bg-[#020617] p-3 text-[11px] leading-relaxed text-red-300">- {diff.before}</pre>
                  <pre className="mt-2 max-h-52 overflow-auto rounded-lg border border-slate-800 bg-[#020617] p-3 text-[11px] leading-relaxed text-emerald-300">+ {diff.after}</pre>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="flex min-h-0 flex-col border-l border-slate-800 bg-[#0F172A]">
          <div className="border-b border-slate-800 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Aprovações</p>
            <div className="mt-3 space-y-2">
              {session.approvals.map((approval) => (
                <div key={approval.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-200">{approval.label}</p>
                    <span className="text-[9px] font-black uppercase text-slate-500">{approval.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-800 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Terminal seguro</p>
              <button
                type="button"
                onClick={handleRunBuildSimulation}
                className="rounded-lg border border-emerald-600/50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/10"
              >
                Simular build
              </button>
            </div>
            {session.commandLogs.map((log) => (
              <div key={log.id} className="rounded-xl border border-slate-800 bg-[#020617] p-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{log.command} · {log.status}</p>
                <pre className="mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-slate-300">{log.output}</pre>
              </div>
            ))}
          </div>

          <div className="min-h-0 flex-1 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Preview</p>
            <div className="mt-3 flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-4 text-center">
              <div>
                <p className="text-3xl">🧪</p>
                <p className="mt-2 text-xs font-bold text-slate-300">Preview placeholder</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">No próximo ciclo, este painel será conectado ao sandbox e ao processo real de preview.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

