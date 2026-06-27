import { Injectable, Inject } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { IStoryRepository, IUserRepository } from '../../../domain/repositories';
import { MaintenanceService } from './maintenance.service';

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
export class SystemStatsService {
  constructor(
    @Inject('IStoryRepository')
    private readonly storyRepository: IStoryRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly maintenanceService: MaintenanceService,
  ) {}

  async getSystemStats(): Promise<SystemStats> {
    const [allStories, totalUsers, maintenanceStatus, storageInfo] = await Promise.all([
      this.storyRepository.findAll(),
      this.userRepository.count(),
      this.maintenanceService.getMaintenanceStatus(),
      this.getStorageInfo(),
    ]);

    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    return {
      users: {
        total: totalUsers,
        active: 0,
        newThisMonth: 0,
      },
      stories: {
        total: allStories.length,
        published: allStories.filter(s => s.status === 'published').length,
        drafts: allStories.filter(s => s.status === 'draft').length,
        newThisMonth: allStories.filter(s => new Date(s.created_at) >= firstDayOfMonth).length,
      },
      system: {
        uptime: this.getUptime(),
        version: process.env.npm_package_version || '2.0.0',
        maintenanceMode: maintenanceStatus.maintenanceActive,
        lastRestart: new Date(Date.now() - process.uptime() * 1000),
      },
      storage: storageInfo,
    };
  }

  private async getStorageInfo(): Promise<{ totalFiles: number; totalSize: string }> {
    try {
      const uploadsPath = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsPath)) {
        return { totalFiles: 0, totalSize: '0 B' };
      }
      const files = await this.getFilesRecursively(uploadsPath);
      let totalSize = 0;
      for (const file of files) {
        try {
          totalSize += fs.statSync(file).size;
        } catch { /* skip unreadable */ }
      }
      return { totalFiles: files.length, totalSize: this.formatBytes(totalSize) };
    } catch {
      return { totalFiles: 0, totalSize: '0 B' };
    }
  }

  private async getFilesRecursively(dir: string): Promise<string[]> {
    const files: string[] = [];
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...(await this.getFilesRecursively(fullPath)));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  private getUptime(): string {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    return `${h}h ${m}m ${s}s`;
  }
}
