import { Injectable, Inject } from '@nestjs/common';
import { SystemSettingRepository } from '../../../domain/repositories';
import { MaintenanceControlDto } from '../../dto/system-admin.dto';

export interface MaintenanceStatus {
  maintenanceWarning: boolean;
  maintenanceActive: boolean;
  maintenanceMessage: string;
  warningMessage: string;
}

@Injectable()
export class MaintenanceService {
  constructor(
    @Inject('SystemSettingRepository')
    private readonly systemSettingRepository: SystemSettingRepository,
  ) {}

  async getMaintenanceStatus(): Promise<MaintenanceStatus> {
    const [warning, active, message, warningMessage] = await Promise.all([
      this.systemSettingRepository.findByKey('maintenance_warning'),
      this.systemSettingRepository.findByKey('maintenance_active'),
      this.systemSettingRepository.findByKey('maintenance_message'),
      this.systemSettingRepository.findByKey('warning_message'),
    ]);

    return {
      maintenanceWarning: warning?.value === 'true',
      maintenanceActive: active?.value === 'true',
      maintenanceMessage: message?.value || 'Sistema en mantenimiento. Volveremos pronto.',
      warningMessage:
        warningMessage?.value ||
        'Mantenimiento programado próximamente. Por favor, guarda tu trabajo.',
    };
  }

  async updateMaintenanceSettings(dto: MaintenanceControlDto): Promise<void> {
    await Promise.all([
      this.systemSettingRepository.update('maintenance_warning', dto.maintenanceWarning.toString()),
      this.systemSettingRepository.update('maintenance_active', dto.maintenanceActive.toString()),
    ]);

    if (dto.maintenanceMessage) {
      await this.systemSettingRepository.upsert(
        'maintenance_message',
        dto.maintenanceMessage,
        'string',
        'Message to show during maintenance',
        'maintenance',
      );
    }

    if (dto.warningMessage) {
      await this.systemSettingRepository.upsert(
        'warning_message',
        dto.warningMessage,
        'string',
        'Message to show during maintenance warning',
        'maintenance',
      );
    }
  }

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.systemSettingRepository.findByKey(key);
    return setting?.value ?? null;
  }

  async getSettingAsBoolean(key: string): Promise<boolean> {
    const value = await this.getSetting(key);
    return value === 'true';
  }
}
