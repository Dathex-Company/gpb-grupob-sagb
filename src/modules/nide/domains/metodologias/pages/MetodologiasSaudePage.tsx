import React from 'react';
import { IndicadoresNucleo } from '../services';

interface MetodologiasSaudePageProps {
  indicadores: IndicadoresNucleo | null;
  onVoltar: () => void;
}

export const MetodologiasSaudePage: React.FC<MetodologiasSaudePageProps> = ({
  indicadores,
  onVoltar
}) => {
  if (!indicadores) {
    return (
      <div className="p-8 flex items-center justify-center text-sagb-muted">
        Carregando painel de métricas...
      </div>
    );
  }

  const { visaoGeral, cobertura, atencao, saude } = indicadores;

  const saudeCorBase = saude.status === 'Saudável'
    ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    : saude.status === 'Atenção'
    ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-500 bg-rose-500/10 border-rose-500/20';

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-sagb-text">Painel de métricas do núcleo</h1>
          <p className="text-[12px] text-sagb-muted mt-1">Visão rápida da qualidade, cobertura e continuidade das metodologias.</p>
        </div>
        <button
          type="button"
          onClick={onVoltar}
          className="px-4 py-2 rounded-lg bg-sagb-panel border border-sagb-line text-sagb-text text-[11px] font-black uppercase tracking-wide hover:bg-sagb-bg-2 transition self-start"
        >
          Voltar para início
        </button>
      </header>

      {/* Visão Saúde Geral */}
      <section className={`rounded-2xl border p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 ${saudeCorBase}`}>
        <div className="flex-1">
          <p className="text-[11px] font-semibold opacity-80">Índice geral</p>
          <div className="flex items-end gap-3 mt-1">
            <h2 className="text-4xl font-black">{saude.status}</h2>
            <p className="text-lg font-bold opacity-90 mb-1">({saude.pontuacao}/100)</p>
          </div>
          <p className="text-[12px] mt-2 opacity-80">
            O índice considera cobertura de conteúdo, cópias de segurança, governança e conexões entre metodologias.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Maturidade e Visão Geral */}
        <section className="space-y-4 xl:col-span-1">
          <h3 className="text-[12px] font-semibold text-sagb-text">Resumo do núcleo</h3>
          <div className="grid grid-cols-2 gap-3">
            <article className="rounded-xl border border-sagb-line bg-sagb-panel p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-sagb-muted">Documentos recebidos</p>
              <p className="text-xl font-black text-sagb-text mt-1">{visaoGeral.totalEntradasBrutas}</p>
            </article>
            <article className="rounded-xl border border-sagb-line bg-sagb-panel p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-sagb-muted">Rascunhos em andamento</p>
              <p className="text-xl font-black text-sagb-text mt-1">{visaoGeral.totalEmEstruturacao}</p>
            </article>
            <article className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-indigo-500">Oficiais</p>
              <p className="text-xl font-black text-indigo-500 mt-1">{visaoGeral.totalCanonicos}</p>
            </article>
            <article className="rounded-xl border border-sagb-line bg-sagb-panel p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-sagb-muted">Atualizadas em 30d</p>
              <p className="text-xl font-black text-sagb-text mt-1">{visaoGeral.totalComManutencaoRecente}</p>
            </article>
          </div>
        </section>

        {/* Cobertura */}
        <section className="space-y-4 xl:col-span-1">
          <h3 className="text-[12px] font-semibold text-sagb-text">Cobertura das oficiais</h3>
          <div className="rounded-2xl border border-sagb-line bg-sagb-panel p-1 overflow-hidden">
            <div className="space-y-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-sagb-bg-2">
                <span className="text-[12px] font-semibold text-sagb-text">Corpo Estruturado</span>
                <span className="text-[12px] font-black text-sagb-text">{cobertura.percentualCorpoEstruturado.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sagb-bg-2">
                <span className="text-[12px] font-semibold text-sagb-text">Cópias de segurança válidas</span>
                <span className="text-[12px] font-black text-sagb-text">{cobertura.percentualSnapshotIntegro.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sagb-bg-2">
                <span className="text-[12px] font-semibold text-sagb-text">Relações Conectadas</span>
                <span className="text-[12px] font-black text-sagb-text">{cobertura.percentualRelacoes.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sagb-bg-2">
                <span className="text-[12px] font-semibold text-sagb-text">Governança estabelecida</span>
                <span className="text-[12px] font-black text-sagb-text">{cobertura.percentualGovernanca.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sagb-bg-2">
                <span className="text-[12px] font-semibold text-sagb-text">Definição & Objetivo</span>
                <span className="text-[12px] font-black text-sagb-text">{cobertura.percentualDefinicaoObjetivo.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Atenção */}
        <section className="space-y-4 xl:col-span-1">
          <h3 className="text-[12px] font-semibold text-rose-500">Pontos de atenção</h3>
          <div className="grid grid-cols-1 gap-3">
            <article className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-bold text-rose-500">Oficiais sem conteúdo</p>
                <p className="text-[10px] text-rose-500/70 mt-0.5">Sem blocos internos</p>
              </div>
              <p className="text-lg font-black text-rose-500">{atencao.semBlocos}</p>
            </article>
            <article className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-bold text-rose-500">Oficiais isoladas</p>
                <p className="text-[10px] text-rose-500/70 mt-0.5">Sem relações registradas</p>
              </div>
              <p className="text-lg font-black text-rose-500">{atencao.semRelacoes}</p>
            </article>
            <article className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-bold text-amber-500">Oficiais sem cópia de segurança</p>
                <p className="text-[10px] text-amber-500/70 mt-0.5">Sem integridade de versão</p>
              </div>
              <p className="text-lg font-black text-amber-500">{atencao.semSnapshot}</p>
            </article>
            <article className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-bold text-amber-500">Rascunhos parados</p>
                <p className="text-[10px] text-amber-500/70 mt-0.5">{'Mais de 30d sem manutenção'}</p>
              </div>
              <p className="text-lg font-black text-amber-500">{atencao.estruturacaoTravada}</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
};
