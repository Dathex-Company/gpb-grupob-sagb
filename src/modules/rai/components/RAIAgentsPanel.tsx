import React from 'react';
import { RAIAgent } from '../types';

interface RAIAgentsPanelProps {
  agents: RAIAgent[];
  onRunNow?: (agentId: string) => void;
  runningAgentId?: string | null;
}

const RAIAgentsPanel: React.FC<RAIAgentsPanelProps> = ({ agents, onRunNow, runningAgentId }) => {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Agentes Temáticos</h3>
        <button className="text-[10px] font-black text-blue-500 uppercase hover:underline">Configurar Agentes</button>
      </div>
      
      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="group p-4 rounded-2xl border border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{agent.name}</h4>
              </div>
              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-400 rounded">
                {agent.frequency}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{agent.objective}</p>
            <div className="flex items-center justify-between">
               <span className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">
                 Tema: {agent.theme}
               </span>
               <div className="flex items-center gap-2">
                 <button
                   onClick={() => onRunNow?.(agent.id)}
                   className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-emerald-600 transition-opacity"
                 >
                   {runningAgentId === agent.id ? 'Executando...' : 'Rodar agora'}
                 </button>
                 <button className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-blue-500 transition-opacity">
                    Ver Logs
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RAIAgentsPanel;
