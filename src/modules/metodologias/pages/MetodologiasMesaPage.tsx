import React from 'react';
import type {
  AtivoEmEstruturacao,
  AtivoMetodologicoEstadoGovernanca,
  ConversaoAssistidaResultado,
  EntradaMetodologicaBruta,
  EntradaMetodologicaTipoDeEntrada,
  EstruturacaoAssistidaLeitura,
  EstruturacaoAssistidaPergunta
} from '../types';
import {
  getLeituraVisualEstruturacaoLabel,
  getStatusConversaoAssistidaLabel,
  getStatusEstruturacaoLabel,
  getTipoDeAtivoLabel,
  getTipoEntradaBrutaLabel
} from '../services';

interface MetodologiasMesaPageProps {
  entradasBrutasLocal: EntradaMetodologicaBruta[];
  entradaSelecionada: EntradaMetodologicaBruta | null;
  leituraAssistida: EstruturacaoAssistidaLeitura | null;
  perguntasEstruturacao: EstruturacaoAssistidaPergunta[];
  conversaoAssistida: ConversaoAssistidaResultado | null;
  ativoEmEstruturacaoLocal: AtivoEmEstruturacao | null;
  totalBrutas: number;
  totalEmEstruturacao: number;
  totalConsolidados: number;
  novoTitulo: string;
  novoTipoEntrada: EntradaMetodologicaTipoDeEntrada;
  novaOrigem: string;
  novoConteudoBruto: string;
  tiposEntradaDisponiveis: EntradaMetodologicaTipoDeEntrada[];
  onNovoTituloChange: (value: string) => void;
  onNovoTipoEntradaChange: (value: EntradaMetodologicaTipoDeEntrada) => void;
  onNovaOrigemChange: (value: string) => void;
  onNovoConteudoBrutoChange: (value: string) => void;
  onRegistrarEntradaBruta: (event: React.FormEvent<HTMLFormElement>) => void;
  onSelecionarEntrada: (entradaId: string) => void;
  onDefinirModoConversao: (modo: 'preview' | 'ativo_em_estruturacao' | 'ativo_base_gerado') => void;
  modoConversao: 'preview' | 'ativo_em_estruturacao' | 'ativo_base_gerado';
  onAbrirEdicaoGuiada: () => void;
}

