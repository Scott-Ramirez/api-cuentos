import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../guards/current-user.decorator';
import { CreateCommentUseCase } from '../../application/use-cases/comments/create-comment.use-case';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ICommentRepository, IStoryRepository } from '../../domain/repositories';
import { Inject } from '@nestjs/common';
import { CreateNotificationUseCase } from '../../application/use-cases/notifications/create-notification.use-case';

@ApiTags('Comments')
@Controller('stories/:storyId/comments')
export class CommentsController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    @Inject(ICommentRepository)
    private readonly commentRepository: ICommentRepository,
    @Inject(IStoryRepository)
    private readonly storyRepository: IStoryRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener comentarios de un cuento',
    description: 'Lista todos los comentarios de un cuento específico.'
  })
  @ApiParam({ 
    name: 'storyId', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de comentarios',
    schema: {
      example: [{
        id: 1,
        comment: '¡Me encantó esta historia!',
        story_id: 1,
        user_id: 2,
        user: {
          id: 2,
          username: 'reader123',
          avatar: null
        },
        created_at: '2025-01-09T12:00:00.000Z',
        updated_at: '2025-01-09T12:00:00.000Z'
      }]
    }
  })
  async findAll(@Param('storyId', ParseIntPipe) storyId: number) {
    return await this.commentRepository.findByStoryId(storyId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Crear comentario o respuesta',
    description: 'Agrega un comentario a un cuento o una respuesta a un comentario existente. Requiere autenticación.'
  })
  @ApiParam({ 
    name: 'storyId', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Comentario creado',
    schema: {
      example: {
        id: 1,
        comment: '¡Me encantó esta historia!',
        story_id: 1,
        user_id: 2,
        parent_comment_id: null,
        created_at: '2025-01-09T12:00:00.000Z',
        updated_at: '2025-01-09T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado'
  })
  async create(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    const comment = await this.createCommentUseCase.execute({
      comment: createCommentDto.comment,
      story_id: storyId,
      user_id: user.id,
      parent_comment_id: createCommentDto.parent_comment_id,
    });

    // Crear notificación
    if (createCommentDto.parent_comment_id) {
      // Es una respuesta - notificar al autor del comentario padre
      const parentComment = await this.commentRepository.findById(createCommentDto.parent_comment_id);
      if (parentComment) {
        await this.createNotificationUseCase.execute({
          user_id: parentComment.user_id,
          type: 'reply',
          story_id: storyId,
          triggered_by_user_id: user.id,
          comment_id: comment.id,
        });
      }
    } else {
      // Es un comentario nuevo - notificar al autor del cuento
      const story = await this.storyRepository.findById(storyId);
      if (story) {
        await this.createNotificationUseCase.execute({
          user_id: story.user_id,
          type: 'comment',
          story_id: storyId,
          triggered_by_user_id: user.id,
          comment_id: comment.id,
        });
      }
    }

    return comment;
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Actualizar comentario',
    description: 'Modifica un comentario existente. Solo el autor puede actualizar.'
  })
  @ApiParam({ 
    name: 'storyId', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del comentario',
    example: 1
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Comentario actualizado',
    schema: {
      example: {
        id: 1,
        comment: 'Actualicé mi opinión...',
        story_id: 1,
        user_id: 2,
        updated_at: '2025-01-09T13:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado o no autorizado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Comentario no encontrado'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
    if (comment.user_id !== user.id) {
      throw new UnauthorizedException('No tienes permiso para actualizar este comentario');
    }
    return await this.commentRepository.update(id, {
      comment: updateCommentDto.comment,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Eliminar comentario',
    description: 'Elimina un comentario. Solo el autor puede eliminar.'
  })
  @ApiParam({ 
    name: 'storyId', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del comentario',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Comentario eliminado',
    schema: {
      example: {
        message: 'Comment deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado o no autorizado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Comentario no encontrado'
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
    if (comment.user_id !== user.id) {
      throw new UnauthorizedException('No tienes permiso para eliminar este comentario');
    }
    await this.commentRepository.delete(id);
    return { message: 'Comment deleted successfully' };
  }
}
