import React from 'react';
import { BookIcon, CodeIcon, ArrowRightIcon } from '../../../../components/Icon';
import { sagbBridgeManifest } from '../manifest';

interface EtapaItem {
  id: string;
  titulo: string;
  status: 'concluida' | 'pendente';
}

const etapas: EtapaItem[] = [
  { id: 'ET-01', titulo: 'Definir arquitetura e contratos da ponte SagB x VS Code', status: 'concluida' },
  { id: 'ET-02', titulo: 'Criar extensão VS Code base', status: 'pendente' },
  { id: 'ET-03', titulo: 'Implementar deep link, pending launch e operação de runs', status: 'pendente' },
  { id: 'ET-04', titulo: 'Criar backend mínimo e Sala dos Programadores', status: 'pendente' }
];

const statusBadge = (status: EtapaItem['status']) => {
  const isDone = status === 'concluida';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        isDone
          ? 'bg-green-500/10 text-green-600 border border-green-500/20'
          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isDone ? 'bg-green-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
};

const SagbBridgePage: React.FC = () => {
  return (
    <div className="flex-1 p-10 bg-sagb-bg text-sagb-text font-inter min-h-full">
      {/* Header canônico */}
      <header className="mb-10 flex justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sagb-blue/10 text-sagb-blue border border-sagb-blue/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
              <CodeIcon className="w-3 h-3" />
              Módulo Oficial
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            SagB Bridge
          </h1>
          <p className="text-sagb-muted mt-2 text-[12px] max-w-2xl">
            Ponte oficial entre o SagB e o VS Code. Abra tasks do SagB diretamente no VS Code
            com resolução de projeto local, task runs, sincronização de status e relatório final.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-black text-sagb-muted uppercase tracking-widest mb-1">
            Módulo Oficial
          </div>
          <div className="text-lg font-bold text-sagb-text">
            SagB Bridge
          </div>
          <div className="mt-2 text-[12px] text-sagb-muted">
            Responsável:{' '}
            <span className="font-semibold text-sagb-text">
              {sagbBridgeManifest.owner?.displayName || 'A definir'}
            </span>
          </div>
          <div className="mt-3 flex gap-2 justify-end">
            <button
              onClick={() => window.open('/sagb_bridge/sala-programadores', '_self')}
              className="inline-flex items-center gap-2 rounded-xl bg-sagb-blue text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider transition hover:bg-sagb-blue-2"
            >
              <BookIcon className="w-3.5 h-3.5" />
              Sala dos Programadores
            </button>
          </div>
        </div>
      </header>

      {/* Stats cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Status</p>
          <p className="mt-2 text-lg font-black text-sagb-text">Ativo</p>
          <p className="text-sagb-muted text-[10px] mt-1">Blueprint canônico definido</p>
        </div>
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Etapas</p>
          <p className="mt-2 text-lg font-black text-sagb-text">1 / 4</p>
          <p className="text-sagb-muted text-[10px] mt-1">ET-01 concluída</p>
        </div>
        <div className="bg-sagb-panel rounded-2xl border border-sagb-line p-5">
          <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Próximo</p>
          <p className="mt-2 text-lg font-black text-sagb-text">ET-02</p>
          <p className="text-sagb-muted text-[10px] mt-1">Criar extensão VS Code</p>
        </div>
      </section>

      {/* Assets existentes */}
      <section className="mt-6 bg-sagb-panel rounded-2xl border border-sagb-line p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[12px] font-bold text-sagb-text">Assets Existentes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4">
            <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Blueprint</p>
            <p className="text-sagb-text text-[12px] mt-1 font-semibold">sagbBridgeBlueprint.ts</p>
            <p className="text-sagb-muted text-[10px] mt-0.5">Tipos, cards, endpoints, riscos, sprints</p>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4">
            <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">View</p>
            <p className="text-sagb-text text-[12px] mt-1 font-semibold">ProgrammersRoomView.tsx</p>
            <p className="text-sagb-muted text-[10px] mt-0.5">Sala dos Programadores (5 seções)</p>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4">
            <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Migration</p>
            <p className="text-sagb-text text-[12px] mt-1 font-semibold">20260313000103</p>
            <p className="text-sagb-muted text-[10px] mt-0.5">5 tabelas: dev_projects, dev_tasks, dev_task_runs, dev_developer_sessions, dev_task_launches</p>
          </div>
          <div className="bg-sagb-bg-2 rounded-xl border border-sagb-line p-4">
            <p className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Documentação</p>
            <p className="text-sagb-text text-[12px] mt-1 font-semibold">13-sagb-bridge.md</p>
            <p className="text-sagb-muted text-[10px] mt-0.5">Mapa modular</p>
          </div>
        </div>
      </section>

      {/* Trilha de Evolução */}
      <section className="mt-6 bg-sagb-panel rounded-2xl border border-sagb-line p-6">
        <h2 className="text-[12px] font-bold text-sagb-text mb-4">Trilha de Evolução</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {etapas.map((etapa) => (
            <div
              key={etapa.id}
              className={`rounded-xl border p-4 transition ${
                etapa.status === 'concluida'
                  ? 'bg-sagb-bg-2 border-sagb-line'
                  : 'bg-sagb-bg-2 border-sagb-line opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-sagb-blue uppercase tracking-widest">
                  {etapa.id}
                </span>
                {statusBadge(etapa.status)}
              </div>
              <p className="text-sagb-text text-[12px] font-semibold">{etapa.titulo}</p>
              {etapa.status === 'concluida' && (
                <p className="text-sagb-muted text-[10px] mt-1">
                  Contratos de API validados, blueprint canônico aprovado
                </p>
              )}
              {etapa.status === 'pendente' && (
                <p className="text-sagb-muted text-[10px] mt-1">
                  Pendente — aguardando implementação
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SagbBridgePage;
