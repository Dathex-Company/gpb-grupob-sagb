import React from 'react';

interface MonitoringTvModeToggleProps {
  active: boolean;
  onToggle: () => void;
}

export const MonitoringTvModeToggle: React.FC<MonitoringTvModeToggleProps> = ({ active, onToggle }) => (
  <button type="button" onClick={onToggle} className="lis-v4-control primary">
    {active ? 'Sair TV' : '⛶ Modo TV'}
  </button>
);
