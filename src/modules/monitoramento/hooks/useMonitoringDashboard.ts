import { useMemo, useState } from 'react';
import { monitoringDashboardCards, monitoringDashboardPresets } from '../services';
import { MonitoringCardSize, MonitoringDashboardCard, MonitoringLayoutItem, MonitoringPanelCount } from '../types';

const panelOptions: MonitoringPanelCount[] = [1, 2, 3, 4, 8, 12, 16];

const nextSize = (current: MonitoringCardSize, allowed: MonitoringCardSize[]) => {
  const currentIndex = allowed.indexOf(current);
  return allowed[(currentIndex + 1) % allowed.length] || current;
};

export const useMonitoringDashboard = () => {
  const [activePresetId, setActivePresetId] = useState(monitoringDashboardPresets[0]?.id || 'operacao-critica');
  const activePreset = monitoringDashboardPresets.find((preset) => preset.id === activePresetId) || monitoringDashboardPresets[0];
  const [panelCount, setPanelCount] = useState<MonitoringPanelCount>(activePreset?.defaultPanelCount || 8);
  const [isTvMode, setIsTvMode] = useState(false);
  const [visualTheme, setVisualTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [customLayout, setCustomLayout] = useState<Record<string, MonitoringLayoutItem[]>>({});

  const presetCards = useMemo(() => {
    const cards = activePreset.cardIds
      .map((cardId) => monitoringDashboardCards.find((card) => card.id === cardId))
      .filter(Boolean) as MonitoringDashboardCard[];

    return cards.slice(0, panelCount);
  }, [activePreset, panelCount]);

  const layout = useMemo(() => {
    const savedLayout = customLayout[activePreset.id];
    if (savedLayout) {
      return savedLayout
        .filter((item) => presetCards.some((card) => card.id === item.cardId))
        .sort((a, b) => a.order - b.order);
    }

    return presetCards.map((card, order) => ({ cardId: card.id, order, size: card.defaultSize }));
  }, [activePreset.id, customLayout, presetCards]);

  const visibleCards = useMemo(() => {
    return layout
      .map((item) => {
        const card = presetCards.find((presetCard) => presetCard.id === item.cardId);
        return card ? { ...card, defaultSize: item.size } : null;
      })
      .filter(Boolean) as MonitoringDashboardCard[];
  }, [layout, presetCards]);

  const selectedCard = selectedCardId
    ? monitoringDashboardCards.find((card) => card.id === selectedCardId) || null
    : null;

  const selectPreset = (presetId: string) => {
    const preset = monitoringDashboardPresets.find((item) => item.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setPanelCount(preset.defaultPanelCount);
    setSelectedCardId(null);
  };

  const reorderCard = (targetCardId: string) => {
    if (!draggedCardId || draggedCardId === targetCardId) return;

    setCustomLayout((current) => {
      const baseLayout = layout.length > 0 ? layout : presetCards.map((card, order) => ({ cardId: card.id, order, size: card.defaultSize }));
      const nextLayout = [...baseLayout];
      const fromIndex = nextLayout.findIndex((item) => item.cardId === draggedCardId);
      const toIndex = nextLayout.findIndex((item) => item.cardId === targetCardId);

      if (fromIndex < 0 || toIndex < 0) return current;

      const [moved] = nextLayout.splice(fromIndex, 1);
      nextLayout.splice(toIndex, 0, moved);

      return {
        ...current,
        [activePreset.id]: nextLayout.map((item, order) => ({ ...item, order }))
      };
    });
  };

  const cycleCardSize = (cardId: string) => {
    const card = monitoringDashboardCards.find((item) => item.id === cardId);
    if (!card) return;

    setCustomLayout((current) => {
      const baseLayout = layout.length > 0 ? layout : presetCards.map((item, order) => ({ cardId: item.id, order, size: item.defaultSize }));
      return {
        ...current,
        [activePreset.id]: baseLayout.map((item) => (
          item.cardId === cardId ? { ...item, size: nextSize(item.size, card.allowedSizes) } : item
        ))
      };
    });
  };

  return {
    activePreset,
    cards: visibleCards,
    selectedCard,
    panelCount,
    panelOptions,
    presets: monitoringDashboardPresets,
    isTvMode,
    visualTheme,
    setPanelCount,
    selectPreset,
    setSelectedCardId,
    setDraggedCardId,
    reorderCard,
    cycleCardSize,
    setIsTvMode,
    setVisualTheme
  };
};

