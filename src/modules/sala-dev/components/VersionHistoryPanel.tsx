import React from 'react';
import { ArtifactVersionEntity } from '../types/salaDev.domain';
import { getStatusView } from '../utils/salaDevStatusView';

interface VersionHistoryPanelProps {
  versions: ArtifactVersionEntity[];
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({ versions }) => {
  const orderedVersions = [...versions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-2 sticky top-0 bg-slate-900/90 py-1">Histórico de versões</p>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {orderedVersions.map((v) => {
          const statusView = getStatusView(v.status);
          return (
          <div key={v.id} className="text-[11px] text-slate-200 border border-slate-700/40 rounded p-2">
            <p className="font-bold text-white flex items-center gap-2">
              <span>{v.version}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${statusView.className}`}>{statusView.label}</span>
            </p>
            <p className="text-slate-300">{v.changeSummary}</p>
          </div>
        )})}
      </div>
    </div>
  );
};
