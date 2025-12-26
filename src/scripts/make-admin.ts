import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MakeAdminCommand } from '../application/commands/make-admin.command';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const makeAdminCommand = app.get(MakeAdminCommand);

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('❌ Uso: npm run make-admin <username_or_email>');
    console.log('Ejemplo: npm run make-admin admin@ejemplo.com');
    process.exit(1);
  }

  const usernameOrEmail = args[0];
  
  try {
    await makeAdminCommand.execute(usernameOrEmail);
  } catch (error) {
    console.error('❌ Error al convertir usuario a admin:', error.message);
  }

  await app.close();
}

bootstrap();