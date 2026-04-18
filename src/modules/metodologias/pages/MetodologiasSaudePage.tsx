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
      <div className="p-8 flex items-center justify-center text-slate-500">
        Carregando leitura executiva do núcleo...
      </div>
    );
  }

  const { visaoGeral, cobertura, atencao, saude } = indicadores;

  const saudeCorBase = saude.status === 'Saudável' 
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
    : saude.status === 'Atenção' 
    ? 'text-amber-700 bg-amber-50 border-amber-200' 
    : 'text-rose-700 bg-rose-50 border-rose-200';

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Saúde e Cobertura do Núcleo</h1>
          <p className="text-sm text-slate-500 mt-1">Leitura executiva de maturidade e integridade metodológica.</p>
        </div>
        <button
          type="button"
          onClick={onVoltar}
          className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-wide hover:bg-slate-50 transition self-start"
        >
          Voltar para Home
        </button>
      </header>

      {/* Visão Saúde Geral */}
      <section className={`rounded-2xl border p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 ${saudeCorBase}`}>
        <div className="flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] opacity-80">Índice de Saúde Global</p>
          <div className="flex items-end gap-3 mt-1">
            <h2 className="text-4xl font-black">{saude.status}</h2>
            <p className="text-lg font-bold opacity-90 mb-1">({saude.pontuacao}/100)</p>
          </div>
          <p className="text-sm mt-2 opacity-80">
            A saúde é calculada com base na cobertura estrutural, integridade de snapshots, governança mínima e conexões entre ativos canônicos.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Maturidade e Visão Geral */}
        <section className="space-y-4 xl:col-span-1">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Maturidade & Escopo</h3>
          <div className="grid grid-cols-2 gap-3">
            <article className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Entradas Brutas</p>
              <p className="text-xl font-black text-slate-900 mt-1">{visaoGeral.totalEntradasBrutas}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Em Estruturação</p>
              <p className="text-xl font-black text-slate-900 mt-1">{visaoGeral.totalEmEstruturacao}</p>
            </article>
            <article className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-indigo-700">Canônicos</p>
              <p className="text-xl font-black text-indigo-900 mt-1">{visaoGeral.totalCanonicos}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Com Manutenção 30d</p>
              <p className="text-xl font-black text-slate-900 mt-1">{visaoGeral.totalComManutencaoRecente}</p>
            </article>
          </div>
        </section>

        {/* Cobertura */}
        <section className="space-y-4 xl:col-span-1">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Cobertura Canônica</h3>
          <div className="rounded-2xl border border-slate-200 bg-white p-1 overflow-hidden">
            <div className="space-y-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">Corpo Estruturado</span>
                <span className="text-xs font-black text-slate-900">{cobertura.percentualCorpoEstruturado.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">Snapshots Íntegros</span>
                <span className="text-xs font-black text-slate-900">{cobertura.percentualSnapshotIntegro.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">Relações Conectadas</span>
                <span className="text-xs font-black text-slate-900">{cobertura.percentualRelacoes.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">Governança Estabelecida</span>
                <span className="text-xs font-black text-slate-900">{cobertura.percentualGovernanca.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">Definição & Objetivo</span>
                <span className="text-xs font-black text-slate-900">{cobertura.percentualDefinicaoObjetivo.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Atenção */}
        <section className="space-y-4 xl:col-span-1">
          <h3 className="text-sm font-black uppercase tracking-wide text-rose-700">Pontos de Atenção</h3>
          <div className="grid grid-cols-1 gap-3">
            <article className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-rose-900">Canônicos sem corpo</p>
                <p className="text-[10px] text-rose-700/80 mt-0.5">Sem blocos internos</p>
              </div>
              <p className="text-lg font-black text-rose-900">{atencao.semBlocos}</p>
            </article>
            <article className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-rose-900">Canônicos isolados</p>
                <p className="text-[10px] text-rose-700/80 mt-0.5">Sem relações registradas</p>
              </div>
              <p className="text-lg font-black text-rose-900">{atencao.semRelacoes}</p>
            </article>
            <article className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900">Canônicos sem snapshot</p>
                <p className="text-[10px] text-amber-700/80 mt-0.5">Sem integridade de versão</p>
              </div>
              <p className="text-lg font-black text-amber-900">{atencao.semSnapshot}</p>
            </article>
            <article className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900">Estruturação parada</p>
                <p className="text-[10px] text-amber-700/80 mt-0.5">{'Mais de 30d sem manutenção'}</p>
              </div>
              <p className="text-lg font-black text-amber-900">{atencao.estruturacaoTravada}</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
};
