/**
 * Componente Viewer para renderizar HTML armazenado
 * Usado para telas do tipo html_file e html_code
 */

import React, { useState, useEffect } from 'react';
import { TelaAvancada, isHtmlFile, isHtmlCode } from '../types/telasAvancadas.types';

interface TelaAvancadaViewerProps {
  tela: TelaAvancada;
  onClose?: () => void;
}

export const TelaAvancadaViewer: React.FC<TelaAvancadaViewerProps> = ({ tela, onClose }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prepara o conteúdo HTML para ser renderizado
  const getHtmlContent = (): string => {
    if (isHtmlFile(tela) || isHtmlCode(tela)) {
      return tela.htmlContent;
    }
    return '';
  };

  // Cria um blob URL para o conteúdo HTML
  const getBlobUrl = (): string | null => {
    const htmlContent = getHtmlContent();
    if (!htmlContent) return null;

    try {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Erro ao criar blob URL:', err);
      return null;
    }
  };

  const htmlContent = getHtmlContent();
  const blobUrl = getBlobUrl();
  const isHtmlContent = isHtmlFile(tela) || isHtmlCode(tela);

  useEffect(() => {
    // Limpa o blob URL quando o componente é desmontado
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Erro ao carregar o conteúdo HTML');
  };

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
    setIsLoading(true);
    setError(null);
  };

  if (!isHtmlContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#24272e] to-[#292d35] border border-white/5 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">
          Tipo de Tela Não Suportado
        </h3>
        <p className="text-xs text-gray-400 text-center max-w-md">
          Este viewer é apenas para conteúdo HTML armazenado. 
          Telas do tipo URL externa devem ser abertas em nova aba.
        </p>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#24272e] to-[#292d35] border border-white/5 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">
          Conteúdo HTML Não Encontrado
        </h3>
        <p className="text-xs text-gray-400 text-center max-w-md">
          O conteúdo HTML desta tela não está disponível ou está vazio.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a1c21] to-[#16181d]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-b from-[#24272e] to-[#292d35]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#0a84ff] to-[#005fcc] flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{tela.title}</h2>
            <div className="flex items-center mt-1">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                isHtmlFile(tela) 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {isHtmlFile(tela) ? 'Arquivo HTML' : 'Código HTML'}
              </span>
              {isHtmlFile(tela) && (
                <span className="text-[10px] text-gray-400 ml-2">
                  {tela.fileName} • {(tela.fileSize ? tela.fileSize / 1024 : 0).toFixed(1)} KB
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReload}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-b from-[#262a31] to-[#23272e] border border-white/5 rounded-lg text-gray-300 hover:text-white hover:border-blue-500/30 transition-all duration-300 disabled:opacity-50"
          >
            Recarregar
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-b from-[#262a31] to-[#23272e] border border-white/5 rounded-lg text-gray-300 hover:text-white hover:border-red-500/30 transition-all duration-300"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#1a1c21] to-[#16181d] z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3" />
              <p className="text-xs text-gray-400">Carregando conteúdo HTML...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#1a1c21] to-[#16181d] z-10">
            <div className="text-center p-6 max-w-md">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Erro ao Carregar</h3>
              <p className="text-xs text-gray-400 mb-4">{error}</p>
              <button
                onClick={handleReload}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-b from-[#0a84ff] to-[#005fcc] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
        
        {blobUrl ? (
          <iframe
            key={iframeKey}
            src={blobUrl}
            title={tela.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Não foi possível renderizar o HTML</h3>
              <p className="text-xs text-gray-400">
                O conteúdo HTML não pôde ser convertido para visualização.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-white/5 bg-gradient-to-b from-[#24272e] to-[#292d35]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
            <span className="text-[10px] text-gray-400">
              {htmlContent.length.toLocaleString()} caracteres • Renderizado internamente
            </span>
          </div>
          <div className="text-[10px] text-gray-500">
            Segurança: sandbox ativo • {new Date(tela.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
};