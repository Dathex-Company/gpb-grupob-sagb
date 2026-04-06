import React from 'react';
import type {
  AtivoMetodologicoCamadaMeta,
  Metodologia,
  MetodologiaBlocoTipo
} from '../types';
import {
  getAtivoById,
  getEstadoGovernancaLabel,
  getHistoricoEventoTipoLabel,
  getMaturidadePraticaLabel,
  getNomeAtivoById,
  getPapelGovernancaLabel,
  getStatusEditorialLabel,
  getTipoDeAtivoLabel,
  getTipoProjecaoOperacionalLabel,
  getTipoRelacaoLabel,
  getVersaoStatusLabel,
  getVersaoVigente
} from '../services';

interface AtivoDetalheCamadasProps {
  metodologia: Metodologia;
}

const CAMADAS_LEITURA: AtivoMetodologicoCamadaMeta[] = [
  {
    id: 'essencia',
    label: 'Essência',
    descricao: 'Identidade, definição, objetivo e tese central do ativo.'
  },
  {
    id: 'estrutura',
    label: 'Estrutura',
    descricao: 'Blocos internos e relações estruturais do ativo no catálogo.'
  },
  {
    id: 'aplicacao',
    label: 'Aplicação',
    descricao: 'Leitura prática, contexto de uso e projeções operacionais derivadas.'
  },
  {
    id: 'governanca',
    label: 'Governança',
    descricao: 'Responsáveis, estado institucional e decisões de ciclo de vida.'
  },
  {
    id: 'evidencias',
    label: 'Evidências',
    descricao: 'Aplicações registradas, validações e aprendizados de campo.'
  },
  {
    id: 'evolucao',
    label: 'Evolução',
    descricao: 'Versões oficiais e histórico estruturado do ativo.'
  }
];

const formatarData = (valor: string) => new Date(valor).toLocaleDateString('pt-BR');

const TIPO_BLOCO_CANONICO_LABEL: Record<string, string> = {
  essencia: 'Essência',
  principio: 'Princípio',
  etapa: 'Etapa',
  regra: 'Regra',
  aplicacao: 'Aplicação',
  checklist: 'Checklist',
  observacao_estrutural: 'Observação estrutural'
};

const obterBloco = (metodologia: Metodologia, tipo: MetodologiaBlocoTipo) => {
  return metodologia.blocos_base.find((bloco) => bloco.tipo === tipo);
};

const CamadaSecao: React.FC<{
  id: string;
  label: string;
  descricao: string;
  children: React.ReactNode;
}> = ({ id, label, descricao, children }) => (
  <section id={`camada-${id}`} className="scroll-mt-36 rounded-2xl border border-slate-100 bg-slate-50/55 p-5 md:p-6 space-y-4">
    <header>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Camada {label}</p>
      <h3 className="text-lg md:text-xl font-black tracking-tight text-slate-900 mt-1">{label}</h3>
      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{descricao}</p>
    </header>
    {children}
  </section>
);

