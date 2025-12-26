import { Controller, Get } from '@nestjs/common';
import { ReleaseNoteService } from '../../application/use-cases/release-notes/release-note.service';

@Controller('release-notes')
export class PublicReleaseNoteController {
  constructor(private readonly releaseNoteService: ReleaseNoteService) {}

  @Get()
  async getPublishedReleaseNotes() {
    return await this.releaseNoteService.findActiveNotes();
  }

  @Get('latest')
  async getLatestReleaseNotes() {
    const notes = await this.releaseNoteService.findActiveNotes();
    return notes.slice(0, 5); // Últimas 5 notas
  }
}