import React from 'react';
import { PlanActualVariance as Variance } from '../types/simulador-mentorias.types';
import { formatCurrency, formatPercent } from '../services/calculationEngine';

interface PlanActualVarianceProps {
  rows: Variance[];
}

export const PlanActualVariance: React.FC<PlanActualVarianceProps> = ({ rows }) => (
  <article className="rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.055)]">
    <div className="mb-4">
      <h3 className="text-[15px] font-medium text-[#202833]">Planejado versus realizado</h3>
      <p className="mt-1 text-[12px] font-light text-[#66717D]">Comparação inicial do cenário aprovado com os dados realizados.</p>
    </div>

    <div className="overflow-x-auto">
      <div className="min-w-[720px] grid gap-2">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] px-3 text-[11px] text-[#66717D]">
          <div>Item</div>
          <div>Planejado</div>
          <div>Realizado</div>
          <div>Variação</div>
          <div>%</div>
        </div>
        {rows.map((row) => {
          const planned = row.plannedCents !== undefined ? formatCurrency(row.plannedCents) : String(row.plannedNumber || 0);
          const actual = row.actualCents !== undefined ? formatCurrency(row.actualCents) : String(row.actualNumber || 0);
          const absolute = row.plannedCents !== undefined ? formatCurrency(row.absolute) : String(row.absolute);

          return (
            <div key={row.label} className="grid min-h-[48px] grid-cols-[1.4fr_1fr_1fr_1fr_1fr] items-center rounded-[15px] bg-[#F0F2F5] px-3 text-[12px] text-[#66717D]">
              <div className="font-medium text-[#202833]">{row.label}</div>
              <div>{planned}</div>
              <div>{actual}</div>
              <div className={row.absolute < 0 ? 'text-[#D90404]' : 'text-[#008528]'}>{absolute}</div>
              <div className={row.percent < 0 ? 'text-[#D90404]' : 'text-[#008528]'}>{formatPercent(row.percent)}</div>
            </div>
          );
        })}
      </div>
    </div>
  </article>
);
