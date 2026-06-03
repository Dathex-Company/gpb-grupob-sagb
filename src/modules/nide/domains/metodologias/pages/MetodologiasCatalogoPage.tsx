import React from 'react';
import type { Metodologia } from '../types';
import { MetodologiasFrontCard } from '../components';
import {
  explorarCatalogoCanonico,
  getCatalogoFacetas,
  montarMapaConexoesVisuais,
  type CatalogoAgrupamento,
  type CatalogoFiltrosAvancados,
  type CatalogoOrdenacao,
  getEstadoGovernancaLabel,
  getMaturidadePraticaLabel,
  getStatusEditorialLabel,
  getTipoDeAtivoLabel
} from '../services';

interface MetodologiasCatalogoPageProps {
  ativos: Metodologia[];
  onAbrirAtivo: (slug: string) => void;
}

const FILTROS_INICIAIS: CatalogoFiltrosAvancados = {
  tipo_de_ativo: 'todos',
  status_editorial: 'todos',
  maturidade_pratica: 'todos',
  governanca_estado: 'todos',
  possui_blocos_canonicos: 'todos',
  possui_versao_vigente: 'todos',
  snapshot_equivalencia: 'todos',
  vindo_de_promocao: 'todos',
  origem_rastreavel: 'todos',
  manutencao_recente: 'todos'
};

