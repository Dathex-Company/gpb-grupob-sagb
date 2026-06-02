import React from 'react';
import { MonitoringPanelCount, MonitoringPreset } from '../types';
import { MonitoringPresetSelector } from './MonitoringPresetSelector';
import { MonitoringTvModeToggle } from './MonitoringTvModeToggle';

interface MonitoringDashboardControlsProps {
  presets: MonitoringPreset[];
  activePresetId: string;
  panelOptions: MonitoringPanelCount[];
  panelCount: MonitoringPanelCount;
  isTvMode: boolean;
  visualTheme: 'dark' | 'light';
  onSelectPreset: (presetId: string) => void;
  onSetPanelCount: (count: MonitoringPanelCount) => void;
  onToggleTvMode: () => void;
  onToggleTheme: () => void;
}

export const MonitoringDashboardControls: React.FC<MonitoringDashboardControlsProps> = ({ presets, activePresetId, panelOptions, panelCount, isTvMode, visualTheme, onSelectPreset, onSetPanelCount, onToggleTvMode, onToggleTheme }) => (
  <div className="lis-v4-controls">
    <button type="button" onClick={onToggleTheme} className="lis-v4-control">
      {visualTheme === 'dark' ? '☼ Modo claro' : '☾ Modo escuro'}
    </button>
    <MonitoringPresetSelector presets={presets} activePresetId={activePresetId} onSelect={onSelectPreset} />
    <div className="flex flex-wrap gap-1">
      {panelOptions.map((count) => (
        <button key={count} type="button" onClick={() => onSetPanelCount(count)} className={`lis-v4-control ${panelCount === count ? 'primary' : ''}`}>{count}</button>
      ))}
    </div>
    <MonitoringTvModeToggle active={isTvMode} onToggle={onToggleTvMode} />
  </div>
);
