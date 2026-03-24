import React, { useState } from 'react';
import { BackIcon, XIcon, FileTextIcon, ArrowRightIcon, MessageSquareIcon, AlertCircleIcon, CheckIcon, ClockIcon } from './Icon';
import { CommandCenterPanel } from './dev-room/CommandCenterPanel';
import { AgentsFlowPanel } from './dev-room/AgentsFlowPanel';
import { WorkspacePanel } from './dev-room/WorkspacePanel';
import { MOCK_RUN, MOCK_DEV_AGENTS, MOCK_FLOW_EVENTS, MOCK_FILE_TREE, AgentFlowEvent } from './dev-room/DevRoomTypes';

interface DevRoomViewProps {
  onBack?: () => void;
}

const DevRoomView: React.FC<DevRoomViewProps> = ({ onBack }) => {
  // Estado local para simular a V1
  const [run] = useState(MOCK_RUN);
  const [agents] = useState(MOCK_DEV_AGENTS);
  const [events] = useState(MOCK_FLOW_EVENTS);
  const [files] = useState(MOCK_FILE_TREE);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent = events.find(e => e.id === selectedEventId);

  const getAgent = (agentId?: string) => agents.find(a => a.id === agentId);

  return (
    <div className="flex flex-col h-full bg-[#0B1121] overflow-hidden text-white font-sans">
      
      {/* GLOBAL HEADER */}
      <header className="h-14 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between px-6 shrink-0 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <BackIcon className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <span className="text-[10px] font-black text-white">DV</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white leading-tight">Sala Dev <span className="text-cyan-500 ml-1">V1</span></h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 leading-tight">Workspace de Engenharia Cognitiva</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Orquestrador Online</span>
          </div>
        </div>
      </header>

      {/* COCKPIT GRID (3 PANELS) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* PANEL 1: COMMAND CENTER (Left) */}
        <div className="w-[380px] shrink-0 border-r border-slate-800 h-full">
          <CommandCenterPanel run={run} agents={agents} />
        </div>

        {/* PANEL 2: AGENTS FLOW (Middle) */}
        <div className="w-[420px] shrink-0 border-r border-slate-800 h-full">
          <AgentsFlowPanel 
            events={events} 
            agents={agents} 
            selectedEventId={selectedEventId || undefined} 
            onSelectEvent={setSelectedEventId}
          />
        </div>

        {/* PANEL 3: WORKSPACE & ARTIFACTS (Right - takes remaining space) */}
        <div className="flex-1 min-w-0 h-full">
          <WorkspacePanel files={files} agents={agents} />
        </div>

        {/* DETALLE LATERAL (DRAWER / OVERLAY) */}
        {selectedEvent && (
          <div 
            className="absolute inset-y-0 right-0 w-[500px] bg-[#0F172A] border-l border-slate-700 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-40 animate-slide-in-right flex flex-col"
          >
            {/* DETAIL HEADER */}
            <div className="p-6 border-b border-slate-800 bg-[#0B1121] flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-1">Detalhes do Evento</h3>
                <h2 className="text-lg font-black tracking-tight">{selectedEvent.summary}</h2>
              </div>
              <button 
                onClick={() => setSelectedEventId(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* DETAIL BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
              
              {/* AGENT INFO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">Agente Responsável</span>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
                      style={{ backgroundColor: getAgent(selectedEvent.agentId)?.avatarColor }}
                    >
                      {getAgent(selectedEvent.agentId)?.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{getAgent(selectedEvent.agentId)?.name}</p>
                      <p className="text-[10px] text-slate-400">{getAgent(selectedEvent.agentId)?.role}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">Status da Ação</span>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">{selectedEvent.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{selectedEvent.timestamp.toLocaleString()}</p>
                </div>
              </div>

              {/* MOTIVE */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Motivo da Decisão</span>
                </div>
                <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-700/30 border-l-2 border-l-cyan-500">
                  <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                    "{selectedEvent.motive || 'Executando protocolo padrão de desenvolvimento para esta fase do projeto.'}"
                  </p>
                </div>
              </div>

              {/* HANDOFF INFO */}
              {(selectedEvent.sourceAgentId || selectedEvent.nextAgentId) && (
                <div className="p-5 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 block">Fluxo de Orquestração</span>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <span className="text-[8px] font-bold text-slate-500 uppercase block mb-1">De</span>
                      {selectedEvent.sourceAgentId ? (
                        <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl">
                           <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-[8px] font-black" style={{ backgroundColor: getAgent(selectedEvent.sourceAgentId)?.avatarColor }}>
                            {getAgent(selectedEvent.sourceAgentId)?.name.substring(0, 1)}
                           </div>
                           <span className="text-[10px] font-bold">{getAgent(selectedEvent.sourceAgentId)?.name}</span>
                        </div>
                      ) : <span className="text-[10px] text-slate-600">Usuário</span>}
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-600" />
                    <div className="text-center">
                      <span className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Para</span>
                      {selectedEvent.nextAgentId ? (
                        <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl">
                           <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-[8px] font-black" style={{ backgroundColor: getAgent(selectedEvent.nextAgentId)?.avatarColor }}>
                            {getAgent(selectedEvent.nextAgentId)?.name.substring(0, 1)}
                           </div>
                           <span className="text-[10px] font-bold">{getAgent(selectedEvent.nextAgentId)?.name}</span>
                        </div>
                      ) : <span className="text-[10px] text-slate-600">Fim do Fluxo</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* INPUT / OUTPUT */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Entrada Recebida</span>
                  <div className="p-4 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-400 border border-slate-800">
                    {selectedEvent.input || '// Sem dados de entrada registrados'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Saída Gerada</span>
                    {selectedEvent.generatedArtifactId && (
                      <span className="text-[8px] font-black px-2 py-0.5 bg-cyan-500 text-[#0B1121] rounded">ARTEFATO PRODUZIDO</span>
                    )}
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl font-mono text-[11px] text-cyan-400 border border-slate-800 shadow-inner">
                    {selectedEvent.output || '// Aguardando finalização do processamento...'}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="pt-4 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors">
                  <MessageSquareIcon className="w-4 h-4" /> Perguntar ao Agente
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors">
                  <FileTextIcon className="w-4 h-4" /> Ver Logs Brutos
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

    </div>
  );
};

export default DevRoomView;