export const MetodologiasCatalogoPage: React.FC<MetodologiasCatalogoPageProps> = ({ ativos, onAbrirAtivo }) => {
  const [busca, setBusca] = React.useState('');
  const [filtros, setFiltros] = React.useState<CatalogoFiltrosAvancados>(FILTROS_INICIAIS);
  const [ordenacao, setOrdenacao] = React.useState<CatalogoOrdenacao>('mais_recente');
  const [agrupamento, setAgrupamento] = React.useState<CatalogoAgrupamento>('nenhum');
  const [ativoPreviewId, setAtivoPreviewId] = React.useState<string>(ativos[0]?.id ?? '');

  const facetas = React.useMemo(() => getCatalogoFacetas(ativos), [ativos]);

  const exploracao = React.useMemo(
    () =>
      explorarCatalogoCanonico({
        ativos,
        busca,
        filtros,
        ordenacao,
        agrupamento
      }),
    [ativos, busca, filtros, ordenacao, agrupamento]
  );

  const ativosFiltrados = exploracao.itens;
  const mapaConexoes = React.useMemo(() => montarMapaConexoesVisuais({ ativos: ativosFiltrados, limiteArestas: 18 }), [ativosFiltrados]);

  const atualizarFiltro = <K extends keyof CatalogoFiltrosAvancados>(chave: K, valor: CatalogoFiltrosAvancados[K]) => {
    setFiltros((atual) => ({ ...atual, [chave]: valor }));
  };

  const limparExploracao = () => {
    setBusca('');
    setFiltros(FILTROS_INICIAIS);
    setOrdenacao('mais_recente');
    setAgrupamento('nenhum');
  };

  const ativoPreview = React.useMemo(
    () => ativosFiltrados.find((ativo) => ativo.id === ativoPreviewId) ?? ativosFiltrados[0] ?? null,
    [ativosFiltrados, ativoPreviewId]
  );

  React.useEffect(() => {
    if (!ativoPreviewId && ativosFiltrados[0]) setAtivoPreviewId(ativosFiltrados[0].id);
    if (ativoPreviewId && !ativosFiltrados.some((a) => a.id === ativoPreviewId)) {
      setAtivoPreviewId(ativosFiltrados[0]?.id ?? '');
    }
  }, [ativosFiltrados, ativoPreviewId]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-sagb-text tracking-tight">Catálogo de metodologias oficiais</h2>
          <p className="text-sagb-muted text-[12px]">
            Encontre metodologias com filtros simples e abra os detalhes quando precisar.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-sagb-muted">Exploração rápida</span>
      </div>

      <div className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-2">
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por nome, resumo, definição, objetivo e títulos de blocos..."
            className="xl:col-span-2 rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text placeholder-sagb-muted focus:outline-none focus:border-sagb-blue"
          />

          <select
            value={filtros.tipo_de_ativo}
            onChange={(event) => atualizarFiltro('tipo_de_ativo', event.target.value as CatalogoFiltrosAvancados['tipo_de_ativo'])}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
          >
            <option value="todos">Tipo: todos</option>
            {facetas.tipos.map((item) => (
              <option key={item} value={item}>{getTipoDeAtivoLabel(item)}</option>
            ))}
          </select>

          <select
            value={filtros.status_editorial}
            onChange={(event) => atualizarFiltro('status_editorial', event.target.value as CatalogoFiltrosAvancados['status_editorial'])}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
          >
            <option value="todos">Publicação: todas</option>
            {facetas.status.map((item) => (
              <option key={item} value={item}>{getStatusEditorialLabel(item)}</option>
            ))}
          </select>

          <select
            value={filtros.maturidade_pratica}
            onChange={(event) => atualizarFiltro('maturidade_pratica', event.target.value as CatalogoFiltrosAvancados['maturidade_pratica'])}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
          >
            <option value="todos">Maturidade: todas</option>
            {facetas.maturidades.map((item) => (
              <option key={item} value={item}>{getMaturidadePraticaLabel(item)}</option>
            ))}
          </select>

          <select
            value={filtros.governanca_estado}
            onChange={(event) => atualizarFiltro('governanca_estado', event.target.value as CatalogoFiltrosAvancados['governanca_estado'])}
            className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text"
          >
            <option value="todos">Governança: todos</option>
            {facetas.governancas.map((item) => (
              <option key={item} value={item}>{getEstadoGovernancaLabel(item)}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-2">
          <select value={filtros.possui_blocos_canonicos} onChange={(event) => atualizarFiltro('possui_blocos_canonicos', event.target.value as CatalogoFiltrosAvancados['possui_blocos_canonicos'])} className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text">
            <option value="todos">Conteúdo oficial: todos</option>
            <option value="sim">Com conteúdo oficial</option>
            <option value="nao">Sem conteúdo oficial</option>
          </select>

          <select value={filtros.possui_versao_vigente} onChange={(event) => atualizarFiltro('possui_versao_vigente', event.target.value as CatalogoFiltrosAvancados['possui_versao_vigente'])} className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text">
            <option value="todos">Versão vigente: todos</option>
            <option value="sim">Com versão vigente</option>
            <option value="nao">Sem versão vigente</option>
          </select>

          <select value={filtros.snapshot_equivalencia} onChange={(event) => atualizarFiltro('snapshot_equivalencia', event.target.value as CatalogoFiltrosAvancados['snapshot_equivalencia'])} className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text">
            <option value="todos">Cópia de segurança: todas</option>
            <option value="integro_minimo">Cópia validada</option>
            <option value="pendente">Cópia pendente</option>
          </select>

          <select value={filtros.vindo_de_promocao} onChange={(event) => atualizarFiltro('vindo_de_promocao', event.target.value as CatalogoFiltrosAvancados['vindo_de_promocao'])} className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text">
            <option value="todos">Origem: todas</option>
            <option value="sim">Somente publicadas do fluxo guiado</option>
            <option value="nao">Somente criadas fora do fluxo guiado</option>
          </select>

          <select value={filtros.origem_rastreavel} onChange={(event) => atualizarFiltro('origem_rastreavel', event.target.value as CatalogoFiltrosAvancados['origem_rastreavel'])} className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text">
            <option value="todos">Origem rastreada: todos</option>
            <option value="sim">Com origem rastreada</option>
            <option value="nao">Sem origem rastreada</option>
          </select>

          <select value={filtros.manutencao_recente} onChange={(event) => atualizarFiltro('manutencao_recente', event.target.value as CatalogoFiltrosAvancados['manutencao_recente'])} className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text">
            <option value="todos">Atualização recente: todas</option>
            <option value="sim">Com atualização recente</option>
            <option value="nao">Sem atualização recente</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
          <select value={ordenacao} onChange={(event) => setOrdenacao(event.target.value as CatalogoOrdenacao)} className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text">
            <option value="mais_recente">Ordenação: mais recente</option>
            <option value="mais_antigo">Ordenação: mais antigo</option>
            <option value="nome_az">Ordenação: nome A-Z</option>
            <option value="nome_za">Ordenação: nome Z-A</option>
            <option value="maior_qtd_blocos">Ordenação: maior quantidade de blocos</option>
            <option value="manutencao_recente">Ordenação: manutenção mais recente</option>
          </select>

          <select value={agrupamento} onChange={(event) => setAgrupamento(event.target.value as CatalogoAgrupamento)} className="rounded-lg border border-sagb-line bg-sagb-panel px-3 py-2 text-[12px] text-sagb-text">
            <option value="nenhum">Agrupar: sem agrupamento</option>
            <option value="tipo_de_ativo">Agrupar por tipo de ativo</option>
            <option value="status_editorial">Agrupar por publicação</option>
            <option value="maturidade_pratica">Agrupar por maturidade</option>
          </select>

          <div className="xl:col-span-2 rounded-lg border border-sagb-line bg-sagb-bg-2 px-3 py-2 text-[12px] text-sagb-muted flex items-center">
            {exploracao.resumo.total_resultados} de {exploracao.resumo.total_ativos_base} metodologias no recorte atual.
          </div>

          <button
            type="button"
            onClick={limparExploracao}
            className="px-3 py-2 rounded-lg border border-sagb-line text-[12px] font-black uppercase tracking-wide text-sagb-muted hover:bg-sagb-bg-2"
          >
            Limpar filtros
          </button>
        </div>

        {exploracao.resumo.possui_filtros_ativos && (
          <div className="flex flex-wrap gap-1.5">
            {exploracao.resumo.filtros_ativos.map((filtro) => (
              <span key={filtro} className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-sagb-blue/10 text-sagb-blue">
                {filtro}
              </span>
            ))}
          </div>
        )}
      </div>

      <section className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
             <p className="text-[11px] font-semibold text-sagb-muted">Mapa de conexões</p>
             <h3 className="text-xl font-black text-sagb-text tracking-tight mt-1">Como as metodologias se conectam</h3>
             <p className="text-[12px] text-sagb-muted mt-1">Visão resumida de relações entre metodologias oficiais neste recorte.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wide">
            <span className="px-2.5 py-1 rounded-md bg-sagb-bg-2 text-sagb-text">{mapaConexoes.total_ativos} metodologias</span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-500">{mapaConexoes.total_arestas} conexões</span>
            <span className="px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-500">{mapaConexoes.total_ativos_conectados} conectados</span>
          </div>
        </div>

        {mapaConexoes.total_arestas === 0 ? (
          <p className="text-[12px] text-sagb-muted">Ainda não há conexões registradas para o recorte atual.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <article className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3 space-y-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-sagb-text">Arestas (amostra)</p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {mapaConexoes.arestas.map((aresta) => (
                  (() => {
                    const slugDestino = aresta.destino_slug || aresta.origem_slug;
                    const podeAbrir = Boolean(slugDestino);
                    return (
                  <button
                    key={aresta.id}
                    type="button"
                    onClick={() => {
                      if (slugDestino) onAbrirAtivo(slugDestino);
                    }}
                    disabled={!podeAbrir}
                    className={`w-full text-left rounded-lg border px-3 py-2 transition ${
                      podeAbrir
                        ? 'border-sagb-line bg-sagb-panel hover:bg-sagb-bg-2'
                        : 'border-sagb-line bg-sagb-bg-2 text-sagb-muted cursor-not-allowed'
                    }`}
                  >
                    <p className="text-[12px] font-semibold text-sagb-text leading-relaxed">
                      {aresta.origem_nome} <span className="text-cyan-500">— {aresta.tipo_relacao_label} →</span> {aresta.destino_nome}
                    </p>
                  </button>
                    );
                  })()
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3 space-y-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-sagb-text">Ativos mais conectados</p>
              <div className="space-y-2">
                {mapaConexoes.ativos_mais_conectados.map((item) => (
                  (() => {
                    const podeAbrir = Boolean(item.slug);
                    return (
                  <button
                    key={item.ativo_id}
                    type="button"
                    onClick={() => {
                      if (item.slug) onAbrirAtivo(item.slug);
                    }}
                    disabled={!podeAbrir}
                    className={`w-full text-left rounded-lg border px-3 py-2 transition ${
                      podeAbrir
                        ? 'border-sagb-line bg-sagb-panel hover:bg-sagb-bg-2'
                        : 'border-sagb-line bg-sagb-bg-2 text-sagb-muted cursor-not-allowed'
                    }`}
                  >
                    <p className="text-[12px] font-semibold text-sagb-text">{item.nome}</p>
                    <p className="text-[11px] text-sagb-muted mt-1">
                      Conexões: <strong>{item.total_conexoes}</strong> · Saídas {item.total_saidas} · Entradas {item.total_entradas}
                    </p>
                  </button>
                    );
                  })()
                ))}
              </div>
            </article>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="space-y-4">
          {ativosFiltrados.length === 0 ? (
            <section className="rounded-2xl border border-sagb-line bg-sagb-panel p-6 text-center">
              <h3 className="text-lg font-black text-sagb-text">Nenhuma metodologia encontrada</h3>
              <p className="text-[12px] text-sagb-muted mt-2 leading-relaxed">
                Ajuste os filtros ou limpe o recorte para explorar novamente o catálogo.
              </p>
              <button
                type="button"
                onClick={limparExploracao}
                className="mt-4 px-4 py-2 rounded-lg bg-sagb-blue text-white text-[11px] font-black uppercase tracking-wide hover:opacity-90 transition"
              >
                Limpar e mostrar catálogo
              </button>
            </section>
          ) : (
            exploracao.grupos.map((grupo) => (
              <section key={grupo.chave} className="space-y-2">
                {agrupamento !== 'nenhum' && (
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[12px] font-black uppercase tracking-wide text-sagb-text">{grupo.label}</h3>
                    <span className="text-[10px] font-black uppercase tracking-wide text-sagb-muted">{grupo.itens.length} ativo(s)</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {grupo.itens.map((metodologia) => (
                    <MetodologiasFrontCard
                      key={metodologia.id}
                      metodologia={metodologia}
                      onAbrirAtivo={() => onAbrirAtivo(metodologia.slug)}
                      onSelecionarPreview={() => setAtivoPreviewId(metodologia.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        <aside className="rounded-2xl border border-sagb-line bg-sagb-panel p-4 h-fit sticky top-4 space-y-3">
           <h3 className="text-[12px] font-semibold text-sagb-text">Preview rápido</h3>
          {!ativoPreview ? (
            <p className="text-[12px] text-sagb-muted">Sem ativo disponível para preview.</p>
          ) : (
            <>
              <p className="text-base font-black text-sagb-text">{ativoPreview.nome}</p>
              <p className="text-[12px] text-sagb-muted leading-relaxed">{ativoPreview.resumo}</p>
              <div className="space-y-1.5 text-[12px] text-sagb-text">
                <p><strong>Tipo:</strong> {getTipoDeAtivoLabel(ativoPreview.tipo_de_ativo)}</p>
                <p><strong>Publicação:</strong> {getStatusEditorialLabel(ativoPreview.status_editorial)}</p>
                <p><strong>Maturidade:</strong> {getMaturidadePraticaLabel(ativoPreview.maturidade_pratica)}</p>
                <p><strong>Ciclo de governança:</strong> {getEstadoGovernancaLabel(ativoPreview.governanca.estado_ciclo_vida)}</p>
                <p><strong>Versão:</strong> {ativoPreview.versao_atual}</p>
              </div>
              <button
                type="button"
                onClick={() => onAbrirAtivo(ativoPreview.slug)}
                className="w-full px-3.5 py-2 rounded-lg bg-sagb-blue text-white text-[11px] font-black uppercase tracking-wide hover:opacity-90 transition"
              >
                Abrir detalhe do ativo
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
};
