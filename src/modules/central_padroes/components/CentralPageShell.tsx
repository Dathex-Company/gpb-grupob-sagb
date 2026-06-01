import React from 'react';

export const CentralPageShell: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="cp-docs-page">
    <div className="cp-docs-wrap">
      <header className="cp-docs-title-block">
        <div className="cp-docs-title">
          <div className="cp-docs-title-icon">📄</div>
          <h1>{title}</h1>
        </div>
        <p className="cp-docs-subtitle">{subtitle}</p>
        <div className="cp-docs-meta-line"><span className="cp-docs-owner-dot">P</span><span>Pietro Carboni</span><span>·</span><span>Central Docs UI</span><span>·</span><span>Canonicidade pendente quando aplicável</span></div>
      </header>
      <div className="cp-docs-content">{children}</div>
    </div>
  </div>
);
