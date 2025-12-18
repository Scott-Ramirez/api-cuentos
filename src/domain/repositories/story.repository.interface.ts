import { Story } from '../entities/story.entity';
import { Chapter } from '../entities/chapter.entity';
import { StoryTag } from '../entities/story-tag.entity';

export interface IStoryRepository {
  create(story: Partial<Story>): Promise<Story>;
  findById(id: number): Promise<Story | null>;
  findAll(filters?: {
    status?: string;
    userId?: number;
    tag?: string;
  }): Promise<Story[]>;
  findByUserId(userId: number): Promise<Story[]>;
  update(id: number, story: Partial<Story>): Promise<Story>;
  delete(id: number): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
  incrementViews(id: number): Promise<void>;
  
  // Chapters
  addChapter(storyId: number, chapter: Partial<Chapter>): Promise<Chapter>;
  findChaptersByStoryId(storyId: number): Promise<Chapter[]>;
  updateChapter(id: number, chapter: Partial<Chapter>): Promise<Chapter>;
  deleteChapter(id: number): Promise<void>;
  
  // Tags
  addTags(storyId: number, tags: string[]): Promise<StoryTag[]>;
  findTagsByStoryId(storyId: number): Promise<StoryTag[]>;
  removeTags(storyId: number): Promise<void>;
}

export const IStoryRepository = Symbol('IStoryRepository');
