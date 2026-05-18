import { collection, db, getDocs, orderBy, query } from '../../../../services/supabase';

export interface TaskzeiUserOption {
  id: string;
  name: string;
  avatarUrl?: string;
}

type UserRow = {
  id: string;
  email?: string | null;
  display_name?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
};

class TaskzeiUsersService {
  async loadUsers(): Promise<TaskzeiUserOption[]> {
    try {
      const snap = await getDocs(query(collection(db, 'users'), orderBy('display_name', 'asc')));
      return snap.docs
        .map((d) => d.data() as UserRow)
        .map((row) => {
          const name = row.display_name || row.name || row.email || 'Usuário';
          return {
            id: row.id,
            name,
            avatarUrl: row.avatar_url || row.avatarUrl || undefined,
          };
        })
        .filter((u) => !!u.id);
    } catch {
      return [];
    }
  }
}

export const taskzeiUsersService = new TaskzeiUsersService();

