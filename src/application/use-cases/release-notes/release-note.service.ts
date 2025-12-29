import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ReleaseNote } from '../../../domain/entities';
import { ReleaseNoteRepository } from '../../../domain/repositories';
import { CreateReleaseNoteDto, UpdateReleaseNoteDto } from '../../dto/release-note.dto';

@Injectable()
export class ReleaseNoteService {
  constructor(
    @Inject('ReleaseNoteRepository')
    private readonly releaseNoteRepository: ReleaseNoteRepository,
  ) {}

  async create(createReleaseNoteDto: CreateReleaseNoteDto): Promise<ReleaseNote> {
    const releaseNote: Partial<ReleaseNote> = {
      title: createReleaseNoteDto.title,
      content: createReleaseNoteDto.content,
      version: createReleaseNoteDto.version,
      type: createReleaseNoteDto.type || 'minor',
      priority: createReleaseNoteDto.priority || 0,
      releaseDate: createReleaseNoteDto.releaseDate ? new Date(createReleaseNoteDto.releaseDate) : new Date(),
      isPublished: createReleaseNoteDto.isPublished || false,
    };
    return await this.releaseNoteRepository.create(releaseNote);
  }

  async findAll(): Promise<ReleaseNote[]> {
    return await this.releaseNoteRepository.findAll();
  }

  async findActiveNotes(): Promise<ReleaseNote[]> {
    return await this.releaseNoteRepository.findActiveNotes();
  }

  async findOne(id: number): Promise<ReleaseNote> {
    const releaseNote = await this.releaseNoteRepository.findById(id);
    if (!releaseNote) {
      throw new NotFoundException('Release note not found');
    }
    return releaseNote;
  }

  async update(id: number, updateReleaseNoteDto: UpdateReleaseNoteDto): Promise<ReleaseNote> {
    await this.findOne(id); // Verificar que existe
    
    const updateData: Partial<ReleaseNote> = {};
    if (updateReleaseNoteDto.title !== undefined) updateData.title = updateReleaseNoteDto.title;
    if (updateReleaseNoteDto.content !== undefined) updateData.content = updateReleaseNoteDto.content;
    if (updateReleaseNoteDto.version !== undefined) updateData.version = updateReleaseNoteDto.version;
    if (updateReleaseNoteDto.type !== undefined) updateData.type = updateReleaseNoteDto.type;
    if (updateReleaseNoteDto.priority !== undefined) updateData.priority = updateReleaseNoteDto.priority;
    if (updateReleaseNoteDto.releaseDate !== undefined) updateData.releaseDate = new Date(updateReleaseNoteDto.releaseDate);
    if (updateReleaseNoteDto.isPublished !== undefined) updateData.isPublished = updateReleaseNoteDto.isPublished;

    return await this.releaseNoteRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verificar que existe
    await this.releaseNoteRepository.delete(id);
  }

  async togglePublished(id: number): Promise<ReleaseNote> {
    const releaseNote = await this.findOne(id);
    return await this.releaseNoteRepository.update(id, { isPublished: !releaseNote.isPublished });
  }

  // Método para obtener la release note más reciente para el endpoint /version
  async getCurrentReleaseNote(): Promise<ReleaseNote | null> {
    const activeNotes = await this.findActiveNotes();
    return activeNotes.length > 0 ? activeNotes[0] : null;
  }

  // Método para obtener release notes recientes para notificaciones
  async getRecentReleaseNotes(fromDate: Date): Promise<ReleaseNote[]> {
    const allActiveNotes = await this.findActiveNotes();
    return allActiveNotes.filter(note => 
      new Date(note.releaseDate) >= fromDate
    ).sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  }
}