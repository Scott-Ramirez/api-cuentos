import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '../../application/use-cases/admin/admin.service';
import { UpdateSystemSettingDto, MaintenanceControlDto } from '../../application/dto/system-admin.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    const [stats, settings, maintenance] = await Promise.all([
      this.adminService.getSystemStats(),
      this.adminService.getSystemSettings(),
      this.adminService.getMaintenanceStatus(),
    ]);

    return {
      stats,
      settings,
      maintenance,
    };
  }

  @Get('stats')
  async getSystemStats() {
    return await this.adminService.getSystemStats();
  }

  @Get('settings')
  async getSystemSettings(@Query('category') category?: string) {
    if (category) {
      return await this.adminService.getSystemSettingsByCategory(category);
    }
    return await this.adminService.getSystemSettings();
  }

  @Post('settings')
  async updateSystemSetting(@Body() dto: UpdateSystemSettingDto) {
    return await this.adminService.updateSystemSetting(dto);
  }

  @Get('maintenance')
  async getMaintenanceStatus() {
    return await this.adminService.getMaintenanceStatus();
  }

  @Post('maintenance')
  async updateMaintenanceSettings(@Body() dto: MaintenanceControlDto) {
    await this.adminService.updateMaintenanceSettings(dto);
    return { message: 'Maintenance settings updated successfully' };
  }

  @Post('maintenance/enable')
  async enableMaintenance(@Body('message') message?: string) {
    await this.adminService.updateMaintenanceSettings({
      maintenanceWarning: false,
      maintenanceActive: true,
      maintenanceMessage: message,
    });
    return { message: 'Maintenance mode enabled' };
  }

  @Post('maintenance/disable')
  async disableMaintenance() {
    await this.adminService.updateMaintenanceSettings({
      maintenanceWarning: false,
      maintenanceActive: false,
    });
    return { message: 'Maintenance mode disabled' };
  }

  @Post('maintenance/warning')
  async enableMaintenanceWarning(@Body('message') message?: string) {
    await this.adminService.updateMaintenanceSettings({
      maintenanceWarning: true,
      maintenanceActive: false,
      warningMessage: message,
    });
    return { message: 'Maintenance warning enabled' };
  }

  @Post('maintenance/warning/disable')
  async disableMaintenanceWarning() {
    const currentStatus = await this.adminService.getMaintenanceStatus();
    await this.adminService.updateMaintenanceSettings({
      maintenanceWarning: false,
      maintenanceActive: currentStatus.maintenanceActive,
      maintenanceMessage: currentStatus.maintenanceMessage,
    });
    return { message: 'Maintenance warning disabled' };
  }
}