import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../../domain/repositories';

@Injectable()
export class GetUnreadCountUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: number): Promise<number> {
    return await this.notificationRepository.getUnreadCount(userId);
  }
}
