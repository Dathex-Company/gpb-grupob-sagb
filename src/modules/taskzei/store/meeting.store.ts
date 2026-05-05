import { create } from 'zustand';
import { Meeting, Decision } from '../types/meeting.types';

interface MeetingState {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  removeMeeting: (id: string) => void;
  addDecision: (meetingId: string, decision: Decision) => void;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  removeDecision: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetings: [],
  isLoading: false,
  error: null,
  setMeetings: (meetings) => set({ meetings }),
  addMeeting: (meeting) => set((state) => ({ meetings: [...state.meetings, meeting] })),
  updateMeeting: (id, updates) => set((state) => ({
    meetings: state.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)),
  })),
  removeMeeting: (id) => set((state) => ({
    meetings: state.meetings.filter((m) => m.id !== id),
  })),
  addDecision: (meetingId, decision) => set((state) => ({
    meetings: state.meetings.map((m) =>
      m.id === meetingId
        ? { ...m, decisions: [...(m.decisions || []), decision] }
        : m
    ),
  })),
  updateDecision: (id, updates) => set((state) => ({
    meetings: state.meetings.map((m) => ({
      ...m,
      decisions: (m.decisions || []).map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  })),
  removeDecision: (id) => set((state) => ({
    meetings: state.meetings.map((m) => ({
      ...m,
      decisions: (m.decisions || []).filter((d) => d.id !== id),
    })),
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
