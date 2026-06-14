import React from 'react';

type CentralPageShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon?: string;
  status?: 'seguro' | 'atencao' | 'alto-risco' | 'critico' | 'bloqueado' | 'informacao' | 'decisao';
  guidance?: string;
  eyebrow?: string;
};

const statusMeta: Record<NonNullable<CentralPageShellProps['status']>, { label: string; icon: string; className: string }> = {
  seguro: { label: 'Seguro', icon: '🟢', className: 'safe' },
  atencao: { label: 'Atenção', icon: '🟡', className: 'attention' },
  'alto-risco': { label: 'Alto risco', icon: '🟠', className: 'high' },
  critico: { label: 'Crítico', icon: '🔴', className: 'critical' },
  bloqueado: { label: 'Bloqueado', icon: '⚫', className: 'blocked' },
  informacao: { label: 'Informação', icon: '🔵', className: 'info' },
  decisao: { label: 'Decisão', icon: '🟣', className: 'decision' }
};

export const CentralPageShell: React.FC<CentralPageShellProps> = ({ title, subtitle, children, icon = '📄', status = 'informacao', guidance, eyebrow = 'Central de Padrões' }) => {
  const meta = statusMeta[status];
  return (
    <div className="cp-docs-page">
      <div className="cp-docs-wrap">
        <header className="cp-docs-title-block">
          <div className="cp-docs-breadcrumb"><span>{eyebrow}</span><span>›</span><strong>{title}</strong></div>
          <div className="cp-docs-title">
            <div className="cp-docs-title-icon">{icon}</div>
            <h1>{title}</h1>
          </div>
          <p className="cp-docs-subtitle">{subtitle}</p>
          <div className="cp-docs-meta-line"><span className="cp-docs-owner-dot">C</span><span>Governança documental</span><span>·</span><span>Central de Documentos e Padrões</span><span>·</span><span className={`cp-visual-badge ${meta.className}`}>{meta.icon} {meta.label}</span></div>
          {guidance && <div className="cp-guidance-card"><strong>🧠 Explicação guiada:</strong> {guidance}</div>}
        </header>
        <div className="cp-docs-content">{children}</div>
      </div>
    </div>
  );
};
