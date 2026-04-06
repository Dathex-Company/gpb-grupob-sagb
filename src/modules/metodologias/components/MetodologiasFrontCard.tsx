import React from 'react';
import type { Metodologia } from '../types';
import {
  getEstadoGovernancaLabel,
  getMaturidadePraticaLabel,
  getPapelGovernancaLabel,
  getStatusEditorialLabel,
  getTipoDeAtivoLabel
} from '../services';

interface MetodologiasFrontCardProps {
  metodologia: Metodologia;
  onAbrirAtivo?: () => void;
  onSelecionarPreview?: () => void;
}

export const MetodologiasFrontCard: React.FC<MetodologiasFrontCardProps> = ({
  metodologia,
  onAbrirAtivo,
  onSelecionarPreview
}) => {
  const responsavelPrincipal = metodologia.governanca.responsaveis.find(
    (responsavel) => responsavel.papel === 'responsavel_principal'
  );

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {metodologia.versao_atual}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide w-fit">
            {getTipoDeAtivoLabel(metodologia.tipo_de_ativo)}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-bold uppercase tracking-wide">
            {getStatusEditorialLabel(metodologia.status_editorial)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
            {getEstadoGovernancaLabel(metodologia.governanca.estado_ciclo_vida)}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-black text-slate-900 tracking-tight">{metodologia.nome}</h3>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{metodologia.resumo}</p>

      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500">
            Maturidade: {getMaturidadePraticaLabel(metodologia.maturidade_pratica)}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            {metodologia.slug}
          </span>
        </div>

        <p className="text-[11px] text-slate-600">
          <span className="font-bold">Projeções operacionais:</span> {metodologia.ativos_derivados?.length ?? 0}
        </p>

        {responsavelPrincipal && (
          <p className="text-[11px] text-slate-600">
            <span className="font-bold">{getPapelGovernancaLabel(responsavelPrincipal.papel)}:</span>{' '}
            {responsavelPrincipal.nome}
          </p>
        )}

        {metodologia.governanca.estado_ciclo_vida === 'obsoleto' && metodologia.governanca.substituido_por_ativo_id && (
          <p className="text-[11px] text-amber-700 font-semibold">
            Superado por: {metodologia.governanca.substituido_por_ativo_id}
          </p>
        )}
      </div>

      {(onAbrirAtivo || onSelecionarPreview) && (
        <div className="flex items-center gap-2 pt-1">
          {onSelecionarPreview && (
            <button
              type="button"
              onClick={onSelecionarPreview}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-black uppercase tracking-wide text-slate-600 hover:bg-slate-50"
            >
              Preview
            </button>
          )}
          {onAbrirAtivo && (
            <button
              type="button"
              onClick={onAbrirAtivo}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-wide hover:bg-slate-800"
            >
              Abrir ativo
            </button>
          )}
        </div>
      )}
    </article>
  );
};
