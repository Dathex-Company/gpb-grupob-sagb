import React, { useMemo, useState } from 'react';
import {
  getPublishedLinksCompanies,
  PublishedAppLink,
  PUBLISHED_APP_LINKS,
} from '../data/publishedLinks';
import '../styles/nagi-tokens.css';

const STATUS_LABELS: Record<PublishedAppLink['status'], string> = {
  published: 'Publicado',
  review: 'Revisar',
  legacy: 'Legado',
};

const STATUS_STYLES: Record<PublishedAppLink['status'], { bg: string; color: string; border: string }> = {
  published: { bg: 'var(--nagi-success-soft)', color: 'var(--nagi-success)', border: 'var(--nagi-success-line)' },
  review: { bg: 'var(--nagi-warning-soft)', color: 'var(--nagi-warning)', border: 'var(--nagi-warning-line)' },
  legacy: { bg: 'var(--nagi-neutral-soft)', color: 'var(--nagi-muted)', border: 'var(--nagi-line)' },
};

const formatDate = (value?: string) => {
  if (!value) return 'Data não informada';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const PublishedLinksSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [company, setCompany] = useState('todas');
  const [status, setStatus] = useState<'todos' | PublishedAppLink['status']>('todos');

  const companies = useMemo(() => getPublishedLinksCompanies(), []);

  const filteredLinks = useMemo(() => {
    const term = query.trim().toLowerCase();
    return PUBLISHED_APP_LINKS.filter((link) => {
      const matchesCompany = company === 'todas' || link.company === company;
      const matchesStatus = status === 'todos' || link.status === status;
      const haystack = [
        link.company,
        link.siteName,
        link.title,
        link.url,
        link.netlifyRepo,
        link.githubRepo,
        link.notes,
        ...(link.tags || []),
      ].filter(Boolean).join(' ').toLowerCase();
      const matchesQuery = !term || haystack.includes(term);
      return matchesCompany && matchesStatus && matchesQuery;
    }).sort((a, b) => a.company.localeCompare(b.company) || a.title.localeCompare(b.title));
  }, [company, query, status]);

  const groupedLinks = useMemo(() => {
    return filteredLinks.reduce<Record<string, PublishedAppLink[]>>((acc, link) => {
      if (!acc[link.company]) acc[link.company] = [];
      acc[link.company].push(link);
      return acc;
    }, {});
  }, [filteredLinks]);

  const publishedCount = PUBLISHED_APP_LINKS.filter((link) => link.status === 'published').length;
  const reviewCount = PUBLISHED_APP_LINKS.filter((link) => link.status === 'review').length;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div
        style={{
          padding: 22,
          borderRadius: 'var(--nagi-radius-xl)',
          background: 'linear-gradient(135deg, var(--nagi-brand-soft), rgba(20,168,166,0.06))',
          border: '1px solid var(--nagi-line-soft)',
          boxShadow: 'var(--nagi-shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--nagi-brand)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
              Netlify publicado
            </div>
            <h2 style={{ margin: 0, fontSize: 30, lineHeight: 1.05, color: 'var(--nagi-text)', letterSpacing: '-0.04em' }}>
              Links publicados do ecossistema
            </h2>
            <p style={{ margin: '10px 0 0', color: 'var(--nagi-muted)', fontSize: 'var(--nagi-body)', lineHeight: 1.6 }}>
              Lista operacional dos apps publicados no Netlify, agrupada por empresa e preparada para sincronização automática quando novos sites forem publicados.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', flexWrap: 'wrap' }}>
            <MetricCard label="Links" value={PUBLISHED_APP_LINKS.length} />
            <MetricCard label="OK" value={publishedCount} />
            <MetricCard label="Revisar" value={reviewCount} />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1fr) minmax(160px, 240px) minmax(140px, 190px)',
          gap: 10,
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por app, domínio, repo ou tag..."
          style={controlStyle}
        />
        <select value={company} onChange={(event) => setCompany(event.target.value)} style={controlStyle}>
          <option value="todas">Todas as empresas</option>
          {companies.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as 'todos' | PublishedAppLink['status'])} style={controlStyle}>
          <option value="todos">Todos os status</option>
          <option value="published">Publicado</option>
          <option value="review">Revisar</option>
          <option value="legacy">Legado</option>
        </select>
      </div>

      {Object.keys(groupedLinks).length === 0 && (
        <div style={{ padding: 28, borderRadius: 'var(--nagi-radius-lg)', border: '1px dashed var(--nagi-line)', color: 'var(--nagi-muted)', textAlign: 'center' }}>
          Nenhum link encontrado com os filtros atuais.
        </div>
      )}

      {Object.entries(groupedLinks).map(([companyName, links]) => (
        <div key={companyName} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ margin: 0, color: 'var(--nagi-text)', fontSize: 18, letterSpacing: '-0.03em' }}>{companyName}</h3>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--nagi-muted)', backgroundColor: 'var(--nagi-neutral-soft)', borderRadius: 999, padding: '4px 9px' }}>
              {links.length} link(s)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {links.map((link) => <LinkCard key={link.id} link={link} />)}
          </div>
        </div>
      ))}
    </section>
  );
};

const MetricCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div style={{ minWidth: 92, padding: '13px 14px', borderRadius: 'var(--nagi-radius-lg)', backgroundColor: 'var(--nagi-surface)', border: '1px solid var(--nagi-line-soft)' }}>
    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--nagi-text)', letterSpacing: '-0.05em' }}>{value}</div>
    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--nagi-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</div>
  </div>
);

const LinkCard: React.FC<{ link: PublishedAppLink }> = ({ link }) => {
  const statusStyle = STATUS_STYLES[link.status];

  return (
    <article
      style={{
        padding: 16,
        borderRadius: 'var(--nagi-radius-lg)',
        backgroundColor: 'var(--nagi-surface)',
        border: '1px solid var(--nagi-line-soft)',
        boxShadow: 'var(--nagi-shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 190,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <h4 style={{ margin: 0, color: 'var(--nagi-text)', fontSize: 16, lineHeight: 1.2, letterSpacing: '-0.03em' }}>{link.title}</h4>
          <p style={{ margin: '5px 0 0', color: 'var(--nagi-muted)', fontSize: 11 }}>{link.siteName}</p>
        </div>
        <span style={{ whiteSpace: 'nowrap', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '5px 8px', borderRadius: 999, backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
          {STATUS_LABELS[link.status]}
        </span>
      </div>

      <a href={link.url} target="_blank" rel="noreferrer" style={{ color: 'var(--nagi-brand)', fontSize: 12, fontWeight: 700, wordBreak: 'break-all', textDecoration: 'none' }}>
        {link.url}
      </a>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--nagi-muted)', fontSize: 10 }}>
        <span>Publicado: {formatDate(link.publishedAt)}</span>
        {link.githubRepo && <span>GitHub: {link.githubRepo}</span>}
        {link.netlifyRepo && <span>Netlify repo: {link.netlifyRepo}</span>}
      </div>

      {link.notes && (
        <div style={{ padding: '8px 10px', borderRadius: 'var(--nagi-radius-md)', backgroundColor: 'var(--nagi-warning-soft)', color: 'var(--nagi-warning)', border: '1px solid var(--nagi-warning-line)', fontSize: 10, lineHeight: 1.4 }}>
          {link.notes}
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {(link.tags || []).map((tag) => (
            <span key={tag} style={{ fontSize: 9, color: 'var(--nagi-muted)', backgroundColor: 'var(--nagi-neutral-soft)', borderRadius: 999, padding: '3px 7px' }}>{tag}</span>
          ))}
        </div>
        <a href={link.url} target="_blank" rel="noreferrer" style={{ height: 30, display: 'inline-flex', alignItems: 'center', padding: '0 12px', borderRadius: 'var(--nagi-radius-md)', backgroundColor: 'var(--nagi-brand)', color: '#fff', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
          Abrir
        </a>
      </div>
    </article>
  );
};

const controlStyle: React.CSSProperties = {
  width: '100%',
  height: 42,
  borderRadius: 'var(--nagi-radius-md)',
  border: '1px solid var(--nagi-line)',
  backgroundColor: 'var(--nagi-surface)',
  color: 'var(--nagi-text)',
  padding: '0 12px',
  fontSize: 12,
  outline: 'none',
};

export default PublishedLinksSection;
