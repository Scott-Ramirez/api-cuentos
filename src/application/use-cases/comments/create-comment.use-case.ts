import { Inject, Injectable } from '@nestjs/common';
import { ICommentRepository } from '../../../domain/repositories';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(ICommentRepository)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(data: {
    comment: string;
    story_id: number;
    user_id: number;
    parent_comment_id?: number;
  }) {
    const comment = await this.commentRepository.create({
      comment: data.comment,
      story_id: data.story_id,
      user_id: data.user_id,
      parent_comment_id: data.parent_comment_id,
    });

    return comment;
  }
}
