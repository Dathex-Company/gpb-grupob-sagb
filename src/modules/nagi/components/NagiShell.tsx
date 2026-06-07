import React, { useCallback, useEffect, useState } from 'react';
import { TabId } from '../../../../types';
import NagiSidebar from './NagiSidebar';
import NAGIView, { NagiSection } from './NAGIView';
import {
  getCatalogItems,
  getTriageItems,
  resetToBlueprint,
} from '../services/nagiService';
import { getEligibleForPromotion, refreshEligibility } from '../services/nagiPromotionService';
import { getIngestionDocuments } from '../services/nagiIngestionService';
import { NagiIngestionDocument, NagiItem } from '../domain/types';
import '../styles/nagi-tokens.css';

/* ── Props ──────────────────────────────────────────── */

interface NagiShellProps {
  onBack: () => void;
  onOpenTab?: (tab: TabId) => void;
}

/* ── Componente principal ───────────────────────────── */

const NagiShell: React.FC<NagiShellProps> = ({ onBack, onOpenTab }) => {
  const [activeSection, setActiveSection] = useState<NagiSection>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const [catalogItems, setCatalogItems] = useState<NagiItem[]>([]);
  const [triageItems, setTriageItems] = useState<NagiItem[]>([]);
  const [ingestionDocs, setIngestionDocs] = useState<NagiIngestionDocument[]>([]);
  const [eligibleCount, setEligibleCount] = useState(0);

  const refresh = useCallback(() => {
    refreshEligibility();
    setCatalogItems(getCatalogItems());
    setTriageItems(getTriageItems());
    setIngestionDocs(getIngestionDocuments());
    setEligibleCount(getEligibleForPromotion().length);
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleNavigate = useCallback((section: string) => {
    if (section === 'dashboard' || section === 'documentos' || section === 'ideias' || section === 'catalogo' || section === 'governanca') {
      setActiveSection(section);
    }
  }, []);

  const handleOpenTab = useCallback((tab: string) => {
    if (onOpenTab) onOpenTab(tab as TabId);
  }, [onOpenTab]);

  /* ── Badge counts for sidebar ─────────────── */
  const badgeCounts = {
    documentos: ingestionDocs.length,
    ideias: triageItems.length,
    catalogo: catalogItems.length,
    governanca: 0,
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: 'var(--nagi-bg)',
      }}
    >
      {/* ── Sidebar ──────────────────────────── */}
      <NagiSidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onBack={onBack}
        badgeCounts={badgeCounts}
      />

      {/* ── Área de conteúdo ─────────────────── */}
      <div
        style={{
          flex: 1,
          height: '100dvh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        className="custom-scrollbar"
      >
        <div style={{ maxWidth: 1500, margin: '0 auto', padding: activeSection === 'dashboard' ? 0 : '20px 24px 48px' }}>
          <NAGIView
            section={activeSection}
            catalogItems={catalogItems}
            triageItems={triageItems}
            ingestionDocs={ingestionDocs}
            eligibleCount={eligibleCount}
            refreshKey={refreshKey}
            onRefresh={refresh}
            onNavigate={handleOpenTab}
          />
        </div>

        {/* ── Footer ────────────────────────── */}
        <footer
          style={{
            textAlign: 'center',
            padding: '16px 24px',
            borderTop: `1px solid var(--nagi-line-soft)`,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--nagi-muted-light)',
            }}
          >
            CID + RAI → NIC → NAGI → Módulos Especialistas
          </span>
          <p
            style={{
              fontSize: 'var(--nagi-muted-size)',
              color: 'var(--nagi-muted)',
              marginTop: 4,
            }}
          >
            O documento entra, o NAGI organiza, a governança decide.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default NagiShell;
