import { addDoc, collection, db, doc, updateDoc } from '../../../../services/supabase';

interface PersistBotPlaceholderInput {
  workspaceId: string;
  sessionId: string;
  agentId: string;
  buId: string;
}

export const touchChatSessionMetadata = async (sessionId: string, nowMs: number) => {
  await updateDoc(doc(db, 'chat_sessions', sessionId), {
    lastMessageAt: new Date(nowMs),
    updatedAt: new Date(nowMs),
  });
};

export const persistBotPlaceholder = async ({ workspaceId, sessionId, agentId, buId }: PersistBotPlaceholderInput) => {
  return addDoc(collection(db, 'chat_messages'), {
    workspaceId,
    sessionId,
    agentId,
    sender: 'bot',
    text: '',
    buId,
    hasAttachment: false,
    createdAt: new Date(),
    payload: { isStreaming: true },
  });
};

