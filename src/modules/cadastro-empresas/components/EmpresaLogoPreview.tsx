import React from 'react';
import { resolveEmpresaLogoUrl } from '../services';

interface EmpresaLogoPreviewProps {
  logoUrl?: string | null;
  alt: string;
  className?: string;
  emptyLabel?: string;
}

const EmpresaLogoPreview: React.FC<EmpresaLogoPreviewProps> = ({
  logoUrl,
  alt,
  className,
  emptyLabel = '--'
}) => {
  const resolved = resolveEmpresaLogoUrl(logoUrl);

  return (
    <div className={className || 'w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 overflow-hidden shadow-sm'}>
      {resolved ? (
        <img src={resolved} alt={alt} className="w-full h-full object-contain" />
      ) : (
        <div className="text-[9px] font-black text-gray-400">{emptyLabel}</div>
      )}
    </div>
  );
};

export default EmpresaLogoPreview;
