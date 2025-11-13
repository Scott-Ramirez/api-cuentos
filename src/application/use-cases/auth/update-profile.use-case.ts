import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: number, data: { username?: string; email?: string; bio?: string; avatar?: string }) {
    // Verificar si el username ya existe (si se está cambiando)
    if (data.username) {
      const existingUser = await this.userRepository.findByUsername(data.username);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('El nombre de usuario ya está en uso');
      }
    }

    // Verificar si el email ya existe (si se está cambiando)
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('El email ya está en uso');
      }
    }

    const updatedUser = await this.userRepository.update(userId, data);
    
    // No devolver la contraseña
    const { password, ...userWithoutPassword } = updatedUser as any;
    return userWithoutPassword;
  }
}
