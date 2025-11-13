import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3001', 
      'http://localhost:3000',
      /https:\/\/.*\.ngrok-free\.app$/, // Permite cualquier URL de ngrok
      /https:\/\/.*\.ngrok\.io$/, // Permite URLs de ngrok antiguas también
    ],
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable class-transformer serialization (para @Exclude())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger Configuration
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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 StoryForge API running on http://localhost:${port}`);
  logger.log(`📚 Swagger Docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
