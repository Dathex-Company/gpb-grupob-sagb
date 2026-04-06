import React from 'react';
import type {
  AtivoCanonico,
  AtivoCanonicoBloco,
  AtivoCanonicoBlocoPatch,
  AtivoCanonicoBlocoTipo,
  AtivoCanonicoPatch,
  AtivoCanonicoVersao,
  AtivoCanonicoVersaoStatus,
  AtivoEmEstruturacaoBlocoInterno,
  AtivoMetodologicoEstadoGovernanca,
  AtivoMetodologicoTipo,
  MetodologiaMaturidadePratica,
  MetodologiaStatusEditorial,
  SnapshotCanonicoStatusVersao
} from '../types';
import {
  calcularComparacaoLevePorVersoes,
  calcularComparacaoLeveVigenteVsAnterior,
  getEstadoGovernancaLabel,
  getMaturidadePraticaLabel,
  getStatusEditorialLabel
} from '../services';

interface MetodologiaCanonicoEditarPageProps {
  ativo: AtivoCanonico;
  blocosOrigemDisponiveis: AtivoEmEstruturacaoBlocoInterno[];
  statusEditoriaisDisponiveis: MetodologiaStatusEditorial[];
  maturidadesDisponiveis: MetodologiaMaturidadePratica[];
  estadosGovernancaDisponiveis: AtivoMetodologicoEstadoGovernanca[];
  tiposDisponiveis: Array<{ tipo: AtivoMetodologicoTipo; label: string }>;
  tiposBlocoDisponiveis: Array<{ tipo: AtivoCanonicoBlocoTipo; label: string }>;
  onAtualizarAtivo: (patch: AtivoCanonicoPatch) => void;
  onAtualizarBloco: (blocoId: string, patch: AtivoCanonicoBlocoPatch) => void;
  onRemoverBloco: (blocoId: string) => void;
  onMoverBloco: (blocoId: string, direcao: 'cima' | 'baixo') => void;
  onCriarBlocoFromOrigem: (origemBlocoId: string) => void;
  onRegistrarVersaoCanonica: (input: {
    numero_versao: string;
    resumo_da_versao: string;
    titulo?: string;
    status_da_versao: AtivoCanonicoVersaoStatus;
  }) => void;
  statusSnapshots: SnapshotCanonicoStatusVersao[];
  onGerarSnapshotsFaltantes: () => void;
  onRevalidarSnapshot: (versao: AtivoCanonicoVersao) => void;
  onRegenerarSnapshot: (versao: AtivoCanonicoVersao) => void;
  onVoltarAtivo: () => void;
}

