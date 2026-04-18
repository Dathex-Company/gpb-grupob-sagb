import React from 'react';
import { PremiumBadge, BadgeStatus } from './Premium';

interface ModuleHeaderProps {
  moduleName: string;
  ownerName: string;
  moduleDocPath?: string;
  className?: string;
  rightAction?: React.ReactNode;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  moduleName,
  ownerName,
  moduleDocPath,
  className = '',
  rightAction,
}) => {
  const handleOpenDoc = () => {
    if (moduleDocPath) {
      // Implementação futura: abrir documentação do módulo
      console.log('Abrir documentação do módulo:', moduleDocPath);
      // Por enquanto, apenas log
    }
  };

  return (
    <header className={`mb-8 border-b border-slate-800 pb-6 relative shrink-0 ${className}`}>
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none -z-10"></div>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black text-white tracking-tight">{moduleName}</h1>
            <PremiumBadge status="Homologado" />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Responsável:</span>
              <span className="text-slate-200 font-medium">{ownerName}</span>
            </div>
            {moduleDocPath && (
              <button
                onClick={handleOpenDoc}
                className="text-blue-400 hover:text-blue-300 text-xs font-medium px-2 py-1 rounded border border-blue-800/50 bg-blue-900/20 hover:bg-blue-900/40 transition-colors"
              >
                📘 Documentação
              </button>
            )}
          </div>
        </div>
        {rightAction && (
          <div className="ml-4">{rightAction}</div>
        )}
      </div>
    </header>
  );
};