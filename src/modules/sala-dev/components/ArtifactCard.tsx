import React from 'react';
import { ArtifactEntity } from '../types/salaDev.domain';

interface ArtifactCardProps {
  artifact: ArtifactEntity;
  selected?: boolean;
  onSelect: (artifactId: string) => void;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(artifact.id)}
      className={`w-full text-left rounded-xl border p-3 transition-colors ${selected ? 'border-cyan-500/60 bg-slate-800/70' : 'border-slate-700/50 bg-slate-900/40 hover:bg-slate-800/50'}`}
    >
      <p className="text-xs font-bold text-white truncate">{artifact.title}</p>
      <p className="text-[10px] text-slate-400 mt-1">{artifact.type} • {artifact.version}</p>
      <p className="text-[10px] text-slate-400">status: {artifact.status}</p>
    </button>
  );
};

