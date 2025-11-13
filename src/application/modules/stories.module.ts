import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { StoriesController } from '../../presentation/controllers/stories.controller';
import { CommentsController } from '../../presentation/controllers/comments.controller';
import { LikesController } from '../../presentation/controllers/likes.controller';
import { CreateStoryUseCase } from '../use-cases/stories/create-story.use-case';
import { PublishStoryUseCase } from '../use-cases/stories/publish-story.use-case';
import { CreateCommentUseCase } from '../use-cases/comments/create-comment.use-case';
import { ToggleLikeUseCase } from '../use-cases/likes/toggle-like.use-case';
import { StoryRepository } from '../../infrastructure/database/typeorm/repositories/story.repository';
import { CommentRepository } from '../../infrastructure/database/typeorm/repositories/comment.repository';
import { LikeRepository } from '../../infrastructure/database/typeorm/repositories/like.repository';
import { StorySchema } from '../../infrastructure/database/typeorm/entities/story.schema';
import { ChapterSchema } from '../../infrastructure/database/typeorm/entities/chapter.schema';
import { StoryTagSchema } from '../../infrastructure/database/typeorm/entities/story-tag.schema';
import { StoryCommentSchema } from '../../infrastructure/database/typeorm/entities/story-comment.schema';
import { StoryLikeSchema } from '../../infrastructure/database/typeorm/entities/story-like.schema';
import {
  IStoryRepository,
  ICommentRepository,
  ILikeRepository,
} from '../../domain/repositories';
import { NotificationsModule } from './notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StorySchema,
      ChapterSchema,
      StoryTagSchema,
      StoryCommentSchema,
      StoryLikeSchema,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    NotificationsModule,
  ],
  controllers: [StoriesController, CommentsController, LikesController],
  providers: [
    CreateStoryUseCase,
    PublishStoryUseCase,
    CreateCommentUseCase,
    ToggleLikeUseCase,
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
  ],
})
export class StoriesModule {}
