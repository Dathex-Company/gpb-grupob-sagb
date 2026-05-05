import { ITaskzeiRepository } from '../types/taskzei.contracts';
import { MockTaskzeiProvider } from './taskzei.providers';
import { SupabaseTaskzeiProvider } from './taskzei_supabase_provider';

// The adapter handles which provider to use based on configuration.
export class TaskzeiAdapter {
  private static instance: ITaskzeiRepository;

  static getProvider(): ITaskzeiRepository {
    if (!this.instance) {
      const provider = String(import.meta.env.VITE_TASKZEI_PROVIDER || 'supabase').toLowerCase();
      this.instance = provider === 'supabase' ? new SupabaseTaskzeiProvider() : new MockTaskzeiProvider();
    }
    return this.instance;
  }
}
