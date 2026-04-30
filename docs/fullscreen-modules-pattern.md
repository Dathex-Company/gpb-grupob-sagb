# Padrão: Módulos Fullscreen no SagB

## Visão Geral
Este documento define o padrão para implementação de módulos que carregam sistemas externos em modo fullscreen dentro do SagB, removendo a sidebar e proporcionando experiência integrada.

## Problema Resolvido
Módulos como o CRM Ziplia atualmente funcionam como gateways que abrem sistemas externos em novas janelas, causando:
- Múltiplos cliques para acesso
- Erros de `window.open` bloqueados pelo navegador
- Experiência fragmentada
- Perda de contexto do SagB

## Solução Padrão
Carregar o sistema externo em um iframe fullscreen com controles de navegação integrados.

## Estrutura do Componente

### 1. Nome do Arquivo
```
src/modules/{nome-modulo}/pages/{NomeModulo}FullscreenPage.tsx
```

### 2. Props do Componente
```typescript
interface FullscreenModuleProps {
  url: string;                    // URL do sistema externo
  title: string;                  // Nome do módulo
  backUrl?: string;              // URL para voltar (padrão: '/')
  controls?: ControlType[];      // Controles a mostrar
  showHeader?: boolean;          // Mostrar header (padrão: true)
  showFooter?: boolean;          // Mostrar footer (padrão: true)
}

type ControlType = 'back' | 'reload' | 'fullscreen' | 'close' | 'home';
```

