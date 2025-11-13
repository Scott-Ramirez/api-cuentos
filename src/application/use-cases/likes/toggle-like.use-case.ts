import { Inject, Injectable } from '@nestjs/common';
import { ILikeRepository } from '../../../domain/repositories';

@Injectable()
export class ToggleLikeUseCase {
  constructor(
    @Inject(ILikeRepository)
    private readonly likeRepository: ILikeRepository,
  ) {}

  async execute(userId: number, storyId: number) {
    const hasLiked = await this.likeRepository.hasUserLiked(userId, storyId);

    if (hasLiked) {
      // Unlike
      await this.likeRepository.unlikeStory(userId, storyId);
      return { liked: false };
    } else {
      // Like
      await this.likeRepository.likeStory(userId, storyId);
      return { liked: true };
    }
  }
}