export const AtivoDetalheCamadas: React.FC<AtivoDetalheCamadasProps> = ({ metodologia }) => {
  const versaoVigente = getVersaoVigente(metodologia);
  const blocoEssencia = obterBloco(metodologia, 'essencia');
  const blocoEstrutura = obterBloco(metodologia, 'estrutura');
  const blocoAplicacao = obterBloco(metodologia, 'aplicacao');
  const blocoGovernanca = obterBloco(metodologia, 'governanca');
  const blocosCanonicosOrdenados = [...(metodologia.blocos_canonicos ?? [])].sort((a, b) => a.ordem - b.ordem);
  const blocosCanonicosEssencia = blocosCanonicosOrdenados.filter((bloco) => ['essencia', 'principio'].includes(bloco.tipo_de_bloco));
  const blocosCanonicosEstrutura = blocosCanonicosOrdenados.filter((bloco) =>
    ['etapa', 'regra', 'observacao_estrutural'].includes(bloco.tipo_de_bloco)
  );
  const blocosCanonicosAplicacao = blocosCanonicosOrdenados.filter((bloco) => ['aplicacao', 'checklist'].includes(bloco.tipo_de_bloco));
  const blocosCanonicosGovernanca = blocosCanonicosOrdenados.filter((bloco) => bloco.tipo_de_bloco === 'observacao_estrutural');

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Detalhe de referência por camadas</h2>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white">
              {getTipoDeAtivoLabel(metodologia.tipo_de_ativo)}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
              {getStatusEditorialLabel(metodologia.status_editorial)}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-700">
              {getMaturidadePraticaLabel(metodologia.maturidade_pratica)}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
              {getEstadoGovernancaLabel(metodologia.governanca.estado_ciclo_vida)}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">{metodologia.versao_atual}</span>
            {versaoVigente && <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">Vigente: {versaoVigente.numero_versao}</span>}
          </div>
        </div>

        <article className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-900">Navegação conceitual</p>
          <p className="text-sm text-cyan-900/85 mt-1 leading-relaxed">
            O conteúdo do ativo está organizado por zonas de domínio para facilitar leitura progressiva e suportar crescimento sem
            acúmulo monolítico de cards.
          </p>
          <nav className="flex flex-wrap gap-2 mt-3">
            {CAMADAS_LEITURA.map((camada) => (
              <a
                key={camada.id}
                href={`#camada-${camada.id}`}
                className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide border border-cyan-200 bg-white text-cyan-800 hover:bg-cyan-100 transition"
              >
                {camada.label}
              </a>
            ))}
          </nav>
        </article>
      </header>

      <div className="space-y-5">
        <CamadaSecao
          id="essencia"
          label="Essência"
          descricao="Identidade canônica, definição de domínio, objetivo e tese central do ativo metodológico."
        >
          <article className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
            <h4 className="text-lg font-black text-slate-900 tracking-tight">{metodologia.nome}</h4>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">{metodologia.slug}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{metodologia.resumo}</p>
          </article>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <article className="rounded-2xl border border-slate-100 bg-white p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-slate-700">Definição</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{metodologia.definicao}</p>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-slate-700">Objetivo</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{metodologia.objetivo}</p>
            </article>
          </div>

          {blocoEssencia && (
            <article className="rounded-2xl border border-slate-100 bg-white p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-slate-700">Contrato de Essência</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{blocoEssencia.resumo}</p>
            </article>
          )}

          {blocosCanonicosEssencia.length > 0 && (
            <article className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
              <h4 className="text-sm font-black uppercase tracking-wide text-slate-700">Blocos canônicos (origem rastreável)</h4>
              <div className="space-y-2">
                {blocosCanonicosEssencia.map((bloco) => (
                  <div key={bloco.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-600">
                      #{bloco.ordem} • {TIPO_BLOCO_CANONICO_LABEL[bloco.tipo_de_bloco] ?? bloco.tipo_de_bloco}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{bloco.titulo}</p>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{bloco.conteudo || 'Sem conteúdo.'}</p>
                  </div>
                ))}
              </div>
            </article>
          )}
        </CamadaSecao>

        <CamadaSecao
          id="estrutura"
          label="Estrutura"
          descricao="Blocos internos e relações estruturais que conectam o ativo à arquitetura semântica do núcleo."
        >
          {blocoEstrutura && (
            <article className="rounded-2xl border border-cyan-100 bg-white p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-cyan-900">Bloco Estrutural</h4>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">{blocoEstrutura.resumo}</p>
            </article>
          )}

          {blocosCanonicosEstrutura.length > 0 && (
            <article className="rounded-2xl border border-cyan-100 bg-white p-4 space-y-2">
              <h4 className="text-sm font-black uppercase tracking-wide text-cyan-900">Blocos estruturais canônicos</h4>
              <div className="space-y-2">
                {blocosCanonicosEstrutura.map((bloco) => (
                  <div key={bloco.id} className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                      #{bloco.ordem} • {TIPO_BLOCO_CANONICO_LABEL[bloco.tipo_de_bloco] ?? bloco.tipo_de_bloco}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{bloco.titulo}</p>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{bloco.conteudo || 'Sem conteúdo.'}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          <article className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-black uppercase tracking-wide text-cyan-900">Relações entre ativos</h4>
              <span className="px-2 py-1 rounded-md bg-white border border-cyan-200 text-[11px] font-bold text-cyan-700">
                {metodologia.relacoes_ativos?.length ?? 0} relações
              </span>
            </div>

            {metodologia.relacoes_ativos?.length ? (
              <div className="space-y-2">
                {metodologia.relacoes_ativos.map((relacao) => {
                  const ativoDestino = getAtivoById(relacao.ativo_destino_id);

                  return (
                    <div key={relacao.id} className="rounded-xl border border-cyan-100 bg-white p-3">
                      <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                        {getTipoRelacaoLabel(relacao.tipo_de_relacao)}
                      </p>
                      <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                        <strong>{metodologia.nome}</strong> → {getNomeAtivoById(relacao.ativo_destino_id)}
                      </p>
                      {ativoDestino && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          Tipo do destino: {getTipoDeAtivoLabel(ativoDestino.tipo_de_ativo)}
                        </p>
                      )}
                      {relacao.observacao && <p className="text-xs text-cyan-900/80 mt-2 leading-relaxed">{relacao.observacao}</p>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-cyan-900/75">Nenhuma relação estrutural registrada para este ativo.</p>
            )}
          </article>
        </CamadaSecao>

        <CamadaSecao
          id="aplicacao"
          label="Aplicação"
          descricao="Leitura prática do ativo, desdobramentos operacionais e pistas para uso em contexto real."
        >
          {blocoAplicacao && (
            <article className="rounded-2xl border border-violet-100 bg-white p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-violet-900">Bloco de Aplicação</h4>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">{blocoAplicacao.resumo}</p>
            </article>
          )}

          {blocosCanonicosAplicacao.length > 0 && (
            <article className="rounded-2xl border border-violet-100 bg-white p-4 space-y-2">
              <h4 className="text-sm font-black uppercase tracking-wide text-violet-900">Blocos de aplicação canônicos</h4>
              <div className="space-y-2">
                {blocosCanonicosAplicacao.map((bloco) => (
                  <div key={bloco.id} className="rounded-xl border border-violet-100 bg-violet-50/40 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-violet-700">
                      #{bloco.ordem} • {TIPO_BLOCO_CANONICO_LABEL[bloco.tipo_de_bloco] ?? bloco.tipo_de_bloco}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{bloco.titulo}</p>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{bloco.conteudo || 'Sem conteúdo.'}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          <article className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wide text-violet-900">Projeções operacionais derivadas</h4>
                <p className="text-xs text-violet-900/75 mt-1 leading-relaxed">
                  Desdobramentos operacionais da fonte canônica. Não substituem a metodologia principal.
                </p>
              </div>
              <span className="px-2 py-1 rounded-md bg-white border border-violet-200 text-[11px] font-bold text-violet-700">
                {metodologia.ativos_derivados?.length ?? 0} projeções
              </span>
            </div>

            {metodologia.ativos_derivados?.length ? (
              <div className="space-y-2">
                {metodologia.ativos_derivados.map((derivado) => (
                  <div key={derivado.id} className="rounded-xl border border-violet-100 bg-white p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-black text-slate-900">{derivado.nome}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 text-[10px] font-black uppercase tracking-wide">
                          {getTipoProjecaoOperacionalLabel(derivado.tipo_de_projecao)}
                        </span>
                        {derivado.status_editorial && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wide">
                            {getStatusEditorialLabel(derivado.status_editorial)}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wide">
                          {derivado.versao_atual}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">
                      <strong>Origem vinculada:</strong> {getNomeAtivoById(derivado.ativo_origem_id)}
                    </p>

                    <p className="text-sm text-slate-700 leading-relaxed">{derivado.resumo}</p>
                    <p className="text-xs text-violet-900/90">
                      <strong>Objetivo:</strong> {derivado.objetivo}
                    </p>

                    {derivado.observacao && <p className="text-xs text-violet-900/80 leading-relaxed">{derivado.observacao}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-violet-900/75">Este ativo ainda não possui projeções operacionais derivadas registradas.</p>
            )}
          </article>
        </CamadaSecao>

        <CamadaSecao
          id="governanca"
          label="Governança"
          descricao="Responsabilidade institucional, estado de ciclo de vida e decisões formais sobre oficialização, arquivamento e obsolescência."
        >
          {blocoGovernanca && (
            <article className="rounded-2xl border border-indigo-100 bg-white p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-indigo-900">Bloco de Governança</h4>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">{blocoGovernanca.resumo}</p>
            </article>
          )}

          {blocosCanonicosGovernanca.length > 0 && (
            <article className="rounded-2xl border border-indigo-100 bg-white p-4 space-y-2">
              <h4 className="text-sm font-black uppercase tracking-wide text-indigo-900">Observações estruturais promovidas</h4>
              <div className="space-y-2">
                {blocosCanonicosGovernanca.map((bloco) => (
                  <div key={bloco.id} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-indigo-700">
                      #{bloco.ordem} • Origem {bloco.bloco_origem_estruturacao_id.slice(0, 8)}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{bloco.titulo}</p>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{bloco.conteudo || 'Sem conteúdo.'}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          <article className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wide text-indigo-900">Quadro de Governança</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-indigo-700">Estado do ciclo</p>
                <p className="text-sm font-semibold text-indigo-900 mt-1">
                  {getEstadoGovernancaLabel(metodologia.governanca.estado_ciclo_vida)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-indigo-700">Oficialização</p>
                <p className="text-sm text-indigo-900 mt-1">
                  {metodologia.governanca.oficializado_em ? formatarData(metodologia.governanca.oficializado_em) : 'Não oficializado'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-indigo-700 mb-2">Responsáveis vinculados</p>
              <div className="flex flex-wrap gap-2">
                {metodologia.governanca.responsaveis.map((responsavel) => (
                  <span
                    key={responsavel.id}
                    className="px-2.5 py-1 rounded-md border border-indigo-200 bg-white text-[11px] text-indigo-900"
                  >
                    <strong>{getPapelGovernancaLabel(responsavel.papel)}:</strong> {responsavel.nome}
                  </span>
                ))}
              </div>
            </div>

            {metodologia.governanca.estado_ciclo_vida === 'obsoleto' && metodologia.governanca.substituido_por_ativo_id && (
              <p className="text-sm text-amber-700 font-semibold">
                Ativo superado por: {getNomeAtivoById(metodologia.governanca.substituido_por_ativo_id)}
              </p>
            )}

            {metodologia.governanca.estado_ciclo_vida === 'arquivado' && (
              <p className="text-sm text-slate-700">
                <strong>Motivo de arquivamento:</strong> {metodologia.governanca.motivo_arquivamento ?? 'Não informado'}
              </p>
            )}

            {metodologia.governanca.observacao && (
              <p className="text-sm text-indigo-900/80 leading-relaxed">{metodologia.governanca.observacao}</p>
            )}
          </article>
        </CamadaSecao>

        <CamadaSecao
          id="evidencias"
          label="Evidências"
          descricao="Registros de aplicação real, sinais de validação e aprendizados acumulados no uso do ativo."
        >
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-black uppercase tracking-wide text-emerald-900">Evidências de aplicação</h4>
              <span className="px-2 py-1 rounded-md bg-white border border-emerald-200 text-[11px] font-bold text-emerald-700">
                {metodologia.evidencias_aplicacao?.length ?? 0} evidências
              </span>
            </div>

            {metodologia.evidencias_aplicacao?.length ? (
              <div className="space-y-2">
                {metodologia.evidencias_aplicacao.map((evidencia) => (
                  <div key={evidencia.id} className="rounded-xl border border-emerald-100 bg-white p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">{evidencia.contexto}</p>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${
                          evidencia.validou_ativo === true
                            ? 'bg-emerald-100 text-emerald-800'
                            : evidencia.validou_ativo === false
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {evidencia.validou_ativo === true
                          ? 'Validou ativo'
                          : evidencia.validou_ativo === false
                          ? 'Não validou'
                          : 'Em observação'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">Aplicado em: {evidencia.aplicado_em}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{evidencia.descricao}</p>

                    <p className="text-xs text-emerald-900/90">
                      <strong>Resultado percebido:</strong> {evidencia.resultado_percebido}
                    </p>
                    <p className="text-xs text-emerald-900/90">
                      <strong>Aprendizados:</strong> {evidencia.aprendizados}
                    </p>

                    {evidencia.observacao && <p className="text-xs text-emerald-900/80 leading-relaxed">{evidencia.observacao}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-emerald-900/75">Nenhuma evidência registrada para este ativo.</p>
            )}
          </article>
        </CamadaSecao>

        <CamadaSecao
          id="evolucao"
          label="Evolução"
          descricao="Trilha oficial de versões e histórico estruturado da trajetória do ativo metodológico."
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <article className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wide text-amber-900">Versões oficiais</h4>
                  <p className="text-xs text-amber-900/75 mt-1 leading-relaxed">
                    Marcos formais de evolução do ativo. Nem toda mudança operacional vira versão oficial.
                  </p>
                </div>
                <span className="px-2 py-1 rounded-md bg-white border border-amber-200 text-[11px] font-bold text-amber-700">
                  {metodologia.versoes_oficiais?.length ?? 0} versões
                </span>
              </div>

              {metodologia.versoes_oficiais?.length ? (
                <div className="space-y-2">
                  {metodologia.versoes_oficiais.map((versao) => (
                    <div key={versao.id} className="rounded-xl border border-amber-100 bg-white p-3 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-black text-slate-900">{versao.numero_versao}</p>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${
                              versao.status_da_versao === 'vigente'
                                ? 'bg-emerald-100 text-emerald-800'
                                : versao.status_da_versao === 'rascunho'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {getVersaoStatusLabel(versao.status_da_versao)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">{formatarData(versao.publicada_em)}</span>
                        </div>
                      </div>

                      {versao.titulo && <p className="text-xs font-bold text-amber-900">{versao.titulo}</p>}
                      <p className="text-sm text-slate-700 leading-relaxed">{versao.resumo_da_versao}</p>
                      {versao.observacao && <p className="text-xs text-amber-900/80">{versao.observacao}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-amber-900/75">Nenhuma versão oficial registrada para este ativo.</p>
              )}
            </article>

            <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wide text-rose-900">Histórico estruturado</h4>
                  <p className="text-xs text-rose-900/75 mt-1 leading-relaxed">
                    Eventos relevantes da trajetória do ativo, sem acoplamento a workflow técnico completo.
                  </p>
                </div>
                <span className="px-2 py-1 rounded-md bg-white border border-rose-200 text-[11px] font-bold text-rose-700">
                  {metodologia.historico_estruturado?.length ?? 0} eventos
                </span>
              </div>

              {metodologia.historico_estruturado?.length ? (
                <div className="space-y-2">
                  {[...metodologia.historico_estruturado]
                    .sort((a, b) => +new Date(b.ocorrido_em) - +new Date(a.ocorrido_em))
                    .map((evento) => (
                      <div key={evento.id} className="rounded-xl border border-rose-100 bg-white p-3 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wide">
                            {getHistoricoEventoTipoLabel(evento.tipo_de_evento)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">{formatarData(evento.ocorrido_em)}</span>
                        </div>

                        <p className="text-sm text-slate-700 leading-relaxed">{evento.descricao}</p>
                        {evento.observacao && <p className="text-xs text-rose-900/80">{evento.observacao}</p>}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-rose-900/75">Nenhum evento de histórico registrado para este ativo.</p>
              )}
            </article>
          </div>
        </CamadaSecao>
      </div>
    </section>
  );
};
