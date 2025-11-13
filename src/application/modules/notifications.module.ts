import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSchema } from '../../infrastructure/database/typeorm/entities/notification.schema';
import { NotificationRepository } from '../../infrastructure/database/typeorm/repositories/notification.repository';
import { INotificationRepository } from '../../domain/repositories';
import { CreateNotificationUseCase } from '../use-cases/notifications/create-notification.use-case';
import { GetUserNotificationsUseCase } from '../use-cases/notifications/get-user-notifications.use-case';
import { MarkNotificationAsReadUseCase } from '../use-cases/notifications/mark-notification-as-read.use-case';
import { GetUnreadCountUseCase } from '../use-cases/notifications/get-unread-count.use-case';
import { NotificationsController } from '../../presentation/controllers/notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationSchema])],
  controllers: [NotificationsController],
  providers: [
    {
      provide: INotificationRepository,
      useClass: NotificationRepository,
    },
    CreateNotificationUseCase,
    GetUserNotificationsUseCase,
    MarkNotificationAsReadUseCase,
    GetUnreadCountUseCase,
  ],
  exports: [CreateNotificationUseCase],
})
export class NotificationsModule {}
