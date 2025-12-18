import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILikeRepository } from '../../../../domain/repositories/like.repository.interface';
import { StoryLike } from '../../../../domain/entities/story-like.entity';
import { StoryLikeSchema } from '../entities/story-like.schema';

@Injectable()
export class LikeRepository implements ILikeRepository {
  constructor(
    @InjectRepository(StoryLikeSchema)
    private readonly repository: Repository<StoryLikeSchema>,
  ) {}

  async likeStory(userId: number, storyId: number): Promise<StoryLike> {
    const like = this.repository.create({
      user_id: userId,
      story_id: storyId,
    });
    return (await this.repository.save(like)) as any;
  }

  async unlikeStory(userId: number, storyId: number): Promise<void> {
    await this.repository.delete({
      user_id: userId,
      story_id: storyId,
    });
  }

  async hasUserLiked(userId: number, storyId: number): Promise<boolean> {
    const like = await this.repository.findOne({
      where: {
        user_id: userId,
        story_id: storyId,
      },
    });
    return !!like;
  }

  async getLikesByStoryId(storyId: number): Promise<StoryLike[]> {
    return (await this.repository.find({
      where: { story_id: storyId },
      relations: ['user'],
    })) as any;
  }

  async getLikesCount(storyId: number): Promise<number> {
    return await this.repository.count({
      where: { story_id: storyId },
    });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ user_id: userId });
  }
}
