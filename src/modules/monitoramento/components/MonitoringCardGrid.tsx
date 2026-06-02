import React from 'react';
import { MonitoringDashboardCard, MonitoringPanelCount } from '../types';
import { MonitoringCard } from './MonitoringCard';

interface MonitoringCardGridProps {
  cards: MonitoringDashboardCard[];
  panelCount: MonitoringPanelCount;
  isTvMode: boolean;
  onOpenCard: (cardId: string) => void;
  onDragStart: (cardId: string) => void;
  onDropCard: (cardId: string) => void;
  onResizeCard: (cardId: string) => void;
}

export const MonitoringCardGrid: React.FC<MonitoringCardGridProps> = ({ cards, panelCount, isTvMode, onOpenCard, onDragStart, onDropCard, onResizeCard }) => {
  const compact = panelCount >= 12;

  return (
    <section className="lis-v4-grid">
      {cards.map((card) => (
        <MonitoringCard
          key={card.id}
          card={card}
          compact={compact}
          onOpen={onOpenCard}
          onDragStart={onDragStart}
          onDropCard={onDropCard}
          onResize={onResizeCard}
        />
      ))}
    </section>
  );
};
