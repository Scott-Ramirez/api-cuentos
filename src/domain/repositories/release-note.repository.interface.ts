import { ReleaseNote } from '../entities';

export interface ReleaseNoteRepository {
  create(releaseNote: Partial<ReleaseNote>): Promise<ReleaseNote>;
  findById(id: number): Promise<ReleaseNote | null>;
  findAll(): Promise<ReleaseNote[]>;
  findActiveNotes(): Promise<ReleaseNote[]>;
  update(id: number, releaseNote: Partial<ReleaseNote>): Promise<ReleaseNote>;
  delete(id: number): Promise<void>;
  deactivateExpired(): Promise<void>;
}