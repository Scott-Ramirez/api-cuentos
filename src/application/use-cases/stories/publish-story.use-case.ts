import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IStoryRepository } from '../../../domain/repositories';

@Injectable()
export class PublishStoryUseCase {
  constructor(
    @Inject(IStoryRepository)
    private readonly storyRepository: IStoryRepository,
  ) {}

  async execute(storyId: number, userId: number) {
    const story = await this.storyRepository.findById(storyId);

    if (!story) {
      throw new NotFoundException(`Cuento con ID ${storyId} no encontrado`);
    }

    if (story.user_id !== userId) {
      throw new UnauthorizedException('No tienes permiso para modificar este cuento');
    }

    // Alternar entre published y draft
    const newStatus = story.status === 'published' ? 'draft' : 'published';
    const isPublic = newStatus === 'published';

    const updatedStory = await this.storyRepository.update(storyId, {
      status: newStatus,
      is_public: isPublic,
    });

    return updatedStory;
  }
}
