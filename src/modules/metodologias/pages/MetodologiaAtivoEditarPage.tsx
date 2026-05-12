import React from 'react';
import type {
  AtivoCanonico,
  AtivoCanonicoPromocaoPreview,
  AtivoEmEstruturacaoBlocoInterno,
  AtivoEmEstruturacaoBlocoInternoPatch,
  AtivoEmEstruturacaoBlocoTipo,
  AtivoEmEstruturacaoRelacao,
  AtivoEmEstruturacaoRelacaoDirecao,
  AtivoEmEstruturacao,
  AtivoEmEstruturacaoPatch,
  AtivoMetodologicoEstadoGovernanca,
  AtivoMetodologicoRelacaoTipo,
  AtivoMetodologicoTipo,
  DiagnosticoPromocaoAssistida,
  DiagnosticoEstruturacao,
  MetodologiaMaturidadePratica,
  MetodologiaStatusEditorial
} from '../types';
import {
  getEstadoGovernancaLabel,
  getLeituraVisualEstruturacaoLabel,
  getMaturidadePraticaLabel,
  getTipoRelacaoLabel,
  getStatusEditorialLabel
} from '../services';

interface MetodologiaAtivoEditarPageProps {
  ativo: AtivoEmEstruturacao;
  diagnostico: DiagnosticoEstruturacao;
  statusEditoriaisDisponiveis: MetodologiaStatusEditorial[];
  maturidadesDisponiveis: MetodologiaMaturidadePratica[];
  estadosGovernancaDisponiveis: AtivoMetodologicoEstadoGovernanca[];
  tiposDisponiveis: Array<{ tipo: AtivoMetodologicoTipo; label: string }>;
  tiposBlocoDisponiveis: Array<{ tipo: AtivoEmEstruturacaoBlocoTipo; label: string }>;
  tiposRelacaoDisponiveis: AtivoMetodologicoRelacaoTipo[];
  ativosCanonicosRelacionaveis: Array<{ id: string; nome: string; slug: string }>;
  onAdicionarBlocoInterno: (tipo: AtivoEmEstruturacaoBlocoTipo) => void;
  onAtualizarBlocoInterno: (blocoId: string, patch: AtivoEmEstruturacaoBlocoInternoPatch) => void;
  onRemoverBlocoInterno: (blocoId: string) => void;
  onMoverBlocoInterno: (blocoId: string, direcao: 'cima' | 'baixo') => void;
  onAdicionarRelacaoEstruturacao: (input: {
    tipo_de_relacao: AtivoMetodologicoRelacaoTipo;
    ativo_relacionado_canonico_id: string;
    direcao: AtivoEmEstruturacaoRelacaoDirecao;
    observacao?: string;
  }) => void;
  onRemoverRelacaoEstruturacao: (relacaoId: string) => void;
  onAtualizarAtivo: (patch: AtivoEmEstruturacaoPatch) => void;
  diagnosticoPromocao: DiagnosticoPromocaoAssistida;
  previewPromocao: AtivoCanonicoPromocaoPreview;
  promovendo: boolean;
  ultimoAtivoCanonicoPromovido: AtivoCanonico | null;
  onPromoverAssistido: () => void;
  onAbrirCanonicoPromovido: (id: string) => void;
  onVoltarMesa: () => void;
}

