import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICommentRepository } from '../../../../domain/repositories/comment.repository.interface';
import { StoryComment } from '../../../../domain/entities/story-comment.entity';
import { StoryCommentSchema } from '../entities/story-comment.schema';

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectRepository(StoryCommentSchema)
    private readonly repository: Repository<StoryCommentSchema>,
  ) {}

  async create(comment: Partial<StoryComment>): Promise<StoryComment> {
    const newComment = this.repository.create(comment);
    return (await this.repository.save(newComment)) as any;
  }

  async findById(id: number): Promise<StoryComment | null> {
    return (await this.repository.findOne({
      where: { id },
      relations: ['user'],
    })) as any;
  }

  async findByStoryId(storyId: number): Promise<StoryComment[]> {
    return (await this.repository.find({
      where: { story_id: storyId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    })) as any;
  }

  async update(
    id: number,
    comment: Partial<StoryComment>,
  ): Promise<StoryComment> {
    await this.repository.update(id, comment);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Comment not found');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getCommentsCount(storyId: number): Promise<number> {
    return await this.repository.count({
      where: { story_id: storyId },
    });
  }
}
