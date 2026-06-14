import React from 'react';
import type { DocumentEvent, DocumentVersion } from '../types/index';

export const CentralActionBar: React.FC<{ children: React.ReactNode; compact?: boolean }> = ({ children, compact = false }) => (
  <div className={`cp-central-action-bar ${compact ? 'compact' : ''}`}>{children}</div>
);

export const CentralEmptyState: React.FC<{ title: string; description: string; icon?: string }> = ({ title, description, icon = '◇' }) => (
  <div className="cp-central-empty-state">
    <div className="cp-central-empty-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export const CentralLoadingState: React.FC<{ label?: string }> = ({ label = 'Carregando...' }) => (
  <div className="cp-central-loading-state"><span />{label}</div>
);

export const CentralErrorState: React.FC<{ title?: string; message: string }> = ({ title = 'Não foi possível concluir a ação', message }) => (
  <div className="cp-central-error-state">
    <strong>{title}</strong>
    <p>{message}</p>
  </div>
);

export const CentralFilterBar: React.FC<{ children: React.ReactNode; activeCount?: number; onClear?: () => void }> = ({ children, activeCount = 0, onClear }) => (
  <div className="cp-central-filter-bar">
    <div className="cp-central-filter-content">{children}</div>
    <div className="cp-central-filter-meta">
      {activeCount > 0 && <span className="cp-central-filter-chip">{activeCount} filtro(s)</span>}
      {onClear && <button type="button" className="cp-docs-btn-secondary" onClick={onClear}>Limpar</button>}
    </div>
  </div>
);

export const CentralTable: React.FC<{ children: React.ReactNode; ariaLabel?: string }> = ({ children, ariaLabel = 'Tabela da Central de Padrões' }) => (
  <div className="cp-central-table-wrap">
    <table className="cp-central-table" aria-label={ariaLabel}>{children}</table>
  </div>
);

export const CentralModal: React.FC<{
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}> = ({ open, title, description, children, footer, onClose }) => {
  if (!open) return null;
  return (
    <div className="cp-central-modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="cp-central-modal">
        <header>
          <div>
            <p className="cp-docs-kicker">Ação crítica</p>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="cp-docs-icon-btn" onClick={onClose} aria-label="Fechar">×</button>
        </header>
        <div className="cp-central-modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
};

export const VersionHistoryPanel: React.FC<{
  versions: DocumentVersion[];
  loading: boolean;
  canEdit: boolean;
  restoringVersion: number | null;
  confirmRestore: number | null;
  onRestore: (version: number) => void;
  formatDate: (value?: string | null) => string;
  getStatusLabel: (status?: string | null) => string;
}> = ({ versions, loading, canEdit, restoringVersion, confirmRestore, onRestore, formatDate, getStatusLabel }) => (
  <section className="cp-docs-panel cp-composed-panel">
    <div className="cp-composed-panel-header">
      <div>
        <p className="cp-docs-kicker">Histórico de versões</p>
        <h2>Versões oficiais</h2>
      </div>
      <span className="cp-central-filter-chip">{versions.length} versão(ões)</span>
    </div>
    {loading && <CentralLoadingState label="Carregando histórico de versões..." />}
    {!loading && versions.length === 0 && <CentralEmptyState icon="📜" title="Nenhuma versão publicada" description="Use Publicar como oficial para criar a primeira versão auditável." />}
    <div className="cp-history-list">
      {versions.map((version) => (
        <article key={version.id} className="cp-history-card">
          <div className="cp-history-card-main">
            <span className="cp-history-version">v{version.version}</span>
            <div>
              <h3>{version.title || 'Versão sem título editorial'}</h3>
              <p>{formatDate(version.createdAt)}{version.officialStatus ? ` · ${getStatusLabel(version.officialStatus)}` : ''}</p>
            </div>
          </div>
          <button type="button" className="cp-docs-btn-secondary compact" onClick={() => onRestore(version.version)} disabled={restoringVersion === version.version || !canEdit}>
            {restoringVersion === version.version ? '⏳ Restaurando' : confirmRestore === version.version ? '⚠️ Confirmar' : '↩️ Restaurar'}
          </button>
        </article>
      ))}
    </div>
  </section>
);

export const EditorialEventsPanel: React.FC<{
  events: DocumentEvent[];
  loading: boolean;
  formatDate: (value?: string | null) => string;
  getEventLabel: (eventType: string) => string;
  getStatusLabel: (status?: string | null) => string;
}> = ({ events, loading, formatDate, getEventLabel, getStatusLabel }) => (
  <section className="cp-docs-panel cp-composed-panel">
    <div className="cp-composed-panel-header">
      <div>
        <p className="cp-docs-kicker">Eventos editoriais</p>
        <h2>Trilha de ações</h2>
      </div>
      <span className="cp-central-filter-chip">{events.length} evento(s)</span>
    </div>
    {loading && <CentralLoadingState label="Carregando eventos editoriais..." />}
    {!loading && events.length === 0 && <CentralEmptyState icon="📋" title="Nenhum evento editorial" description="Publicações, restaurações e mudanças de status aparecerão aqui." />}
    <div className="cp-events-timeline">
      {events.map((event) => (
        <article key={event.id} className="cp-event-card">
          <span className="cp-event-dot" />
          <div>
            <h3>{getEventLabel(event.eventType)}</h3>
            <p>{formatDate(event.createdAt)}{event.versionTo ? ` · v${event.versionTo}` : ''}</p>
            {(event.previousOfficialStatus || event.newOfficialStatus) && (
              <span className="cp-event-transition">
                {event.previousOfficialStatus ? getStatusLabel(event.previousOfficialStatus) : '—'} → {event.newOfficialStatus ? getStatusLabel(event.newOfficialStatus) : '—'}
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  </section>
);
