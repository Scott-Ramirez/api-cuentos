import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettingSchema } from '../../infrastructure/database/typeorm/entities/system-setting.schema';
import { ReleaseNoteSchema } from '../../infrastructure/database/typeorm/entities/release-note.schema';
import { UserSchema } from '../../infrastructure/database/typeorm/entities/user.schema';
import { StorySchema } from '../../infrastructure/database/typeorm/entities/story.schema';
import { ChapterSchema } from '../../infrastructure/database/typeorm/entities/chapter.schema';
import { StoryTagSchema } from '../../infrastructure/database/typeorm/entities/story-tag.schema';
import { AdminController } from '../../presentation/controllers/admin.controller';
import { VersionController } from '../../presentation/controllers/version.controller';
import { TypeOrmSystemSettingRepository } from '../../infrastructure/database/typeorm/repositories/system-setting.repository';
import { TypeOrmReleaseNoteRepository } from '../../infrastructure/database/typeorm/repositories/release-note.repository';
import { StoryRepository } from '../../infrastructure/database/typeorm/repositories/story.repository';
import { UserRepository } from '../../infrastructure/database/typeorm/repositories/user.repository';
import { MakeAdminCommand } from '../commands/make-admin.command';
import { ReleaseNoteService } from '../use-cases/release-notes/release-note.service';
import { MaintenanceService } from '../use-cases/admin/maintenance.service';
import { SystemSettingsService } from '../use-cases/admin/system-settings.service';
import { SystemStatsService } from '../use-cases/admin/system-stats.service';
import { AdminProfileService } from '../use-cases/admin/admin-profile.service';
import { DatabaseManagementService } from '../use-cases/admin/database-management.service';
import { SystemMonitoringService } from '../use-cases/admin/system-monitoring.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemSettingSchema,
      ReleaseNoteSchema,
      UserSchema,
      StorySchema,
      ChapterSchema,
      StoryTagSchema,
    ]),
  ],
  controllers: [AdminController, VersionController],
  providers: [
    MakeAdminCommand,
    ReleaseNoteService,
    MaintenanceService,
    SystemSettingsService,
    SystemStatsService,
    AdminProfileService,
    DatabaseManagementService,
    SystemMonitoringService,
    { provide: 'SystemSettingRepository', useClass: TypeOrmSystemSettingRepository },
    { provide: 'ReleaseNoteRepository', useClass: TypeOrmReleaseNoteRepository },
    { provide: 'IStoryRepository', useClass: StoryRepository },
    { provide: 'IUserRepository', useClass: UserRepository },
  ],
  exports: [MaintenanceService, SystemSettingsService, ReleaseNoteService, MakeAdminCommand],
})
export class AdminModule {}