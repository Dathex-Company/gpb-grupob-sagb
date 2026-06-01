import React from 'react';
import { BlockEntity, GateEntity, RunAgentEntity } from '../types/salaDev.domain';
import { getStatusView } from '../utils/salaDevStatusView';

interface BlockFlowVisualProps {
  blocks: BlockEntity[];
  runAgents: RunAgentEntity[];
  gates: GateEntity[];
  selectedBlockId?: string | null;
  onSelectBlock?: (blockId: string) => void;
}

export const BlockFlowVisual: React.FC<BlockFlowVisualProps> = ({
  blocks,
  runAgents,
  gates,
  selectedBlockId,
  onSelectBlock
}) => {
  const sortedBlocks = [...blocks].sort((a, b) => a.block - b.block);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Esteira v3 · 5 blocos</p>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">18 agentes CA</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {sortedBlocks.map((block) => {
          const statusView = getStatusView(block.status);
          const gate = gates.find(item => item.macroLayerId === block.id);
          const gateView = getStatusView(block.gateStatus || gate?.status);
          const blockAgents = runAgents.filter(agent => agent.macroLayerId === block.id);
          const activeAgent = block.currentAgentId ? blockAgents.find(agent => agent.agentId === block.currentAgentId) : blockAgents.find(agent => agent.status === 'active');
          const isSelected = selectedBlockId === block.id;

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onSelectBlock?.(block.id)}
              className={`text-left rounded-2xl border p-3 transition-all ${
                isSelected ? 'bg-cyan-500/10 border-cyan-400/70 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-500/70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-cyan-300">B{block.block}</span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest ${statusView.className}`}>{statusView.label}</span>
                  </div>
                  <h3 className="mt-1 text-xs font-black text-white leading-tight">{block.name}</h3>
                  <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">{block.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-white leading-none">{block.progress}%</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">progresso</p>
                </div>
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full rounded-full bg-cyan-400" style={{ width: `${block.progress}%` }} />
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-[9px]">
                <span className="font-bold text-slate-400 uppercase tracking-wider">{blockAgents.length} agentes</span>
                <span className={`px-2 py-0.5 rounded-full border font-black uppercase tracking-widest ${gateView.className}`}>Gate: {gateView.label}</span>
              </div>
              {activeAgent && <p className="mt-2 text-[10px] text-slate-300">Ativo: <span className="font-bold text-white">{activeAgent.name}</span></p>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

