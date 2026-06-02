import React from 'react';
import { MonitoringPreset } from '../types';

interface MonitoringPresetSelectorProps {
  presets: MonitoringPreset[];
  activePresetId: string;
  onSelect: (presetId: string) => void;
}

export const MonitoringPresetSelector: React.FC<MonitoringPresetSelectorProps> = ({ presets, activePresetId, onSelect }) => (
  <select value={activePresetId} onChange={(event) => onSelect(event.target.value)} className="lis-v4-select">
    {presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
  </select>
);
