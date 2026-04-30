import React from 'react';

type CrmKpiCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export const CrmKpiCard: React.FC<CrmKpiCardProps> = ({ label, value, helper }) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-sagb-border bg-white dark:bg-sagb-card p-4">
      <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">{label}</p>
      <p className="text-2xl font-black text-gray-900 dark:text-sagb-text mt-1">{value}</p>
      {helper ? <p className="text-xs text-gray-500 mt-1">{helper}</p> : null}
    </div>
  );
};

export default CrmKpiCard;

