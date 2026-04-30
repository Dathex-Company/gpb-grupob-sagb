import React, { useState, useEffect, useRef } from 'react';

// URLs para tentar (em ordem de prioridade)
const CRM_ZIPLIA_URLS = [
  'http://localhost:6000', // Porta priorizada para execução local atual
  'http://localhost:7000', // Porta configurada no .env do CRM
  'http://localhost:3000',
  'http://localhost:5173' // Porta alternativa do Vite
];

const DEFAULT_CRM_URL = CRM_ZIPLIA_URLS[0];
const IFRAME_LOAD_TIMEOUT_MS = 8000;

export const CrmZipliaFullscreenPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(Date.now());

  const currentUrl = CRM_ZIPLIA_URLS[currentUrlIndex];

  // Função para voltar ao SagB
  const handleBackToSagB = () => {
    // Usar history para voltar
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const startLoadCycle = (nextIndex: number) => {
    setCurrentUrlIndex(nextIndex);
    setAttemptCount(0);
    setIsLoading(true);
    setHasError(false);
    setConnectionStatus('connecting');
    setIframeKey(Date.now());
  };

  // Função para tentar próxima URL
  const tryNextUrl = () => {
    const nextIndex = (currentUrlIndex + 1) % CRM_ZIPLIA_URLS.length;
    startLoadCycle(nextIndex);
  };

  // Função para recarregar o iframe
  const handleReload = () => {
    setAttemptCount(0);
    setIsLoading(true);
    setHasError(false);
    setConnectionStatus('connecting');
    setIframeKey(Date.now());
  };

  const handleLoadTimeout = () => {
    if (!isLoading) return;

    const hasMoreUrlsToTry = attemptCount < CRM_ZIPLIA_URLS.length - 1;

    if (hasMoreUrlsToTry) {
      const nextIndex = (currentUrlIndex + 1) % CRM_ZIPLIA_URLS.length;
      setCurrentUrlIndex(nextIndex);
      setAttemptCount((prev) => prev + 1);
      setConnectionStatus('connecting');
      setIframeKey(Date.now());
      return;
    }

    setIsLoading(false);
    setHasError(true);
    setConnectionStatus('error');
  };

  // Monitorar carregamento do iframe
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setConnectionStatus('connected');
  };

  // Monitorar erro no iframe
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    setConnectionStatus('error');
  };

  // Efeito de atalho de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBackToSagB();
      }
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        handleReload();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timeout de carregamento do iframe com fallback automático para próxima URL
  useEffect(() => {
    if (!isLoading || hasError) return;

    const timeoutId = window.setTimeout(() => {
      handleLoadTimeout();
    }, IFRAME_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isLoading, hasError, iframeKey, currentUrlIndex, attemptCount]);

  // Status colors
  const statusColors = {
    connecting: 'bg-yellow-500',
    connected: 'bg-green-500',
    error: 'bg-red-500'
  };

  const statusText = {
    connecting: 'Conectando...',
    connected: 'Conectado',
    error: 'Erro de conexão'
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header com controles */}
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToSagB}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Voltar ao SagB"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Voltar ao SagB</span>
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${statusColors[connectionStatus]} animate-pulse`}></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">CRM Ziplia</span>
                <button
                  onClick={tryNextUrl}
                  className="text-xs text-gray-400 hover:text-gray-300"
                  title="Alternar URL"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-400 truncate max-w-[200px]" title={currentUrl}>
                {currentUrl.replace('http://', '').replace('https://', '')}
                <span className="ml-2">{statusText[connectionStatus]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasError && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 text-red-300 rounded-md mr-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">CRM indisponível</span>
            </div>
          )}

          <button
            onClick={handleReload}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Recarregar CRM"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área principal com iframe */}
      <div className="flex-1 relative bg-gray-50">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-bold text-gray-700">Carregando CRM Ziplia...</p>
            <p className="text-sm text-gray-500 mt-2">Conectando a {currentUrl}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">CRM Ziplia Indisponível</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Não foi possível conectar ao CRM Ziplia em <code className="bg-gray-100 px-2 py-1 rounded">{currentUrl}</code>.
              Verifique se o servidor está rodando localmente.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleReload}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tentar Novamente
              </button>
              <button
                onClick={tryNextUrl}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Tentar Próxima URL
              </button>
              <button
                onClick={handleBackToSagB}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Voltar ao SagB
              </button>
            </div>
            <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
              <p className="text-sm font-bold text-gray-700 mb-2">📋 Para rodar o CRM localmente:</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Opção 1: Servidor Express (API + Frontend)</p>
                  <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`cd _ventures/ziplia/modules/crm/web
npm install
npm run dev`}
                  </pre>
                  <p className="text-xs text-gray-600 mt-1">Inicia servidor completo na porta definida (atual: 6000)</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Opção 2: Apenas Frontend (Vite - se configurado)</p>
                  <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`cd _ventures/ziplia/modules/crm/web
npm install
npx vite`}
                  </pre>
                  <p className="text-xs text-gray-600 mt-1">Inicia apenas o frontend na porta 5173 (fallback)</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3">💡 <strong>Dica:</strong> O CRM Ziplia está na mesma pasta do SagB. Após iniciar, atualize esta página.</p>
            </div>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-0"
            title="CRM Ziplia"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            allow="camera; microphone; fullscreen; clipboard-write"
            loading="eager"
          />
        )}

        {/* Overlay de ajuda */}
        {!isLoading && !hasError && (
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
            <div className="bg-gray-900/90 text-white p-3 rounded-lg max-w-xs text-sm backdrop-blur-sm">
              <p className="font-medium">💡 Dicas de uso:</p>
              <ul className="text-gray-300 text-xs mt-1 space-y-1">
                <li>• Pressione <kbd className="bg-gray-700 px-1 py-0.5 rounded">ESC</kbd> para voltar ao SagB</li>
                <li>• <kbd className="bg-gray-700 px-1 py-0.5 rounded">F5</kbd> ou <kbd className="bg-gray-700 px-1 py-0.5 rounded">Ctrl+R</kbd> para recarregar</li>
                <li>• Clique fora do iframe para focar nos controles</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer com status */}
      <div className="px-4 py-2 bg-gray-900 text-gray-400 text-xs border-t border-gray-800 flex justify-between">
        <div className="flex items-center gap-4">
          <span>CRM Ziplia • {currentUrl}</span>
          <span className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${statusColors[connectionStatus]}`}></div>
            {statusText[connectionStatus]}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Modo: Tela Cheia</span>
          <span className="text-gray-500">•</span>
          <button 
            onClick={() => iframeRef.current?.contentWindow?.postMessage({ type: 'SAGB_PING' }, currentUrl)}
            className="text-gray-400 hover:text-gray-300"
            title="Testar comunicação"
          >
            Testar Conexão
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrmZipliaFullscreenPage;
