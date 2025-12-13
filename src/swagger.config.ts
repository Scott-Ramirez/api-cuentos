import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('StoryForge API')
    .setDescription(
      '📚 API para plataforma de creación de cuentos personales con autenticación, subida de imágenes, likes y comentarios.\n\n' +
        '## Características:\n' +
        '- ✅ Autenticación JWT\n' +
        '- ✅ Gestión de cuentos con capítulos\n' +
        '- ✅ Sistema de likes y comentarios\n' +
        '- ✅ Subida de imágenes (avatares, portadas, ilustraciones)\n' +
        '- ✅ Tags y categorización\n' +
        '- ✅ Publicación de cuentos (draft/published)\n\n'
    )
    .setVersion('1.0')
    .addTag('Auth', 'Autenticación y registro de usuarios')
    .addTag('Stories', 'Gestión de cuentos y capítulos')
    .addTag('Likes', 'Sistema de likes en cuentos')
    .addTag('Comments', 'Sistema de comentarios')
    .addTag('Upload', 'Subida de imágenes')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'StoryForge API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .topbar-wrapper img { content:url('https://nestjs.com/img/logo-small.svg'); width:80px; height:auto; }
      .swagger-ui .topbar { background-color: #1a1a1a; }
    `,
  });
}
