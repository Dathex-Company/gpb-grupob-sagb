import React from 'react';
import { VideoProviderConfig } from '../types';

interface ProviderBadgeProps {
  provider: VideoProviderConfig;
}

const ProviderBadge: React.FC<ProviderBadgeProps> = ({ provider }) => {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
      <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-100">{provider.name}</p>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 uppercase">{provider.status}</p>
      <ul className="text-[12px] text-slate-600 dark:text-slate-300 mt-2 list-disc ml-4">
        {provider.strengths.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderBadge;
