import { StoryLike } from '../entities/story-like.entity';

export interface ILikeRepository {
  likeStory(userId: number, storyId: number): Promise<StoryLike>;
  unlikeStory(userId: number, storyId: number): Promise<void>;
  hasUserLiked(userId: number, storyId: number): Promise<boolean>;
  getLikesByStoryId(storyId: number): Promise<StoryLike[]>;
  getLikesCount(storyId: number): Promise<number>;
  deleteByUserId(userId: number): Promise<void>;
}

export const ILikeRepository = Symbol('ILikeRepository');
