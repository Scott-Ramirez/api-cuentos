import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../../domain/repositories';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(data: {
    user_id: number;
    type: 'like' | 'comment' | 'reply';
    story_id: number;
    triggered_by_user_id: number;
    comment_id?: number;
  }) {
    // No crear notificación si el usuario se notifica a sí mismo
    if (data.user_id === data.triggered_by_user_id) {
      return null;
    }

    return await this.notificationRepository.create(data);
  }
}
