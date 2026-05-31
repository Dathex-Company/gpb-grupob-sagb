import React from 'react';
import { CentralAgentRun } from '../types';
import { StatusBadge } from './StatusBadge';

export const AgentRunBoard: React.FC<{ agents: CentralAgentRun[] }> = ({ agents }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
    {agents.map((agent) => (
      <article key={agent.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sagb-muted">{agent.agentCode} · {agent.block}</p>
            <h3 className="mt-1 text-sm font-black text-sagb-text">{agent.agentName}</h3>
          </div>
          <StatusBadge value={agent.status} />
        </div>
        <p className="mt-3 text-[12px] text-sagb-muted">{agent.deliverable}</p>
      </article>
    ))}
  </div>
);

