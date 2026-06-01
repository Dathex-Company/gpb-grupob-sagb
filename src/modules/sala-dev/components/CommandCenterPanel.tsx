import React from 'react';
import { PlayIcon, PauseIcon, CheckIcon, SearchIcon, DownloadIcon } from '../../../../components/Icon';
import { DevAgent, DevRun } from '../types/salaDev.types';
import { SalaDevDomainSnapshot } from '../types/salaDev.types';
import { getStatusView } from '../utils/salaDevStatusView';
import { TechnicalExecutionPackage } from '../types/salaDev.technicalExport';
import { salaDevTechnicalBridgeService } from '../services/salaDevTechnicalBridgeService';

interface CommandCenterPanelProps {
  run: DevRun;
  agents: DevAgent[];
  domain: SalaDevDomainSnapshot;
  onGenerateTechnicalPackage?: () => void;
  lastTechnicalPackage?: TechnicalExecutionPackage | null;
}

export const CommandCenterPanel: React.FC<CommandCenterPanelProps> = ({ run, agents, domain, onGenerateTechnicalPackage, lastTechnicalPackage }) => {
  const activeAgent = agents.find(a => a.id === run.activeAgentId);
  const pendingGate = domain.gates.find(g => g.status === 'pending' || g.status === 'review' || g.status === 'running');
  const activeBlock = domain.blocks.find(b => b.id === domain.run.currentMacroLayerId) || domain.blocks.find(b => b.status === 'running');
  const activeMacroLayer = activeBlock || domain.macroLayers.find(m => m.id === domain.run.currentMacroLayerId);
  const macroLayerStatusView = getStatusView(activeMacroLayer?.status);
  const gateStatusView = getStatusView(activeBlock?.gateStatus || pendingGate?.status);
  const riskLevelView = getStatusView(domain.run.riskLevel);
  const bridgeStatusLabel = salaDevTechnicalBridgeService.resolveStatusLabel(domain.technicalBridge.status);

  return (
    <div className="flex flex-col h-full bg-[#0F172A] border-r border-slate-800 text-white overflow-y-auto">
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

      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Resumo do Briefing</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            {run.briefingSummary}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Bloco atual</p>
            <p className="text-xs font-bold text-white mt-1">{activeMacroLayer?.name || 'N/A'}</p>
            {activeMacroLayer && (
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${macroLayerStatusView.className}`}>{macroLayerStatusView.label}</span>
                <p className="text-[10px] text-slate-300">{activeMacroLayer.progress}%</p>
              </div>
            )}
          </div>
          <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Risco geral</p>
            <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded font-bold ${riskLevelView.className}`}>{riskLevelView.label}</span>
          </div>
          <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 col-span-2">
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Decisão pendente</p>
            <p className="text-xs font-bold text-white mt-1">{pendingGate ? `${pendingGate.name} (${pendingGate.status})` : 'Sem gate pendente'}</p>
          </div>
          {activeBlock && (
            <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 col-span-2">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Gate do bloco</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${gateStatusView.className}`}>{gateStatusView.label}</span>
                <span className="text-[10px] text-slate-300">{activeBlock.agentsCount} agentes · {activeBlock.artifactsCount} artefatos</span>
              </div>
            </div>
          )}
          <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 col-span-2">
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Execução técnica futura</p>
            <p className="text-xs font-bold text-white mt-1">VS Code / Roo Code (preparação arquitetural)</p>
            <p className="text-[10px] text-slate-300 mt-2">Ponte técnica: <span className="text-white font-semibold">{bridgeStatusLabel}</span></p>
            <p className="text-[10px] text-slate-300">Status conexão: <span className="text-amber-300 font-semibold">não conectada</span></p>
            <p className="text-[10px] text-slate-300">Execução remota: <span className="text-amber-300 font-semibold">desabilitada</span></p>
            <p className="text-[10px] text-slate-300">Aprovação humana: <span className="text-cyan-300 font-semibold">obrigatória</span></p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Progresso Geral</h3>
            <span className="text-xl font-black text-cyan-400">{run.progressPercent}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000" style={{ width: `${run.progressPercent}%` }} />
          </div>
        </div>

        {activeAgent && (
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Agente Ativo</h3>
            <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg" style={{ backgroundColor: activeAgent.avatarColor }}>
                {activeAgent.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm">{activeAgent.name}</p>
                <p className="text-xs text-slate-400">{activeAgent.role}</p>
              </div>
            </div>
          </div>
        )}

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

      <div className="mt-auto p-6 border-t border-slate-800 bg-[#0B1121] grid grid-cols-2 gap-3">
        <div className="col-span-2 rounded-lg border border-amber-900/60 bg-amber-950/30 px-3 py-2 text-[10px] text-amber-100">
          Modo simulado: ações de run, gate e aprovação ainda não persistem em Supabase.
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-colors col-span-2">
          <PlayIcon className="w-4 h-4" />
          {run.status === 'PAUSED' ? 'Retomar Run' : 'Iniciar Run'}
        </button>
        <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors border border-slate-700"><PauseIcon className="w-4 h-4" />Pausar</button>
        <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors border border-slate-700"><CheckIcon className="w-4 h-4" />Aprovar Etapa</button>
        <button className="flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors"><SearchIcon className="w-3.5 h-3.5" /> Revisão</button>
        <button
          onClick={onGenerateTechnicalPackage}
          className="flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800 text-slate-500 hover:text-slate-300 font-bold text-xs py-2 px-3 rounded-xl transition-colors border border-slate-800"
          title="Ação avançada: exporta pacote técnico auditável"
        >
          <DownloadIcon className="w-3.5 h-3.5" /> Exportar pacote técnico (avançado)
        </button>
        {lastTechnicalPackage && (
          <div className="col-span-2 rounded-lg border border-cyan-900/60 bg-cyan-950/30 px-3 py-2 text-[10px] text-cyan-100">
            Pacote técnico gerado: <span className="font-semibold">{lastTechnicalPackage.packageId}</span> · checksum <span className="font-semibold">{lastTechnicalPackage.packageChecksum}</span>
          </div>
        )}
      </div>
    </div>
  );
};
