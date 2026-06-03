import { NagiIngestionDocument } from '../domain/types';

/* ──────────────────────────────────────────────
 * NAGI V3 — Repository de ingestão de documentos
 * Camada isolada para swap futuro para Supabase
 * ────────────────────────────────────────────── */

export interface INagiIngestionRepository {
  getAll(): NagiIngestionDocument[];
  getById(id: string): NagiIngestionDocument | undefined;
  save(doc: NagiIngestionDocument): void;
  saveAll(docs: NagiIngestionDocument[]): void;
  create(doc: NagiIngestionDocument): void;
  delete(id: string): void;
  reset(): void;
}

const STORAGE_KEY = 'sagb_nagi_ingestion_documents_v1';

export class LocalStorageNagiIngestionRepository implements INagiIngestionRepository {
  private load(): NagiIngestionDocument[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* falha silenciosa */
    }
    return [];
  }

  private persist(docs: NagiIngestionDocument[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch {
      /* falha silenciosa */
    }
  }

  getAll(): NagiIngestionDocument[] {
    return this.load();
  }

  getById(id: string): NagiIngestionDocument | undefined {
    return this.load().find((doc) => doc.id === id);
  }

  save(doc: NagiIngestionDocument): void {
    const all = this.load();
    const index = all.findIndex((item) => item.id === doc.id);
    if (index >= 0) all[index] = doc;
    else all.push(doc);
    this.persist(all);
  }

  saveAll(docs: NagiIngestionDocument[]): void {
    this.persist(docs);
  }

  create(doc: NagiIngestionDocument): void {
    const all = this.load();
    all.push(doc);
    this.persist(all);
  }

  delete(id: string): void {
    this.persist(this.load().filter((doc) => doc.id !== id));
  }

  reset(): void {
    this.persist([]);
  }
}

export const nagiIngestionRepository: INagiIngestionRepository = new LocalStorageNagiIngestionRepository();
