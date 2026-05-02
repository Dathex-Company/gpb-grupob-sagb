import React, { useState } from 'react';
import { FileTextIcon } from '../../../../components/Icon';
import { DevAgent, DevFileNode } from '../types/salaDev.types';
import { ArtifactEntity, ArtifactVersionEntity, FinalAuditEntity, GateChecklistEntity, MacroLayerEntity, RunDecisionEntity, RunLogEntity } from '../types/salaDev.domain';
import { ArtifactCard } from './ArtifactCard';
import { ArtifactPreviewPanel } from './ArtifactPreviewPanel';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import { DecisionLogPanel } from './DecisionLogPanel';
import { ChecklistPanel } from './ChecklistPanel';
import { AuditTrailPanel } from './AuditTrailPanel';

interface WorkspacePanelProps {
  files: DevFileNode[];
  agents: DevAgent[];
  macroLayers: MacroLayerEntity[];
  artifacts: ArtifactEntity[];
  artifactVersions: ArtifactVersionEntity[];
  gateChecklists: GateChecklistEntity[];
  finalAudit: FinalAuditEntity;
  logs: RunLogEntity[];
  decisions: RunDecisionEntity[];
}

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({ agents, macroLayers, artifacts, artifactVersions, gateChecklists, finalAudit, logs, decisions }) => {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(artifacts[0]?.id || null);

  const findFile = (nodes: DevFileNode[], id: string): DevFileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFile(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedArtifact = selectedArtifactId ? artifacts.find((a) => a.id === selectedArtifactId) : null;
  const artifactAuthor = selectedArtifact?.agentId ? agents.find(a => a.id === selectedArtifact.agentId) : null;
  const artifactMacroLayer = selectedArtifact?.macroLayerId ? macroLayers.find(m => m.id === selectedArtifact.macroLayerId) : null;
  const selectedVersions = selectedArtifact ? artifactVersions.filter(v => v.artifactId === selectedArtifact.id) : [];
  const selectedChecklist = selectedArtifact?.gateId ? gateChecklists.find(c => c.gateId === selectedArtifact.gateId) : undefined;

  const _ignoreFiles = findFile as (nodes: DevFileNode[], id: string) => DevFileNode | null;

  return (
    <div className="flex h-full bg-[#0F172A] text-white overflow-hidden">
      <div className="w-72 border-r border-slate-800 flex flex-col bg-[#0B1121]">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Artefatos e Auditoria</h3>
          <p className="text-[9px] mt-2 text-slate-500 font-bold uppercase tracking-wider">
            {artifacts.length} artefatos • {artifactVersions.length} versões • {logs.length} logs
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {artifacts.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              selected={selectedArtifactId === artifact.id}
              onSelect={setSelectedArtifactId}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedArtifact ? (
          <>
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0B1121] shrink-0">
              <div className="flex items-center gap-3"><FileTextIcon className="w-4 h-4 text-cyan-400" /><span className="font-medium text-sm text-slate-200">{selectedArtifact.title}</span></div>
              <div className="flex items-center gap-4">
                {artifactAuthor && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{artifactAuthor.name}</span>}
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-[#0F172A] p-6 space-y-4">
              <ArtifactPreviewPanel artifact={selectedArtifact} agentName={artifactAuthor?.name} macroLayerName={artifactMacroLayer?.name} />
              <VersionHistoryPanel versions={selectedVersions} />
              <DecisionLogPanel decisions={decisions.filter(d => !selectedArtifact.gateId || d.gateId === selectedArtifact.gateId)} />
              <ChecklistPanel checklist={selectedChecklist} />
              <AuditTrailPanel logs={logs} finalAudit={finalAudit} />
            </div>
            <div className="h-8 border-t border-slate-800 bg-[#0B1121] flex items-center px-4 shrink-0"><span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status: {selectedArtifact.status} • versão atual {selectedArtifact.version}</span></div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500"><FileTextIcon className="w-16 h-16 mb-4 opacity-20" /><p className="text-sm font-medium">Selecione um artefato para visualizar auditoria</p></div>
        )}
      </div>
    </div>
  );
};
