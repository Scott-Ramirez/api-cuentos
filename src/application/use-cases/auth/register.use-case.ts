import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: {
    email: string;
    username: string;
    password: string;
  }) {
    // Validar que no exista el email
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Validar que no exista el username
    const existingUsername = await this.userRepository.findByUsername(
      data.username,
    );
    if (existingUsername) {
      throw new ConflictException('El username ya está en uso');
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear usuario
    const user = await this.userRepository.create({
      email: data.email,
      username: data.username,
      password: hashedPassword,
    });

    // No retornar el password
    const { password, ...result } = user;
    return result;
  }
}
