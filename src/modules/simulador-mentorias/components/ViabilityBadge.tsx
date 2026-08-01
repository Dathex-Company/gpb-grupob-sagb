import React from 'react';

interface ViabilityBadgeProps {
  resultCents: number;
  marginPercent: number;
}

export const ViabilityBadge: React.FC<ViabilityBadgeProps> = ({ resultCents, marginPercent }) => {
  const viable = resultCents >= 0 && marginPercent >= 25;
  const attention = resultCents >= 0 && !viable;

  const label = viable ? 'Viável' : attention ? 'Atenção' : 'Inviável';
  const classes = viable
    ? 'bg-[#E6F8EC] text-[#008528]'
    : attention
      ? 'bg-[#FFF8D8] text-[#A87800]'
      : 'bg-[#FFE8E8] text-[#D90404]';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-2 text-[11px] font-medium ${classes}`}>
      {label}
    </span>
  );
};
