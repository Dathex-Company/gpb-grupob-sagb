import React from 'react';
import { GateChecklistEntity } from '../types/salaDev.domain';

interface ChecklistPanelProps {
  checklist?: GateChecklistEntity;
}

export const ChecklistPanel: React.FC<ChecklistPanelProps> = ({ checklist }) => {
  if (!checklist) {
    return (
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 text-[11px] text-slate-500">
        Sem checklist associado ao artefato selecionado.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-black mb-2">{checklist.title}</p>
      <p className="text-[11px] text-slate-300 mb-2">Conclusão: {checklist.completionRate}% • {checklist.status}</p>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {checklist.items.map((item) => (
          <div key={item.id} className="border border-slate-700/40 rounded p-2 text-[11px] text-slate-300">
            <p className="font-bold text-white">{item.label}</p>
            <p>{item.status} • {item.required ? 'obrigatório' : 'opcional'}</p>
            {item.observation && <p className="text-slate-400">{item.observation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

