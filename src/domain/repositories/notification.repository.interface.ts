import { NotificationEntity } from '../entities/notification.entity';

export interface INotificationRepository {
  create(notification: Partial<NotificationEntity>): Promise<NotificationEntity>;
  findByUserId(userId: number): Promise<NotificationEntity[]>;
  findUnreadByUserId(userId: number): Promise<NotificationEntity[]>;
  getUnreadCount(userId: number): Promise<number>;
  markAsRead(id: number): Promise<void>;
  markAllAsRead(userId: number): Promise<void>;
}

export const INotificationRepository = Symbol('INotificationRepository');
