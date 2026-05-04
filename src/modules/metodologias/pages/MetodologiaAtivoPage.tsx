import React from 'react';
import { AtivoDetalheCamadas } from '../components';
import type { Metodologia } from '../types';
import {
  getEstadoGovernancaLabel,
  getMaturidadePraticaLabel,
  getStatusEditorialLabel,
  getTipoDeAtivoLabel,
  listarRelacoesVisuaisDoAtivo
} from '../services';

interface MetodologiaAtivoPageProps {
  metodologia: Metodologia;
  ativosContexto: Metodologia[];
  onVoltarCatalogo: () => void;
  onEditarAtivo: () => void;
  onAbrirAtivoRelacionado?: (slug: string) => void;
  modoEdicaoLabel?: string;
}

export const MetodologiaAtivoPage: React.FC<MetodologiaAtivoPageProps> = ({
  metodologia,
  ativosContexto,
  onVoltarCatalogo,
  onEditarAtivo,
  onAbrirAtivoRelacionado,
  modoEdicaoLabel = 'Edição guiada'
}) => {
  const relacoes = React.useMemo(
    () => listarRelacoesVisuaisDoAtivo({ ativoId: metodologia.id, ativos: ativosContexto }),
    [metodologia.id, ativosContexto]
  );

  const gruposRelacao: Array<{
    chave: 'saida' | 'entrada';
    titulo: string;
    itens: typeof relacoes.saida;
    containerClass: string;
    tituloClass: string;
    contadorClass: string;
  }> = [
    {
      chave: 'saida',
      titulo: 'Saídas',
      itens: relacoes.saida,
      containerClass: 'rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 space-y-3',
      tituloClass: 'text-[12px] font-black uppercase tracking-wide text-emerald-500',
      contadorClass: 'text-[10px] font-black uppercase tracking-wide text-emerald-500'
    },
    {
      chave: 'entrada',
      titulo: 'Entradas',
      itens: relacoes.entrada,
      containerClass: 'rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4 space-y-3',
      tituloClass: 'text-[12px] font-black uppercase tracking-wide text-violet-500',
      contadorClass: 'text-[10px] font-black uppercase tracking-wide text-violet-500'
    }
  ];

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-sagb-line bg-sagb-panel p-6 md:p-7 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-sagb-muted">Ativo metodológico</p>
            <h2 className="text-2xl md:text-3xl font-black text-sagb-text tracking-tight mt-1">{metodologia.nome}</h2>
            <p className="text-[12px] text-sagb-muted mt-1">{metodologia.slug}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onVoltarCatalogo}
              className="px-3 py-2 rounded-lg border border-sagb-line text-[11px] font-black uppercase tracking-wide text-sagb-text bg-sagb-panel hover:bg-sagb-bg-2"
            >
              Voltar ao catálogo
            </button>
            <button
              type="button"
              onClick={onEditarAtivo}
              className="px-3 py-2 rounded-lg bg-sagb-blue text-white text-[11px] font-black uppercase tracking-wide hover:opacity-90"
            >
              {modoEdicaoLabel}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-md bg-sagb-bg-2 text-sagb-muted text-[10px] font-black uppercase tracking-wide">
            {getTipoDeAtivoLabel(metodologia.tipo_de_ativo)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-wide">
            {getStatusEditorialLabel(metodologia.status_editorial)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-wide">
            {getMaturidadePraticaLabel(metodologia.maturidade_pratica)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wide">
            {getEstadoGovernancaLabel(metodologia.governanca.estado_ciclo_vida)}
          </span>
          <span className="px-2.5 py-1 rounded-md border border-sagb-line text-sagb-muted text-[10px] font-black uppercase tracking-wide">
            {metodologia.versao_atual}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <article className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-sagb-muted">Resumo</p>
            <p className="text-[12px] text-sagb-text mt-1 leading-relaxed">{metodologia.resumo}</p>
          </article>
          <article className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-sagb-muted">Objetivo</p>
            <p className="text-[12px] text-sagb-text mt-1 leading-relaxed">{metodologia.objetivo}</p>
          </article>
          <article className="rounded-xl border border-sagb-line bg-sagb-bg-2 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-sagb-muted">Camadas</p>
            <p className="text-[12px] text-sagb-text mt-1 leading-relaxed">
              Essência, Estrutura, Aplicação, Governança, Evidências e Evolução.
            </p>
          </article>
        </div>
      </header>

      <section className="rounded-3xl border border-sagb-line bg-sagb-panel p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-sagb-muted">Relações visuais</p>
            <h3 className="text-lg md:text-xl font-black text-sagb-text tracking-tight mt-1">Conexões canônicas do ativo</h3>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-wide">
            {relacoes.total_relacoes} conexão(ões)
          </span>
        </div>

        {relacoes.total_relacoes === 0 ? (
          <p className="text-[12px] text-sagb-muted">Este ativo ainda não possui relações registradas no mapa canônico.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {gruposRelacao.map((grupo) => (
              <article key={grupo.chave} className={grupo.containerClass}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className={grupo.tituloClass}>{grupo.titulo}</h4>
                  <span className={grupo.contadorClass}>{grupo.itens.length}</span>
                </div>

                {grupo.itens.length === 0 ? (
                  <p className="text-[12px] text-sagb-muted">Sem relações nesta direção.</p>
                ) : (
                  <div className="space-y-2">
                    {grupo.itens.map((item) => (
                      <div key={item.id} className="rounded-xl border border-sagb-line bg-sagb-panel p-3 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-sagb-bg-2 text-sagb-muted text-[10px] font-black uppercase tracking-wide">
                            {item.tipo_relacao_label}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wide text-sagb-muted">
                            {item.direcao === 'saida' ? 'Ativo atual → relacionado' : 'Relacionado → ativo atual'}
                          </span>
                        </div>
                        <p className="text-[12px] text-sagb-text font-semibold">{item.ativo_relacionado_nome}</p>
                        {item.observacao && <p className="text-[12px] text-sagb-muted leading-relaxed">{item.observacao}</p>}
                        {item.ativo_relacionado_slug && onAbrirAtivoRelacionado && (
                          <button
                            type="button"
                            onClick={() => onAbrirAtivoRelacionado(item.ativo_relacionado_slug)}
                            className="px-3 py-1.5 rounded-lg bg-sagb-blue text-white text-[11px] font-black uppercase tracking-wide hover:opacity-90"
                          >
                            Abrir relacionado
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <AtivoDetalheCamadas metodologia={metodologia} />
    </section>
  );
};
