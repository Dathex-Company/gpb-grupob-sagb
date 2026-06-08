/**
 * @sagb/nucleo-conversacional — Barrel export público
 *
 * Uso no host:
 * ```ts
 * import { ConversationsView, ChatMessage, setDbProvider, setLlmProvider } from '@sagb/nucleo-conversacional';
 * ```
 */

// ── Manifest + Routes (registro no moduleRegistry) ────
export { manifest as nucleoConversacionalManifest } from './manifest';
export { routes as nucleoConversacionalRoutes } from './routes';

// ── Tipos ──────────────────────────────────────────────
export type {
  Agent,
  Message,
  Sender,
  ChatAttachment,
  UploadStatus,
  PersonaConfig,
  UserProfile,
  AgentTier,
  AgentStatus,
  ModelProvider,
} from './types';

// ── UI (default → named re-export) ─────────────────────
export { default as ChatMessage } from './components/ChatMessage';
export { default as ChatAttachmentCard } from './components/ChatAttachmentCard';
export { default as ConversationsView } from './pages/ConversationsView';
export { Avatar } from './components/ui/Avatar';
export {
  SuggestionPanel,
  TitleSuggestionPanel,
  TaskSuggestionPanel,
} from './components/SuggestionPanel';
export type {
  SuggestionPanelProps,
  TitleSuggestionPanelProps,
  TaskSuggestionPanelProps,
} from './components/SuggestionPanel';

// ── Services / Providers ───────────────────────────────
export {
  setDbProvider,
  getDbProvider,
  resolveWorkspaceId,
  DEFAULT_WORKSPACE_ID,
  createSupabaseDbProvider,
} from './services/ncDb';
export type { NcDbProvider, SessionsSnapshotDoc } from './services/ncDb';

export {
  setLlmProvider,
  getLlmProvider,
  createProxyLlmProvider,
} from './services/ncLlm';
export type { NcLlmProvider } from './services/ncLlm';

export {
  touchChatSessionMetadata,
  persistBotPlaceholder,
} from './services/chatPersistence';

// ── Observabilidade ────────────────────────────────────
export { ncLog } from './utils/observability';

// ── Tailwind Preset ────────────────────────────────────
export {
  tailwindTokens,
  ncTailwindPreset,
  bitrixTokens,
  sagbColors,
  sagbGradients,
  sagbBoxShadows,
} from './tailwind.preset';
export type { BitrixToken, SagbColorToken } from './tailwind.preset';
