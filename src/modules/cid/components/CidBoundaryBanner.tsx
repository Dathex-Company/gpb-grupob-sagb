import React from 'react';
import { cidBoundaryNotice } from '../cid-contract';

interface CidBoundaryBannerProps {
  compact?: boolean;
}

const CidBoundaryBanner: React.FC<CidBoundaryBannerProps> = ({ compact = false }) => {
  return (
    <div className={`rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-800 ${compact ? 'px-3 py-2' : 'px-5 py-4'}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">🧭</span>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-black text-indigo-500">Fronteira do CID</p>
          <p className="text-xs font-semibold mt-0.5">{cidBoundaryNotice}</p>
        </div>
      </div>
    </div>
  );
};

export default CidBoundaryBanner;