export const MetodologiaCanonicoEditarPage: React.FC<MetodologiaCanonicoEditarPageProps> = ({
  ativo,
  blocosOrigemDisponiveis,
  statusEditoriaisDisponiveis,
  maturidadesDisponiveis,
  estadosGovernancaDisponiveis,
  tiposDisponiveis,
  tiposBlocoDisponiveis,
  onAtualizarAtivo,
  onAtualizarBloco,
  onRemoverBloco,
  onMoverBloco,
  onCriarBlocoFromOrigem,
  onRegistrarVersaoCanonica,
  statusSnapshots,
  onGerarSnapshotsFaltantes,
  onRevalidarSnapshot,
  onRegenerarSnapshot,
  onVoltarAtivo
}) => {
  const blocosCanonicos: AtivoCanonicoBloco[] = [...(ativo.blocos_canonicos ?? [])].sort((a, b) => a.ordem - b.ordem);
  const [origemSelecionadaParaCriacao, setOrigemSelecionadaParaCriacao] = React.useState<string>(
    blocosOrigemDisponiveis[0]?.id ?? ''
  );
  const [numeroVersao, setNumeroVersao] = React.useState<string>(ativo.versao_atual || '1.0.0');
  const [tituloVersao, setTituloVersao] = React.useState<string>('');
  const [resumoVersao, setResumoVersao] = React.useState<string>('');
  const [statusVersao, setStatusVersao] = React.useState<AtivoCanonicoVersaoStatus>('rascunho');
  const versoesCanonicasOrdenadas = React.useMemo(
    () => [...(ativo.versoes_canonicas ?? [])].sort((a, b) => +new Date(b.publicada_em) - +new Date(a.publicada_em)),
    [ativo.versoes_canonicas]
  );
  const comparacaoVigenteAnterior = React.useMemo(() => calcularComparacaoLeveVigenteVsAnterior(ativo), [ativo]);
  const [versaoAnteriorSelecionadaId, setVersaoAnteriorSelecionadaId] = React.useState<string>('');
  const [versaoAtualSelecionadaId, setVersaoAtualSelecionadaId] = React.useState<string>('');

  React.useEffect(() => {
    if (!blocosOrigemDisponiveis.length) {
      setOrigemSelecionadaParaCriacao('');
      return;
    }

    setOrigemSelecionadaParaCriacao((atual) => {
      if (atual && blocosOrigemDisponiveis.some((bloco) => bloco.id === atual)) return atual;
      return blocosOrigemDisponiveis[0].id;
    });
  }, [blocosOrigemDisponiveis]);

  React.useEffect(() => {
    setNumeroVersao((atual) => atual || ativo.versao_atual || '1.0.0');
  }, [ativo.versao_atual]);

  React.useEffect(() => {
    const comparacaoPadrao = comparacaoVigenteAnterior.comparacao;
    if (comparacaoPadrao) {
      setVersaoAnteriorSelecionadaId(comparacaoPadrao.versao_anterior.id);
      setVersaoAtualSelecionadaId(comparacaoPadrao.versao_atual.id);
      return;
    }

    setVersaoAtualSelecionadaId(versoesCanonicasOrdenadas[0]?.id ?? '');
    setVersaoAnteriorSelecionadaId(versoesCanonicasOrdenadas[1]?.id ?? '');
  }, [comparacaoVigenteAnterior.comparacao, versoesCanonicasOrdenadas]);

  const comparacaoSelecionada = React.useMemo(() => {
    if (!versaoAnteriorSelecionadaId || !versaoAtualSelecionadaId) {
      return comparacaoVigenteAnterior;
    }

    return calcularComparacaoLevePorVersoes({
      ativo,
      versaoAnteriorId: versaoAnteriorSelecionadaId,
      versaoAtualId: versaoAtualSelecionadaId
    });
  }, [ativo, comparacaoVigenteAnterior, versaoAnteriorSelecionadaId, versaoAtualSelecionadaId]);

  const statusPorVersaoId = React.useMemo(() => {
    return new Map(statusSnapshots.map((item) => [item.versao_id, item]));
  }, [statusSnapshots]);

  const totalSemSnapshot = React.useMemo(
    () => statusSnapshots.filter((item) => item.status === 'ausente').length,
    [statusSnapshots]
  );

  const handleRegistrarVersao = () => {
    if (!numeroVersao.trim() || !resumoVersao.trim()) return;

    onRegistrarVersaoCanonica({
      numero_versao: numeroVersao.trim(),
      titulo: tituloVersao.trim() || undefined,
      resumo_da_versao: resumoVersao.trim(),
      status_da_versao: statusVersao
    });

    setTituloVersao('');
    setResumoVersao('');
  };

  return (
    <section className="space-y-4">
      <header className="rounded-3xl border border-indigo-100 bg-white p-5 md:p-6 shadow-sm space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-indigo-700">Manutenção canônica inicial</p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Ativo canônico no catálogo</h2>
            <p className="text-sm text-slate-500 mt-1">
              Ajuste controlado do canônico já promovido, sem reabrir estruturação e sem versionamento profundo.
            </p>
          </div>
          <button
            type="button"
            onClick={onVoltarAtivo}
            className="px-3 py-2 rounded-lg border border-slate-200 text-[11px] font-black uppercase tracking-wide text-slate-600 hover:bg-slate-50"
          >
            Voltar ao ativo
          </button>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-900 space-y-1">
          <p>
            <strong>Rastreabilidade preservada:</strong> entrada {ativo.origem_entrada_bruta_id}
          </p>
          <p>
            <strong>Estruturação de origem:</strong> {ativo.origem_ativo_em_estruturacao_id}
          </p>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 space-y-3">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">Campos-base do ativo canônico</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Nome</span>
            <input
              value={ativo.nome}
              onChange={(event) => onAtualizarAtivo({ nome: event.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Tipo de ativo</span>
            <select
              value={ativo.tipo_de_ativo}
              onChange={(event) => onAtualizarAtivo({ tipo_de_ativo: event.target.value as AtivoMetodologicoTipo })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
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
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Resumo</span>
          <textarea
            value={ativo.resumo}
            onChange={(event) => onAtualizarAtivo({ resumo: event.target.value })}
            rows={3}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 resize-y"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Definição</span>
          <textarea
            value={ativo.definicao}
            onChange={(event) => onAtualizarAtivo({ definicao: event.target.value })}
            rows={3}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 resize-y"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Objetivo</span>
          <textarea
            value={ativo.objetivo}
            onChange={(event) => onAtualizarAtivo({ objetivo: event.target.value })}
            rows={3}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 resize-y"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Status editorial</span>
            <select
              value={ativo.status_editorial}
              onChange={(event) => onAtualizarAtivo({ status_editorial: event.target.value as MetodologiaStatusEditorial })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            >
              {statusEditoriaisDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {getStatusEditorialLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Maturidade prática</span>
            <select
              value={ativo.maturidade_pratica}
              onChange={(event) => onAtualizarAtivo({ maturidade_pratica: event.target.value as MetodologiaMaturidadePratica })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            >
              {maturidadesDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {getMaturidadePraticaLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Governança</span>
            <select
              value={ativo.governanca_estado}
              onChange={(event) => onAtualizarAtivo({ governanca_estado: event.target.value as AtivoMetodologicoEstadoGovernanca })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
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

      <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 md:p-5 space-y-3">
        <header className="space-y-1">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">Versionamento canônico inicial</p>
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Versões registradas e manutenção recente</h4>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={numeroVersao}
            onChange={(event) => setNumeroVersao(event.target.value)}
            placeholder="Número da versão (ex.: 1.0.1)"
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800"
          />
          <select
            value={statusVersao}
            onChange={(event) => setStatusVersao(event.target.value as AtivoCanonicoVersaoStatus)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800"
          >
            <option value="rascunho">Rascunho</option>
            <option value="vigente">Vigente</option>
            <option value="superada">Superada</option>
          </select>
        </div>

        <input
          value={tituloVersao}
          onChange={(event) => setTituloVersao(event.target.value)}
          placeholder="Título opcional da versão"
          className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800"
        />

        <textarea
          value={resumoVersao}
          onChange={(event) => setResumoVersao(event.target.value)}
          rows={3}
          placeholder="Resumo da versão"
          className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800 resize-y"
        />

        <button
          type="button"
          onClick={handleRegistrarVersao}
          disabled={!numeroVersao.trim() || !resumoVersao.trim()}
          className="px-3 py-2 rounded-lg bg-amber-700 text-white text-[11px] font-black uppercase tracking-wide disabled:opacity-50"
        >
          Registrar versão
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <article className="rounded-xl border border-amber-200 bg-white p-3 space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wide text-amber-800">Versões canônicas</p>
            {totalSemSnapshot > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900 flex items-center justify-between gap-2">
                <span>{totalSemSnapshot} versão(ões) sem snapshot.</span>
                <button
                  type="button"
                  onClick={onGerarSnapshotsFaltantes}
                  className="px-2.5 py-1.5 rounded-md bg-amber-700 text-white text-[10px] font-black uppercase tracking-wide"
                >
                  Gerar snapshot faltante
                </button>
              </div>
            )}
            {(ativo.versoes_canonicas ?? []).length === 0 ? (
              <p className="text-xs text-slate-600">Nenhuma versão canônica registrada.</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {(ativo.versoes_canonicas ?? []).map((versao) => (
                  <div key={versao.id} className="rounded-lg border border-amber-100 bg-amber-50/40 p-2.5">
                    <p className="text-xs font-black text-slate-900">{versao.numero_versao} • {versao.status_da_versao}</p>
                    {versao.titulo && <p className="text-xs font-semibold text-amber-900 mt-0.5">{versao.titulo}</p>}
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{versao.resumo_da_versao}</p>
                    <div className="mt-2 rounded-md border border-slate-200 bg-white p-2 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                        Snapshot: {statusPorVersaoId.get(versao.id)?.status ?? 'ausente'}
                      </p>
                      {!!statusPorVersaoId.get(versao.id)?.integridade.pendencias.length && (
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {statusPorVersaoId.get(versao.id)?.integridade.pendencias[0]}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => onRevalidarSnapshot(versao)}
                          className="px-2 py-1 rounded-md border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-700"
                        >
                          Revalidar
                        </button>
                        <button
                          type="button"
                          onClick={() => onRegenerarSnapshot(versao)}
                          className="px-2 py-1 rounded-md border border-indigo-200 text-[10px] font-black uppercase tracking-wide text-indigo-700"
                        >
                          Regenerar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-xl border border-indigo-200 bg-white p-3 space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wide text-indigo-800">Eventos recentes</p>
            {(ativo.eventos_manutencao ?? []).length === 0 ? (
              <p className="text-xs text-slate-600">Nenhum evento de manutenção registrado.</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {(ativo.eventos_manutencao ?? []).slice(0, 12).map((evento) => (
                  <div key={evento.id} className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-2.5">
                    <p className="text-[10px] font-black uppercase tracking-wide text-indigo-700">{evento.tipo_de_evento}</p>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{evento.descricao}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <article className="rounded-xl border border-amber-200 bg-white p-3 space-y-3">
          <header className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-wide text-amber-800">Diff leve entre versões canônicas</p>
            <p className="text-xs text-slate-600">
              Leitura comparativa rápida entre marcos formais. Não substitui auditoria profunda nem evento de manutenção.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">Versão anterior</span>
              <select
                value={versaoAnteriorSelecionadaId}
                onChange={(event) => setVersaoAnteriorSelecionadaId(event.target.value)}
                className="rounded-lg border border-amber-200 bg-white px-2.5 py-2 text-xs text-slate-800"
              >
                <option value="">Selecionar</option>
                {versoesCanonicasOrdenadas.map((versao) => (
                  <option key={versao.id} value={versao.id}>
                    {versao.numero_versao} • {versao.status_da_versao}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">Versão atual</span>
              <select
                value={versaoAtualSelecionadaId}
                onChange={(event) => setVersaoAtualSelecionadaId(event.target.value)}
                className="rounded-lg border border-amber-200 bg-white px-2.5 py-2 text-xs text-slate-800"
              >
                <option value="">Selecionar</option>
                {versoesCanonicasOrdenadas.map((versao) => (
                  <option key={versao.id} value={versao.id}>
                    {versao.numero_versao} • {versao.status_da_versao}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {comparacaoSelecionada.comparacao ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-700">
                <strong>
                  {comparacaoSelecionada.comparacao.versao_anterior.numero_versao} → {comparacaoSelecionada.comparacao.versao_atual.numero_versao}:
                </strong>{' '}
                {comparacaoSelecionada.comparacao.resumo_textual}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-700">Campos-base alterados</p>
                  {comparacaoSelecionada.comparacao.mudancas_campos.length === 0 ? (
                    <p className="text-xs text-slate-600 mt-1">Sem alteração de campos-base.</p>
                  ) : (
                    <ul className="mt-1.5 space-y-1">
                      {comparacaoSelecionada.comparacao.mudancas_campos.map((mudanca) => (
                        <li key={mudanca.campo} className="text-xs text-slate-700">
                          <strong>{mudanca.label}:</strong> “{mudanca.valor_anterior || '—'}” → “{mudanca.valor_atual || '—'}”
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-700">Blocos (resumo)</p>
                  <p className="text-xs text-slate-700 mt-1">
                    Total: {comparacaoSelecionada.comparacao.total_blocos_antes} → {comparacaoSelecionada.comparacao.total_blocos_depois} | Criados:{' '}
                    {comparacaoSelecionada.comparacao.total_blocos_criados} | Removidos: {comparacaoSelecionada.comparacao.total_blocos_removidos} |
                    Alterados: {comparacaoSelecionada.comparacao.total_blocos_alterados}
                  </p>
                  {comparacaoSelecionada.comparacao.mudancas_blocos.length === 0 ? (
                    <p className="text-xs text-slate-600 mt-1">Sem alteração detectável em blocos.</p>
                  ) : (
                    <ul className="mt-1.5 space-y-1 max-h-32 overflow-y-auto pr-1">
                      {comparacaoSelecionada.comparacao.mudancas_blocos.map((mudanca) => (
                        <li key={`${mudanca.tipo}-${mudanca.bloco_origem_estruturacao_id}`} className="text-xs text-slate-700">
                          <strong>{mudanca.tipo.toUpperCase()}</strong> • {mudanca.titulo_depois ?? mudanca.titulo_antes ?? 'Sem título'}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600">{comparacaoSelecionada.mensagem}</p>
          )}
        </article>
      </section>

      <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-4 md:p-5 space-y-3">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-700">Blocos canônicos</p>
            <h4 className="text-lg font-black text-slate-900 tracking-tight mt-1">Edição simples do corpo canônico</h4>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={origemSelecionadaParaCriacao}
              onChange={(event) => setOrigemSelecionadaParaCriacao(event.target.value)}
              className="rounded-lg border border-violet-200 bg-white px-2.5 py-2 text-xs text-slate-800"
              disabled={!blocosOrigemDisponiveis.length}
            >
              {blocosOrigemDisponiveis.length === 0 && <option value="">Sem blocos de origem disponíveis</option>}
              {blocosOrigemDisponiveis.map((bloco) => (
                <option key={bloco.id} value={bloco.id}>
                  {bloco.titulo || `Bloco ${bloco.id.slice(0, 8)}`}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => origemSelecionadaParaCriacao && onCriarBlocoFromOrigem(origemSelecionadaParaCriacao)}
              disabled={!origemSelecionadaParaCriacao}
              className="px-3 py-2 rounded-lg bg-violet-700 text-white text-[11px] font-black uppercase tracking-wide disabled:opacity-50"
            >
              Criar bloco
            </button>
          </div>
        </header>

        {blocosCanonicos.length === 0 ? (
          <p className="text-sm text-violet-900/80">Nenhum bloco canônico encontrado para este ativo.</p>
        ) : (
          <div className="space-y-3">
            {blocosCanonicos.map((bloco, index) => (
              <article key={bloco.id} className="rounded-xl border border-violet-200 bg-white p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 rounded-md bg-violet-50 text-violet-800 text-[10px] font-black uppercase tracking-wide">
                    #{bloco.ordem}
                  </span>
                  <select
                    value={bloco.tipo_de_bloco}
                    onChange={(event) => onAtualizarBloco(bloco.id, { tipo_de_bloco: event.target.value as AtivoCanonicoBlocoTipo })}
                    className="rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-800"
                  >
                    {tiposBlocoDisponiveis.map((item) => (
                      <option key={item.tipo} value={item.tipo}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={bloco.status_do_bloco}
                    onChange={(event) => onAtualizarBloco(bloco.id, { status_do_bloco: event.target.value as AtivoCanonicoBloco['status_do_bloco'] })}
                    className="rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-800"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="ativo">Ativo</option>
                    <option value="arquivado">Arquivado</option>
                  </select>

                  <div className="ml-auto flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onMoverBloco(bloco.id, 'cima')}
                      disabled={index === 0}
                      className="px-2 py-1 rounded-md border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-600 disabled:opacity-40"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoverBloco(bloco.id, 'baixo')}
                      disabled={index === blocosCanonicos.length - 1}
                      className="px-2 py-1 rounded-md border border-slate-200 text-[10px] font-black uppercase tracking-wide text-slate-600 disabled:opacity-40"
                    >
                      Descer
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoverBloco(bloco.id)}
                      className="px-2 py-1 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wide"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <input
                  value={bloco.titulo}
                  onChange={(event) => onAtualizarBloco(bloco.id, { titulo: event.target.value })}
                  placeholder="Título do bloco"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
                />

                <textarea
                  value={bloco.conteudo}
                  onChange={(event) => onAtualizarBloco(bloco.id, { conteudo: event.target.value })}
                  rows={4}
                  placeholder="Conteúdo do bloco"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 resize-y"
                />

                <p className="text-[11px] text-slate-500">
                  Origem de estruturação: <span className="font-semibold">{bloco.bloco_origem_estruturacao_id}</span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};
