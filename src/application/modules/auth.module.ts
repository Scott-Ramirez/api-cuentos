import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/auth/update-profile.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/auth/change-password.use-case';
import { UserRepository } from '../../infrastructure/database/typeorm/repositories/user.repository';
import { UserSchema } from '../../infrastructure/database/typeorm/entities/user.schema';
import { IUserRepository } from '../../domain/repositories';
import { JwtStrategy } from '../../presentation/guards/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') || 'default_secret_change',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
            '7d') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    JwtStrategy,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
