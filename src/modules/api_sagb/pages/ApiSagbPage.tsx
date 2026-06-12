import React from 'react';

const endpoints = [
  'GET /health',
  'GET /status',
  'POST /events',
  'GET /events',
  'GET /events/:id',
  'GET /integrations',
  'GET /integrations/:provider/status',
  'POST /integrations/:provider/actions',
  'GET /integrations/actions/:actionId',
  'GET /integrations/whatsapp/webhook',
  'POST /integrations/whatsapp/webhook',
  'POST /integrations/whatsapp/send-message',
  'GET /integrations/whatsapp/conversations',
  'GET /integrations/whatsapp/conversations/:id/messages',
];

const providers = ['whatsapp', 'clickup', 'gmail', 'titan', 'meta_facebook', 'google_calendar', 'supabase'];

const checklist = [
  'Router v1 oficial',
  'API Key SHA-256',
  'Escopos por endpoint',
  'Audit log persistente',
  'Events API',
  'Integration API via Hub',
  'WhatsApp Cloud API',
  'OpenAPI atualizado',
  'Rollback documentado',
];

const statusCards = [
  { label: 'API', status: 'ok', detail: '/api-sagb/v1 ativo' },
  { label: 'Supabase', status: 'configured', detail: 'api_keys, audit, events e WhatsApp' },
  { label: 'Hub', status: 'connected', detail: 'providers e execução externa' },
  { label: 'WhatsApp', status: 'ready', detail: 'Cloud API oficial Meta' },
];

const ApiSagbPage: React.FC = () => {
  return (
    <div className="flex-1 min-h-full bg-sagb-bg text-sagb-text p-8 font-inter">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔌</span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">API SagB</h1>
              <p className="text-sm text-sagb-muted">Camada oficial `/api-sagb/v1` para sistemas, Hub, integrações e WhatsApp Cloud API.</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm text-green-300">
          Runtime consolidado · v1.1.0 · Sem secrets expostos
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-sagb-line bg-sagb-panel p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sagb-muted">{card.label}</h2>
              <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-300">{card.status}</span>
            </div>
            <p className="mt-3 text-sm text-sagb-muted">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Endpoints ativos</h2>
            <span className="rounded-full bg-sagb-bg-2 px-3 py-1 text-xs text-sagb-muted">{endpoints.length} rotas oficiais</span>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {endpoints.map((endpoint) => (
              <code key={endpoint} className="rounded-xl border border-sagb-line bg-sagb-bg-2 px-3 py-2 text-xs text-sagb-muted">
                {endpoint}
              </code>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-6">
          <h2 className="text-lg font-semibold">Providers Hub</h2>
          <p className="mt-1 text-sm text-sagb-muted">API valida, autoriza e audita. Hub executa. Supabase registra.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {providers.map((provider) => (
              <span key={provider} className="rounded-full border border-sagb-line bg-sagb-bg-2 px-3 py-1.5 text-xs text-sagb-muted">
                {provider}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-6">
          <h2 className="text-lg font-semibold">Segurança</h2>
          <ul className="mt-4 space-y-2 text-sm text-sagb-muted">
            <li>✓ API Key via SHA-256 em `api_keys.key_hash`</li>
            <li>✓ 401 para ausente, inválida, inativa, revogada ou expirada</li>
            <li>✓ 403 para escopo insuficiente</li>
            <li>✓ CORS configurável por ambiente</li>
            <li>✓ Logs com headers/payloads sensíveis mascarados</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-6">
          <h2 className="text-lg font-semibold">Operação</h2>
          <ul className="mt-4 space-y-2 text-sm text-sagb-muted">
            <li>Audit logs recentes: `api_audit_log`</li>
            <li>Eventos recentes: `api_events`</li>
            <li>Actions recentes: `integration_logs`</li>
            <li>Erros recentes: `error_code` + `provider`</li>
            <li>Monitoramento: `/status` + tabelas de logs</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-6">
          <h2 className="text-lg font-semibold">Go-live</h2>
          <div className="mt-4 space-y-2">
            {checklist.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl bg-sagb-bg-2 px-3 py-2 text-sm text-sagb-muted">
                <span className="text-green-300">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-sagb-line bg-sagb-panel p-6">
        <h2 className="text-lg font-semibold">Fronteira operacional</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-sagb-muted md:grid-cols-4">
          <p><strong className="text-sagb-text">API</strong><br />Contrato, auth, scopes, audit e normalização.</p>
          <p><strong className="text-sagb-text">Hub</strong><br />Providers, credenciais e execução externa.</p>
          <p><strong className="text-sagb-text">Supabase</strong><br />Persistência, logs, contatos, conversas e mensagens.</p>
          <p><strong className="text-sagb-text">CRM/Núcleo</strong><br />Consumo operacional das conversas WhatsApp.</p>
        </div>
      </section>
    </div>
  );
};

export default ApiSagbPage;
