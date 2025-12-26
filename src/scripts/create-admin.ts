import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserSchema } from '../infrastructure/database/typeorm/entities/user.schema';
import { UserRole } from '../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<UserSchema>>(getRepositoryToken(UserSchema));

  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('❌ Uso: npm run create-admin <email> <password>');
    console.log('Ejemplo: npm run create-admin admin@ejemplo.com admin123');
    process.exit(1);
  }

  const [email, password] = args;
  
  try {
    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findOne({
      where: [{ email }, { username: email }]
    });

    if (existingUser) {
      // Si el usuario existe, solo actualizamos su rol
      existingUser.role = UserRole.ADMIN;
      await userRepository.save(existingUser);
      console.log('✅ Usuario existente promocionado a administrador:', email);
    } else {
      // Crear nuevo usuario administrador
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const adminUser = userRepository.create({
        email,
        username: email.split('@')[0], // Usar la parte antes del @ como username
        password: hashedPassword,
        role: UserRole.ADMIN,
        bio: 'Administrador del sistema'
      });

      await userRepository.save(adminUser);
      console.log('✅ Usuario administrador creado exitosamente:', email);
    }
    
    console.log('🎉 Ya puedes ingresar al panel de administración con estas credenciales');
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
  }

  await app.close();
}

bootstrap();