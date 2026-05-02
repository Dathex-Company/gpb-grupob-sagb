import React from 'react';
import { FinalAuditEntity, RunLogEntity } from '../types/salaDev.domain';

interface AuditTrailPanelProps {
  logs: RunLogEntity[];
  finalAudit: FinalAuditEntity;
}

export const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ logs, finalAudit }) => {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 space-y-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Auditoria final (inicial)</p>
      <div className="text-[11px] text-slate-300 grid grid-cols-2 gap-2">
        <p>Status: <b>{finalAudit.status}</b></p>
        <p>Decisão: <b>{finalAudit.finalDecision}</b></p>
        <p>Riscos: {finalAudit.risksFound}</p>
        <p>Gates aprovados: {finalAudit.gatesApproved}</p>
        <p>Gates pendentes: {finalAudit.gatesPending}</p>
        <p>Artefatos oficiais: {finalAudit.officialArtifacts}</p>
      </div>
      <p className="text-[11px] text-slate-400">{finalAudit.finalNotes}</p>

      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Logs da run</p>
      <div className="max-h-44 overflow-y-auto pr-1 space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="border border-slate-700/40 rounded p-2 text-[11px] text-slate-300">
            <p className="font-bold text-white">{log.eventType} • {log.severity}</p>
            <p>{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

