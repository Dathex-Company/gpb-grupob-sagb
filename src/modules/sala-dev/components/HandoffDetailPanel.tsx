import React from 'react';
import { HandoffEntity } from '../types/salaDev.domain';

interface HandoffDetailPanelProps {
  handoff: HandoffEntity;
  onUpdateStatus: (id: string, status: HandoffEntity['status']) => void;
}

export const HandoffDetailPanel: React.FC<HandoffDetailPanelProps> = ({ handoff, onUpdateStatus }) => {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 space-y-3">
      <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black">Detalhe do handoff</p>
      <p className="text-xs text-white font-bold">{handoff.reason}</p>
      <p className="text-[11px] text-slate-300">Input: {handoff.inputSummary}</p>
      <p className="text-[11px] text-slate-300">Output esperado: {handoff.expectedOutput}</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onUpdateStatus(handoff.id, 'received')} className="text-[10px] font-bold py-2 rounded bg-slate-800 hover:bg-slate-700 text-white">Marcar recebido</button>
        <button onClick={() => onUpdateStatus(handoff.id, 'running')} className="text-[10px] font-bold py-2 rounded bg-cyan-700/50 hover:bg-cyan-700 text-white">Marcar em execução</button>
        <button onClick={() => onUpdateStatus(handoff.id, 'completed')} className="text-[10px] font-bold py-2 rounded bg-emerald-700/50 hover:bg-emerald-700 text-white">Marcar concluído</button>
        <button onClick={() => onUpdateStatus(handoff.id, 'blocked')} className="text-[10px] font-bold py-2 rounded bg-red-700/50 hover:bg-red-700 text-white">Marcar bloqueado</button>
      </div>
    </div>
  );
};

