import React from 'react';
import { BookIcon } from '../../../../components/Icon';
import { apiSagbManifest } from '../manifest';

const ApiSagbPage: React.FC = () => {
  return (
    <div className="flex-1 p-10 bg-sagb-bg text-sagb-text font-inter min-h-full">
      <header className="mb-10 flex justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">API SagB</h1>
          <p className="text-sagb-muted mt-2 text-[12px]">
            Camada oficial de API do SagB para consumo de sistemas internos e externos com governança,
            segurança e rastreabilidade.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-sagb-muted uppercase tracking-widest mb-1">Módulo Oficial</div>
          <div className="text-lg font-bold text-sagb-text">API SagB</div>
          <div className="mt-2 text-[12px] text-sagb-muted">
            Responsável: <span className="font-semibold text-sagb-text">{apiSagbManifest.owner?.displayName || 'A definir'}</span>
          </div>
          <button
            onClick={() => window.open('/api-sagb/docs', '_self')}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sagb-blue text-white hover:bg-sagb-blue-2 text-[12px] font-semibold transition-colors"
          >
            <BookIcon className="w-4 h-4" />
            Docs
          </button>
        </div>
      </header>

      <section className="bg-sagb-bg-2 p-6 rounded-2xl border border-sagb-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-[12px] font-bold text-sagb-text mb-2">Responsabilidade do Módulo</h2>
            <p className="text-[12px] text-sagb-muted">
              <strong>Agente responsável:</strong> {apiSagbManifest.owner?.displayName || 'A definir'}
            </p>
            <p className="text-[12px] text-sagb-muted mt-2">
              API SagB é a camada oficial para sistemas. MCP SagB permanece voltado a agentes.
              Hub de Integração permanece como camada de conectores e credenciais.
            </p>
          </div>

          <div>
            <h2 className="text-[12px] font-bold text-sagb-text mb-2">Objetivo Operacional</h2>
            <p className="text-[12px] text-sagb-muted">
              Prover endpoints versionados (/v1) com autenticação, autorização por escopo,
              auditoria por request e contratos estáveis para consumo multi-produto.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <div className="text-[10px] text-sagb-muted">Status</div>
          <div className="text-xl font-black text-sagb-text mt-1">Ativo</div>
          <div className="text-[10px] text-sagb-muted mt-1">Módulo registrado no runtime</div>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <div className="text-[10px] text-sagb-muted">Etapas</div>
          <div className="text-xl font-black text-sagb-text mt-1">1 / 9</div>
          <div className="text-[10px] text-sagb-muted mt-1">Definição de fronteiras concluída</div>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <div className="text-[10px] text-sagb-muted">Próximo passo</div>
          <div className="text-[12px] font-bold text-sagb-text mt-1">Contrato inicial /v1</div>
          <div className="text-[10px] text-sagb-muted mt-1">Recursos, padrões de resposta/erro</div>
        </article>
      </section>

      <section className="mt-6 bg-sagb-panel p-6 rounded-2xl border border-sagb-line">
        <h2 className="text-[12px] font-bold text-sagb-text mb-4">Trilha de Evolução</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { etapa: 'ET-01', titulo: 'Definição de fronteiras', status: 'concluído' },
            { etapa: 'ET-02', titulo: 'Contrato inicial /v1', status: 'pendente' },
            { etapa: 'ET-03', titulo: 'Segurança e identidade', status: 'pendente' },
            { etapa: 'ET-04', titulo: 'Auditoria e observabilidade', status: 'pendente' },
            { etapa: 'ET-05', titulo: 'Camada de integração interna', status: 'pendente' },
            { etapa: 'ET-06', titulo: 'Endpoints prioritários', status: 'pendente' },
            { etapa: 'ET-07', titulo: 'Governança de versão', status: 'pendente' },
            { etapa: 'ET-08', titulo: 'Hardening e testes', status: 'pendente' },
            { etapa: 'ET-09', titulo: 'Rollout controlado', status: 'pendente' },
          ].map((item) => (
            <div
              key={item.etapa}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border border-sagb-line bg-sagb-bg"
            >
              <span className={`inline-block w-2 h-2 rounded-full ${item.status === 'concluído' ? 'bg-green-500' : 'bg-sagb-muted'}`} />
              <div>
                <div className="text-[10px] font-bold text-sagb-muted">{item.etapa}</div>
                <div className="text-[12px] font-semibold text-sagb-text">{item.titulo}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ApiSagbPage;
