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

const providerStates: Record<string, string> = {
  whatsapp: 'Implementado para validação; depende de Meta env + assinatura webhook',
  clickup: 'Provider registrado; ações dependem de driver/credenciais do Hub',
  gmail: 'Provider registrado; ações dependem de driver/credenciais do Hub',
  titan: 'Provider registrado; ações dependem de driver/credenciais do Hub',
  meta_facebook: 'Driver pendente; credenciais Meta não validam produção neste painel',
  google_calendar: 'Driver pendente; credenciais Google não validam produção neste painel',
  supabase: 'Persistência esperada; depende de env e migration controlada não aplicada',
};

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
  { label: 'API', status: 'checklist', detail: 'Runtime implementado no PR #4; validar /api-sagb/v1/status com API key no ambiente alvo.' },
  { label: 'Supabase', status: 'pendente validação', detail: 'Migration criada, não aplicada. Status real depende de env e banco alvo.' },
  { label: 'Hub', status: 'parcial', detail: 'Fronteira API x Hub documentada; drivers/credenciais variam por provider.' },
  { label: 'WhatsApp', status: 'pendente Meta', detail: 'Cloud API implementada para validação; produção exige assinatura, secrets e webhook Meta.' },
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
          Checklist de revisão · v1.1.0 · Sem secrets expostos
        </div>
      </header>

      <section className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-200">
        <strong>Importante:</strong> este painel é um checklist operacional pré-produção. Ele não autentica nem consulta dados sensíveis sozinho.
        O status real deve ser validado pelo endpoint <code>/api-sagb/v1/status</code> com API key autorizada no ambiente alvo.
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-sagb-line bg-sagb-panel p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sagb-muted">{card.label}</h2>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-200">{card.status}</span>
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
          <p className="mt-1 text-sm text-sagb-muted">API valida, autoriza e audita. Hub é a fronteira de providers/credenciais, mas nem todo provider tem driver server-side pronto.</p>
          <div className="mt-4 space-y-2">
            {providers.map((provider) => (
              <div key={provider} className="rounded-xl border border-sagb-line bg-sagb-bg-2 px-3 py-2 text-xs text-sagb-muted">
                <strong className="text-sagb-text">{provider}</strong> · {providerStates[provider]}
              </div>
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
                <span className="text-amber-200">□</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-sagb-muted">Checklist não significa produção concluída. Deploy, secrets, migration e validação Meta seguem pendentes de aprovação.</p>
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
