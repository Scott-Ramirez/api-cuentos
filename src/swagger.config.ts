import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('api-cuentos')
    .setDescription(
      '📚 REST API para la plataforma de cuentos digitales.\n\n' +
        'Permite a los usuarios crear, publicar y explorar cuentos con capítulos, ' +
        'ilustraciones, likes y comentarios. Incluye un panel de administración completo ' +
        'para gestionar la plataforma.\n\n' +
        '## Módulos disponibles\n' +
        '- **Auth** — Registro, login y gestión del perfil propio\n' +
        '- **Stories** — CRUD de cuentos, capítulos y exploración pública\n' +
        '- **Comments** — Comentarios y respuestas anidadas en cuentos\n' +
        '- **Likes** — Sistema de likes por cuento\n' +
        '- **Notifications** — Notificaciones de actividad del usuario\n' +
        '- **Upload** — Subida de imágenes (avatares, portadas, ilustraciones)\n' +
        '- **Release Notes** — Historial de versiones de la plataforma\n' +
        '- **Admin** — Panel de administración (requiere rol admin)\n\n' +
        '## Autenticación\n' +
        'La mayoría de endpoints protegidos requieren un token **Bearer JWT**. ' +
        'Obtenlo desde `POST /auth/login` e inclúyelo en el header `Authorization`.'
    )
    .setVersion('2.0.0')
    .addTag('Auth', 'Registro, login y perfil de usuario')
    .addTag('Stories', 'Gestión de cuentos y capítulos')
    .addTag('Comments', 'Comentarios en cuentos')
    .addTag('Likes', 'Sistema de likes')
    .addTag('Notifications', 'Notificaciones de actividad')
    .addTag('Upload', 'Subida de imágenes')
    .addTag('Release Notes', 'Notas de versión de la plataforma')
    .addTag('Admin', 'Panel de administración')
    .addTag('Version', 'Estado y versión del sistema')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'api-cuentos | Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .topbar-wrapper img { content:url('https://nestjs.com/img/logo-small.svg'); width:80px; height:auto; }
      .swagger-ui .topbar { background-color: #1a1a1a; }
    `,
  });
}
