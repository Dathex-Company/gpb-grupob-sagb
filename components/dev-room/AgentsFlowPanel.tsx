import React from 'react';
import { AgentFlowEvent, DevAgent, EventStatus } from './DevRoomTypes';
import { CheckIcon, XIcon, FileTextIcon, MessageSquareIcon, ArrowRightIcon, SearchIcon as LucideSearchIcon, AlertCircleIcon, ClockIcon } from '../Icon';

interface AgentsFlowPanelProps {
  events: AgentFlowEvent[];
  agents: DevAgent[];
  selectedEventId?: string;
  onSelectEvent?: (eventId: string) => void;
}

export const AgentsFlowPanel: React.FC<AgentsFlowPanelProps> = ({ events, agents, selectedEventId, onSelectEvent }) => {

  const getAgent = (agentId: string) => agents.find(a => a.id === agentId);

  const renderIcon = (type: string) => {
    switch(type) {
      case 'PLAN': return <FileTextIcon className="w-4 h-4" />;
      case 'CODE': return <FileTextIcon className="w-4 h-4" />;
      case 'REVIEW': return <SearchIcon className="w-4 h-4" />;
      case 'APPROVE': return <CheckIcon className="w-4 h-4" />;
      case 'ERROR': return <XIcon className="w-4 h-4" />;
      case 'HANDOFF': return <ArrowRightIcon className="w-4 h-4" />;
      case 'MESSAGE':
      default: return <MessageSquareIcon className="w-4 h-4" />;
    }
  };
  
  const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );

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
      case 'PENDING':
      default:
        return { color: 'bg-slate-500', text: 'Aguardando', icon: <ClockIcon className="w-3 h-3" /> };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1121] border-r border-slate-800 text-white overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fluxo dos Agentes</h2>
          <p className="text-sm font-medium text-slate-300 mt-1">Timeline de execução ao vivo</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Orquestração Ativa</span>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {events.map((event, index) => {
          const agent = getAgent(event.agentId);
          const sourceAgent = event.sourceAgentId ? getAgent(event.sourceAgentId) : null;
          const nextAgent = event.nextAgentId ? getAgent(event.nextAgentId) : null;
          const isLast = index === events.length - 1;
          const statusCfg = getStatusConfig(event.status);
          const isSelected = selectedEventId === event.id;
          
          return (
            <div key={event.id} className="relative pl-10 group">
              {/* TIMELINE LINE */}
              {!isLast && (
                <div className="absolute top-10 bottom-[-32px] left-[17px] w-0.5 bg-gradient-to-b from-slate-800 to-transparent" />
              )}
              
              {/* TIMELINE DOT */}
              <div 
                className={`absolute top-1 left-0 w-9 h-9 rounded-xl flex items-center justify-center border border-slate-700/50 z-10 transition-all duration-300 ${
                  isSelected ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] border-cyan-400' : 'bg-slate-900 group-hover:border-slate-500'
                }`}
              >
                <div className={isSelected ? 'text-[#0B1121]' : 'text-slate-400 group-hover:text-white'}>
                  {renderIcon(event.actionType)}
                </div>
              </div>

              {/* EVENT CARD */}
              <div 
                className={`cursor-pointer transition-all duration-300 rounded-[22px] border p-5 ${
                  isSelected 
                    ? 'bg-slate-800/80 border-cyan-500/50 shadow-xl ring-1 ring-cyan-500/20' 
                    : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600'
                }`}
                onClick={() => onSelectEvent?.(event.id)}
              >
                {/* CARD HEADER */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {sourceAgent && (
                        <div 
                          className="w-7 h-7 rounded-lg border-2 border-slate-800 flex items-center justify-center text-[8px] font-black text-white shadow-sm opacity-60"
                          style={{ backgroundColor: sourceAgent.avatarColor }}
                          title={`Origem: ${sourceAgent.name}`}
                        >
                          {sourceAgent.name.substring(0, 1).toUpperCase()}
                        </div>
                      )}
                      {agent && (
                        <div 
                          className="w-8 h-8 rounded-lg border-2 border-slate-800 flex items-center justify-center text-[10px] font-black text-white shadow-md z-10"
                          style={{ backgroundColor: agent.avatarColor }}
                          title={`Ativo: ${agent.name}`}
                        >
                          {agent.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white tracking-tight">{event.summary}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{agent?.name}</span>
                        <span className="text-slate-700 font-bold">•</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{event.actionType}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${statusCfg.color.split(' ')[0]} bg-opacity-10 border-opacity-20`}>
                    <span className={statusCfg.color.split(' ')[0].replace('bg-', 'text-')}>
                      {statusCfg.icon}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${statusCfg.color.split(' ')[0].replace('bg-', 'text-')}`}>
                      {statusCfg.text}
                    </span>
                  </div>
                </div>
                
                {/* CARD BODY (PREVIEW) */}
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic">
                    "{event.motive || 'Executando tarefa delegada pelo orquestrador...'}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      {event.generatedArtifactId && (
                        <div className="flex items-center gap-1.5">
                          <FileTextIcon className="w-3 h-3 text-cyan-500" />
                          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-wider">Artefato gerado</span>
                        </div>
                      )}
                    </div>

                    {nextAgent && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-slate-900/50 rounded-lg border border-slate-700/30">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Handoff para</span>
                        <div 
                          className="w-4 h-4 rounded text-[7px] font-black text-white flex items-center justify-center"
                          style={{ backgroundColor: nextAgent.avatarColor }}
                        >
                          {nextAgent.name.substring(0, 1)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* SELECTION INDICATOR */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
                    <div className="flex items-center gap-2 text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span className="text-[9px] font-black uppercase tracking-widest">Ver detalhes</span>
                      <ArrowRightIcon className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
