import React from 'react';
import { ArtifactEntity, GateEntity, HandoffEntity, MacroLayerEntity, RunAgentEntity, RunRiskEntity } from '../types/salaDev.domain';
import { HandoffCard } from './HandoffCard';
import { GateCard } from './GateCard';
import { HandoffDetailPanel } from './HandoffDetailPanel';
import { GateDetailPanel } from './GateDetailPanel';
import { DomainDecision } from '../types/salaDev.status';

interface MacroLayerDetailProps {
  layer: MacroLayerEntity;
  runAgents: RunAgentEntity[];
  handoffs: HandoffEntity[];
  gates: GateEntity[];
  artifacts: ArtifactEntity[];
  risks: RunRiskEntity[];
  selectedHandoffId?: string;
  selectedGateId?: string;
  onSelectHandoff: (id: string) => void;
  onSelectGate: (id: string) => void;
  onUpdateHandoffStatus: (id: string, status: HandoffEntity['status']) => void;
  onUpdateGateStatus: (id: string, status: GateEntity['status'], decision?: DomainDecision) => void;
}

export const MacroLayerDetail: React.FC<MacroLayerDetailProps> = ({
  layer,
  runAgents,
  handoffs,
  gates,
  artifacts,
  risks,
  selectedHandoffId,
  selectedGateId,
  onSelectHandoff,
  onSelectGate,
  onUpdateHandoffStatus,
  onUpdateGateStatus
}) => {
  const layerAgents = runAgents.filter(a => a.layer.toLowerCase().includes(layer.name.toLowerCase().split(' ')[0]));
  const layerHandoffs = handoffs.filter(h => h.macroLayerId === layer.id);
  const layerGates = gates.filter(g => g.macroLayerId === layer.id);
  const layerArtifacts = artifacts.filter(a => a.macroLayerId === layer.id);
  const layerRisks = risks.filter(r => r.macroLayerId === layer.id);
  const selectedHandoff = layerHandoffs.find(h => h.id === selectedHandoffId);
  const selectedGate = layerGates.find(g => g.id === selectedGateId);

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-[#0B1121] p-4 space-y-4">
      <div>
        <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Modo detalhado</p>
        <h4 className="text-sm font-black text-white mt-1">{layer.name}</h4>
        <p className="text-xs text-slate-400 mt-1">{layer.description || 'Macrocamada operacional da esteira Dathex.'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div className="rounded-xl bg-slate-800/40 p-3 border border-slate-700/50">
          <p className="text-slate-500 uppercase text-[9px] font-black">Status</p>
          <p className="text-white font-bold mt-1">{layer.status}</p>
        </div>
        <div className="rounded-xl bg-slate-800/40 p-3 border border-slate-700/50">
          <p className="text-slate-500 uppercase text-[9px] font-black">Próxima ação</p>
          <p className="text-white font-bold mt-1">{layer.nextRecommendedAction || 'Aguardar evolução da run'}</p>
        </div>
      </div>

      <div className="space-y-2 text-[11px] text-slate-300">
        <p><span className="text-slate-500 uppercase text-[9px] font-black">Agentes</span>: {layerAgents.length}</p>
        <p><span className="text-slate-500 uppercase text-[9px] font-black">Handoffs</span>: {layerHandoffs.length}</p>
        <p><span className="text-slate-500 uppercase text-[9px] font-black">Gates</span>: {layerGates.length}</p>
        <p><span className="text-slate-500 uppercase text-[9px] font-black">Artefatos</span>: {layerArtifacts.length}</p>
        <p><span className="text-slate-500 uppercase text-[9px] font-black">Riscos</span>: {layerRisks.length}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black mb-2">Handoffs da macrocamada</p>
          <div className="space-y-2">
            {layerHandoffs.length === 0 && <p className="text-[11px] text-slate-500">Sem handoffs vinculados.</p>}
            {layerHandoffs.map(h => (
              <HandoffCard key={h.id} handoff={h} selected={selectedHandoffId === h.id} onSelect={onSelectHandoff} />
            ))}
          </div>
          {selectedHandoff && (
            <div className="mt-2">
              <HandoffDetailPanel handoff={selectedHandoff} onUpdateStatus={onUpdateHandoffStatus} />
            </div>
          )}
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black mb-2">Gates da macrocamada</p>
          <div className="space-y-2">
            {layerGates.length === 0 && <p className="text-[11px] text-slate-500">Sem gates vinculados.</p>}
            {layerGates.map(g => (
              <GateCard key={g.id} gate={g} selected={selectedGateId === g.id} onSelect={onSelectGate} />
            ))}
          </div>
          {selectedGate && (
            <div className="mt-2">
              <GateDetailPanel gate={selectedGate} onUpdate={onUpdateGateStatus} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
