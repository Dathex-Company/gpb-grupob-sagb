import React from 'react';
import { NetworkIcon } from '../../../../components/Icon';
import { fluxobManifest } from '../manifest';

const conceitos = [
  { nome: 'Workflow', descricao: 'Sequência de etapas que executam uma tarefa de negócio' },
  { nome: 'Step', descricao: 'Unidade atômica do workflow (ação, API, notificação, decisão)' },
  { nome: 'Trigger', descricao: 'Evento que inicia um workflow (agendado, webhook, manual)' },
  { nome: 'Contexto', descricao: 'Dados compartilhados entre steps do mesmo workflow' },
  { nome: 'Rastro', descricao: 'Log completo de execução com status, duração e resultado' }
];

const FluxobPage: React.FC = () => {
  return (
    <div className="flex-1 p-10 bg-sagb-bg text-sagb-text font-inter min-h-full">
      {/* Header canônico */}
      <header className="mb-10 flex justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
              <NetworkIcon className="w-3 h-3" />
              Módulo Oficial • Pré-alpha
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            FluxoB
          </h1>
          <p className="text-sagb-muted mt-2 text-[12px] max-w-2xl">
            Motor de orquestração de fluxos de trabalho do ecossistema GrupoB.
            Define, executa e monitora processos de negócio que envolvem múltiplos agentes,
            sistemas e etapas manuais.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-black text-sagb-muted uppercase tracking-widest mb-1">
            Módulo Oficial
          </div>
          <div className="text-lg font-bold text-sagb-text">
            FluxoB
          </div>
          <div className="mt-2 text-[12px] text-sagb-muted">
            Responsável:{' '}
            <span className="font-semibold text-sagb-text">
              {fluxobManifest.owner?.displayName || 'A definir'}
            </span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Status</p>
          <p className="mt-2 text-lg font-black text-sagb-text">Pré-alpha</p>
          <p className="text-sagb-muted text-[10px] mt-1">Estrutura canônica criada</p>
        </div>
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Etapas</p>
          <p className="mt-2 text-lg font-black text-sagb-text">0 / 5</p>
          <p className="text-sagb-muted text-[10px] mt-1">Domínio em definição</p>
        </div>
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Próximo</p>
          <p className="mt-2 text-lg font-black text-sagb-text">ET-01</p>
          <p className="text-sagb-muted text-[10px] mt-1">Validar domínio com stakeholders</p>
        </div>
      </section>

      {/* Conceitos */}
      <section className="mt-6 bg-sagb-panel rounded-2xl border border-sagb-line p-6">
        <h2 className="text-[12px] font-bold text-sagb-text mb-4">Conceitos Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conceitos.map((item) => (
            <div key={item.nome} className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4">
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{item.nome}</p>
              <p className="text-sagb-text text-[12px] mt-1">{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mt-6 bg-sagb-panel rounded-2xl border border-sagb-line p-6">
        <h2 className="text-[12px] font-bold text-sagb-text mb-4">Roadmap</h2>
        <div className="space-y-3">
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4 flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-[10px] font-black">1</span>
            <div>
              <p className="text-sagb-text text-[12px] font-semibold">Validar domínio</p>
              <p className="text-sagb-muted text-[10px]">Alinhar conceitos e casos de uso com stakeholders</p>
            </div>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4 flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/50 text-sagb-text text-[10px] font-black">2</span>
            <div>
              <p className="text-sagb-text text-[12px] font-semibold">Modelar dados e contratos</p>
              <p className="text-sagb-muted text-[10px]">Schema de workflow, step, trigger, contexto, rastro</p>
            </div>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4 flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/50 text-sagb-text text-[10px] font-black">3</span>
            <div>
              <p className="text-sagb-text text-[12px] font-semibold">Implementar executor</p>
              <p className="text-sagb-muted text-[10px]">Engine sequencial com steps, contexto e rastro</p>
            </div>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4 flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/50 text-sagb-text text-[10px] font-black">4</span>
            <div>
              <p className="text-sagb-text text-[12px] font-semibold">Interface visual</p>
              <p className="text-sagb-muted text-[10px]">Editor e visualizador de execução</p>
            </div>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4 flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/50 text-sagb-text text-[10px] font-black">5</span>
            <div>
              <p className="text-sagb-text text-[12px] font-semibold">Integrações</p>
              <p className="text-sagb-muted text-[10px]">Hub, API SagB, Bridge, MCP</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { FluxobPage };
export default FluxobPage;
