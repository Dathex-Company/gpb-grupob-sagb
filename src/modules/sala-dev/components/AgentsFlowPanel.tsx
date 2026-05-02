import React from 'react';
import { CheckIcon, XIcon, FileTextIcon, MessageSquareIcon, ArrowRightIcon, AlertCircleIcon, ClockIcon } from '../../../../components/Icon';
import { AgentFlowEvent, DevAgent, EventStatus } from '../types/salaDev.types';
import { AgentCatalogEntity, ArtifactEntity, GateEntity, HandoffEntity, MacroLayerEntity, RecommendedAgentEntity, RunAgentEntity, RunRiskEntity } from '../types/salaDev.domain';
import { MacroLayerCard } from './MacroLayerCard';
import { MacroLayerDetail } from './MacroLayerDetail';
import { DomainDecision } from '../types/salaDev.status';
import { AgentGroupPanel } from './AgentGroupPanel';
import { getStatusView } from '../utils/salaDevStatusView';

interface AgentsFlowPanelProps {
  events: AgentFlowEvent[];
  agents: DevAgent[];
  macroLayers: MacroLayerEntity[];
  handoffs: HandoffEntity[];
  gates: GateEntity[];
  runAgents: RunAgentEntity[];
  availableAgents: AgentCatalogEntity[];
  recommendedAgents: RecommendedAgentEntity[];
  artifacts: ArtifactEntity[];
  risks: RunRiskEntity[];
  selectedMacroLayerId?: string;
  onSelectMacroLayer?: (layerId: string) => void;
  selectedHandoffId?: string;
  selectedGateId?: string;
  onSelectHandoff?: (handoffId: string) => void;
  onSelectGate?: (gateId: string) => void;
  onUpdateHandoffStatus?: (id: string, status: HandoffEntity['status']) => void;
  onUpdateGateStatus?: (id: string, status: GateEntity['status'], decision?: DomainDecision) => void;
  onSummonAgent?: (agentId: string) => void;
  onSetRunAgentStatus?: (agentId: string, status: RunAgentEntity['status']) => void;
  onDeactivateRunAgent?: (agentId: string) => void;
  selectedEventId?: string;
  onSelectEvent?: (eventId: string) => void;
}

