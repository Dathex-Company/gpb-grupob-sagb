/**
 * Componente Card para exibir uma Tela Avançada
 * V2: Suporte a 3 tipos (URL externa, arquivo HTML, código HTML)
 */

import React from 'react';
import { TelaAvancada, isExternalUrl, isHtmlFile, isHtmlCode } from '../types/telasAvancadas.types';

interface TelaAvancadaCardProps {
  tela: TelaAvancada;
  onClick?: (tela: TelaAvancada) => void;
  onOpenHtmlViewer?: (htmlContent: string, title: string) => void;
}

export const TelaAvancadaCard: React.FC<TelaAvancadaCardProps> = ({ 
  tela, 
  onClick,
  onOpenHtmlViewer 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(tela);
      return;
    }

    // Comportamento padrão baseado no tipo
    if (isExternalUrl(tela)) {
      // URLs externas abrem em nova aba
      window.open(tela.url, '_blank', 'noopener,noreferrer');
    } else if (isHtmlFile(tela) || isHtmlCode(tela)) {
      // HTML armazenado abre no viewer interno
      if (onOpenHtmlViewer) {
        onOpenHtmlViewer(tela.htmlContent, tela.title);
      } else {
        // Fallback: mostra alerta informando que precisa do viewer
        alert(`HTML armazenado: ${tela.title}\n\nPara visualizar, o módulo precisa do viewer interno.`);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Determinar badge baseado no tipo
  const getBadgeInfo = () => {
    if (isExternalUrl(tela)) {
      return {
        text: 'URL Externa',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        hoverColor: 'hover:border-blue-500/30'
      };
    } else if (isHtmlFile(tela)) {
      return {
        text: 'Arquivo HTML',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        hoverColor: 'hover:border-emerald-500/30'
      };
    } else if (isHtmlCode(tela)) {
      return {
        text: 'Código HTML',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        hoverColor: 'hover:border-purple-500/30'
      };
    }
    return {
      text: 'Desconhecido',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
      hoverColor: 'hover:border-gray-500/30'
    };
  };

  // Determinar ícone baseado no tipo
  const getIcon = () => {
    if (isExternalUrl(tela)) {
      return (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      );
    } else if (isHtmlFile(tela)) {
      return (
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (isHtmlCode(tela)) {
      return (
        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    }
  };

  // Determinar texto de informação baseado no tipo
  const getInfoText = () => {
    if (isExternalUrl(tela)) {
      return tela.url.replace(/^https?:\/\//, '');
    } else if (isHtmlFile(tela)) {
      return tela.fileName || 'Arquivo HTML';
    } else if (isHtmlCode(tela)) {
      return 'Código HTML personalizado';
    }
    return '';
  };

  const badgeInfo = getBadgeInfo();

  return (
    <button
      onClick={handleClick}
      className={`group relative w-full h-full min-h-[120px] rounded-2xl border border-white/5 bg-gradient-to-b from-[#24272e] to-[#292d35] p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 ${badgeInfo.hoverColor}`}
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)'
      }}
    >
      {/* Efeito de brilho sutil no hover com cor baseada no tipo */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${isExternalUrl(tela) ? 'from-blue-500/5' : isHtmlFile(tela) ? 'from-emerald-500/5' : 'from-purple-500/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Ícone baseado no tipo */}
      <div className="absolute top-3 right-3 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
        {getIcon()}
      </div>
      
      {/* Conteúdo do card */}
      <div className="relative z-10">
        <h3 className="text-sm font-black uppercase tracking-tight text-white mb-2 line-clamp-2">
          {tela.title}
        </h3>
        
        {/* Badge do tipo */}
        <div className="flex items-center justify-between mt-4">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${badgeInfo.color} ${badgeInfo.bgColor} border ${badgeInfo.borderColor}`}>
            {badgeInfo.text}
          </span>
          
          <span className="text-[9px] text-gray-400 font-medium">
            {formatDate(tela.createdAt)}
          </span>
        </div>
        
        {/* Informação específica do tipo */}
        <div className="mt-3">
          <p className="text-[10px] text-gray-400 truncate" title={getInfoText()}>
            {getInfoText()}
          </p>
        </div>

        {/* Informação adicional para arquivos HTML */}
        {isHtmlFile(tela) && tela.fileSize && (
          <div className="mt-1">
            <p className="text-[9px] text-gray-500">
              {Math.round(tela.fileSize / 1024)} KB
            </p>
          </div>
        )}
      </div>
      
      {/* Efeito de borda gradiente no hover */}
      <div className={`absolute inset-0 rounded-2xl border border-transparent group-hover:border ${badgeInfo.borderColor.replace('/20', '/30')} transition-all duration-300`} />
    </button>
  );
};