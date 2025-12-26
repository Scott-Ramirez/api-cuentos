import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettingSchema } from '../../infrastructure/database/typeorm/entities/system-setting.schema';
import { ReleaseNoteSchema } from '../../infrastructure/database/typeorm/entities/release-note.schema';
import { UserSchema } from '../../infrastructure/database/typeorm/entities/user.schema';
import { StorySchema } from '../../infrastructure/database/typeorm/entities/story.schema';
import { ChapterSchema } from '../../infrastructure/database/typeorm/entities/chapter.schema';
import { StoryTagSchema } from '../../infrastructure/database/typeorm/entities/story-tag.schema';
import { AdminService } from '../use-cases/admin/admin.service';
import { AdminController } from '../../presentation/controllers/admin.controller';
import { VersionController } from '../../presentation/controllers/version.controller';
import { TypeOrmSystemSettingRepository } from '../../infrastructure/database/typeorm/system-setting.repository';
import { ReleaseNoteService } from '../use-cases/release-notes/release-note.service';
import { TypeOrmReleaseNoteRepository } from '../../infrastructure/database/typeorm/release-note.repository';
import { MakeAdminCommand } from '../commands/make-admin.command';
import { IStoryRepository } from '../../domain/repositories/story.repository.interface';
import { StoryRepository } from '../../infrastructure/database/typeorm/repositories/story.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSettingSchema, ReleaseNoteSchema, UserSchema, StorySchema, ChapterSchema, StoryTagSchema])],
  controllers: [AdminController, VersionController],
  providers: [
    AdminService,
    ReleaseNoteService,
    MakeAdminCommand,
    {
      provide: 'SystemSettingRepository',
      useClass: TypeOrmSystemSettingRepository,
    },
    {
      provide: 'ReleaseNoteRepository',
      useClass: TypeOrmReleaseNoteRepository,
    },
    {
      provide: IStoryRepository,
      useClass: StoryRepository,
    },
  ],
  exports: [AdminService, ReleaseNoteService, MakeAdminCommand],
})
export class AdminModule {}