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
  arquivosBrutos: File[];
  tiposEntradaDisponiveis: EntradaMetodologicaTipoDeEntrada[];
  onNovoTituloChange: (value: string) => void;
  onNovoTipoEntradaChange: (value: EntradaMetodologicaTipoDeEntrada) => void;
  onNovaOrigemChange: (value: string) => void;
  onNovoConteudoBrutoChange: (value: string) => void;
  onArquivosBrutosChange: (files: File[]) => void;
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
  travado: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  em_andamento: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  quase_pronto: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  pronto_para_revisao: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  precisa_de_acao: 'bg-violet-500/10 text-violet-500 border-violet-500/20'
};

const BADGE_PRONTIDAO_STYLE: Record<MesaEstruturacaoItemOperacional['prontidao'], string> = {
  baixa: 'bg-sagb-bg-2 text-sagb-muted border-sagb-line',
  media: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  alta: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  revisao: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
};

const FILTER_BASE_CLASS =
  'rounded-lg border border-sagb-line bg-sagb-panel px-2.5 py-1.5 text-[12px] text-sagb-text';

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
  arquivosBrutos,
  tiposEntradaDisponiveis,
  onNovoTituloChange,
  onNovoTipoEntradaChange,
  onNovaOrigemChange,
  onNovoConteudoBrutoChange,
  onArquivosBrutosChange,
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
          <h2 className="text-2xl font-black text-sagb-text tracking-tight">Área de trabalho das metodologias</h2>
          <p className="text-sagb-muted text-[12px]">
            Organize documentos recebidos, acompanhe rascunhos e avance para publicação com mais clareza.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-sagb-muted">Fluxo guiado</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <article className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-500">Material cru</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{totalBrutas}</p>
          <p className="text-[12px] text-amber-500/80 mt-1">Entradas ainda em estado bruto aguardando leitura.</p>
        </article>

        <article className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-cyan-500">Em estruturação</p>
          <p className="text-2xl font-black text-cyan-500 mt-1">{totalEmEstruturacao}</p>
          <p className="text-[12px] text-cyan-500/80 mt-1">Itens com lapidação metodológica em andamento.</p>
        </article>

        <article className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-500">Consolidados</p>
          <p className="text-2xl font-black text-emerald-500 mt-1">{totalConsolidados}</p>
          <p className="text-[12px] text-emerald-500/80 mt-1">Ativos já consolidados no catálogo canônico.</p>
        </article>
      </div>

      <section className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 md:p-5 space-y-4">
        <header>
          <p className="text-[11px] font-semibold text-sagb-muted">Resumo da área de trabalho</p>
          <h3 className="text-lg font-black text-sagb-text tracking-tight mt-1">Onde precisamos agir agora</h3>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2.5">
          <article className="rounded-xl border border-sagb-line bg-sagb-bg-2 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sagb-muted">Itens em estruturação</p>
            <p className="text-xl font-black text-sagb-text mt-1">{indicadoresOperacionais.total_itens_em_estruturacao}</p>
          </article>
          <article className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-500">Quase prontos</p>
            <p className="text-xl font-black text-amber-500 mt-1">{indicadoresOperacionais.itens_quase_prontos}</p>
          </article>
          <article className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-500">Travados</p>
            <p className="text-xl font-black text-rose-500 mt-1">{indicadoresOperacionais.itens_travados}</p>
          </article>
          <article className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-500">Sem blocos</p>
            <p className="text-xl font-black text-indigo-500 mt-1">{indicadoresOperacionais.ativos_sem_blocos}</p>
          </article>
          <article className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-500">Sem relações</p>
            <p className="text-xl font-black text-violet-500 mt-1">{indicadoresOperacionais.ativos_sem_relacoes}</p>
          </article>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          <article className="rounded-lg border border-sagb-line bg-sagb-bg-2 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-sagb-muted">Base mínima preenchida</p>
            <p className="text-[12px] font-black text-sagb-text mt-1">{indicadoresOperacionais.ativos_com_base_minima}</p>
          </article>
          <article className="rounded-lg border border-sagb-line bg-sagb-bg-2 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-sagb-muted">Prontos para revisão</p>
            <p className="text-[12px] font-black text-sagb-text mt-1">{indicadoresOperacionais.ativos_prontos_para_revisao}</p>
          </article>
          <article className="rounded-lg border border-sagb-line bg-sagb-bg-2 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-sagb-muted">Atividade recente</p>
            <p className="text-[12px] font-black text-sagb-text mt-1">{indicadoresOperacionais.itens_com_atividade_recente}</p>
          </article>
          <article className="rounded-lg border border-sagb-line bg-sagb-bg-2 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-sagb-muted">Mais parados</p>
            <p className="text-[12px] font-black text-sagb-text mt-1">{indicadoresOperacionais.itens_parados}</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 md:p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sagb-muted">Bancada operacional</p>
            <h3 className="text-lg font-black text-sagb-text tracking-tight mt-1">Filtros, ordenação e agrupamento</h3>
          </div>
          <button
            type="button"
            onClick={onLimparFiltrosOperacionais}
            className="px-3 py-1.5 rounded-lg border border-sagb-line text-[11px] font-black uppercase tracking-wide text-sagb-muted hover:bg-sagb-bg-2"
          >
            Limpar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Status de estruturação</span>
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
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Tipo de entrada</span>
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
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Prontidão</span>
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
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Blocos</span>
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
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Relações</span>
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
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Atividade</span>
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
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Ponto crítico</span>
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
                <option value="com_lacuna_critica">Com ponto crítico</option>
                <option value="sem_lacuna_critica">Sem ponto crítico</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Classificação operacional</span>
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
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Ordenação</span>
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
            <span className="text-[10px] uppercase tracking-wide text-sagb-muted">Agrupamento</span>
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

        <article className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-black text-sagb-text uppercase tracking-wide">Fila operacional</p>
            <p className="text-[11px] text-sagb-muted">{itensOperacionais.length} itens após filtros</p>
          </div>

          {gruposOperacionais.length === 0 || itensOperacionais.length === 0 ? (
            <p className="text-[12px] text-sagb-muted">Nenhum item encontrado com os filtros atuais.</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {gruposOperacionais.map((grupo) => (
                <div key={grupo.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-sagb-muted">{grupo.label}</p>
                    <span className="text-[11px] font-bold text-sagb-muted">{grupo.total}</span>
                  </div>

                  <div className="space-y-2">
                    {grupo.itens.map((item) => (
                      <article key={item.id} className="rounded-lg border border-sagb-line bg-sagb-bg-2 px-3 py-2.5 space-y-2">
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
                            <span className="px-2 py-0.5 rounded-md border border-rose-500/20 bg-rose-500/10 text-[10px] font-black uppercase tracking-wide text-rose-500">
                              Ponto crítico
                            </span>
                          )}
                          {item.parado && (
                            <span className="px-2 py-0.5 rounded-md border border-sagb-line bg-sagb-bg-2 text-[10px] font-black uppercase tracking-wide text-sagb-muted">
                              Parado
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-[12px] font-bold text-sagb-text">{item.titulo}</p>
                          <p className="text-[12px] text-sagb-muted mt-0.5">{item.subtitulo}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-[11px] text-sagb-muted">
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
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-1 text-[11px] text-sagb-muted">
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

      <form onSubmit={onRegistrarEntradaBruta} className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 md:p-5 space-y-3">
        <div>
          <p className="text-[11px] font-semibold text-sagb-muted">Novo documento</p>
          <h3 className="text-lg font-black text-sagb-text tracking-tight mt-1">Adicionar conteúdo para leitura inicial</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Título</span>
            <input
              value={novoTitulo}
              onChange={(event) => onNovoTituloChange(event.target.value)}
              placeholder="Ex.: Rascunho de framework de validação"
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Tipo de entrada</span>
            <select
              value={novoTipoEntrada}
              onChange={(event) => onNovoTipoEntradaChange(event.target.value as EntradaMetodologicaTipoDeEntrada)}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
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
          <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Origem</span>
          <input
            value={novaOrigem}
            onChange={(event) => onNovaOrigemChange(event.target.value)}
            placeholder="Ex.: anotação interna, resumo de PDF, bloco conceitual"
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Conteúdo bruto</span>
          <textarea
            value={novoConteudoBruto}
            onChange={(event) => onNovoConteudoBrutoChange(event.target.value)}
            rows={4}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text resize-y"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Anexos brutos (opcional)</span>
          <input
            type="file"
            multiple
            onChange={(event) => onArquivosBrutosChange(Array.from(event.target.files ?? []))}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
          />
          <p className="text-[11px] text-sagb-muted">
            {arquivosBrutos.length > 0
              ? `${arquivosBrutos.length} arquivo(s) anexado(s) para leitura inicial.`
              : 'Arquivos textuais serão incorporados ao conteúdo bruto para leitura assistida.'}
          </p>
        </label>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-sagb-muted">Entrada persistida para continuidade real da estruturação.</p>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-sagb-blue text-white text-[11px] font-black uppercase tracking-wide hover:brightness-110 transition"
          >
            Salvar documento
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-5">
        <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 md:p-5 space-y-3">
          <div>
            <p className="text-[11px] font-semibold text-sagb-muted">Fila de trabalho</p>
            <h3 className="text-lg font-black text-sagb-text tracking-tight mt-1">Entradas recebidas</h3>
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
                      ? 'border-cyan-500/20 bg-cyan-500/10 shadow-sm'
                      : 'border-sagb-line bg-sagb-bg-2 hover:brightness-110'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-sagb-panel border border-sagb-line text-[10px] font-black uppercase tracking-wide text-sagb-muted">
                      {getTipoEntradaBrutaLabel(entrada.tipo_de_entrada)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide bg-cyan-500/10 text-cyan-500">
                      {getStatusEstruturacaoLabel(entrada.status_de_estruturacao)}
                    </span>
                  </div>
                  <p className="text-[12px] font-bold text-sagb-text leading-snug">{entrada.titulo}</p>
                  <p className="text-[12px] text-sagb-muted mt-1 line-clamp-2">{entrada.conteudo_bruto}</p>
                </button>
              );
            })}
          </div>
        </article>

        {entradaSelecionada && leituraAssistida && (
          <article className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 md:p-5 space-y-4">
            <header className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-500">Leitura assistida</p>
              <h3 className="text-lg font-black text-sagb-text tracking-tight">Interpretação inicial do insumo</h3>
              <p className="text-[12px] text-sagb-muted leading-relaxed">Orientação estruturante para converter material cru em ativo.</p>
            </header>

            <div className="rounded-xl border border-cyan-500/20 bg-sagb-bg-2 p-4 space-y-3">
              <p className="text-[12px] font-black text-sagb-text">{entradaSelecionada.titulo}</p>
              <p className="text-[12px] text-sagb-text leading-relaxed">{entradaSelecionada.conteudo_bruto}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p className="text-[12px] text-sagb-muted"><strong>O que parece ser:</strong> {leituraAssistida.o_que_parece_ser}</p>
                <p className="text-[12px] text-sagb-muted">
                  <strong>Tipo provável:</strong>{' '}
                  {leituraAssistida.tipo_mais_provavel === 'indefinido'
                    ? 'Ainda indefinido'
                    : getTipoDeAtivoLabel(leituraAssistida.tipo_mais_provavel)}
                </p>
                <p className="text-[12px] text-sagb-muted"><strong>Essência:</strong> {leituraAssistida.essencia}</p>
                <p className="text-[12px] text-sagb-muted"><strong>Objetivo:</strong> {leituraAssistida.objetivo}</p>
              </div>
            </div>

            <article className="rounded-xl border border-sagb-line bg-sagb-panel p-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-sagb-muted">Perguntas de estruturação</h4>
              <ul className="mt-2 space-y-2">
                {perguntasEstruturacao.map((pergunta) => (
                  <li key={pergunta.id} className="rounded-lg border border-sagb-line bg-sagb-bg-2 px-3 py-2">
                    <p className="text-[12px] font-bold text-sagb-text">{pergunta.titulo}</p>
                    <p className="text-[12px] text-sagb-muted mt-1">{pergunta.descricao}</p>
                  </li>
                ))}
              </ul>
            </article>

            {conversaoAssistida && (
              <article className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 md:p-4 space-y-4">
                <header className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-500">Conversão assistida</p>
                  <h4 className="text-base font-black text-sagb-text tracking-tight">Documento recebido → rascunho da metodologia</h4>
                </header>

                <div className="flex flex-wrap gap-2">
                  {(['preview', 'ativo_em_estruturacao', 'ativo_base_gerado'] as const).map((modo) => (
                    <button
                      key={modo}
                      type="button"
                      onClick={() => onDefinirModoConversao(modo)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide border transition ${
                        modoConversao === modo
                          ? 'bg-violet-500/10 text-violet-500 border-violet-500/30'
                          : 'bg-sagb-panel text-sagb-muted border-sagb-line hover:border-sagb-muted'
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

                <article className="rounded-xl border border-sagb-line bg-sagb-panel p-3 space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-sagb-muted">Preview do resultado</p>
                  <p className="text-[12px] text-sagb-text"><strong>Nome:</strong> {conversaoAssistida.ativo_preview.nome}</p>
                  <p className="text-[12px] text-sagb-text"><strong>Tipo:</strong> {getTipoDeAtivoLabel(conversaoAssistida.ativo_preview.tipo_de_ativo)}</p>
                  <p className="text-[12px] text-sagb-text"><strong>Status:</strong> {getStatusConversaoAssistidaLabel(conversaoAssistida.status_resultado)}</p>
                  {ativoEmEstruturacaoLocal && (
                    <p className="text-[12px] text-sagb-text">
                      <strong>Status rápido:</strong>{' '}
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
                  className="w-full px-3.5 py-2 rounded-lg bg-sagb-blue text-white text-[11px] font-black uppercase tracking-wide hover:brightness-110 transition"
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
