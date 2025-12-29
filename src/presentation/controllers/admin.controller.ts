import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { AdminService } from '../../application/use-cases/admin/admin.service';
import { UpdateSystemSettingDto, MaintenanceControlDto, UpdateAdminProfileDto, ChangePasswordDto } from '../../application/dto/system-admin.dto';
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

  // Endpoints para configuración de perfil de admin
  @Get('profile')
  async getAdminProfile(@Request() req) {
    return await this.adminService.getAdminProfile(req.user.id);
  }

  @Put('profile')
  async updateAdminProfile(@Request() req, @Body() dto: UpdateAdminProfileDto) {
    return await this.adminService.updateAdminProfile(req.user.id, dto);
  }

  @Post('profile/change-password')
  async changeAdminPassword(@Request() req, @Body() dto: ChangePasswordDto) {
    await this.adminService.changeAdminPassword(req.user.id, dto);
    return { message: 'Password changed successfully' };
  }

  @Get('profile/security')
  async getSecuritySettings(@Request() req) {
    return await this.adminService.getAdminSecurityInfo(req.user.id);
  }

  // Nuevos endpoints para funcionalidades avanzadas de sistema
  @Get('database/info')
  async getDatabaseInfo() {
    return await this.adminService.getDatabaseInfo();
  }

  @Post('database/backup')
  async createDatabaseBackup() {
    return await this.adminService.createDatabaseBackup();
  }

  @Post('database/optimize')
  async optimizeDatabase() {
    return await this.adminService.optimizeDatabase();
  }

  @Get('logs')
  async getSystemLogs(@Query('limit') limit?: string) {
    const logLimit = limit ? parseInt(limit, 10) : 50;
    return await this.adminService.getSystemLogs(logLimit);
  }

  @Get('environment')
  async getEnvironmentVariables() {
    return await this.adminService.getEnvironmentVariables();
  }

  @Get('system/metrics')
  async getSystemMetrics() {
    return await this.adminService.getSystemMetrics();
  }
}