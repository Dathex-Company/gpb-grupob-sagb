import { getDbProvider } from './ncDb';
import { restFetch } from '../../../../services/supabase';

interface PersistBotPlaceholderInput {
  workspaceId: string;
  sessionId: string;
  agentId: string;
  buId: string;
}

export const touchChatSessionMetadata = async (sessionId: string, nowMs: number) => {
  const db = getDbProvider();
  await db.updateSession(sessionId, {
    lastMessageAt: new Date(nowMs),
    updatedAt: new Date(nowMs),
  });
};

export const persistBotPlaceholder = async ({ workspaceId, sessionId, agentId, buId }: PersistBotPlaceholderInput) => {
  const db = getDbProvider();
  return db.addMessage({
    workspaceId,
    sessionId,
    agentId,
    sender: 'bot',
    text: '',
    buId,
    hasAttachment: false,
    isStreaming: true,
  });
};

export const getWhatsAppConversationMessagesForNucleo = async (conversationId: string, limit = 100) => {
  const query = new URLSearchParams({
    select: '*',
    conversation_id: `eq.${conversationId}`,
    order: 'created_at.asc',
    limit: String(Math.min(Math.max(limit, 1), 200)),
  });

  const rows = await restFetch('whatsapp_messages', { query });
  return Array.isArray(rows) ? rows : [];
};

// Re-export provider for convenience
export { setDbProvider, getDbProvider, createSupabaseDbProvider } from './ncDb';
export type { NcDbProvider, SessionsSnapshotDoc } from './ncDb';
