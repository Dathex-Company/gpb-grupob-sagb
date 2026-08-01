import React from 'react';
import { SimulationAlert } from '../types/simulador-mentorias.types';

interface AlertPanelProps {
  alerts: SimulationAlert[];
}

const severityClass: Record<SimulationAlert['severity'], string> = {
  info: 'bg-[#E9E9FF] text-[#0C0CA4]',
  warning: 'bg-[#FFF8D8] text-[#A87800]',
  critical: 'bg-[#FFE8E8] text-[#D90404]'
};

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => (
  <article className="rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.055)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[15px] font-medium text-[#202833]">Alertas de viabilidade</h3>
        <p className="mt-1 text-[12px] font-light text-[#66717D]">Regras críticas do documento técnico aplicadas ao cenário ativo.</p>
      </div>
      <span className="rounded-full bg-[#F0F2F5] px-3 py-2 text-[11px] text-[#66717D]">{alerts.length} alertas</span>
    </div>

    <div className="mt-4 grid gap-2">
      {alerts.length === 0 && (
        <div className="rounded-[16px] bg-[#E6F8EC] p-4 text-[13px] text-[#008528]">Nenhum alerta crítico no cenário ativo.</div>
      )}
      {alerts.map((alert) => (
        <div key={alert.id} className="rounded-[16px] bg-[#F0F2F5] p-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${severityClass[alert.severity]}`}>{alert.severity}</span>
            <strong className="text-[13px] font-medium text-[#202833]">{alert.title}</strong>
          </div>
          <p className="mt-1 text-[12px] font-light text-[#66717D]">{alert.description}</p>
        </div>
      ))}
    </div>
  </article>
);
