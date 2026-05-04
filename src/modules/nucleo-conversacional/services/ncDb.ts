import { ncLog } from '../utils/observability';

// ─────────────────────────────────────────────────────────────────────────────
// Utility: resolve workspaceId (default fallback)
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000000';

export const resolveWorkspaceId = (workspaceId?: string | null): string => {
  return workspaceId && workspaceId.trim() ? workspaceId : DEFAULT_WORKSPACE_ID;
};

// ─────────────────────────────────────────────────────────────────────────────
// NcDbProvider — Interface de abstração de banco para o Núcleo Conversacional
// ─────────────────────────────────────────────────────────────────────────────
// Purpose: Allow the module to function independently of the root SagB codebase.
// The default implementation uses Supabase (Firestore emulation), but a consumer
// can swap it out via setDbProvider() for any backend (REST API, Firebase, etc.).

export interface SessionsSnapshotDoc {
  id: string;
  data(): Record<string, unknown>;
}

export interface NcDbProvider {
  /** Subscribe to real-time session list changes. Returns unsubscribe fn. */
  subscribeToSessions(
    workspaceId: string,
    onNext: (snapshot: SessionsSnapshotDoc[]) => void,
    onError?: (err: Error) => void,
  ): Promise<() => void>;

  /** Update session metadata (e.g., title, lastMessageAt). */
  updateSession(sessionId: string, data: Record<string, unknown>): Promise<void>;

  /** Touch session timestamps (updatedAt, lastMessageAt). */
  touchSession(sessionId: string): Promise<void>;

  /** Append a message document to a collection. Returns the new doc id. */
  addMessage(data: {
    workspaceId: string;
    sessionId: string;
    agentId: string;
    sender: string;
    text: string;
    buId?: string;
    hasAttachment?: boolean;
    attachment?: Record<string, unknown> | null;
    isStreaming?: boolean;
  }): Promise<string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider registry (DI container)
// ─────────────────────────────────────────────────────────────────────────────

let _provider: NcDbProvider | null = null;

export const setDbProvider = (provider: NcDbProvider): void => {
  _provider = provider;
  ncLog.info('db.provider.set', { provider: provider.constructor.name });
};

export const getDbProvider = (): NcDbProvider => {
  if (!_provider) {
    throw new Error(
      '[ncDb] No DbProvider registered. Call setDbProvider() before using the module.',
    );
  }
  return _provider;
};

// ─────────────────────────────────────────────────────────────────────────────
// Default implementation — Supabase-backed
// ─────────────────────────────────────────────────────────────────────────────

interface SupabaseImports {
  db: unknown;
  collection: (db: unknown, name: string) => unknown;
  query: (...args: unknown[]) => unknown;
  where: (field: string, op: string, value: unknown) => unknown;
  orderBy: (field: string, dir?: 'asc' | 'desc') => unknown;
  onSnapshot: (
    ref: unknown,
    onNext: (snapshot: { docs: Array<{ id: string; data: () => Record<string, unknown> }> }) => void,
    onError?: (err: Error) => void,
  ) => () => void;
  addDoc: (ref: unknown, data: Record<string, unknown>) => Promise<{ id: string }>;
  doc: (db: unknown, collection: string, id: string) => unknown;
  updateDoc: (ref: unknown, data: Record<string, unknown>) => Promise<void>;
}

let _supabaseInit: Promise<SupabaseImports> | null = null;

const getSupabase = async (): Promise<SupabaseImports> => {
  if (!_supabaseInit) {
    _supabaseInit = import('../../../../services/supabase') as Promise<SupabaseImports>;
  }
  return _supabaseInit;
};

export const createSupabaseDbProvider = (): NcDbProvider => ({
  async subscribeToSessions(workspaceId, onNext, onError) {
    const supabase = await getSupabase();
    const sessionsQuery = supabase.query(
      supabase.collection(supabase.db, 'chat_sessions'),
      supabase.where('workspaceId', '==', workspaceId),
      supabase.orderBy('lastMessageAt', 'desc'),
    );
    return supabase.onSnapshot(
      sessionsQuery,
      (snapshot) => onNext(snapshot.docs),
      onError,
    );
  },

  async updateSession(sessionId, data) {
    const supabase = await getSupabase();
    await supabase.updateDoc(
      supabase.doc(supabase.db, 'chat_sessions', sessionId),
      data,
    );
  },

  async touchSession(sessionId) {
    const now = new Date();
    const supabase = await getSupabase();
    await supabase.updateDoc(
      supabase.doc(supabase.db, 'chat_sessions', sessionId),
      { updatedAt: now, lastMessageAt: now },
    );
  },

  async addMessage(data) {
    const supabase = await getSupabase();
    const ref = await supabase.addDoc(
      supabase.collection(supabase.db, 'chat_messages'),
      {
        workspaceId: data.workspaceId,
        sessionId: data.sessionId,
        agentId: data.agentId,
        sender: data.sender,
        text: data.text,
        buId: data.buId || null,
        hasAttachment: Boolean(data.hasAttachment),
        attachment: data.attachment || null,
        createdAt: new Date(),
        isStreaming: Boolean(data.isStreaming),
      },
    );
    return ref.id;
  },
});
