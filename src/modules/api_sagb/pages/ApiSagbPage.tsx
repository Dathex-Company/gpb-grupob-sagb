import React from 'react';

const stages = [
  { id: 1, name: 'Definição de Fronteiras', status: 'done' as const },
  { id: 2, name: 'Contrato Inicial /v1', status: 'done' as const },
  { id: 3, name: 'Segurança e Identidade', status: 'done' as const },
  { id: 4, name: 'Auditoria e Observabilidade', status: 'done' as const },
  { id: 5, name: 'Camada de Integração Interna', status: 'done' as const },
  { id: 6, name: 'Endpoints Prioritários', status: 'done' as const },
  { id: 7, name: 'Governança de Versão', status: 'done' as const },
  { id: 8, name: 'Hardening e Testes', status: 'done' as const },
  { id: 9, name: 'Rollout Controlado', status: 'done' as const },
];

const ApiSagbPage: React.FC = () => {
  const completed = stages.filter(s => s.status === 'done').length;
  const total = stages.length;
  const progressPercent = Math.round((completed / total) * 100);

  return (
    <div className="flex-1 p-10 bg-sagb-bg text-sagb-text font-inter min-h-full">
      <header className="mb-10 flex justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <span>🔌</span>
            <span>API SagB</span>
            <span className="text-sm font-normal bg-sagb-line text-sagb-muted px-2 py-0.5 rounded-md">v1.0.0</span>
          </h1>
          <p className="text-sagb-muted mt-1 text-sm max-w-xl">
            Camada oficial de API para consumo interno e externo do ecossistema SagB.
            Autenticação via API Key, autorização por escopo, auditoria por request.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-sagb-bg-2 px-4 py-2 rounded-xl border border-sagb-line">
          <span className="text-sm text-sagb-muted">Progresso</span>
          <span className="text-2xl font-bold text-green-400">{completed}/{total}</span>
          <span className="text-xs text-sagb-muted">({progressPercent}%)</span>
        </div>
      </header>

      <section className="bg-sagb-bg-2 p-6 rounded-2xl border border-sagb-line">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📋</span>
          <span>Etapas de Implementação</span>
        </h2>
        <div className="space-y-2">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-sagb-panel border border-sagb-line"
            >
              <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="text-sm">{stage.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <h3 className="text-xs uppercase tracking-wider text-sagb-muted font-semibold mb-1">Endpoints</h3>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-sagb-muted mt-1">Health, TaskZei, CRM, Studio, Vox</p>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <h3 className="text-xs uppercase tracking-wider text-sagb-muted font-semibold mb-1">Escopos</h3>
          <p className="text-2xl font-bold">6</p>
          <p className="text-xs text-sagb-muted mt-1">system, agents, cid · read/write/execute</p>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <h3 className="text-xs uppercase tracking-wider text-sagb-muted font-semibold mb-1">Testes</h3>
          <p className="text-2xl font-bold">5</p>
          <p className="text-xs text-sagb-muted mt-1">Contrato, Auth, Integração, Auditoria, Versão</p>
        </article>
      </section>

      <section className="mt-6 bg-sagb-panel p-6 rounded-2xl border border-sagb-line">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🏗️</span>
          <span>Arquitetura do Módulo</span>
        </h2>
        <div className="text-sm text-sagb-muted space-y-2 leading-relaxed">
          <p><strong className="text-sagb-text">Contrato</strong> — OpenAPI 3.0.3 em <code>contracts/openapi_v1.yaml</code> com schemas, security scheme (ApiKeyAuth) e 12 endpoints documentados.</p>
          <p><strong className="text-sagb-text">Segurança</strong> — Validação de API Key via Supabase, autorização por escopos (<code>system:read</code>, <code>system:write</code>, <code>agents:read</code>, <code>agents:execute</code>, <code>cid:read</code>, <code>cid:write</code>).</p>
          <p><strong className="text-sagb-text">Auditoria</strong> — <code>X-Request-Id</code> por requisição, <code>AuditLogger</code> com buffer em memória (flush para Supabase), tabela <code>api_audit_log</code> com RLS.</p>
          <p><strong className="text-sagb-text">Integração</strong> — <code>HttpClient</code> com retry (exponential backoff) e timeout, <code>CircuitBreaker</code> por adapter, 4 adapters (TaskZei, CRM, Studio, Vox).</p>
          <p><strong className="text-sagb-text">Deploy</strong> — Função Netlify <code>api-sagb-router.mjs</code> (auto-contida) + função de auditoria. Roteamento interno via <code>router.ts</code> (TypeScript) para testes.</p>
          <p><strong className="text-sagb-text">Rollout</strong> — 4 ondas progressivas (Pré-Produção → Alpha → Beta → GA), rollback em 4 níveis, feature flags por domínio.</p>
        </div>
      </section>

      <section className="mt-6 bg-sagb-panel p-6 rounded-2xl border border-sagb-line">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📚</span>
          <span>Links Rápidos</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {[
            { label: 'OpenAPI Spec', href: '#', desc: 'contracts/openapi_v1.yaml' },
            { label: 'Changelog API', href: '#', desc: 'CHANGELOG_API.md' },
            { label: 'Plano de Rollout', href: '#', desc: 'rollout/rolloutPlan.md' },
            { label: 'Política de Depreciação', href: '#', desc: 'versioning/deprecationPolicy.md' },
            { label: 'Go-Live Checklist', href: '#', desc: 'rollout/goLiveChecklist.md' },
            { label: 'Arquitetura do Plano', href: '#', desc: 'plans/plano-execucao-api-sagb-etapas-4-9.md' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block p-3 rounded-xl bg-sagb-bg-2 border border-sagb-line hover:border-sagb-muted transition-colors"
            >
              <span className="text-sagb-text font-medium">{item.label}</span>
              <span className="block text-xs text-sagb-muted mt-0.5">{item.desc}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ApiSagbPage;
