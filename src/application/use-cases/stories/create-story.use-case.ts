import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IStoryRepository } from '../../../domain/repositories';

@Injectable()
export class CreateStoryUseCase {
  constructor(
    @Inject(IStoryRepository)
    private readonly storyRepository: IStoryRepository,
  ) {}

  async execute(data: {
    title: string;
    description: string;
    cover_image?: string;
    user_id: number;
    tags?: string[];
  }) {
    // Validar que no exista un cuento con el mismo título para este usuario
    const existingStories = await this.storyRepository.findByUserId(data.user_id);
    const duplicateTitle = existingStories.find(
      story => story.title.toLowerCase() === data.title.toLowerCase()
    );
    
    if (duplicateTitle) {
      throw new ConflictException(`Ya tienes un cuento con el título "${data.title}"`);
    }

    // Crear story
    const story = await this.storyRepository.create({
      title: data.title,
      description: data.description,
      cover_image: data.cover_image,
      user_id: data.user_id,
      status: 'draft',
      is_public: false,
      views_count: 0,
    });

    // Agregar tags si existen
    if (data.tags && data.tags.length > 0) {
      await this.storyRepository.addTags(story.id, data.tags);
    }

    return story;
  }
}
