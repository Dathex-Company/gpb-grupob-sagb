import React, { useEffect } from 'react';
import { MonitoringCardGrid, MonitoringDashboardControls, MonitoringDrawer } from '../components';
import { useMonitoringDashboard } from '../hooks';
import '../styles/lisV4Dashboard.css';

const MonitoramentoDashboardPage: React.FC = () => {
  const dashboard = useMonitoringDashboard();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dashboard.setIsTvMode(false);
        dashboard.setSelectedCardId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dashboard]);

  const isDark = dashboard.visualTheme === 'dark';
  const panelClass = `panels-${dashboard.panelCount}`;

  return (
    <section className={`lis-v4-dashboard ${panelClass} ${dashboard.isTvMode ? 'lis-v4-tv' : ''} ${isDark ? '' : 'lis-light'}`}>
      <div className="lis-v4-main">
        <header className="lis-v4-head">
          <div className="lis-v4-head-left">
            <div className="lis-v4-module-icon">▣</div>
            <div>
              <h1 className="lis-v4-title">Central de Monitoramento</h1>
              <div className="lis-v4-subtitle">
                {dashboard.activePreset.label}
                <span className="lis-v4-live">Atualizado agora</span>
              </div>
            </div>
          </div>
          <MonitoringDashboardControls
            presets={dashboard.presets}
            activePresetId={dashboard.activePreset.id}
            panelOptions={dashboard.panelOptions}
            panelCount={dashboard.panelCount}
            isTvMode={dashboard.isTvMode}
            visualTheme={dashboard.visualTheme}
            onSelectPreset={dashboard.selectPreset}
            onSetPanelCount={dashboard.setPanelCount}
            onToggleTvMode={() => dashboard.setIsTvMode(!dashboard.isTvMode)}
            onToggleTheme={() => dashboard.setVisualTheme(isDark ? 'light' : 'dark')}
          />
        </header>

        {dashboard.isTvMode && (
          <>
            <button type="button" onClick={() => dashboard.setIsTvMode(false)} className="lis-v4-tv-exit">Sair do modo TV</button>
            <div className="lis-v4-tv-badge">Modo TV ativo · clique em “Sair do modo TV” ou pressione ESC</div>
          </>
        )}

        <section className="lis-v4-grid-wrap">
          <MonitoringCardGrid
            cards={dashboard.cards}
            panelCount={dashboard.panelCount}
            isTvMode={dashboard.isTvMode}
            onOpenCard={dashboard.setSelectedCardId}
            onDragStart={dashboard.setDraggedCardId}
            onDropCard={dashboard.reorderCard}
            onResizeCard={dashboard.cycleCardSize}
          />
        </section>

        <MonitoringDrawer card={dashboard.selectedCard} onClose={() => dashboard.setSelectedCardId(null)} />
      </div>
    </section>
  );
};

export default MonitoramentoDashboardPage;
