import { NagiItem } from '../domain/types';

/* ──────────────────────────────────────────────
 * NAGI V2 — Repository Interface + Implementação
 * Isolamento da camada de dados para swap futuro (Supabase)
 * ────────────────────────────────────────────── */

export interface INagiRepository {
  getAll(): NagiItem[];
  getById(id: string): NagiItem | undefined;
  save(item: NagiItem): void;
  saveAll(items: NagiItem[]): void;
  create(item: NagiItem): void;
  delete(id: string): void;
  reset(data: NagiItem[]): void;
}

/* ── LocalStorage Implementation ──────────────── */

const STORAGE_KEY = 'sagb_nagi_items_v2';

export class LocalStorageNagiRepository implements INagiRepository {
  private load(): NagiItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* falha silenciosa */
    }
    return [];
  }

  private persist(items: NagiItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* falha silenciosa */
    }
  }

  getAll(): NagiItem[] {
    return this.load();
  }

  getById(id: string): NagiItem | undefined {
    return this.load().find((i) => i.id === id);
  }

  save(item: NagiItem): void {
    const all = this.load();
    const idx = all.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      all[idx] = item;
    } else {
      all.push(item);
    }
    this.persist(all);
  }

  saveAll(items: NagiItem[]): void {
    this.persist(items);
  }

  create(item: NagiItem): void {
    const all = this.load();
    all.push(item);
    this.persist(all);
  }

  delete(id: string): void {
    const all = this.load().filter((i) => i.id !== id);
    this.persist(all);
  }

  reset(data: NagiItem[]): void {
    this.persist(data);
  }
}

/* ── Singleton export ─────────────────────────── */

export const nagiRepository: INagiRepository = new LocalStorageNagiRepository();
