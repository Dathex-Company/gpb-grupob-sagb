import React from 'react';
import { XIcon, ArrowRightIcon, AlertCircleIcon, MessageSquareIcon, FileTextIcon } from '../../../../components/Icon';
import { AgentFlowEvent, DevAgent } from '../types/salaDev.types';

interface EventDetailDrawerProps {
  event: AgentFlowEvent;
  agents: DevAgent[];
  onClose: () => void;
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({ event, agents, onClose }) => {
  const getAgent = (agentId?: string) => agents.find(a => a.id === agentId);

  return (
    <div className="absolute inset-y-0 right-0 w-[500px] bg-[#0F172A] border-l border-slate-700 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-40 flex flex-col">
      <div className="p-6 border-b border-slate-800 bg-[#0B1121] flex items-center justify-between">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-1">Detalhes do Evento</h3>
          <h2 className="text-lg font-black tracking-tight text-white">{event.summary}</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center">
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">Agente Responsável</span>
            <p className="text-sm font-bold text-white">{getAgent(event.agentId)?.name}</p>
          </div>
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">Status da Ação</span>
            <p className="text-xs font-black uppercase tracking-widest text-white">{event.status}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2"><AlertCircleIcon className="w-3 h-3 text-cyan-400" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Motivo da Decisão</span></div>
          <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-700/30 border-l-2 border-l-cyan-500"><p className="text-sm text-slate-300 leading-relaxed italic font-medium">"{event.motive || 'Executando protocolo padrão.'}"</p></div>
        </div>

        {(event.sourceAgentId || event.nextAgentId) && (
          <div className="p-5 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 block">Fluxo de Orquestração</span>
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>{getAgent(event.sourceAgentId)?.name || 'Usuário'}</span>
              <ArrowRightIcon className="w-4 h-4 text-slate-600" />
              <span>{getAgent(event.nextAgentId)?.name || 'Fim do Fluxo'}</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Entrada Recebida</span><div className="p-4 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-400 border border-slate-800">{event.input || '// Sem dados de entrada registrados'}</div></div>
          <div className="space-y-2"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Saída Gerada</span><div className="p-4 bg-slate-950 rounded-xl font-mono text-[11px] text-cyan-400 border border-slate-800">{event.output || '// Aguardando finalização...'}</div></div>
        </div>

        <div className="pt-4 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors text-white"><MessageSquareIcon className="w-4 h-4" /> Perguntar ao Agente</button>
          <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors text-white"><FileTextIcon className="w-4 h-4" /> Ver Logs Brutos</button>
        </div>
      </div>
    </div>
  );
};

