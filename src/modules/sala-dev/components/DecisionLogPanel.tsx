import React from 'react';
import { RunDecisionEntity } from '../types/salaDev.domain';
import { getStatusView } from '../utils/salaDevStatusView';

interface DecisionLogPanelProps {
  decisions: RunDecisionEntity[];
}

export const DecisionLogPanel: React.FC<DecisionLogPanelProps> = ({ decisions }) => {
  const orderedDecisions = [...decisions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black mb-2 sticky top-0 bg-slate-900/90 py-1">Decisões da run</p>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {orderedDecisions.map((d) => {
          const decisionView = getStatusView(d.decision);
          const statusView = getStatusView(d.status);
          return (
          <div key={d.id} className="border border-slate-700/40 rounded p-2 text-[11px] text-slate-200">
            <p className="text-white font-bold">{d.title}</p>
            <p className="mt-1 flex items-center gap-2">
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${decisionView.className}`}>{decisionView.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${statusView.className}`}>{statusView.label}</span>
            </p>
            <p className="text-slate-300 mt-1">{d.reason}</p>
          </div>
        )})}
      </div>
    </div>
  );
};
