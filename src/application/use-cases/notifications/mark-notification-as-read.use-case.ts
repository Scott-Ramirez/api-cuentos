import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../../domain/repositories';

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(notificationId: number) {
    await this.notificationRepository.markAsRead(notificationId);
  }

  async executeAll(userId: number) {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
