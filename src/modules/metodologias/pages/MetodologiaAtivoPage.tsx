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
      containerClass: 'rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 space-y-3',
      tituloClass: 'text-sm font-black uppercase tracking-wide text-emerald-900',
      contadorClass: 'text-[10px] font-black uppercase tracking-wide text-emerald-700'
    },
    {
      chave: 'entrada',
      titulo: 'Entradas',
      itens: relacoes.entrada,
      containerClass: 'rounded-2xl border border-violet-100 bg-violet-50/30 p-4 space-y-3',
      tituloClass: 'text-sm font-black uppercase tracking-wide text-violet-900',
      contadorClass: 'text-[10px] font-black uppercase tracking-wide text-violet-700'
    }
  ];

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 md:p-7 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Ativo metodológico</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">{metodologia.nome}</h2>
            <p className="text-sm text-slate-500 mt-1">{metodologia.slug}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onVoltarCatalogo}
              className="px-3 py-2 rounded-lg border border-slate-200 text-[11px] font-black uppercase tracking-wide text-slate-600 bg-white hover:bg-slate-50"
            >
              Voltar ao catálogo
            </button>
            <button
              type="button"
              onClick={onEditarAtivo}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-wide hover:bg-slate-800"
            >
              {modoEdicaoLabel}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wide">
            {getTipoDeAtivoLabel(metodologia.tipo_de_ativo)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase tracking-wide">
            {getStatusEditorialLabel(metodologia.status_editorial)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wide">
            {getMaturidadePraticaLabel(metodologia.maturidade_pratica)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wide">
            {getEstadoGovernancaLabel(metodologia.governanca.estado_ciclo_vida)}
          </span>
          <span className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wide">
            {metodologia.versao_atual}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <article className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Resumo</p>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{metodologia.resumo}</p>
          </article>
          <article className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Objetivo</p>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{metodologia.objetivo}</p>
          </article>
          <article className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Camadas</p>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Essência, Estrutura, Aplicação, Governança, Evidências e Evolução.
            </p>
          </article>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Relações visuais</p>
            <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mt-1">Conexões canônicas do ativo</h3>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase tracking-wide">
            {relacoes.total_relacoes} conexão(ões)
          </span>
        </div>

        {relacoes.total_relacoes === 0 ? (
          <p className="text-sm text-slate-500">Este ativo ainda não possui relações registradas no mapa canônico.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {gruposRelacao.map((grupo) => (
              <article key={grupo.chave} className={grupo.containerClass}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className={grupo.tituloClass}>{grupo.titulo}</h4>
                  <span className={grupo.contadorClass}>{grupo.itens.length}</span>
                </div>

                {grupo.itens.length === 0 ? (
                  <p className="text-xs text-slate-500">Sem relações nesta direção.</p>
                ) : (
                  <div className="space-y-2">
                    {grupo.itens.map((item) => (
                      <div key={item.id} className="rounded-xl border border-white/70 bg-white p-3 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wide">
                            {item.tipo_relacao_label}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                            {item.direcao === 'saida' ? 'Ativo atual → relacionado' : 'Relacionado → ativo atual'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-800 font-semibold">{item.ativo_relacionado_nome}</p>
                        {item.observacao && <p className="text-xs text-slate-600 leading-relaxed">{item.observacao}</p>}
                        {item.ativo_relacionado_slug && onAbrirAtivoRelacionado && (
                          <button
                            type="button"
                            onClick={() => onAbrirAtivoRelacionado(item.ativo_relacionado_slug)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-wide hover:bg-slate-800"
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
