
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { setupSwagger } from './swagger.config';
import { AppModule } from './app.module';

function parseCorsOrigins(envOrigins?: string): (string | RegExp)[] {
  if (!envOrigins) {
    // Default to localhost for dev
    return [
      'http://localhost:3001',
      'http://localhost:3000',
      /https:\/\/.*\.ngrok-free\.app$/,
      /https:\/\/.*\.ngrok\.io$/,
    ];
  }
  return envOrigins.split(',').map(origin => {
    const trimmed = origin.trim();
    if (trimmed.startsWith('regex:')) {
      // Allow regex: prefix for advanced use
      return new RegExp(trimmed.replace('regex:', ''));
    }
    return trimmed;
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS with dynamic origins from env
  const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  app.enableCors({
    origin: corsOrigins,
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
  setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 StoryForge API running on http://localhost:${port}`);
  logger.log(`📚 Swagger Docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
