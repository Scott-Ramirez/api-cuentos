import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { MaintenanceService } from '../../application/use-cases/admin/maintenance.service';
import { SystemSettingsService } from '../../application/use-cases/admin/system-settings.service';
import { SystemStatsService } from '../../application/use-cases/admin/system-stats.service';
import { AdminProfileService } from '../../application/use-cases/admin/admin-profile.service';
import { DatabaseManagementService } from '../../application/use-cases/admin/database-management.service';
import { SystemMonitoringService } from '../../application/use-cases/admin/system-monitoring.service';
import {
  UpdateSystemSettingDto,
  MaintenanceControlDto,
  UpdateAdminProfileDto,
  ChangePasswordDto,
} from '../../application/dto/system-admin.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly systemSettingsService: SystemSettingsService,
    private readonly systemStatsService: SystemStatsService,
    private readonly adminProfileService: AdminProfileService,
    private readonly databaseService: DatabaseManagementService,
    private readonly monitoringService: SystemMonitoringService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    const [stats, settings, maintenance] = await Promise.all([
      this.systemStatsService.getSystemStats(),
      this.systemSettingsService.getSystemSettings(),
      this.maintenanceService.getMaintenanceStatus(),
    ]);
    return { stats, settings, maintenance };
  }

  @Get('stats')
  async getSystemStats() {
    return this.systemStatsService.getSystemStats();
  }

  @Get('settings')
  async getSystemSettings(@Query('category') category?: string) {
    return category
      ? this.systemSettingsService.getSystemSettingsByCategory(category)
      : this.systemSettingsService.getSystemSettings();
  }

  @Post('settings')
  async updateSystemSetting(@Body() dto: UpdateSystemSettingDto) {
    return this.systemSettingsService.updateSystemSetting(dto);
  }

  @Get('maintenance')
  async getMaintenanceStatus() {
    return this.maintenanceService.getMaintenanceStatus();
  }

  @Post('maintenance')
  async updateMaintenanceSettings(@Body() dto: MaintenanceControlDto) {
    await this.maintenanceService.updateMaintenanceSettings(dto);
    return { message: 'Maintenance settings updated successfully' };
  }

  @Post('maintenance/enable')
  async enableMaintenance(@Body('message') message?: string) {
    await this.maintenanceService.updateMaintenanceSettings({
      maintenanceWarning: false,
      maintenanceActive: true,
      maintenanceMessage: message,
    });
    return { message: 'Maintenance mode enabled' };
  }

  @Post('maintenance/disable')
  async disableMaintenance() {
    await this.maintenanceService.updateMaintenanceSettings({
      maintenanceWarning: false,
      maintenanceActive: false,
    });
    return { message: 'Maintenance mode disabled' };
  }

  @Post('maintenance/warning')
  async enableMaintenanceWarning(@Body('message') message?: string) {
    await this.maintenanceService.updateMaintenanceSettings({
      maintenanceWarning: true,
      maintenanceActive: false,
      warningMessage: message,
    });
    return { message: 'Maintenance warning enabled' };
  }

  @Post('maintenance/warning/disable')
  async disableMaintenanceWarning() {
    const current = await this.maintenanceService.getMaintenanceStatus();
    await this.maintenanceService.updateMaintenanceSettings({
      maintenanceWarning: false,
      maintenanceActive: current.maintenanceActive,
      maintenanceMessage: current.maintenanceMessage,
    });
    return { message: 'Maintenance warning disabled' };
  }

  @Get('profile')
  async getAdminProfile(@Request() req) {
    return this.adminProfileService.getAdminProfile(req.user.id);
  }

  @Put('profile')
  async updateAdminProfile(@Request() req, @Body() dto: UpdateAdminProfileDto) {
    return this.adminProfileService.updateAdminProfile(req.user.id, dto);
  }

  @Post('profile/change-password')
  async changeAdminPassword(@Request() req, @Body() dto: ChangePasswordDto) {
    await this.adminProfileService.changeAdminPassword(req.user.id, dto);
    return { message: 'Password changed successfully' };
  }

  @Get('profile/security')
  async getSecuritySettings(@Request() req) {
    return this.adminProfileService.getAdminSecurityInfo(req.user.id);
  }

  @Get('database/info')
  async getDatabaseInfo() {
    return this.databaseService.getDatabaseInfo();
  }

  @Post('database/backup')
  async createDatabaseBackup() {
    return this.databaseService.createDatabaseBackup();
  }

  @Post('database/optimize')
  async optimizeDatabase() {
    return this.databaseService.optimizeDatabase();
  }

  @Get('logs')
  async getSystemLogs(@Query('limit') limit?: string) {
    return this.monitoringService.getSystemLogs(limit ? parseInt(limit, 10) : 50);
  }

  @Get('environment')
  async getEnvironmentVariables() {
    return this.monitoringService.getEnvironmentVariables();
  }

  @Get('system/metrics')
  async getSystemMetrics() {
    return this.monitoringService.getSystemMetrics();
  }
}
