import { Controller, Get, Put, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../guards/current-user.decorator';
import { CreateNotificationUseCase } from '../../application/use-cases/notifications/create-notification.use-case';
import { GetUserNotificationsUseCase } from '../../application/use-cases/notifications/get-user-notifications.use-case';
import { MarkNotificationAsReadUseCase } from '../../application/use-cases/notifications/mark-notification-as-read.use-case';
import { GetUnreadCountUseCase } from '../../application/use-cases/notifications/get-unread-count.use-case';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener notificaciones del usuario',
    description: 'Lista todas las notificaciones del usuario autenticado. Puede filtrar solo no leídas.'
  })
  @ApiQuery({ 
    name: 'unread', 
    required: false, 
    description: 'Filtrar solo notificaciones no leídas',
    type: Boolean
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de notificaciones',
    schema: {
      example: [{
        id: 1,
        user_id: 2,
        type: 'comment',
        story_id: 5,
        triggered_by_user_id: 3,
        comment_id: 10,
        is_read: false,
        created_at: '2025-01-09T12:00:00.000Z',
        triggered_by: {
          id: 3,
          username: 'reader123'
        },
        story: {
          id: 5,
          title: 'Mi cuento fantástico'
        }
      }]
    }
  })
  async getNotifications(
    @CurrentUser() user: any,
    @Query('unread') unread?: string,
  ) {
    const onlyUnread = unread === 'true';
    return await this.getUserNotificationsUseCase.execute(user.id, onlyUnread);
  }

  @Get('count')
  @ApiOperation({ 
    summary: 'Contar notificaciones no leídas',
    description: 'Obtiene el número de notificaciones no leídas del usuario.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Número de notificaciones no leídas',
    schema: {
      example: {
        count: 5
      }
    }
  })
  async getUnreadCount(@CurrentUser() user: any) {
    const count = await this.getUnreadCountUseCase.execute(user.id);
    return { count };
  }

  @Put(':id/read')
  @ApiOperation({ 
    summary: 'Marcar notificación como leída',
    description: 'Marca una notificación específica como leída.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la notificación',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Notificación marcada como leída',
    schema: {
      example: {
        message: 'Notification marked as read'
      }
    }
  })
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    await this.markNotificationAsReadUseCase.execute(id);
    return { message: 'Notification marked as read' };
  }

  @Put('read-all')
  @ApiOperation({ 
    summary: 'Marcar todas las notificaciones como leídas',
    description: 'Marca todas las notificaciones del usuario como leídas.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Todas las notificaciones marcadas como leídas',
    schema: {
      example: {
        message: 'All notifications marked as read'
      }
    }
  })
  async markAllAsRead(@CurrentUser() user: any) {
    await this.markNotificationAsReadUseCase.executeAll(user.id);
    return { message: 'All notifications marked as read' };
  }
}
