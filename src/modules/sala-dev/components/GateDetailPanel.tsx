import React from 'react';
import { GateEntity } from '../types/salaDev.domain';
import { DomainDecision } from '../types/salaDev.status';

interface GateDetailPanelProps {
  gate: GateEntity;
  onUpdate: (id: string, status: GateEntity['status'], decision?: DomainDecision) => void;
}

export const GateDetailPanel: React.FC<GateDetailPanelProps> = ({ gate, onUpdate }) => {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 space-y-3">
      <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black">Detalhe do gate</p>
      <p className="text-xs text-white font-bold">{gate.name}</p>
      <p className="text-[11px] text-slate-300">Checklist: {gate.checklist.join(' • ')}</p>
      <p className="text-[11px] text-slate-300">Observações: {gate.observations || 'Sem observações'}</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onUpdate(gate.id, 'approved', 'approved')} className="text-[10px] font-bold py-2 rounded bg-emerald-700/50 hover:bg-emerald-700 text-white">Aprovar</button>
        <button onClick={() => onUpdate(gate.id, 'rejected', 'rejected')} className="text-[10px] font-bold py-2 rounded bg-red-700/50 hover:bg-red-700 text-white">Rejeitar</button>
        <button onClick={() => onUpdate(gate.id, 'review', 'needs_review')} className="text-[10px] font-bold py-2 rounded bg-amber-700/50 hover:bg-amber-700 text-white">Solicitar revisão</button>
        <button onClick={() => onUpdate(gate.id, 'blocked', 'deferred')} className="text-[10px] font-bold py-2 rounded bg-slate-700 hover:bg-slate-600 text-white">Marcar bloqueado</button>
      </div>
    </div>
  );
};