export const MetodologiasMesaPage: React.FC<MetodologiasMesaPageProps> = ({
  entradasBrutasLocal,
  entradaSelecionada,
  leituraAssistida,
  perguntasEstruturacao,
  conversaoAssistida,
  ativoEmEstruturacaoLocal,
  totalBrutas,
  totalEmEstruturacao,
  totalConsolidados,
  novoTitulo,
  novoTipoEntrada,
  novaOrigem,
  novoConteudoBruto,
  tiposEntradaDisponiveis,
  onNovoTituloChange,
  onNovoTipoEntradaChange,
  onNovaOrigemChange,
  onNovoConteudoBrutoChange,
  onRegistrarEntradaBruta,
  onSelecionarEntrada,
  onDefinirModoConversao,
  modoConversao,
  onAbrirEdicaoGuiada
}) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mesa de Estruturação Assistida</h2>
          <p className="text-slate-500 text-sm">
            Bancada de trabalho para entrada bruta, leitura assistida, conversão e preparação de ativo em estruturação.
          </p>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Frente dedicada</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-700">Material cru</p>
          <p className="text-2xl font-black text-amber-900 mt-1">{totalBrutas}</p>
          <p className="text-xs text-amber-900/80 mt-1">Entradas ainda em estado bruto aguardando leitura.</p>
        </article>

        <article className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-cyan-700">Em estruturação</p>
          <p className="text-2xl font-black text-cyan-900 mt-1">{totalEmEstruturacao}</p>
          <p className="text-xs text-cyan-900/80 mt-1">Itens com lapidação metodológica em andamento.</p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">Consolidados</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{totalConsolidados}</p>
          <p className="text-xs text-emerald-900/80 mt-1">Ativos já consolidados no catálogo canônico.</p>
        </article>
      </div>

      <form onSubmit={onRegistrarEntradaBruta} className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 space-y-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Entrada bruta</p>
          <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">Registrar novo insumo</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Título</span>
            <input
              value={novoTitulo}
              onChange={(event) => onNovoTituloChange(event.target.value)}
              placeholder="Ex.: Rascunho de framework de validação"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-cyan-300"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Tipo de entrada</span>
            <select
              value={novoTipoEntrada}
              onChange={(event) => onNovoTipoEntradaChange(event.target.value as EntradaMetodologicaTipoDeEntrada)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-cyan-300"
            >
              {tiposEntradaDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {getTipoEntradaBrutaLabel(tipo)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Origem</span>
          <input
            value={novaOrigem}
            onChange={(event) => onNovaOrigemChange(event.target.value)}
            placeholder="Ex.: anotação interna, resumo de PDF, bloco conceitual"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-cyan-300"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Conteúdo bruto</span>
          <textarea
            value={novoConteudoBruto}
            onChange={(event) => onNovoConteudoBrutoChange(event.target.value)}
            rows={4}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-cyan-300 resize-y"
          />
        </label>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Entrada persistida para continuidade real da estruturação.</p>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-wide hover:bg-slate-800 transition"
          >
            Registrar entrada bruta
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-5">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 space-y-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Fila de estruturação</p>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">Entradas recebidas</h3>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
            {entradasBrutasLocal.map((entrada) => {
              const selecionada = entrada.id === entradaSelecionada?.id;
              return (
                <button
                  key={entrada.id}
                  type="button"
                  onClick={() => onSelecionarEntrada(entrada.id)}
                  className={`w-full text-left rounded-xl border p-3 transition ${
                    selecionada
                      ? 'border-cyan-200 bg-cyan-50/70 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-700">
                      {getTipoEntradaBrutaLabel(entrada.tipo_de_entrada)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide bg-cyan-100 text-cyan-800">
                      {getStatusEstruturacaoLabel(entrada.status_de_estruturacao)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{entrada.titulo}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{entrada.conteudo_bruto}</p>
                </button>
              );
            })}
          </div>
        </article>

        {entradaSelecionada && leituraAssistida && (
          <article className="rounded-2xl border border-cyan-100 bg-cyan-50/35 p-4 md:p-5 space-y-4">
            <header className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-800">Leitura assistida</p>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Interpretação inicial do insumo</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Orientação estruturante para converter material cru em ativo.</p>
            </header>

            <div className="rounded-xl border border-cyan-200 bg-white p-4 space-y-3">
              <p className="text-sm font-black text-slate-900">{entradaSelecionada.titulo}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{entradaSelecionada.conteudo_bruto}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p className="text-xs text-slate-600"><strong>O que parece ser:</strong> {leituraAssistida.o_que_parece_ser}</p>
                <p className="text-xs text-slate-600">
                  <strong>Tipo provável:</strong>{' '}
                  {leituraAssistida.tipo_mais_provavel === 'indefinido'
                    ? 'Ainda indefinido'
                    : getTipoDeAtivoLabel(leituraAssistida.tipo_mais_provavel)}
                </p>
                <p className="text-xs text-slate-600"><strong>Essência:</strong> {leituraAssistida.essencia}</p>
                <p className="text-xs text-slate-600"><strong>Objetivo:</strong> {leituraAssistida.objetivo}</p>
              </div>
            </div>

            <article className="rounded-xl border border-slate-200 bg-white p-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-700">Perguntas de estruturação</h4>
              <ul className="mt-2 space-y-2">
                {perguntasEstruturacao.map((pergunta) => (
                  <li key={pergunta.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="text-xs font-bold text-slate-800">{pergunta.titulo}</p>
                    <p className="text-xs text-slate-600 mt-1">{pergunta.descricao}</p>
                  </li>
                ))}
              </ul>
            </article>

            {conversaoAssistida && (
              <article className="rounded-xl border border-violet-200 bg-violet-50/50 p-3 md:p-4 space-y-4">
                <header className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-800">Conversão assistida</p>
                  <h4 className="text-base font-black text-slate-900 tracking-tight">Entrada bruta → ativo em estruturação</h4>
                </header>

                <div className="flex flex-wrap gap-2">
                  {(['preview', 'ativo_em_estruturacao', 'ativo_base_gerado'] as const).map((modo) => (
                    <button
                      key={modo}
                      type="button"
                      onClick={() => onDefinirModoConversao(modo)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide border transition ${
                        modoConversao === modo
                          ? 'bg-violet-100 text-violet-800 border-violet-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {modo === 'preview'
                        ? 'Gerar preview'
                        : modo === 'ativo_em_estruturacao'
                        ? 'Ativo em estruturação'
                        : 'Ativo-base'}
                    </button>
                  ))}
                </div>

                <article className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-600">Preview do resultado</p>
                  <p className="text-xs text-slate-700"><strong>Nome:</strong> {conversaoAssistida.ativo_preview.nome}</p>
                  <p className="text-xs text-slate-700"><strong>Tipo:</strong> {getTipoDeAtivoLabel(conversaoAssistida.ativo_preview.tipo_de_ativo)}</p>
                  <p className="text-xs text-slate-700"><strong>Status:</strong> {getStatusConversaoAssistidaLabel(conversaoAssistida.status_resultado)}</p>
                  {ativoEmEstruturacaoLocal && (
                    <p className="text-xs text-slate-700">
                      <strong>Leitura visual:</strong>{' '}
                      {getLeituraVisualEstruturacaoLabel(
                        ativoEmEstruturacaoLocal.governanca.estado === ('em_revisao' as AtivoMetodologicoEstadoGovernanca)
                          ? 'pronto_para_revisao_manual'
                          : 'base_minima_preenchida'
                      )}
                    </p>
                  )}
                </article>

                <button
                  type="button"
                  onClick={onAbrirEdicaoGuiada}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-wide hover:bg-slate-800 transition"
                >
                  Abrir edição guiada do ativo
                </button>
              </article>
            )}
          </article>
        )}
      </div>
    </section>
  );
};
