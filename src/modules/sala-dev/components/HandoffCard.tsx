import React from 'react';
import { HandoffEntity } from '../types/salaDev.domain';

interface HandoffCardProps {
  handoff: HandoffEntity;
  selected?: boolean;
  onSelect: (id: string) => void;
}

export const HandoffCard: React.FC<HandoffCardProps> = ({ handoff, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(handoff.id)}
      className={`w-full text-left rounded-xl border p-3 transition ${selected ? 'border-cyan-500/50 bg-slate-800/80' : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'}`}
    >
      <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black">Handoff</p>
      <p className="text-xs font-bold text-white mt-1">{handoff.reason}</p>
      <div className="mt-2 text-[10px] text-slate-400 grid grid-cols-2 gap-2">
        <span>Status: {handoff.status}</span>
        <span>Risco: {handoff.riskLevel}</span>
        <span>Origem: {handoff.sourceAgentId || 'N/A'}</span>
        <span>Destino: {handoff.targetAgentId || 'N/A'}</span>
      </div>
    </button>
  );
};

