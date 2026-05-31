import React from 'react';
import { CentralStandard } from '../types';
import { StatusBadge } from './StatusBadge';

export const StandardTable: React.FC<{ standards: CentralStandard[]; onEdit?: (id: string) => void; onDelete?: (id: string) => void; onRequestApproval?: (id: string) => void }> = ({ standards, onEdit, onDelete, onRequestApproval }) => (
  <div className="overflow-hidden rounded-2xl border border-sagb-line">
    <table className="w-full text-left text-[12px]">
      <thead className="bg-sagb-bg-2 text-[10px] uppercase tracking-[0.14em] text-sagb-muted">
        <tr>
          <th className="px-4 py-3">Chave</th>
          <th className="px-4 py-3">Título</th>
          <th className="px-4 py-3">Tipo</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Risco</th>
          <th className="px-4 py-3">Owner</th>
          {(onEdit || onDelete || onRequestApproval) && <th className="px-4 py-3">Ações</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-sagb-line">
        {standards.map((standard) => (
          <tr key={standard.id} className="bg-sagb-panel hover:bg-sagb-bg-2/60">
            <td className="px-4 py-3 font-mono text-[11px] font-bold text-sagb-text">{standard.key}</td>
            <td className="px-4 py-3"><div className="font-bold text-sagb-text">{standard.title}</div><div className="mt-1 text-[11px] text-sagb-muted">{standard.summary}</div></td>
            <td className="px-4 py-3 text-sagb-muted">{standard.type.replace(/_/g, ' ')}</td>
            <td className="px-4 py-3"><StatusBadge value={standard.status} /></td>
            <td className="px-4 py-3"><StatusBadge value={standard.risk} /></td>
            <td className="px-4 py-3 text-sagb-muted">{standard.owner}</td>
            {(onEdit || onDelete || onRequestApproval) && (
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {onEdit && <button onClick={() => onEdit(standard.id)} className="rounded-lg bg-sagb-bg-2 px-2 py-1 text-[10px] font-black text-sagb-text">Editar</button>}
                  {onRequestApproval && <button onClick={() => onRequestApproval(standard.id)} className="rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-black text-blue-600">Aprovar</button>}
                  {onDelete && <button onClick={() => onDelete(standard.id)} className="rounded-lg bg-red-500/10 px-2 py-1 text-[10px] font-black text-red-600">Excluir</button>}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