export const AgentsFlowPanel: React.FC<AgentsFlowPanelProps> = ({
  events,
  agents,
  macroLayers,
  handoffs,
  gates,
  runAgents,
  availableAgents,
  recommendedAgents,
  artifacts,
  risks,
  selectedMacroLayerId,
  onSelectMacroLayer,
  selectedHandoffId,
  selectedGateId,
  onSelectHandoff,
  onSelectGate,
  onUpdateHandoffStatus,
  onUpdateGateStatus,
  onSummonAgent,
  onSetRunAgentStatus,
  onDeactivateRunAgent,
  selectedEventId,
  onSelectEvent
}) => {
  const getAgent = (agentId: string) => agents.find(a => a.id === agentId);

  const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );

  const renderIcon = (type: string) => {
    switch(type) {
      case 'PLAN': return <FileTextIcon className="w-4 h-4" />;
      case 'CODE': return <FileTextIcon className="w-4 h-4" />;
      case 'REVIEW': return <SearchIcon className="w-4 h-4" />;
      case 'APPROVE': return <CheckIcon className="w-4 h-4" />;
      case 'ERROR': return <XIcon className="w-4 h-4" />;
      case 'HANDOFF': return <ArrowRightIcon className="w-4 h-4" />;
      default: return <MessageSquareIcon className="w-4 h-4" />;
    }
  };

  const getStatusConfig = (status: EventStatus) => {
    switch(status) {
      case 'COMPLETED':
      case 'APPROVED':
        return { color: 'bg-emerald-500', text: 'Concluído', icon: <CheckIcon className="w-3 h-3" /> };
      case 'RUNNING':
        return { color: 'bg-cyan-500 animate-pulse', text: 'Processando', icon: <ClockIcon className="w-3 h-3" /> };
      case 'BLOCKED':
        return { color: 'bg-red-500', text: 'Bloqueado', icon: <XIcon className="w-3 h-3" /> };
      case 'REVIEW':
        return { color: 'bg-amber-500', text: 'Em Revisão', icon: <AlertCircleIcon className="w-3 h-3" /> };
      case 'FAILED':
        return { color: 'bg-red-600', text: 'Falhou', icon: <XIcon className="w-3 h-3" /> };
      default:
        return { color: 'bg-slate-500', text: 'Aguardando', icon: <ClockIcon className="w-3 h-3" /> };
    }
  };

  const macroLayerNameById = macroLayers.reduce<Record<string, string>>((acc, layer) => {
    acc[layer.id] = layer.name;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full bg-[#0B1121] border-r border-slate-800 text-white overflow-hidden">
      <div className="p-6 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Esteira e Fluxo</h2>
          <p className="text-sm font-medium text-slate-300 mt-1">Timeline de execução ao vivo</p>
        </div>
        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-right">
          <div>{macroLayers.length} macrocamadas</div>
          <div>{handoffs.length} handoffs • {gates.length} gates</div>
          <div>{runAgents.filter(a => a.status === 'active').length} agentes ativos</div>
        </div>
      </div>

      <div className="p-4 border-b border-slate-800 bg-[#0B1121] space-y-3">
        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black sticky top-0 bg-[#0B1121] py-1 z-10">Modo compacto · macrocamadas</p>
        <div className="grid grid-cols-1 gap-2 max-h-[270px] overflow-y-auto pr-1">
          {macroLayers
            .sort((a, b) => a.order - b.order)
            .map((layer) => (
              <MacroLayerCard
                key={layer.id}
                layer={layer}
                isActive={layer.id === macroLayers.find(m => m.status === 'running')?.id}
                isSelected={selectedMacroLayerId === layer.id}
                onSelect={(id) => onSelectMacroLayer?.(id)}
              />
            ))}
        </div>

        {selectedMacroLayerId && (
          <MacroLayerDetail
            layer={macroLayers.find(m => m.id === selectedMacroLayerId)!}
            runAgents={runAgents}
            handoffs={handoffs}
            gates={gates}
            artifacts={artifacts}
            risks={risks}
            selectedHandoffId={selectedHandoffId}
            selectedGateId={selectedGateId}
            onSelectHandoff={(id) => onSelectHandoff?.(id)}
            onSelectGate={(id) => onSelectGate?.(id)}
            onUpdateHandoffStatus={(id, status) => onUpdateHandoffStatus?.(id, status)}
            onUpdateGateStatus={(id, status, decision) => onUpdateGateStatus?.(id, status, decision)}
          />
        )}

        <AgentGroupPanel
          runAgents={runAgents}
          availableAgents={availableAgents}
          recommendedAgents={recommendedAgents}
          macroLayerNameById={macroLayerNameById}
          currentMacroLayerId={selectedMacroLayerId || undefined}
          onSummonAgent={(id) => onSummonAgent?.(id)}
          onSetRunAgentStatus={(id, status) => onSetRunAgentStatus?.(id, status)}
          onDeactivateRunAgent={(id) => onDeactivateRunAgent?.(id)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {events.map((event, index) => {
          const agent = getAgent(event.agentId);
          const sourceAgent = event.sourceAgentId ? getAgent(event.sourceAgentId) : null;
          const nextAgent = event.nextAgentId ? getAgent(event.nextAgentId) : null;
          const isLast = index === events.length - 1;
          const statusCfg = getStatusConfig(event.status);
          const statusView = getStatusView(event.status.toLowerCase());
          const isSelected = selectedEventId === event.id;

          return (
            <div key={event.id} className="relative pl-10 group">
              {!isLast && (<div className="absolute top-10 bottom-[-32px] left-[17px] w-0.5 bg-gradient-to-b from-slate-800 to-transparent" />)}
              <div className={`absolute top-1 left-0 w-9 h-9 rounded-xl flex items-center justify-center border border-slate-700/50 z-10 ${isSelected ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-900'}`}>
                <div className={isSelected ? 'text-[#0B1121]' : 'text-slate-400'}>{renderIcon(event.actionType)}</div>
              </div>

              <div className={`cursor-pointer rounded-[22px] border p-5 ${isSelected ? 'bg-slate-800/80 border-cyan-500/50' : 'bg-slate-800/30 border-slate-700/50'}`} onClick={() => onSelectEvent?.(event.id)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {sourceAgent && <div className="w-7 h-7 rounded-lg border-2 border-slate-800 flex items-center justify-center text-[8px] font-black text-white opacity-60" style={{ backgroundColor: sourceAgent.avatarColor }}>{sourceAgent.name.substring(0, 1).toUpperCase()}</div>}
                      {agent && <div className="w-8 h-8 rounded-lg border-2 border-slate-800 flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: agent.avatarColor }}>{agent.name.substring(0, 2).toUpperCase()}</div>}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white tracking-tight">{event.summary}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{agent?.name}</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{event.actionType}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${statusView.className}`}>
                    {statusCfg.icon}
                    <span className="text-[8px] font-black uppercase tracking-widest">{statusView.label}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic">"{event.motive || 'Executando tarefa delegada pelo orquestrador...'}"</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {nextAgent && <span className="text-[8px] font-black text-slate-500 uppercase">Handoff para {nextAgent.name}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
