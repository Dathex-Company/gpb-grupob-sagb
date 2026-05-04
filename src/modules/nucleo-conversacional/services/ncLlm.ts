import { ncLog } from '../utils/observability';

// ─────────────────────────────────────────────────────────────────────────────
// NcLlmProvider — Interface de abstração de LLM para o Núcleo Conversacional
// ─────────────────────────────────────────────────────────────────────────────
// Purpose: Decouple the module from specific LLM services (gemini.ts, proxy).
// The default implementation calls the Netlify AI proxy; consumers can swap
// it out via setLlmProvider() for any provider (OpenAI, Anthropic, etc.).

export interface NcLlmProvider {
  /** Generate 3 title suggestions from conversation context. */
  generateTitleOptions(messagesText: string): Promise<string[]>;

  /** Generate 3 task suggestions from conversation context. */
  generateTaskSuggestions(contextText: string): Promise<string[]>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider registry (DI container)
// ─────────────────────────────────────────────────────────────────────────────

let _provider: NcLlmProvider | null = null;

export const setLlmProvider = (provider: NcLlmProvider): void => {
  _provider = provider;
  ncLog.info('llm.provider.set', { provider: provider.constructor.name });
};

export const getLlmProvider = (): NcLlmProvider => {
  if (!_provider) {
    throw new Error(
      '[ncLlm] No LlmProvider registered. Call setLlmProvider() before using the module.',
    );
  }
  return _provider;
};

// ─────────────────────────────────────────────────────────────────────────────
// Default implementation — Netlify AI Proxy backed
// ─────────────────────────────────────────────────────────────────────────────

type AiProxyPayload = Record<string, unknown>;

interface AiProxyResponse<T> {
  data?: T;
  error?: string;
}

interface AiProxyModule {
  callAiProxy: <T>(action: string, payload: AiProxyPayload) => Promise<T>;
}

let _proxyInit: Promise<AiProxyModule> | null = null;

const getAiProxy = async (): Promise<AiProxyModule> => {
  if (!_proxyInit) {
    _proxyInit = import('../../../../services/aiProxy') as Promise<AiProxyModule>;
  }
  return _proxyInit;
};

export const createProxyLlmProvider = (): NcLlmProvider => ({
  async generateTitleOptions(messagesText) {
    const proxy = await getAiProxy();
    const result = await proxy.callAiProxy<AiProxyResponse<string[]>>('generateTitleOptions', {
      messagesText,
    });
    if (result.error) throw new Error(result.error);
    return result.data || [];
  },

  async generateTaskSuggestions(contextText) {
    const proxy = await getAiProxy();
    const result = await proxy.callAiProxy<AiProxyResponse<string[]>>('generateTaskSuggestions', {
      contextText,
    });
    if (result.error) throw new Error(result.error);
    return result.data || [];
  },
});
