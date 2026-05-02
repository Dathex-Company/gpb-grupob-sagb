import React from 'react';
import { ArtifactEntity } from '../types/salaDev.domain';

interface ArtifactPreviewPanelProps {
  artifact: ArtifactEntity;
  agentName?: string;
  macroLayerName?: string;
}

export const ArtifactPreviewPanel: React.FC<ArtifactPreviewPanelProps> = ({ artifact, agentName, macroLayerName }) => {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 space-y-2">
      <h4 className="text-sm font-bold text-white">{artifact.title}</h4>
      <p className="text-[11px] text-slate-400">{artifact.type} • {artifact.version} • {artifact.status}</p>
      <p className="text-[11px] text-slate-300">Agente: {agentName || 'N/A'} • Macrocamada: {macroLayerName || 'N/A'}</p>
      <p className="text-xs text-slate-300">{artifact.contentPreview || 'Sem preview disponível.'}</p>
      {artifact.filePath && <p className="text-[10px] text-cyan-300">Path: {artifact.filePath}</p>}
    </div>
  );
};

