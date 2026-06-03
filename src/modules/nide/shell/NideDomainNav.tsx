import React, { useState } from 'react';
import { useDomainRegistry } from '../registry/useDomainRegistry';
import { NideDomain } from '../registry/domain.types';

interface NideDomainNavProps {
  /** Se true, esconde domínios planejados (mostra apenas ativos) */
  hidePlanned?: boolean;
  /** Callback ao selecionar um domínio */
  onSelectDomain?: (domain: NideDomain) => void;
  /** ID do domínio atualmente selecionado */
  selectedDomainId?: string;
}

/**
 * Navegação interna de domínios do NIDE.
 *
 * Exibe os domínios registrados, separando ativos de planejados.
 * Domínios planejados aparecem com indicador visual de "em breve".
 * Domínios core aparecem destacados.
 */
export const NideDomainNav: React.FC<NideDomainNavProps> = ({
  hidePlanned = false,
  onSelectDomain,
  selectedDomainId
}) => {
  const { activeDomains, plannedDomains } = useDomainRegistry();
  const [expanded, setExpanded] = useState(false);

  const renderDomainItem = (domain: NideDomain) => {
    const isCore = domain.manifest.isCore;
    const isPlanned = domain.manifest.isPlanned;
    const isSelected = selectedDomainId === domain.manifest.id;

    return (
      <button
        key={domain.manifest.id}
        type="button"
        onClick={() => onSelectDomain?.(domain)}
        disabled={isPlanned}
        className={`
          w-full text-left px-3 py-2 rounded-lg transition-all duration-150
          text-[11px] font-semibold
          ${isSelected
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30'
            : isPlanned
              ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }
          ${isCore && !isSelected && !isPlanned
            ? 'border-l-2 border-blue-400 dark:border-blue-500'
            : ''
          }
        `}
        title={isPlanned ? 'Domínio planejado — ainda não implementado' : domain.manifest.description}
      >
        <div className="flex items-center gap-2">
          {/* Indicador de status */}
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isPlanned
              ? 'bg-slate-300 dark:bg-slate-600'
              : isCore
                ? 'bg-blue-500'
                : 'bg-emerald-500'
          }`} />

          {/* Nome */}
          <span className="truncate flex-1">{domain.manifest.displayName}</span>

          {/* Badge planejado */}
          {isPlanned && (
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
              Previsto
            </span>
          )}

          {/* Badge core */}
          {isCore && !isPlanned && (
            <span className="text-[8px] font-black uppercase tracking-widest text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
              Core
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <nav className="space-y-3">
      {/* Domínios ativos */}
      {activeDomains.length > 0 && (
        <div>
          <p className="px-3 mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Ativos
          </p>
          <div className="space-y-0.5">
            {activeDomains.map(renderDomainItem)}
          </div>
        </div>
      )}

      {/* Domínios planejados (se não ocultos) */}
      {!hidePlanned && plannedDomains.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
          >
            <span>Planejados ({plannedDomains.length})</span>
            <span className={`transform transition-transform ${expanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          </button>
          {expanded && (
            <div className="space-y-0.5 mt-1">
              {plannedDomains.map(renderDomainItem)}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
