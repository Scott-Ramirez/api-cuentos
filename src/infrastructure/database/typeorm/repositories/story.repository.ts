import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStoryRepository } from '../../../../domain/repositories/story.repository.interface';
import { Story } from '../../../../domain/entities/story.entity';
import { Chapter } from '../../../../domain/entities/chapter.entity';
import { StoryTag } from '../../../../domain/entities/story-tag.entity';
import { StorySchema } from '../entities/story.schema';
import { ChapterSchema } from '../entities/chapter.schema';
import { StoryTagSchema } from '../entities/story-tag.schema';

@Injectable()
export class StoryRepository implements IStoryRepository {
  constructor(
    @InjectRepository(StorySchema)
    private readonly storyRepo: Repository<StorySchema>,
    @InjectRepository(ChapterSchema)
    private readonly chapterRepo: Repository<ChapterSchema>,
    @InjectRepository(StoryTagSchema)
    private readonly tagRepo: Repository<StoryTagSchema>,
  ) {}

  async create(story: Partial<Story>): Promise<Story> {
    const newStory = this.storyRepo.create(story);
    return (await this.storyRepo.save(newStory)) as any;
  }

  async findById(id: number): Promise<Story | null> {
    return (await this.storyRepo.findOne({
      where: { id },
      relations: ['chapters', 'tags', 'user'],
    })) as any;
  }

  async findAll(filters?: {
    status?: string;
    userId?: number;
    tag?: string;
  }): Promise<Story[]> {
    const query = this.storyRepo.createQueryBuilder('story')
      .leftJoinAndSelect('story.user', 'user')
      .leftJoinAndSelect('story.tags', 'tags')
      .leftJoinAndSelect('story.chapters', 'chapters')
      .loadRelationCountAndMap('story.likes_count', 'story.likes')
      .loadRelationCountAndMap('story.comments_count', 'story.comments');

    if (filters?.status) {
      query.andWhere('story.status = :status', { status: filters.status });
    }

    if (filters?.userId) {
      query.andWhere('story.user_id = :userId', { userId: filters.userId });
    }

    if (filters?.tag) {
      query.andWhere('tags.tag_name = :tag', { tag: filters.tag });
    }

    query.orderBy('story.created_at', 'DESC');
    return (await query.getMany()) as any;
  }

  async findByUserId(userId: number): Promise<Story[]> {
    return (await this.storyRepo.find({
      where: { user_id: userId },
      relations: ['chapters', 'tags'],
      order: { created_at: 'DESC' },
    })) as any;
  }

  async update(id: number, story: Partial<Story>): Promise<Story> {
    // Excluir relaciones (tags, chapters) del update directo
    const { tags, chapters, ...updateData } = story as any;
    
    if (Object.keys(updateData).length > 0) {
      await this.storyRepo.update(id, updateData);
    }
    
    const updated = await this.findById(id);
    if (!updated) throw new Error('Story not found');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.storyRepo.delete(id);
  }

  async incrementViews(id: number): Promise<void> {
    await this.storyRepo.increment({ id }, 'views_count', 1);
  }

  // Chapters
  async addChapter(storyId: number, chapter: Partial<Chapter>): Promise<Chapter> {
    const newChapter = this.chapterRepo.create({
      ...chapter,
      story_id: storyId,
    });
    return await this.chapterRepo.save(newChapter);
  }

  async findChaptersByStoryId(storyId: number): Promise<Chapter[]> {
    return await this.chapterRepo.find({
      where: { story_id: storyId },
      order: { chapter_number: 'ASC' },
    });
  }

  async updateChapter(id: number, chapter: Partial<Chapter>): Promise<Chapter> {
    await this.chapterRepo.update(id, chapter);
    const updated = await this.chapterRepo.findOne({ where: { id } });
    if (!updated) throw new Error('Chapter not found');
    return updated;
  }

  async deleteChapter(id: number): Promise<void> {
    await this.chapterRepo.delete(id);
  }

  // Tags
  async addTags(storyId: number, tags: string[]): Promise<StoryTag[]> {
    const tagEntities = tags.map((tag) =>
      this.tagRepo.create({
        story_id: storyId,
        tag_name: tag.toLowerCase(),
      }),
    );
    return await this.tagRepo.save(tagEntities);
  }

  async findTagsByStoryId(storyId: number): Promise<StoryTag[]> {
    return await this.tagRepo.find({ where: { story_id: storyId } });
  }

  async removeTags(storyId: number): Promise<void> {
    await this.tagRepo.delete({ story_id: storyId });
  }
}
