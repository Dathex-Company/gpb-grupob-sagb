import React from 'react';
import { MacroLayerEntity } from '../types/salaDev.domain';

interface MacroLayerCardProps {
  layer: MacroLayerEntity;
  isActive: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const statusTone: Record<MacroLayerEntity['status'], string> = {
  pending: 'text-slate-400 border-slate-700 bg-slate-900/40',
  running: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
  blocked: 'text-red-300 border-red-500/40 bg-red-500/10',
  review: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
  approved: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  completed: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10'
};

export const MacroLayerCard: React.FC<MacroLayerCardProps> = ({ layer, isActive, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(layer.id)}
      className={`w-full text-left rounded-2xl border p-4 transition ${
        isSelected ? 'ring-1 ring-cyan-400/40 border-cyan-500/40 bg-slate-800/80' : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">#{layer.order}</p>
          <h3 className="text-sm font-black text-white tracking-tight">{layer.name}</h3>
        </div>
        {isActive && <span className="text-[8px] px-2 py-0.5 rounded bg-cyan-400 text-[#0B1121] font-black uppercase">Ativa</span>}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className={`text-[9px] uppercase tracking-wider font-black px-2 py-1 rounded border ${statusTone[layer.status]}`}>{layer.status}</span>
        <span className="text-xs font-black text-cyan-300">{layer.progress}%</span>
      </div>

      <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${layer.progress}%` }} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-bold">
        <span>Agentes: {layer.agentsCount}</span>
        <span>Handoffs: {layer.handoffsCount}</span>
        <span>Gates: {layer.gatesCount}</span>
        <span>Artefatos: {layer.artifactsCount}</span>
      </div>

      <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-500 font-black">Risco: {layer.riskLevel}</p>
    </button>
  );
};

