import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationSchema } from '../entities/notification.schema';
import { INotificationRepository } from '../../../../domain/repositories';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationSchema)
    private readonly notificationRepository: Repository<NotificationSchema>,
  ) {}

  async create(notification: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const newNotification = this.notificationRepository.create(notification);
    return await this.notificationRepository.save(newNotification);
  }

  async findByUserId(userId: number): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find({
      where: { user_id: userId },
      relations: ['triggered_by', 'story'],
      order: { created_at: 'DESC' },
    });
  }

  async findUnreadByUserId(userId: number): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find({
      where: { user_id: userId, is_read: false },
      relations: ['triggered_by', 'story'],
      order: { created_at: 'DESC' },
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { user_id: userId, is_read: false },
    });
  }

  async markAsRead(id: number): Promise<void> {
    await this.notificationRepository.update(id, { is_read: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { user_id: userId, is_read: false },
      { is_read: true },
    );
  }
}
