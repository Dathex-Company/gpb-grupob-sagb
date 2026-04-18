import React from 'react';
import type {
  AtivoEmEstruturacao,
  AtivoMetodologicoEstadoGovernanca,
  ConversaoAssistidaResultado,
  EntradaMetodologicaBruta,
  EntradaMetodologicaTipoDeEntrada,
  EstruturacaoAssistidaLeitura,
  EstruturacaoAssistidaPergunta,
  MesaEstruturacaoAgrupamentoOperacional,
  MesaEstruturacaoFiltrosOperacionais,
  MesaEstruturacaoGrupoOperacional,
  MesaEstruturacaoIndicadoresOperacionais,
  MesaEstruturacaoItemOperacional,
  MesaEstruturacaoOrdenacaoOperacional
} from '../types';
import {
  getClassificacaoOperacionalMesaLabel,
  getLeituraVisualEstruturacaoLabel,
  getProntidaoOperacionalMesaLabel,
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
  indicadoresOperacionais: MesaEstruturacaoIndicadoresOperacionais;
  itensOperacionais: MesaEstruturacaoItemOperacional[];
  gruposOperacionais: MesaEstruturacaoGrupoOperacional[];
  filtrosOperacionais: MesaEstruturacaoFiltrosOperacionais;
  ordenacaoOperacional: MesaEstruturacaoOrdenacaoOperacional;
  agrupamentoOperacional: MesaEstruturacaoAgrupamentoOperacional;
  onAtualizarFiltrosOperacionais: (next: MesaEstruturacaoFiltrosOperacionais) => void;
  onAlterarOrdenacaoOperacional: (value: MesaEstruturacaoOrdenacaoOperacional) => void;
  onAlterarAgrupamentoOperacional: (value: MesaEstruturacaoAgrupamentoOperacional) => void;
  onLimparFiltrosOperacionais: () => void;
}

const BADGE_CLASSIFICACAO_STYLE: Record<MesaEstruturacaoItemOperacional['classificacao_operacional'], string> = {
  travado: 'bg-rose-100 text-rose-700 border-rose-200',
  em_andamento: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  quase_pronto: 'bg-amber-100 text-amber-700 border-amber-200',
  pronto_para_revisao: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  precisa_de_acao: 'bg-violet-100 text-violet-700 border-violet-200'
};

