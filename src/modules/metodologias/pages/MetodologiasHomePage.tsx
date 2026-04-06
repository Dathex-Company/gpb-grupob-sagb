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
  onAbrirAtivo
}) => {
  return (
    <div className="space-y-6">
      <header className="rounded-[28px] border border-white/80 bg-slate-950 text-white shadow-[0_25px_70px_rgba(15,23,42,0.24)] overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.18),_transparent_42%)]" />
        <div className="relative px-7 md:px-9 py-8 space-y-4">
          <span className="inline-flex px-3 py-1 rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-300 text-[10px] font-black uppercase tracking-[0.22em]">
            Cockpit do Núcleo
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{titulo}</h1>
            <p className="text-cyan-200 mt-1 text-base font-semibold">{subtitulo}</p>
          </div>
          <p className="max-w-3xl text-slate-300 leading-relaxed text-sm">{descricao}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onIrMesa}
              className="px-3.5 py-2 rounded-lg bg-cyan-400/20 border border-cyan-300/30 text-cyan-100 text-[11px] font-black uppercase tracking-wide hover:bg-cyan-400/30 transition"
            >
              Ir para mesa
            </button>
            <button
              type="button"
              onClick={onIrCatalogo}
              className="px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 text-slate-100 text-[11px] font-black uppercase tracking-wide hover:bg-white/10 transition"
            >
              Ir para catálogo
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">Ativos no núcleo</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{totalAtivos}</p>
          <p className="text-xs text-emerald-900/80 mt-1">Base metodológica total disponível no módulo.</p>
        </article>

        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-700">Entradas brutas</p>
          <p className="text-2xl font-black text-amber-900 mt-1">{totalEntradasBrutas}</p>
          <p className="text-xs text-amber-900/80 mt-1">Insumos em estado inicial para a mesa de estruturação.</p>
        </article>

        <article className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-indigo-700">Ativos oficiais</p>
          <p className="text-2xl font-black text-indigo-900 mt-1">{totalAtivosOficiais}</p>
          <p className="text-xs text-indigo-900/80 mt-1">Ativos com status editorial oficial no catálogo canônico.</p>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-700">Últimos movimentos</h2>
            <button
              type="button"
              onClick={onIrCatalogo}
              className="text-[11px] font-bold text-cyan-700 hover:text-cyan-600"
            >
              Ver ativos
            </button>
          </div>

          <div className="space-y-2">
            {ultimosMovimentos.length === 0 ? (
              <p className="text-xs text-slate-500">Sem movimentos recentes registrados.</p>
            ) : (
              ultimosMovimentos.map((movimento) => (
                <div key={movimento.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-500">{movimento.data}</p>
                  <p className="text-xs font-bold text-slate-900 mt-1">{movimento.titulo}</p>
                  <p className="text-xs text-slate-600 mt-1">{movimento.descricao}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-700">Entradas brutas recentes</h2>
            <button type="button" onClick={onIrMesa} className="text-[11px] font-bold text-amber-700 hover:text-amber-600">
              Ir para mesa
            </button>
          </div>
          <div className="space-y-2">
            {ultimasEntradas.map((entrada) => (
              <div key={entrada.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-900">{entrada.titulo}</p>
                <p className="text-[11px] text-slate-500 mt-1">{entrada.origem}</p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{entrada.conteudo_bruto}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 xl:col-span-1">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-700">Ativos oficiais recentes</h2>
          <div className="space-y-2">
            {ativosOficiaisRecentes.map((ativo) => (
              <button
                key={ativo.id}
                type="button"
                onClick={() => onAbrirAtivo(ativo.slug)}
                className="w-full text-left rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 transition"
              >
                <p className="text-xs font-black text-slate-900">{ativo.nome}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-slate-600 border border-slate-200">
                    {getTipoDeAtivoLabel(ativo.tipo_de_ativo)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-[10px] font-bold text-cyan-700 border border-cyan-100">
                    {getStatusEditorialLabel(ativo.status_editorial)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-[10px] font-bold text-indigo-700 border border-indigo-100">
                    {getMaturidadePraticaLabel(ativo.maturidade_pratica)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
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
