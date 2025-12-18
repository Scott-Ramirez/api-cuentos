import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IStoryRepository } from '../../../domain/repositories/story.repository.interface';
import { ICommentRepository } from '../../../domain/repositories/comment.repository.interface';
import { ILikeRepository } from '../../../domain/repositories/like.repository.interface';
import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IStoryRepository)
    private readonly storyRepository: IStoryRepository,
    @Inject(ICommentRepository)
    private readonly commentRepository: ICommentRepository,
    @Inject(ILikeRepository)
    private readonly likeRepository: ILikeRepository,
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: number, password: string): Promise<void> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    // Eliminar en orden correcto (por dependencias):
    
    // 1. Eliminar notificaciones relacionadas con el usuario
    await this.notificationRepository.deleteByUserId(userId);
    
    // 2. Eliminar likes del usuario
    await this.likeRepository.deleteByUserId(userId);
    
    // 3. Eliminar comentarios del usuario
    await this.commentRepository.deleteByUserId(userId);
    
    // 4. Eliminar stories del usuario (esto también eliminará likes y comentarios relacionados)
    await this.storyRepository.deleteByUserId(userId);
    
    // 5. Finalmente, eliminar el usuario
    await this.userRepository.delete(userId);
  }
}