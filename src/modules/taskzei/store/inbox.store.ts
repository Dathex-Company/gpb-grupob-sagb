import { create } from 'zustand';
import { InboxItem } from '../types/inbox.types';

interface InboxState {
  inboxItems: InboxItem[];
  isLoading: boolean;
  error: string | null;
  setInboxItems: (items: InboxItem[]) => void;
  addInboxItem: (item: InboxItem) => void;
  updateInboxItem: (id: string, updates: Partial<InboxItem>) => void;
  removeInboxItem: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInboxStore = create<InboxState>((set) => ({
  inboxItems: [],
  isLoading: false,
  error: null,
  setInboxItems: (items) => set({ inboxItems: items }),
  addInboxItem: (item) => set((state) => ({ inboxItems: [...state.inboxItems, item] })),
  updateInboxItem: (id, updates) => set((state) => ({
    inboxItems: state.inboxItems.map((i) => (i.id === id ? { ...i, ...updates } : i)),
  })),
  removeInboxItem: (id) => set((state) => ({
    inboxItems: state.inboxItems.filter((i) => i.id !== id),
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
