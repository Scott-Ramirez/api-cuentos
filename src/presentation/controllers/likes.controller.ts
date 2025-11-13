import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../guards/current-user.decorator';
import { ToggleLikeUseCase } from '../../application/use-cases/likes/toggle-like.use-case';
import { ILikeRepository, IStoryRepository } from '../../domain/repositories';
import { Inject } from '@nestjs/common';
import { CreateNotificationUseCase } from '../../application/use-cases/notifications/create-notification.use-case';

@ApiTags('Likes')
@Controller('stories/:storyId/likes')
export class LikesController {
  constructor(
    private readonly toggleLikeUseCase: ToggleLikeUseCase,
    @Inject(ILikeRepository)
    private readonly likeRepository: ILikeRepository,
    @Inject(IStoryRepository)
    private readonly storyRepository: IStoryRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener likes de un cuento',
    description: 'Lista todos los likes de un cuento con información del usuario.'
  })
  @ApiParam({ 
    name: 'storyId', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de likes',
    schema: {
      example: [{
        id: 1,
        story_id: 1,
        user_id: 2,
        user: {
          id: 2,
          username: 'fan123',
          avatar: null
        },
        created_at: '2025-01-09T12:00:00.000Z'
      }]
    }
  })
  async getLikes(@Param('storyId', ParseIntPipe) storyId: number) {
    return await this.likeRepository.getLikesByStoryId(storyId);
  }

  @Get('count')
  @ApiOperation({ 
    summary: 'Contar likes de un cuento',
    description: 'Obtiene el número total de likes de un cuento.'
  })
  @ApiParam({ 
    name: 'storyId', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Número de likes',
    schema: {
      example: {
        count: 42
      }
    }
  })
  async getLikesCount(@Param('storyId', ParseIntPipe) storyId: number) {
    const count = await this.likeRepository.getLikesCount(storyId);
    return { count };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Toggle like',
    description: 'Da like a un cuento. Si ya existe el like, lo elimina (toggle). Requiere autenticación.'
  })
  @ApiParam({ 
    name: 'storyId', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Like agregado o removido',
    schema: {
      example: {
        message: 'Like added',
        like: {
          id: 1,
          story_id: 1,
          user_id: 2,
          created_at: '2025-01-09T12:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado'
  })
  async toggleLike(
    @Param('storyId', ParseIntPipe) storyId: number,
    @CurrentUser() user: any,
  ) {
    const result = await this.toggleLikeUseCase.execute(user.id, storyId);
    
    // Crear notificación si se dio like
    if (result.liked) {
      const story = await this.storyRepository.findById(storyId);
      if (story) {
        await this.createNotificationUseCase.execute({
          user_id: story.user_id,
          type: 'like',
          story_id: storyId,
          triggered_by_user_id: user.id,
        });
      }
    }
    
    return result;
  }
}
