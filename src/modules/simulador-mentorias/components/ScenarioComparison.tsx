import React from 'react';
import { ScenarioInput, ScenarioResult } from '../types/simulador-mentorias.types';
import { formatCurrency, formatPercent } from '../services/calculationEngine';
import { ViabilityBadge } from './ViabilityBadge';

interface ScenarioComparisonProps {
  scenarios: ScenarioInput[];
  results: ScenarioResult[];
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ scenarios, results, activeScenarioId, onSelectScenario }) => (
  <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
    {scenarios.map((scenario) => {
      const result = results.find((item) => item.scenarioId === scenario.id);
      const active = scenario.id === activeScenarioId;

      return (
        <button
          key={scenario.id}
          type="button"
          onClick={() => onSelectScenario(scenario.id)}
          className={`text-left rounded-[22px] p-4 transition-all ${
            active
              ? 'bg-gradient-to-br from-[#9C00A8] to-[#B82BC5] text-white shadow-[0_18px_42px_rgba(156,0,168,0.18)]'
              : 'bg-white text-[#202833] shadow-[0_10px_28px_rgba(15,23,42,0.055)] hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className={`text-[12px] font-medium ${active ? 'text-white/80' : 'text-[#66717D]'}`}>Cenário</div>
              <div className="mt-1 text-lg font-medium tracking-[-0.03em]">{scenario.name}</div>
            </div>
            {result && !active && <ViabilityBadge resultCents={result.operationalResultWithUpsellCents} marginPercent={result.marginPercent} />}
          </div>

          {result && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className={`rounded-[16px] p-3 ${active ? 'bg-white/14' : 'bg-[#F0F2F5]'}`}>
                <div className={`text-[11px] ${active ? 'text-white/70' : 'text-[#66717D]'}`}>Resultado</div>
                <div className="mt-1 text-[15px] font-medium">{formatCurrency(result.operationalResultWithUpsellCents)}</div>
              </div>
              <div className={`rounded-[16px] p-3 ${active ? 'bg-white/14' : 'bg-[#F0F2F5]'}`}>
                <div className={`text-[11px] ${active ? 'text-white/70' : 'text-[#66717D]'}`}>Margem</div>
                <div className="mt-1 text-[15px] font-medium">{formatPercent(result.marginPercent)}</div>
              </div>
              <div className={`rounded-[16px] p-3 ${active ? 'bg-white/14' : 'bg-[#F0F2F5]'}`}>
                <div className={`text-[11px] ${active ? 'text-white/70' : 'text-[#66717D]'}`}>Break-even</div>
                <div className="mt-1 text-[15px] font-medium">{result.breakEvenPaidParticipants} pagantes</div>
              </div>
              <div className={`rounded-[16px] p-3 ${active ? 'bg-white/14' : 'bg-[#F0F2F5]'}`}>
                <div className={`text-[11px] ${active ? 'text-white/70' : 'text-[#66717D]'}`}>ROI</div>
                <div className="mt-1 text-[15px] font-medium">{formatPercent(result.roiPercent)}</div>
              </div>
            </div>
          )}
        </button>
      );
    })}
  </div>
);
