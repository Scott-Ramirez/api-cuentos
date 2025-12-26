import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { SystemSetting } from '../../../domain/entities';
import { SystemSettingRepository, IStoryRepository } from '../../../domain/repositories';
import { UpdateSystemSettingDto, MaintenanceControlDto } from '../../dto/system-admin.dto';
import * as fs from 'fs';
import * as path from 'path';

export interface SystemStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  stories: {
    total: number;
    published: number;
    drafts: number;
    newThisMonth: number;
  };
  system: {
    uptime: string;
    version: string;
    maintenanceMode: boolean;
    lastRestart: Date;
  };
  storage: {
    totalFiles: number;
    totalSize: string;
  };
}

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @Inject('SystemSettingRepository')
    private readonly systemSettingRepository: SystemSettingRepository,
    @Inject(IStoryRepository)
    private readonly storyRepository: IStoryRepository,
  ) {}

  async onModuleInit() {
    // Inicializar configuraciones por defecto al arrancar el servidor
    await this.systemSettingRepository.initializeDefaults();
  }

  async getSystemSettings(): Promise<SystemSetting[]> {
    return await this.systemSettingRepository.findAll();
  }

  async getSystemSettingsByCategory(category: string): Promise<SystemSetting[]> {
    return await this.systemSettingRepository.findByCategory(category);
  }

  async updateSystemSetting(dto: UpdateSystemSettingDto): Promise<SystemSetting> {
    return await this.systemSettingRepository.upsert(
      dto.key,
      dto.value,
      dto.type,
      dto.description,
      dto.category
    );
  }

  async updateMaintenanceSettings(dto: MaintenanceControlDto): Promise<void> {
    await this.systemSettingRepository.update('maintenance_warning', dto.maintenanceWarning.toString());
    await this.systemSettingRepository.update('maintenance_active', dto.maintenanceActive.toString());
    
    if (dto.maintenanceMessage) {
      await this.systemSettingRepository.upsert(
        'maintenance_message',
        dto.maintenanceMessage,
        'string',
        'Message to show during maintenance',
        'maintenance'
      );
    }

    if (dto.warningMessage) {
      await this.systemSettingRepository.upsert(
        'warning_message',
        dto.warningMessage,
        'string',
        'Message to show during maintenance warning',
        'maintenance'
      );
    }
  }

  async getMaintenanceStatus(): Promise<{
    maintenanceWarning: boolean;
    maintenanceActive: boolean;
    maintenanceMessage: string;
    warningMessage: string;
  }> {
    const warning = await this.systemSettingRepository.findByKey('maintenance_warning');
    const active = await this.systemSettingRepository.findByKey('maintenance_active');
    const message = await this.systemSettingRepository.findByKey('maintenance_message');
    const warningMessage = await this.systemSettingRepository.findByKey('warning_message');

    return {
      maintenanceWarning: warning?.value === 'true',
      maintenanceActive: active?.value === 'true',
      maintenanceMessage: message?.value || 'Sistema en mantenimiento. Volveremos pronto.',
      warningMessage: warningMessage?.value || 'Mantenimiento programado próximamente. Por favor, guarda tu trabajo.',
    };
  }

  async getSystemStats(): Promise<SystemStats> {
    // Obtener estadísticas básicas para monitoreo
    const allStories = await this.storyRepository.findAll();
    const publishedStories = allStories.filter(story => story.status === 'published');
    const draftStories = allStories.filter(story => story.status === 'draft');

    // Calcular estadísticas del mes actual
    const currentMonth = new Date();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const newStoriesThisMonth = allStories.filter(story => new Date(story.created_at) >= firstDayOfMonth);

    // Obtener información de almacenamiento
    const storageInfo = await this.getStorageInfo();

    // Contar usuarios únicos (estimación básica basada en user_id de historias)
    const uniqueUserIds = [...new Set(allStories.map(story => story.user_id))];
    const totalUsers = uniqueUserIds.length;

    return {
      users: {
        total: totalUsers,
        active: uniqueUserIds.filter(userId => {
          // Considerar activo si ha creado o editado historias en los últimos 30 días
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          const userStories = allStories.filter(story => story.user_id === userId);
          return userStories.some(story => new Date(story.updated_at) >= thirtyDaysAgo);
        }).length,
        newThisMonth: 0, // Solo monitoreo básico
      },
      stories: {
        total: allStories.length,
        published: publishedStories.length,
        drafts: draftStories.length,
        newThisMonth: newStoriesThisMonth.length,
      },
      system: {
        uptime: this.getUptime(),
        version: process.env.npm_package_version || '0.11.1',
        maintenanceMode: (await this.getMaintenanceStatus()).maintenanceActive,
        lastRestart: new Date(Date.now() - process.uptime() * 1000),
      },
      storage: storageInfo,
    };
  }

  private async getStorageInfo(): Promise<{ totalFiles: number; totalSize: string; }> {
    try {
      const uploadsPath = path.join(process.cwd(), 'uploads');
      
      if (!fs.existsSync(uploadsPath)) {
        return { totalFiles: 0, totalSize: '0 MB' };
      }

      const files = await this.getFilesRecursively(uploadsPath);
      const totalFiles = files.length;
      
      let totalSize = 0;
      for (const file of files) {
        try {
          const stats = fs.statSync(file);
          totalSize += stats.size;
        } catch (error) {
          // Ignorar archivos que no se pueden leer
        }
      }

      return {
        totalFiles,
        totalSize: this.formatBytes(totalSize),
      };
    } catch (error) {
      return { totalFiles: 0, totalSize: '0 MB' };
    }
  }

  private async getFilesRecursively(dir: string): Promise<string[]> {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...await this.getFilesRecursively(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 MB';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private getUptime(): string {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.systemSettingRepository.findByKey(key);
    return setting?.value || null;
  }

  async getSettingAsBoolean(key: string): Promise<boolean> {
    const value = await this.getSetting(key);
    return value === 'true';
  }
}