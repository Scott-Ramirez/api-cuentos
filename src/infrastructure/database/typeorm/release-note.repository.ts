import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { ReleaseNote } from '../../../domain/entities';
import { ReleaseNoteSchema } from './entities/release-note.schema';
import { ReleaseNoteRepository } from '../../../domain/repositories';

@Injectable()
export class TypeOrmReleaseNoteRepository implements ReleaseNoteRepository {
  constructor(
    @InjectRepository(ReleaseNoteSchema)
    private readonly repository: Repository<ReleaseNoteSchema>,
  ) {}

  async create(releaseNote: Partial<ReleaseNote>): Promise<ReleaseNote> {
    const newReleaseNote = this.repository.create(releaseNote);
    const saved = await this.repository.save(newReleaseNote);
    return saved as ReleaseNote;
  }

  async findById(id: number): Promise<ReleaseNote | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result as ReleaseNote | null;
  }

  async findAll(): Promise<ReleaseNote[]> {
    const results = await this.repository.find({
      order: { createdAt: 'DESC' }
    });
    return results as ReleaseNote[];
  }

  async findActiveNotes(): Promise<ReleaseNote[]> {
    const results = await this.repository.find({
      where: { isPublished: true },
      order: { priority: 'DESC', createdAt: 'DESC' }
    });
    return results as ReleaseNote[];
  }

  async update(id: number, releaseNote: Partial<ReleaseNote>): Promise<ReleaseNote> {
    await this.repository.update(id, releaseNote);
    const updatedNote = await this.findById(id);
    if (!updatedNote) {
      throw new Error('Release note not found after update');
    }
    return updatedNote;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deactivateExpired(): Promise<void> {
    // Este método ya no es necesario con la nueva estructura
    // pero lo mantenemos por compatibilidad
  }
}