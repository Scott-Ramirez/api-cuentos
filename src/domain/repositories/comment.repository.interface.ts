import { StoryComment } from '../entities/story-comment.entity';

export interface ICommentRepository {
  create(comment: Partial<StoryComment>): Promise<StoryComment>;
  findById(id: number): Promise<StoryComment | null>;
  findByStoryId(storyId: number): Promise<StoryComment[]>;
  update(id: number, comment: Partial<StoryComment>): Promise<StoryComment>;
  delete(id: number): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
  getCommentsCount(storyId: number): Promise<number>;
}

export const ICommentRepository = Symbol('ICommentRepository');
