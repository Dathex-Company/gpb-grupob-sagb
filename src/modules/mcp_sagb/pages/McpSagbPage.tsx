import React from 'react';
import { BookIcon, TerminalIcon } from '../../../../components/Icon';
import { mcpSagbManifest } from '../manifest';

const especialidades = [
  { area: 'VS Code', descricao: 'Workspaces, multi-root, performance, atalhos' },
  { area: 'Extensões de IA', descricao: 'Codex, OpenAI, agentes de código' },
  { area: 'Desenvolvimento', descricao: 'React, TypeScript, Tailwind, Vite' },
  { area: 'Infraestrutura', descricao: 'GitHub, Netlify, Supabase' },
  { area: 'Automação', descricao: 'n8n, webhooks, scripts' },
  { area: 'Terminal', descricao: 'PowerShell, Bash, scripts' },
  { area: 'Organização', descricao: 'Monorepo, multi-repo, DATHEX_STACK' }
];

const McpSagbPage: React.FC = () => {
  return (
    <div className="flex-1 p-10 bg-sagb-bg text-sagb-text font-inter min-h-full">
      {/* Header canônico */}
      <header className="mb-10 flex justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
              <TerminalIcon className="w-3 h-3" />
              Camada Técnica • Draft
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            MCP SagB
          </h1>
          <p className="text-sagb-muted mt-2 text-[12px] max-w-2xl">
            Model Context Protocol do SagB — especialista em VS Code, produtividade de
            desenvolvimento e configuração de ambiente local. Agente Sávio Codare fornece
            mentoria técnica e automação para o ecossistema SagB.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-black text-sagb-muted uppercase tracking-widest mb-1">
            Camada Técnica
          </div>
          <div className="text-lg font-bold text-sagb-text">
            MCP SagB
          </div>
          <div className="mt-2 text-[12px] text-sagb-muted">
            Responsável:{' '}
            <span className="font-semibold text-sagb-text">
              {mcpSagbManifest.owner?.displayName || 'A definir'}
            </span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Status</p>
          <p className="mt-2 text-lg font-black text-sagb-text">Draft</p>
          <p className="text-sagb-muted text-[10px] mt-1">Módulo canônico criado</p>
        </div>
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Asset Legado</p>
          <p className="mt-2 text-lg font-black text-sagb-text">24.357 linhas</p>
          <p className="text-sagb-muted text-[10px] mt-1">docs/legacy/MCP SagB</p>
        </div>
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Especialidades</p>
          <p className="mt-2 text-lg font-black text-sagb-text">7 áreas</p>
          <p className="text-sagb-muted text-[10px] mt-1">VS Code, IA, Dev, Infra, Automação</p>
        </div>
      </section>

      {/* Especialidades */}
      <section className="mt-6 bg-sagb-panel rounded-2xl border border-sagb-line p-6">
        <h2 className="text-[12px] font-bold text-sagb-text mb-4">Especialidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {especialidades.map((item) => (
            <div key={item.area} className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4">
              <p className="text-[10px] font-black text-sagb-blue uppercase tracking-widest">{item.area}</p>
              <p className="text-sagb-text text-[12px] mt-1">{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Próximos passos */}
      <section className="mt-6 bg-sagb-panel rounded-2xl border border-sagb-line p-6">
        <h2 className="text-[12px] font-bold text-sagb-text mb-4">Próximos Passos</h2>
        <div className="space-y-3">
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4 flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sagb-blue text-white text-[10px] font-black">1</span>
            <div>
              <p className="text-sagb-text text-[12px] font-semibold">Triar legado de 24k+ linhas</p>
              <p className="text-sagb-muted text-[10px]">Extrair conhecimento útil e descartar duplicatas</p>
            </div>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4 flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sagb-blue text-white text-[10px] font-black">2</span>
            <div>
              <p className="text-sagb-text text-[12px] font-semibold">Definir se MCP SagB será um MCP server real</p>
              <p className="text-sagb-muted text-[10px]">Ou se permanece como agente de conhecimento (persona)</p>
            </div>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4 flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sagb-blue text-white text-[10px] font-black">3</span>
            <div>
              <p className="text-sagb-text text-[12px] font-semibold">Integrar com SagB Bridge</p>
              <p className="text-sagb-muted text-[10px]">MCP SagB (conhecimento) + SagB Bridge (conexão técnica)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { McpSagbPage };
export default McpSagbPage;
