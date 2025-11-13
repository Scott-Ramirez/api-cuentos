import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../../domain/repositories';

@Injectable()
export class GetUserNotificationsUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: number, onlyUnread: boolean = false) {
    if (onlyUnread) {
      return await this.notificationRepository.findUnreadByUserId(userId);
    }
    return await this.notificationRepository.findByUserId(userId);
  }
}
