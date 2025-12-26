import { Controller, Get } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { ReleaseNoteService } from '../../application/use-cases/release-notes/release-note.service';
import { AdminService } from '../../application/use-cases/admin/admin.service';

@Controller('version')
export class VersionController {
  constructor(
    private readonly releaseNoteService: ReleaseNoteService,
    private readonly adminService: AdminService,
  ) {}

  @Get()
  async getVersion() {
    try {
      // Leer package.json de forma más robusta
      const packageJsonPath = join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Obtener configuraciones de mantenimiento desde la base de datos
      const maintenanceStatus = await this.adminService.getMaintenanceStatus();
      
      // Obtener release note activa desde la base de datos
      const currentReleaseNote = await this.releaseNoteService.getCurrentReleaseNote();
      
      return {
        version: packageJson.version,
        name: packageJson.name,
        maintenanceWarning: maintenanceStatus.maintenanceWarning,
        maintenanceActive: maintenanceStatus.maintenanceActive,
        maintenanceMessage: maintenanceStatus.maintenanceActive 
          ? maintenanceStatus.maintenanceMessage 
          : maintenanceStatus.warningMessage, // Use correct message based on state
        releaseNotes: currentReleaseNote?.content || null,
        releaseId: currentReleaseNote?.id?.toString() || null,
        releaseTitle: currentReleaseNote?.title || null,
        lastUpdate: new Date().toISOString(),
        features: [
          'Gestión de historias',
          'Sistema de autenticación',
          'Perfil de usuario mejorado',
          'Eliminación segura de cuenta',
          'Notificaciones del sistema'
        ]
      };
    } catch (error) {
      console.error('Error reading package.json:', error);
      const maintenanceStatus = await this.adminService.getMaintenanceStatus();
      const currentReleaseNote = await this.releaseNoteService.getCurrentReleaseNote();
        
      return {
        version: '0.8.0',
        name: 'probar_api_new_server',
        maintenanceWarning: maintenanceStatus.maintenanceWarning,
        maintenanceActive: maintenanceStatus.maintenanceActive,
        maintenanceMessage: maintenanceStatus.maintenanceActive 
          ? maintenanceStatus.maintenanceMessage 
          : maintenanceStatus.warningMessage, // Use correct message based on state
        releaseNotes: currentReleaseNote?.content || null,
        releaseId: currentReleaseNote?.id?.toString() || null,
        releaseTitle: currentReleaseNote?.title || null,
        lastUpdate: new Date().toISOString(),
        features: []
      };
    }
  }
}