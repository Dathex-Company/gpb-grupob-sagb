import React from 'react';
import { CentralChecklist } from '../types';

export const ChecklistPanel: React.FC<{ checklists: CentralChecklist[] }> = ({ checklists }) => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    {checklists.map((checklist) => (
      <article key={checklist.id} className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sagb-muted">{checklist.context}</p>
        <h3 className="mt-1 text-sm font-black text-sagb-text">{checklist.title}</h3>
        <p className="mt-1 text-[11px] text-sagb-muted">Responsável: {checklist.owner}</p>
        <ul className="mt-3 space-y-2">
          {checklist.items.map((item) => (
            <li key={item} className="flex gap-2 text-[12px] text-sagb-text"><span className="mt-1 h-2 w-2 rounded-full bg-sagb-primary" />{item}</li>
          ))}
        </ul>
      </article>
    ))}
  </div>
);

