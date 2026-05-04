import { getDbProvider } from './ncDb';

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

// Re-export provider for convenience
export { setDbProvider, getDbProvider, createSupabaseDbProvider } from './ncDb';
export type { NcDbProvider, SessionsSnapshotDoc } from './ncDb';