### 3. Template Básico
```typescript
import React, { useState, useEffect } from 'react';

const FullscreenModulePage: React.FC<FullscreenModuleProps> = ({
  url,
  title,
  backUrl = '/',
  controls = ['back', 'reload', 'fullscreen', 'close'],
  showHeader = true,
  showFooter = true,
}) => {
  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);

  // Handlers
  const handleBack = () => window.location.href = backUrl;
  const handleReload = () => window.location.reload();
  const handleToggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const handleClose = () => window.close();

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'}`}>
      {showHeader && (
        <Header 
          title={title}
          url={url}
          controls={controls}
          onBack={handleBack}
          onReload={handleReload}
          onToggleFullscreen={handleToggleFullscreen}
          onClose={handleClose}
          hasError={hasError}
        />
      )}
      
      <IframeArea
        url={url}
        isLoading={isLoading}
        hasError={hasError}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      
      {showFooter && (
        <Footer 
          url={url}
          hasError={hasError}
          isFullscreen={isFullscreen}
        />
      )}
    </div>
  );
};
```

## Componentes Reutilizáveis

### 1. Header Component
```typescript
const Header: React.FC<HeaderProps> = ({
  title,
  url,
  controls,
  onBack,
  onReload,
  onToggleFullscreen,
  onClose,
  hasError,
}) => (
  <div className="flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800">
    <div className="flex items-center gap-4">
      {controls.includes('back') && (
        <Button icon="ArrowLeft" onClick={onBack} label="Voltar ao SagB" />
      )}
      <ModuleStatus title={title} url={url} hasError={hasError} />
    </div>
    <div className="flex items-center gap-2">
      {controls.includes('reload') && (
        <Button icon="RefreshCw" onClick={onReload} title="Recarregar" />
      )}
      {controls.includes('fullscreen') && (
        <Button 
          icon={isFullscreen ? "Minimize2" : "Maximize2"} 
          onClick={onToggleFullscreen} 
          title={isFullscreen ? "Sair do modo tela cheia" : "Modo tela cheia"}
        />
      )}
      {controls.includes('close') && (
        <Button icon="X" onClick={onClose} title="Fechar" />
      )}
    </div>
  </div>
);
```

### 2. Iframe Area Component
```typescript
const IframeArea: React.FC<IframeAreaProps> = ({
  url,
  isLoading,
  hasError,
  onLoad,
  onError,
}) => (
  <div className="flex-1 relative bg-slate-50">
    {isLoading && <LoadingScreen url={url} />}
    {hasError && <ErrorScreen url={url} onRetry={onReload} />}
    {!hasError && (
      <iframe
        src={url}
        className="w-full h-full border-0"
        title={title}
        onLoad={onLoad}
        onError={onError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        allow="camera; microphone; fullscreen; clipboard-write"
      />
    )}
  </div>
);
```

### 3. Footer Component
```typescript
const Footer: React.FC<FooterProps> = ({
  url,
  hasError,
  isFullscreen,
}) => (
  <div className="px-4 py-2 bg-slate-900 text-slate-400 text-xs border-t border-slate-800 flex justify-between">
    <div className="flex items-center gap-4">
      <span>{url}</span>
      <ConnectionStatus hasError={hasError} />
    </div>
    <div>
      <span>Modo: {isFullscreen ? 'Tela Cheia' : 'Normal'}</span>
    </div>
  </div>
);
```

## Configuração do Módulo

### 1. Manifest
```typescript
export const crmZipliaManifest: ModuleManifest = {
  id: 'crm-ziplia',
  internalName: 'crm_ziplia_fullscreen',
  displayName: 'CRM Ziplia',
  baseRoute: '/crm-ziplia',
  icon: 'BriefcaseIcon',
  initialStatus: 'active',
  fullscreen: true, // Nova flag
  externalUrl: 'http://localhost:3000', // URL do sistema externo
};
```

### 2. Routes
```typescript
export const crmZipliaRoutes: ModuleRoute = {
  path: crmZipliaManifest.baseRoute,
  element: <CrmZipliaFullscreenPage />,
  fullscreen: true, // Informa ao router para ocultar sidebar
};
```

### 3. Router Integration
O router principal do SagB deve:
- Verificar a flag `fullscreen` nas rotas
- Ocultar sidebar quando um módulo fullscreen estiver ativo
- Manter estado de navegação para voltar

## Comunicação Iframe ↔ SagB

### 1. Protocolo de Mensagens
```typescript
// SagB → Iframe
const sendToIframe = (type: string, data: any) => {
  const iframe = document.querySelector('iframe');
  iframe?.contentWindow?.postMessage({ type, data }, url);
};

// Iframe → SagB
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.origin === new URL(url).origin) {
      switch (event.data.type) {
        case 'READY':
          setIsLoading(false);
          break;
        case 'NAVIGATE':
          // Atualizar URL no header
          break;
        case 'CLOSE':
          handleBack();
          break;
      }
    }
  };
  
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, [url]);
```

### 2. Eventos Padronizados
| Evento | Direção | Propósito |
|--------|---------|-----------|
| `MODULE_READY` | Iframe → SagB | Sistema carregado |
| `MODULE_ERROR` | Iframe → SagB | Erro no sistema |
| `MODULE_NAVIGATE` | Iframe → SagB | Navegação interna |
| `SAGB_AUTH` | SagB → Iframe | Enviar credenciais |
| `SAGB_BACK` | SagB → Iframe | Solicitar voltar |
| `SAGB_RELOAD` | SagB → Iframe | Solicitar recarregar |

## Tratamento de Erros

### 1. Tipos de Erro
```typescript
enum ModuleErrorType {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  TIMEOUT = 'TIMEOUT',
  CORS_ERROR = 'CORS_ERROR',
  SSL_ERROR = 'SSL_ERROR',
  CONTENT_ERROR = 'CONTENT_ERROR',
}
```

### 2. Tela de Erro Padrão
```typescript
const ErrorScreen: React.FC<ErrorScreenProps> = ({
  errorType,
  url,
  onRetry,
  onBack,
}) => (
  <div className="error-screen">
    <ErrorIcon type={errorType} />
    <ErrorTitle type={errorType} />
    <ErrorMessage type={errorType} url={url} />
    <ErrorActions onRetry={onRetry} onBack={onBack} />
    <TechnicalDetails errorType={errorType} />
  </div>
);
```

## Atalhos de Teclado

### 1. Mapeamento Padrão
```typescript
const KEYBOARD_SHORTCUTS = {
  'Escape': 'back',
  'F5': 'reload',
  'Ctrl+R': 'reload',
  'Cmd+R': 'reload',
  'F11': 'fullscreen',
  'Ctrl+F': 'search',
  'Cmd+F': 'search',
};
```

### 2. Implementação
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const shortcut = `${e.ctrlKey ? 'Ctrl+' : ''}${e.metaKey ? 'Cmd+' : ''}${e.key}`;
    
    if (KEYBOARD_SHORTCUTS[shortcut]) {
      e.preventDefault();
      executeShortcut(KEYBOARD_SHORTCUTS[shortcut]);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

## Estilos e Temas

### 1. Classes CSS Padrão
```css
.fullscreen-module {
  @apply fixed inset-0 z-50 bg-white;
}

