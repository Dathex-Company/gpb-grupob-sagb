import React from 'react';
import { GateEntity } from '../types/salaDev.domain';

interface GateCardProps {
  gate: GateEntity;
  selected?: boolean;
  onSelect: (id: string) => void;
}

export const GateCard: React.FC<GateCardProps> = ({ gate, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(gate.id)}
      className={`w-full text-left rounded-xl border p-3 transition ${selected ? 'border-amber-500/50 bg-slate-800/80' : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'}`}
    >
      <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black">Gate</p>
      <p className="text-xs font-bold text-white mt-1">{gate.name}</p>
      <div className="mt-2 text-[10px] text-slate-400 grid grid-cols-2 gap-2">
        <span>Status: {gate.status}</span>
        <span>Risco: {gate.riskLevel}</span>
        <span>Responsável: {gate.responsibleAgentId || 'N/A'}</span>
        <span>Decisão: {gate.decision || 'pendente'}</span>
      </div>
    </button>
  );
};

