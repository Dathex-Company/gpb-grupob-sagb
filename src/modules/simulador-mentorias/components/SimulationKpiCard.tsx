import React from 'react';

interface SimulationKpiCardProps {
  label: string;
  value: string;
  foot?: string;
  icon?: string;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
}

const toneClass: Record<NonNullable<SimulationKpiCardProps['tone']>, string> = {
  brand: 'bg-[#F8E4FA] text-[#9C00A8]',
  success: 'bg-[#E6F8EC] text-[#008528]',
  warning: 'bg-[#FFF8D8] text-[#A87800]',
  danger: 'bg-[#FFE8E8] text-[#D90404]',
  info: 'bg-[#E9E9FF] text-[#0C0CA4]'
};

export const SimulationKpiCard: React.FC<SimulationKpiCardProps> = ({
  label,
  value,
  foot,
  icon = '●',
  tone = 'brand'
}) => (
  <article className="min-h-[126px] rounded-[22px] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.055)] flex flex-col justify-between">
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] uppercase tracking-[0.05em] text-[#66717D] font-normal">{label}</span>
      <span className={`grid h-9 w-9 place-items-center rounded-[13px] text-[13px] font-medium ${toneClass[tone]}`}>{icon}</span>
    </div>
    <div>
      <div className="mt-3 text-[28px] font-medium tracking-[-0.04em] text-[#202833]">{value}</div>
      {foot && <div className="mt-1 text-[12px] text-[#66717D] font-light">{foot}</div>}
    </div>
  </article>
);
