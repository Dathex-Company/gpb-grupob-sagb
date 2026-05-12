import React from 'react';
import type { EntradaMetodologicaBruta, Metodologia } from '../types';
import {
  getEstadoGovernancaLabel,
  getMaturidadePraticaLabel,
  getStatusEditorialLabel,
  getTipoDeAtivoLabel
} from '../services';

interface MetodologiasHomePageProps {
  titulo: string;
  subtitulo: string;
  descricao: string;
  totalAtivos: number;
  totalEntradasBrutas: number;
  totalAtivosOficiais: number;
  ultimasEntradas: EntradaMetodologicaBruta[];
  ativosOficiaisRecentes: Metodologia[];
  ultimosMovimentos: Array<{ id: string; data: string; titulo: string; descricao: string }>;
  onIrMesa: () => void;
  onIrCatalogo: () => void;
  onIrSaude: () => void;
  onAbrirAtivo: (slug: string) => void;
}

export const MetodologiasHomePage: React.FC<MetodologiasHomePageProps> = ({
  titulo,
  subtitulo,
  descricao,
  totalAtivos,
  totalEntradasBrutas,
  totalAtivosOficiais,
  ultimasEntradas,
  ativosOficiaisRecentes,
  ultimosMovimentos,
  onIrMesa,
  onIrCatalogo,
  onIrSaude,
  onAbrirAtivo
}) => {
  return (
    <div className="space-y-6">
      {/* Header com gradiente canônico */}
      <header className="rounded-[28px] bg-gradient-to-br from-sagb-blue to-indigo-700 text-white overflow-hidden relative shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_50%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_50%)]" />
        <div className="relative px-7 md:px-9 py-8 space-y-4">
          <span className="inline-flex px-3 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-semibold border border-white/20">
            Painel principal
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{titulo}</h1>
            <p className="text-white/70 mt-1 text-base font-semibold">{subtitulo}</p>
          </div>
          <p className="max-w-3xl text-white/60 leading-relaxed text-[12px]">{descricao}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onIrMesa}
              className="px-3.5 py-2 rounded-lg bg-white/15 border border-white/20 text-white/80 text-[11px] font-black uppercase tracking-wide hover:bg-white/25 transition"
            >
              Ir para mesa
            </button>
            <button
              type="button"
              onClick={onIrCatalogo}
              className="px-3.5 py-2 rounded-lg bg-white/10 border border-white/15 text-white/70 text-[11px] font-black uppercase tracking-wide hover:bg-white/20 transition"
            >
              Ir para catálogo
            </button>
            <button
              type="button"
              onClick={onIrSaude}
              className="px-3.5 py-2 rounded-lg bg-emerald-400/20 border border-emerald-300/25 text-emerald-200 text-[11px] font-black uppercase tracking-wide hover:bg-emerald-400/30 transition"
            >
              Ver métricas
            </button>
          </div>
        </div>
      </header>

      {/* Indicadores com badges semânticas canônicas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <article className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs font-semibold text-emerald-500">Metodologias no núcleo</p>
          <p className="text-2xl font-black text-emerald-500 mt-1">{totalAtivos}</p>
          <p className="text-[12px] text-emerald-500/70 mt-1">Base metodológica total disponível no módulo.</p>
        </article>

        <article className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-xs font-semibold text-amber-500">Documentos recebidos</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{totalEntradasBrutas}</p>
          <p className="text-[12px] text-amber-500/70 mt-1">Insumos em estado inicial para a mesa de estruturação.</p>
        </article>

        <article className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
          <p className="text-xs font-semibold text-indigo-500">Metodologias oficiais</p>
          <p className="text-2xl font-black text-indigo-500 mt-1">{totalAtivosOficiais}</p>
          <p className="text-[12px] text-indigo-500/70 mt-1">Ativos com status editorial oficial no catálogo canônico.</p>
        </article>
      </section>

      {/* Cards de conteúdo com tokens */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 space-y-3 xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-black uppercase tracking-wide text-sagb-text">Últimos movimentos</h2>
            <button
              type="button"
              onClick={onIrCatalogo}
              className="text-[11px] font-semibold text-sagb-blue hover:text-sagb-blue/80"
            >
              Ver ativos
            </button>
          </div>

          <div className="space-y-2">
            {ultimosMovimentos.length === 0 ? (
              <p className="text-[12px] text-sagb-muted">Sem movimentos recentes registrados.</p>
            ) : (
              ultimosMovimentos.map((movimento) => (
                <div key={movimento.id} className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3">
                  <p className="text-[11px] text-sagb-muted">{movimento.data}</p>
                  <p className="text-[12px] font-bold text-sagb-text mt-1">{movimento.titulo}</p>
                  <p className="text-[12px] text-sagb-muted mt-1">{movimento.descricao}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 space-y-3 xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-black uppercase tracking-wide text-sagb-text">Entradas brutas recentes</h2>
            <button type="button" onClick={onIrMesa} className="text-[11px] font-semibold text-amber-500 hover:text-amber-500/80">
              Ir para mesa
            </button>
          </div>
          <div className="space-y-2">
            {ultimasEntradas.map((entrada) => (
              <div key={entrada.id} className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3">
                <p className="text-[12px] font-bold text-sagb-text">{entrada.titulo}</p>
                <p className="text-[11px] text-sagb-muted mt-1">{entrada.origem}</p>
                <p className="text-[12px] text-sagb-muted mt-1 line-clamp-2">{entrada.conteudo_bruto}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 space-y-3 xl:col-span-1">
          <h2 className="text-[12px] font-black uppercase tracking-wide text-sagb-text">Ativos oficiais recentes</h2>
          <div className="space-y-2">
            {ativosOficiaisRecentes.map((ativo) => (
              <button
                key={ativo.id}
                type="button"
                onClick={() => onAbrirAtivo(ativo.slug)}
                className="w-full text-left rounded-xl border border-sagb-line bg-sagb-bg-2 p-3 hover:bg-sagb-panel transition"
              >
                <p className="text-[12px] font-black text-sagb-text">{ativo.nome}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-sagb-panel text-[10px] font-bold text-sagb-muted border border-sagb-line">
                    {getTipoDeAtivoLabel(ativo.tipo_de_ativo)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-[10px] font-bold text-cyan-500 border border-cyan-500/20">
                    {getStatusEditorialLabel(ativo.status_editorial)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-[10px] font-bold text-indigo-500 border border-indigo-500/20">
                    {getMaturidadePraticaLabel(ativo.maturidade_pratica)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                    {getEstadoGovernancaLabel(ativo.governanca.estado_ciclo_vida)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};
