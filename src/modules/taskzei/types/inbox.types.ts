export type InboxSource = 'manual' | 'whatsapp' | 'email' | 'clickup' | 'voice' | 'sagb_chat';
export type InboxStatus = 'pending' | 'classified' | 'converted' | 'dismissed';
export type SuggestedEntityType = 'task' | 'meeting' | 'decision' | 'note';
export type ConvertedEntityType = 'task' | 'meeting' | 'decision';

export interface InboxItem {
  id: string;
  content: string;
  source: InboxSource;
  status: InboxStatus;
  suggestedType?: SuggestedEntityType;
  confidence?: number;
  convertedToId?: string;
  convertedToType?: ConvertedEntityType;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