.fullscreen-header {
  @apply flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800;
}

.fullscreen-iframe {
  @apply w-full h-full border-0;
}

.fullscreen-footer {
  @apply px-4 py-2 bg-slate-900 text-slate-400 text-xs border-t border-slate-800;
}

.loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-white;
}

.error-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-white p-8;
}
```

### 2. Variantes de Tema
```typescript
const THEME_VARIANTS = {
  dark: {
    header: 'bg-gray-900 text-white',
    footer: 'bg-gray-800 text-gray-300',
  },
  light: {
    header: 'bg-white text-gray-900 border-b',
    footer: 'bg-gray-100 text-gray-600 border-t',
  },
  branded: {
    header: 'bg-brand-600 text-white',
    footer: 'bg-brand-700 text-brand-100',
  },
};
```

## Métricas e Monitoramento

### 1. Métricas Coletadas
```typescript
interface ModuleMetrics {
  loadTime: number;          // Tempo para carregar iframe
  errorRate: number;         // Taxa de erros
  sessionDuration: number;   // Duração da sessão
  interactionCount: number;  // Número de interações
  returnRate: number;        // Taxa de retorno ao SagB
}
```

### 2. Eventos Analytics
```typescript
const trackModuleEvent = (event: ModuleEvent) => {
  analytics.track('module_interaction', {
    moduleId,
    eventType: event.type,
    timestamp: Date.now(),
    ...event.data,
  });
};
```

## Exemplos de Implementação

### 1. CRM Ziplia
```typescript
export const CrmZipliaFullscreenPage: React.FC = () => (
  <FullscreenModulePage
    url="http://localhost:3000"
    title="CRM Ziplia"
    controls={['back', 'reload', 'fullscreen', 'close']}
  />
);
```

### 2. Sistema Financeiro
```typescript
export const FinanceSystemFullscreenPage: React.FC = () => (
  <FullscreenModulePage
    url="https://finance.empresa.com"
    title="Sistema Financeiro"
    controls={['back', 'reload', 'home']}
    showFooter={false}
  />
);
```

## Rollback e Compatibilidade

### 1. Fallback Strategy
```typescript
// routes.tsx
export const crmZipliaRoutes: ModuleRoute = {
  path: crmZipliaManifest.baseRoute,
  element: isFullscreenSupported() 
    ? <CrmZipliaFullscreenPage />
    : <CrmZipliaGatewayPage />,
};
```

### 2. Feature Detection
```typescript
const isFullscreenSupported = () => {
  return 'postMessage' in window &&
         typeof HTMLIFrameElement !== 'undefined' &&
         !isMobileDevice();
};
```

## Próximos Passos

### 1. Fase 1: Implementação Básica
- [ ] Criar componente `FullscreenModulePage`
- [ ] Implementar CRM Ziplia como primeiro caso
- [ ] Testar funcionalidades básicas

### 2. Fase 2: Aprimoramentos
- [ ] Adicionar comunicação via PostMessage
- [ ] Implementar tratamento de erros avançado
- [ ] Adicionar suporte a temas

### 3. Fase 3: Padronização
- [ ] Criar hooks reutilizáveis
- [ ] Documentar API de comunicação
- [ ] Criar testes automatizados

### 4. Fase 4: Expansão
- [ ] Aplicar padrão a outros módulos
- [ ] Implementar cache de iframes
- [ ] Adicionar pré-carregamento

## Conclusão
Este padrão proporciona uma experiência integrada para sistemas externos dentro do SagB, resolvendo problemas de usabilidade enquanto mantém a segurança e isolamento apropriados. A implementação modular permite reutilização em diversos cenários.

**Status**: Padrão definido, pronto para implementação no CRM Ziplia como caso piloto.

**Responsável**: Dan Salure (Diretor de Automação CRM Ziplia)
**Data**: 2026-04-19