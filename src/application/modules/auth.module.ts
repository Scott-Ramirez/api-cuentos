import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { UsersController } from '../../presentation/controllers/users.controller';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/auth/update-profile.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/auth/change-password.use-case';
import { DeleteAccountUseCase } from '../../application/use-cases/auth/delete-account.use-case';
import { UserRepository } from '../../infrastructure/database/typeorm/repositories/user.repository';
import { StoryRepository } from '../../infrastructure/database/typeorm/repositories/story.repository';
import { CommentRepository } from '../../infrastructure/database/typeorm/repositories/comment.repository';
import { LikeRepository } from '../../infrastructure/database/typeorm/repositories/like.repository';
import { NotificationRepository } from '../../infrastructure/database/typeorm/repositories/notification.repository';
import { UserSchema } from '../../infrastructure/database/typeorm/entities/user.schema';
import { StorySchema } from '../../infrastructure/database/typeorm/entities/story.schema';
import { ChapterSchema } from '../../infrastructure/database/typeorm/entities/chapter.schema';
import { StoryTagSchema } from '../../infrastructure/database/typeorm/entities/story-tag.schema';
import { StoryCommentSchema } from '../../infrastructure/database/typeorm/entities/story-comment.schema';
import { StoryLikeSchema } from '../../infrastructure/database/typeorm/entities/story-like.schema';
import { NotificationSchema } from '../../infrastructure/database/typeorm/entities/notification.schema';
import { IUserRepository, IStoryRepository, ICommentRepository, ILikeRepository, INotificationRepository } from '../../domain/repositories';
import { JwtStrategy } from '../../presentation/guards/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSchema, 
      StorySchema, 
      ChapterSchema, 
      StoryTagSchema, 
      StoryCommentSchema, 
      StoryLikeSchema, 
      NotificationSchema
    ]),
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
  controllers: [AuthController, UsersController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    DeleteAccountUseCase,
    JwtStrategy,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IStoryRepository,
      useClass: StoryRepository,
    },
    {
      provide: ICommentRepository,
      useClass: CommentRepository,
    },
    {
      provide: ILikeRepository,
      useClass: LikeRepository,
    },
    {
      provide: INotificationRepository,
      useClass: NotificationRepository,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
