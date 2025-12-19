import { Controller, Get } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

@Controller('version')
export class VersionController {
  @Get()
  getVersion() {
    try {
      // Leer package.json de forma más robusta
      const packageJsonPath = join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      return {
        version: packageJson.version,
        name: packageJson.name,
        maintenanceWarning: process.env.MAINTENANCE_WARNING === 'true',
        maintenanceActive: process.env.MAINTENANCE_ACTIVE === 'true',
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
      return {
        version: '0.8.0',
        name: 'probar_api_new_server',
        maintenanceWarning: process.env.MAINTENANCE_WARNING === 'true',
        maintenanceActive: process.env.MAINTENANCE_ACTIVE === 'true',
        lastUpdate: new Date().toISOString(),
        features: []
      };
    }
  }
}