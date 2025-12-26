import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleaseNoteSchema } from '../../infrastructure/database/typeorm/entities/release-note.schema';
import { ReleaseNoteService } from '../use-cases/release-notes/release-note.service';
import { ReleaseNoteController } from '../../presentation/controllers/release-note.controller';
import { PublicReleaseNoteController } from '../../presentation/controllers/public-release-note.controller';
import { TypeOrmReleaseNoteRepository } from '../../infrastructure/database/typeorm/release-note.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReleaseNoteSchema])],
  controllers: [ReleaseNoteController, PublicReleaseNoteController],
  providers: [
    ReleaseNoteService,
    {
      provide: 'ReleaseNoteRepository',
      useClass: TypeOrmReleaseNoteRepository,
    },
  ],
  exports: [ReleaseNoteService],
})
export class ReleaseNotesModule {}