import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { SystemSetting } from '../../../domain/entities';
import { SystemSettingRepository } from '../../../domain/repositories';
import { UpdateSystemSettingDto } from '../../dto/system-admin.dto';

@Injectable()
export class SystemSettingsService implements OnModuleInit {
  constructor(
    @Inject('SystemSettingRepository')
    private readonly systemSettingRepository: SystemSettingRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.systemSettingRepository.initializeDefaults();
  }

  async getSystemSettings(): Promise<SystemSetting[]> {
    return this.systemSettingRepository.findAll();
  }

  async getSystemSettingsByCategory(category: string): Promise<SystemSetting[]> {
    return this.systemSettingRepository.findByCategory(category);
  }

  async updateSystemSetting(dto: UpdateSystemSettingDto): Promise<SystemSetting> {
    return this.systemSettingRepository.upsert(
      dto.key,
      dto.value,
      dto.type,
      dto.description,
      dto.category,
    );
  }
}
