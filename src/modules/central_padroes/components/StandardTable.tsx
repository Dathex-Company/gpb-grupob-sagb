import React from 'react';
import { CentralStandard } from '../types';
import { StatusBadge } from './StatusBadge';

export const StandardTable: React.FC<{ standards: CentralStandard[] }> = ({ standards }) => (
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
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