const BADGE_PRONTIDAO_STYLE: Record<MesaEstruturacaoItemOperacional['prontidao'], string> = {
  baixa: 'bg-slate-100 text-slate-700 border-slate-200',
  media: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  alta: 'bg-amber-100 text-amber-700 border-amber-200',
  revisao: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

const FILTER_BASE_CLASS =
  'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-cyan-300';

const ORDENACOES: Array<{ id: MesaEstruturacaoOrdenacaoOperacional; label: string }> = [
  { id: 'mais_recentes', label: 'Mais recentes' },
  { id: 'mais_antigos', label: 'Mais antigos' },
  { id: 'mais_proximos_promocao', label: 'Mais próximos de promoção' },
  { id: 'mais_incompletos', label: 'Mais incompletos' },
  { id: 'mais_parados', label: 'Mais parados' }
];

const AGRUPAMENTOS: Array<{ id: MesaEstruturacaoAgrupamentoOperacional; label: string }> = [
  { id: 'nenhum', label: 'Sem agrupamento' },
  { id: 'status', label: 'Por status' },
  { id: 'prontidao', label: 'Por prontidão' },
  { id: 'origem', label: 'Por origem' },
  { id: 'lacunas', label: 'Por lacunas' }
];

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
  onAbrirEdicaoGuiada,
  indicadoresOperacionais,
  itensOperacionais,
  gruposOperacionais,
  filtrosOperacionais,
  ordenacaoOperacional,
  agrupamentoOperacional,
  onAtualizarFiltrosOperacionais,
  onAlterarOrdenacaoOperacional,
  onAlterarAgrupamentoOperacional,
  onLimparFiltrosOperacionais
}) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mesa de Estruturação Assistida</h2>
          <p className="text-slate-500 text-sm">
            Bancada operacional para triagem, priorização e ação sobre entradas e ativos em estruturação.
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

      <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 space-y-4">
        <header>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Leitura operacional da mesa</p>
          <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">Visão executiva de gargalos e prontidão</h3>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2.5">
          <article className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Itens em estruturação</p>
            <p className="text-xl font-black text-slate-900 mt-1">{indicadoresOperacionais.total_itens_em_estruturacao}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">Quase prontos</p>
            <p className="text-xl font-black text-amber-900 mt-1">{indicadoresOperacionais.itens_quase_prontos}</p>
          </article>
          <article className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-700">Travados</p>
            <p className="text-xl font-black text-rose-900 mt-1">{indicadoresOperacionais.itens_travados}</p>
          </article>
          <article className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-700">Sem blocos</p>
            <p className="text-xl font-black text-indigo-900 mt-1">{indicadoresOperacionais.ativos_sem_blocos}</p>
          </article>
          <article className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-700">Sem relações</p>
            <p className="text-xl font-black text-violet-900 mt-1">{indicadoresOperacionais.ativos_sem_relacoes}</p>
          </article>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          <article className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Base mínima preenchida</p>
            <p className="text-sm font-black text-slate-800 mt-1">{indicadoresOperacionais.ativos_com_base_minima}</p>
          </article>
          <article className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Prontos para revisão</p>
            <p className="text-sm font-black text-slate-800 mt-1">{indicadoresOperacionais.ativos_prontos_para_revisao}</p>
          </article>
          <article className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Atividade recente</p>
            <p className="text-sm font-black text-slate-800 mt-1">{indicadoresOperacionais.itens_com_atividade_recente}</p>
          </article>
          <article className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Mais parados</p>
            <p className="text-sm font-black text-slate-800 mt-1">{indicadoresOperacionais.itens_parados}</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Bancada operacional</p>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">Filtros, ordenação e agrupamento</h3>
          </div>
          <button
            type="button"
            onClick={onLimparFiltrosOperacionais}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50"
          >
            Limpar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Status de estruturação</span>
            <select
              className={FILTER_BASE_CLASS}
              value={filtrosOperacionais.status_estruturacao}
              onChange={(event) =>
                onAtualizarFiltrosOperacionais({
                  ...filtrosOperacionais,
                  status_estruturacao: event.target.value as MesaEstruturacaoFiltrosOperacionais['status_estruturacao']
                })
              }
            >
              <option value="todos">Todos</option>
              <option value="bruto">Bruto</option>
              <option value="em_analise">Em análise</option>
              <option value="estruturado_parcialmente">Estruturado parcialmente</option>
              <option value="convertido_em_ativo">Convertido em ativo</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Tipo de entrada</span>
            <select
              className={FILTER_BASE_CLASS}
              value={filtrosOperacionais.tipo_entrada}
              onChange={(event) =>
                onAtualizarFiltrosOperacionais({
                  ...filtrosOperacionais,
                  tipo_entrada: event.target.value as MesaEstruturacaoFiltrosOperacionais['tipo_entrada']
                })
              }
            >
              <option value="todos">Todos</option>
              {tiposEntradaDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {getTipoEntradaBrutaLabel(tipo)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Prontidão</span>
            <select
              className={FILTER_BASE_CLASS}
              value={filtrosOperacionais.prontidao}
              onChange={(event) =>
                onAtualizarFiltrosOperacionais({
                  ...filtrosOperacionais,
                  prontidao: event.target.value as MesaEstruturacaoFiltrosOperacionais['prontidao']
                })
              }
            >
              <option value="todos">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="revisao">Em revisão</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Blocos</span>
            <select
              className={FILTER_BASE_CLASS}
              value={filtrosOperacionais.presenca_blocos}
              onChange={(event) =>
                onAtualizarFiltrosOperacionais({
                  ...filtrosOperacionais,
                  presenca_blocos: event.target.value as MesaEstruturacaoFiltrosOperacionais['presenca_blocos']
                })
              }
            >
              <option value="todos">Todos</option>
              <option value="com_blocos">Com blocos</option>
              <option value="sem_blocos">Sem blocos</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Relações</span>
            <select
              className={FILTER_BASE_CLASS}
              value={filtrosOperacionais.presenca_relacoes}
              onChange={(event) =>
                onAtualizarFiltrosOperacionais({
                  ...filtrosOperacionais,
                  presenca_relacoes: event.target.value as MesaEstruturacaoFiltrosOperacionais['presenca_relacoes']
                })
              }
            >
              <option value="todos">Todos</option>
              <option value="com_relacoes">Com relações</option>
              <option value="sem_relacoes">Sem relações</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Atividade</span>
            <select
              className={FILTER_BASE_CLASS}
              value={filtrosOperacionais.atividade}
              onChange={(event) =>
                onAtualizarFiltrosOperacionais({
                  ...filtrosOperacionais,
                  atividade: event.target.value as MesaEstruturacaoFiltrosOperacionais['atividade']
                })
              }
            >
              <option value="todos">Todos</option>
              <option value="recente">Atividade recente</option>
              <option value="parado">Mais parados</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Lacuna crítica</span>
            <select
              className={FILTER_BASE_CLASS}
              value={filtrosOperacionais.lacuna_critica}
              onChange={(event) =>
                onAtualizarFiltrosOperacionais({
                  ...filtrosOperacionais,
                  lacuna_critica: event.target.value as MesaEstruturacaoFiltrosOperacionais['lacuna_critica']
                })
              }
            >
              <option value="todos">Todos</option>
              <option value="com_lacuna_critica">Com lacuna crítica</option>
              <option value="sem_lacuna_critica">Sem lacuna crítica</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Classificação operacional</span>
            <select
              className={FILTER_BASE_CLASS}
              value={filtrosOperacionais.classificacao}
              onChange={(event) =>
                onAtualizarFiltrosOperacionais({
                  ...filtrosOperacionais,
                  classificacao: event.target.value as MesaEstruturacaoFiltrosOperacionais['classificacao']
                })
              }
            >
              <option value="todos">Todas</option>
              <option value="travado">Travado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="quase_pronto">Quase pronto</option>
              <option value="pronto_para_revisao">Pronto para revisão</option>
              <option value="precisa_de_acao">Precisa de ação</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Ordenação</span>
            <select
              className={FILTER_BASE_CLASS}
              value={ordenacaoOperacional}
              onChange={(event) => onAlterarOrdenacaoOperacional(event.target.value as MesaEstruturacaoOrdenacaoOperacional)}
            >
              {ORDENACOES.map((ordem) => (
                <option key={ordem.id} value={ordem.id}>
                  {ordem.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Agrupamento</span>
            <select
              className={FILTER_BASE_CLASS}
              value={agrupamentoOperacional}
              onChange={(event) => onAlterarAgrupamentoOperacional(event.target.value as MesaEstruturacaoAgrupamentoOperacional)}
            >
              {AGRUPAMENTOS.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <article className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Fila operacional</p>
            <p className="text-[11px] text-slate-500">{itensOperacionais.length} itens após filtros</p>
          </div>

          {gruposOperacionais.length === 0 || itensOperacionais.length === 0 ? (
            <p className="text-xs text-slate-500">Nenhum item encontrado com os filtros atuais.</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {gruposOperacionais.map((grupo) => (
                <div key={grupo.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">{grupo.label}</p>
                    <span className="text-[11px] font-bold text-slate-500">{grupo.total}</span>
                  </div>

                  <div className="space-y-2">
                    {grupo.itens.map((item) => (
                      <article key={item.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wide ${BADGE_CLASSIFICACAO_STYLE[item.classificacao_operacional]}`}
                          >
                            {getClassificacaoOperacionalMesaLabel(item.classificacao_operacional)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wide ${BADGE_PRONTIDAO_STYLE[item.prontidao]}`}
                          >
                            {getProntidaoOperacionalMesaLabel(item.prontidao)}
                          </span>
                          {item.lacuna_critica && (
                            <span className="px-2 py-0.5 rounded-md border border-rose-200 bg-rose-50 text-[10px] font-black uppercase tracking-wide text-rose-700">
                              Lacuna crítica
                            </span>
                          )}
                          {item.parado && (
                            <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-100 text-[10px] font-black uppercase tracking-wide text-slate-700">
                              Parado
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.titulo}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.subtitulo}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-[11px] text-slate-600">
                          <p>
                            <strong>Origem:</strong> {item.origem_label}
                          </p>
                          <p>
                            <strong>Status:</strong> {item.status_label}
                          </p>
                          <p>
                            <strong>Parado há:</strong> {item.dias_sem_movimento}d
                          </p>
                        </div>

                        {item.tipo_item === 'ativo_estruturacao' && (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-1 text-[11px] text-slate-600">
                            <p>
                              <strong>Base mínima:</strong> {item.base_minima_preenchida ? 'Sim' : 'Não'}
                            </p>
                            <p>
                              <strong>Blocos:</strong> {item.tem_blocos ? 'Com blocos' : 'Sem blocos'}
                            </p>
                            <p>
                              <strong>Relações:</strong> {item.tem_relacoes ? 'Com relações' : 'Sem relações'}
                            </p>
                            <p>
                              <strong>Promoção:</strong> {item.proximidade_promocao}%
                            </p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

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