export const MetodologiaAtivoEditarPage: React.FC<MetodologiaAtivoEditarPageProps> = ({
  ativo,
  diagnostico,
  statusEditoriaisDisponiveis,
  maturidadesDisponiveis,
  estadosGovernancaDisponiveis,
  tiposDisponiveis,
  tiposBlocoDisponiveis,
  tiposRelacaoDisponiveis,
  ativosCanonicosRelacionaveis,
  onAdicionarBlocoInterno,
  onAtualizarBlocoInterno,
  onRemoverBlocoInterno,
  onMoverBlocoInterno,
  onAdicionarRelacaoEstruturacao,
  onRemoverRelacaoEstruturacao,
  onAtualizarAtivo,
  diagnosticoPromocao,
  previewPromocao,
  promovendo,
  ultimoAtivoCanonicoPromovido,
  onPromoverAssistido,
  onAbrirCanonicoPromovido,
  onVoltarMesa
}) => {
  const [tipoNovoBloco, setTipoNovoBloco] = React.useState<AtivoEmEstruturacaoBlocoTipo>('essencia');
  const [tipoNovaRelacao, setTipoNovaRelacao] = React.useState<AtivoMetodologicoRelacaoTipo>('complementa');
  const [ativoRelacionadoId, setAtivoRelacionadoId] = React.useState<string>('');
  const [direcaoRelacao, setDirecaoRelacao] = React.useState<AtivoEmEstruturacaoRelacaoDirecao>('saida');
  const [observacaoRelacao, setObservacaoRelacao] = React.useState('');
  const blocosInternos: AtivoEmEstruturacaoBlocoInterno[] = [...(ativo.blocos_internos ?? [])].sort((a, b) => a.ordem - b.ordem);
  const relacoesEstruturacao: AtivoEmEstruturacaoRelacao[] = [...(ativo.relacoes_estruturacao ?? [])];

  React.useEffect(() => {
    if (!ativosCanonicosRelacionaveis.length) {
      setAtivoRelacionadoId('');
      return;
    }
    if (!ativoRelacionadoId || !ativosCanonicosRelacionaveis.some((item) => item.id === ativoRelacionadoId)) {
      setAtivoRelacionadoId(ativosCanonicosRelacionaveis[0].id);
    }
  }, [ativosCanonicosRelacionaveis, ativoRelacionadoId]);

  return (
    <section className="space-y-4">
      <header className="rounded-3xl border border-sagb-line bg-sagb-panel p-5 md:p-6 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-sagb-muted">Edição guiada</p>
            <h2 className="text-2xl font-black text-sagb-text tracking-tight mt-1">Rascunho da metodologia</h2>
            <p className="text-[12px] text-sagb-muted mt-1">Refine o conteúdo antes de publicar como metodologia oficial.</p>
          </div>
          <button
            type="button"
            onClick={onVoltarMesa}
            className="px-3 py-2 rounded-lg border border-sagb-line text-[11px] font-black uppercase tracking-wide text-sagb-muted hover:bg-sagb-bg-2"
          >
            Voltar para área de trabalho
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <article className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
            <p className="text-[11px] font-semibold text-cyan-500">Status rápido</p>
            <p className="text-[12px] font-bold text-sagb-text mt-1">
              {getLeituraVisualEstruturacaoLabel(diagnostico.leitura_visual)}
            </p>
          </article>

          <article className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-500">Preenchimento</p>
            <p className="text-[12px] font-bold text-sagb-text mt-1">
              {diagnostico.campos_preenchidos}/{diagnostico.total_campos_monitorados} ({diagnostico.percentual_preenchimento}%)
            </p>
          </article>

          <article className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <p className="text-[11px] font-semibold text-amber-500">Campos obrigatórios</p>
            <p className="text-[12px] font-bold text-sagb-text mt-1">
               {diagnostico.base_minima_preenchida ? 'Preenchidos' : 'Incompletos'}
            </p>
          </article>
        </div>
      </header>

      <div className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 md:p-5 space-y-3">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sagb-muted">Campos principais</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Nome</span>
            <input
              value={ativo.nome}
              onChange={(event) => onAtualizarAtivo({ nome: event.target.value })}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text focus:outline-none focus:border-sagb-blue"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Tipo de ativo</span>
            <select
              value={ativo.tipo_de_ativo}
              onChange={(event) => onAtualizarAtivo({ tipo_de_ativo: event.target.value as AtivoMetodologicoTipo })}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text focus:outline-none focus:border-sagb-blue"
            >
              {tiposDisponiveis.map((item) => (
                <option key={item.tipo} value={item.tipo}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Resumo</span>
          <textarea
            value={ativo.resumo}
            onChange={(event) => onAtualizarAtivo({ resumo: event.target.value })}
            rows={3}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text focus:outline-none focus:border-sagb-blue resize-y"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Definição</span>
          <textarea
            value={ativo.definicao}
            onChange={(event) => onAtualizarAtivo({ definicao: event.target.value })}
            rows={3}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text focus:outline-none focus:border-sagb-blue resize-y"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Objetivo</span>
          <textarea
            value={ativo.objetivo}
            onChange={(event) => onAtualizarAtivo({ objetivo: event.target.value })}
            rows={3}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text focus:outline-none focus:border-sagb-blue resize-y"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Status editorial</span>
            <select
              value={ativo.status_editorial}
              onChange={(event) => onAtualizarAtivo({ status_editorial: event.target.value as MetodologiaStatusEditorial })}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
            >
              {statusEditoriaisDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {getStatusEditorialLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Maturidade prática</span>
            <select
              value={ativo.maturidade_pratica}
              onChange={(event) => onAtualizarAtivo({ maturidade_pratica: event.target.value as MetodologiaMaturidadePratica })}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
            >
              {maturidadesDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {getMaturidadePraticaLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Governança</span>
            <select
              value={ativo.governanca.estado}
              onChange={(event) =>
                onAtualizarAtivo({
                  governanca: { estado: event.target.value as AtivoMetodologicoEstadoGovernanca }
                })
              }
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
            >
              {estadosGovernancaDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {getEstadoGovernancaLabel(item)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <article className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-500">Lacunas detectadas</h4>
          {diagnostico.lacunas.length === 0 ? (
            <p className="text-[12px] text-emerald-500 mt-2">Sem lacunas críticas nesta etapa.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {diagnostico.lacunas.map((lacuna) => (
                <li key={lacuna.id} className="text-[12px] text-amber-500">
                  • <strong>{lacuna.titulo}</strong> — {lacuna.descricao}
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-indigo-500">Próximo passo sugerido</h4>
          <p className="text-[12px] text-indigo-400 mt-2">{diagnostico.proximo_passo_sugerido}</p>
        </article>
      </div>

      <div className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 md:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sagb-muted">Corpo interno</p>
            <h4 className="text-lg font-black text-sagb-text tracking-tight mt-1">Blocos da metodologia em estruturação</h4>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={tipoNovoBloco}
              onChange={(event) => setTipoNovoBloco(event.target.value as AtivoEmEstruturacaoBlocoTipo)}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-2.5 py-2 text-[12px] text-sagb-text"
            >
              {tiposBlocoDisponiveis.map((item) => (
                <option key={item.tipo} value={item.tipo}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onAdicionarBlocoInterno(tipoNovoBloco)}
              className="px-3 py-2 rounded-lg bg-sagb-blue text-white text-[11px] font-black uppercase tracking-wide hover:brightness-110"
            >
              Adicionar bloco
            </button>
          </div>
        </div>

        {blocosInternos.length === 0 ? (
          <p className="text-[12px] text-sagb-muted">Nenhum bloco interno ainda. Adicione o primeiro bloco para estruturar o corpo metodológico.</p>
        ) : (
          <div className="space-y-3">
            {blocosInternos.map((bloco, index) => (
              <article key={bloco.id} className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 rounded-md bg-sagb-blue/10 text-sagb-blue text-[10px] font-black uppercase tracking-wide">
                    #{bloco.ordem}
                  </span>
                  <select
                    value={bloco.tipo_de_bloco}
                    onChange={(event) =>
                      onAtualizarBlocoInterno(bloco.id, {
                        tipo_de_bloco: event.target.value as AtivoEmEstruturacaoBlocoTipo
                      })
                    }
                    className="rounded-md border border-sagb-line bg-sagb-panel px-2 py-1.5 text-[12px] text-sagb-text"
                  >
                    {tiposBlocoDisponiveis.map((item) => (
                      <option key={item.tipo} value={item.tipo}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <div className="ml-auto flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onMoverBlocoInterno(bloco.id, 'cima')}
                      disabled={index === 0}
                      className="px-2 py-1 rounded-md border border-sagb-line text-[10px] font-black uppercase tracking-wide text-sagb-muted disabled:opacity-40"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoverBlocoInterno(bloco.id, 'baixo')}
                      disabled={index === blocosInternos.length - 1}
                      className="px-2 py-1 rounded-md border border-sagb-line text-[10px] font-black uppercase tracking-wide text-sagb-muted disabled:opacity-40"
                    >
                      Descer
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoverBlocoInterno(bloco.id)}
                      className="px-2 py-1 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase tracking-wide"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <input
                  value={bloco.titulo}
                  onChange={(event) => onAtualizarBlocoInterno(bloco.id, { titulo: event.target.value })}
                  placeholder="Título do bloco"
                  className="w-full rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
                />

                <textarea
                  value={bloco.conteudo}
                  onChange={(event) => onAtualizarBlocoInterno(bloco.id, { conteudo: event.target.value })}
                  rows={4}
                  placeholder="Conteúdo do bloco"
                  className="w-full rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text resize-y"
                />
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 md:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sagb-muted">Relações em estruturação</p>
            <h4 className="text-lg font-black text-sagb-text tracking-tight mt-1">Conexões mínimas de intenção estrutural</h4>
            <p className="text-[12px] text-sagb-muted mt-1">
              {relacoesEstruturacao.length
                ? `Este ativo já se conecta com ${new Set(relacoesEstruturacao.map((item) => item.ativo_relacionado_canonico_id)).size} ativo(s) canônico(s).`
                : 'Sem relações definidas ainda.'}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-sagb-bg-2 border border-sagb-line text-[10px] font-black uppercase tracking-wide text-sagb-muted">
            intenção estrutural • não canônica
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Tipo de relação</span>
            <select
              value={tipoNovaRelacao}
              onChange={(event) => setTipoNovaRelacao(event.target.value as AtivoMetodologicoRelacaoTipo)}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
            >
              {tiposRelacaoDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {getTipoRelacaoLabel(tipo)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Ativo relacionado (canônico)</span>
            <select
              value={ativoRelacionadoId}
              onChange={(event) => setAtivoRelacionadoId(event.target.value)}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
              disabled={ativosCanonicosRelacionaveis.length === 0}
            >
              {ativosCanonicosRelacionaveis.length === 0 && <option value="">Sem ativos canônicos disponíveis</option>}
              {ativosCanonicosRelacionaveis.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Direção</span>
            <select
              value={direcaoRelacao}
              onChange={(event) => setDirecaoRelacao(event.target.value as AtivoEmEstruturacaoRelacaoDirecao)}
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
            >
              <option value="saida">Saída (este ativo → relacionado)</option>
              <option value="entrada">Entrada (relacionado → este ativo)</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-sagb-muted">Observação (opcional)</span>
            <input
              value={observacaoRelacao}
              onChange={(event) => setObservacaoRelacao(event.target.value)}
              placeholder="Contexto curto da intenção de vínculo"
              className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
            />
          </label>
        </div>

        <div>
          <button
            type="button"
            disabled={!ativoRelacionadoId || ativosCanonicosRelacionaveis.length === 0}
            onClick={() => {
              onAdicionarRelacaoEstruturacao({
                tipo_de_relacao: tipoNovaRelacao,
                ativo_relacionado_canonico_id: ativoRelacionadoId,
                direcao: direcaoRelacao,
                observacao: observacaoRelacao
              });
              setObservacaoRelacao('');
            }}
            className="px-3 py-2 rounded-lg bg-sagb-blue text-white text-[11px] font-black uppercase tracking-wide disabled:opacity-50"
          >
            Adicionar relação
          </button>
        </div>

        {relacoesEstruturacao.length === 0 ? (
          <p className="text-[12px] text-sagb-muted">Defina ao menos uma conexão quando fizer sentido para evitar promoção de ativo isolado.</p>
        ) : (
          <div className="space-y-2">
            {relacoesEstruturacao.map((relacao) => {
              const ativoRelacionado = ativosCanonicosRelacionaveis.find((item) => item.id === relacao.ativo_relacionado_canonico_id);
              return (
                <article key={relacao.id} className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 rounded-md bg-sagb-blue/10 text-sagb-blue text-[10px] font-black uppercase tracking-wide">
                      {getTipoRelacaoLabel(relacao.tipo_de_relacao)}
                    </span>
                    <span className="text-[12px] text-sagb-muted">
                      {relacao.direcao === 'saida' ? 'este ativo → relacionado' : 'relacionado → este ativo'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoverRelacaoEstruturacao(relacao.id)}
                      className="ml-auto px-2 py-1 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase tracking-wide"
                    >
                      Remover
                    </button>
                  </div>
                  <p className="text-[12px] text-sagb-text">
                    <strong>Ativo relacionado:</strong> {ativoRelacionado?.nome ?? relacao.ativo_relacionado_canonico_id}
                  </p>
                  {relacao.observacao && <p className="text-[12px] text-sagb-muted">{relacao.observacao}</p>}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 md:p-5 space-y-3">
        <header className="space-y-1">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-500">Promoção assistida</p>
          <h4 className="text-lg font-black text-sagb-text tracking-tight">Ativo em estruturação → ativo canônico</h4>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <article className="rounded-xl border border-emerald-500/20 bg-sagb-bg-2 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-500">Prontidão</p>
            <p className="text-[12px] font-bold text-sagb-text mt-1">
              {diagnosticoPromocao.criterios_atendidos}/{diagnosticoPromocao.total_criterios} ({diagnosticoPromocao.percentual_prontidao}%)
            </p>
          </article>

          <article className="rounded-xl border border-emerald-500/20 bg-sagb-bg-2 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-500">Estado</p>
            <p className="text-[12px] font-bold text-sagb-text mt-1">
              {diagnosticoPromocao.pronto_para_promocao ? 'Pronto para promoção' : 'Ainda não pronto'}
            </p>
          </article>

          <article className="rounded-xl border border-emerald-500/20 bg-sagb-bg-2 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-500">Rastreabilidade</p>
            <p className="text-[12px] text-sagb-muted mt-1">Entrada: {previewPromocao.origem_entrada_bruta_id}</p>
            <p className="text-[12px] text-sagb-muted">Estruturação: {previewPromocao.origem_ativo_em_estruturacao_id}</p>
          </article>
        </div>

        {!diagnosticoPromocao.pronto_para_promocao && (
          <article className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-500">Pendências para promoção</p>
            <ul className="mt-2 space-y-1.5">
              {diagnosticoPromocao.pendencias.map((pendencia) => (
                <li key={pendencia.id} className="text-[12px] text-amber-500">
                  • <strong>{pendencia.titulo}</strong> — {pendencia.descricao}
                </li>
              ))}
            </ul>
          </article>
        )}

        <article className="rounded-xl border border-emerald-500/20 bg-sagb-bg-2 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-500">Itens já prontos</p>
          <ul className="mt-2 space-y-1.5">
            {diagnosticoPromocao.criterios
              .filter((criterio) => criterio.atendido)
              .map((criterio) => (
                <li key={criterio.id} className="text-[12px] text-emerald-500">
                  • <strong>{criterio.titulo}</strong>
                </li>
              ))}
          </ul>
        </article>

        <article className="rounded-xl border border-emerald-500/20 bg-sagb-bg-2 p-3 space-y-1.5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-500">Preview do ativo canônico</p>
          <p className="text-[12px] text-sagb-muted"><strong>Nome:</strong> {previewPromocao.nome}</p>
          <p className="text-[12px] text-sagb-muted"><strong>Slug:</strong> {previewPromocao.slug_sugerido}</p>
          <p className="text-[12px] text-sagb-muted"><strong>Status editorial inicial:</strong> {previewPromocao.status_editorial}</p>
          <p className="text-[12px] text-sagb-muted"><strong>Versão inicial:</strong> {previewPromocao.versao_atual}</p>
        </article>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!diagnosticoPromocao.pronto_para_promocao || promovendo}
            onClick={onPromoverAssistido}
            className="px-3.5 py-2 rounded-lg bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wide disabled:opacity-50"
          >
            {promovendo ? 'Promovendo...' : 'Promover para canônico'}
          </button>

          {ultimoAtivoCanonicoPromovido && (
            <button
              type="button"
              onClick={() => onAbrirCanonicoPromovido(ultimoAtivoCanonicoPromovido.id)}
              className="px-3.5 py-2 rounded-lg border border-emerald-500/30 bg-sagb-bg-2 text-emerald-500 text-[11px] font-black uppercase tracking-wide"
            >
              Abrir ativo canônico promovido
            </button>
          )}
        </div>
      </section>
    </section>
  );
};
