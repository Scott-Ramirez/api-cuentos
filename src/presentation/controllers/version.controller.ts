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
        maintenance: process.env.MAINTENANCE_MODE === 'true',
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
        version: '0.0.1',
        name: 'probar_api_new_server',
        maintenance: process.env.MAINTENANCE_MODE === 'true',
        lastUpdate: new Date().toISOString(),
        features: []
      };
    }
  }
}