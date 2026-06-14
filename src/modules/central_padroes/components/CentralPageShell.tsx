import React from 'react';

type CentralPageShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  eyebrow?: string;
  compact?: boolean;
  /** @deprecated — ignorado no modo compacto */
  icon?: string;
  /** @deprecated — ignorado no modo compacto */
  status?: 'seguro' | 'atencao' | 'alto-risco' | 'critico' | 'bloqueado' | 'informacao' | 'decisao';
  /** @deprecated — ignorado no modo compacto */
  guidance?: string;
};

/** Shell compacto para o Document Hub Clean v2. Remove hero gigante, meta line e guidance card. */
export const CentralPageShell: React.FC<CentralPageShellProps> = ({ title, subtitle, children, eyebrow = 'Central de Padrões', compact = false }) => {
  return (
    <div className={`cp-docs-page${compact ? ' compact' : ''}`}>
      <div className="cp-docs-wrap">
        <header className="cp-docs-title-block">
          <div className="cp-docs-breadcrumb"><span>{eyebrow}</span><span>›</span><strong>{title}</strong></div>
          {!compact && (
            <div className="cp-docs-title">
              <h1>{title}</h1>
            </div>
          )}
          {!compact && <p className="cp-docs-subtitle">{subtitle}</p>}
        </header>
        <div className="cp-docs-content">{children}</div>
      </div>
    </div>
  );
};
