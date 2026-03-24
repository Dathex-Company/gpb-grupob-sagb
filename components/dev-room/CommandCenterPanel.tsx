import React from 'react';
import { DevAgent, DevRun } from './DevRoomTypes';
import { PlayIcon, PauseIcon, CheckIcon, SearchIcon, DownloadIcon } from '../Icon';

interface CommandCenterPanelProps {
  run: DevRun;
  agents: DevAgent[];
}

export const CommandCenterPanel: React.FC<CommandCenterPanelProps> = ({ run, agents }) => {
  const activeAgent = agents.find(a => a.id === run.activeAgentId);

  return (
    <div className="flex flex-col h-full bg-[#0F172A] border-r border-slate-800 text-white overflow-y-auto">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-800 bg-[#0B1121]">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-2">
          <span>Centro de Comando</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>
        <h2 className="text-xl font-black tracking-tight">{run.projectName}</h2>
        
        <div className="mt-4 flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${
            run.status === 'EXECUTING' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {run.status === 'EXECUTING' ? 'Em Execução' : run.status}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Etapa: <span className="text-white">{run.currentStage}</span>
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-8">
        
        {/* BRIEFING */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Resumo do Briefing</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            {run.briefingSummary}
          </p>
        </div>

        {/* PROGRESS */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Progresso Geral</h3>
            <span className="text-xl font-black text-cyan-400">{run.progressPercent}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
              style={{ width: `${run.progressPercent}%` }}
            />
          </div>
        </div>

        {/* ACTIVE AGENT */}
        {activeAgent && (
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Agente Ativo</h3>
            <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg"
                style={{ backgroundColor: activeAgent.avatarColor }}
              >
                {activeAgent.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm">{activeAgent.name}</p>
                <p className="text-xs text-slate-400">{activeAgent.role}</p>
              </div>
              <div className="ml-auto">
                 <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
              </div>
            </div>
          </div>
        )}

        {/* NEXT STEPS */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Próximos Passos</h3>
          <div className="space-y-2">
            {run.nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ACTIONS FOOTer */}
      <div className="mt-auto p-6 border-t border-slate-800 bg-[#0B1121] grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-colors col-span-2">
          <PlayIcon className="w-4 h-4" />
          {run.status === 'PAUSED' ? 'Retomar Run' : 'Iniciar Run'}
        </button>
        
        <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors border border-slate-700">
          <PauseIcon className="w-4 h-4" />
          Pausar
        </button>
        <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors border border-slate-700">
          <CheckIcon className="w-4 h-4" />
          Aprovar Etapa
        </button>
        
        <button className="flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors">
          <SearchIcon className="w-3.5 h-3.5" /> Revisão
        </button>
        <button className="flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors">
          <DownloadIcon className="w-3.5 h-3.5" /> Exportar
        </button>
      </div>

    </div>
  );
};
