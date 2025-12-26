import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from '../../infrastructure/database/typeorm/entities/user.schema';

@Injectable()
export class MakeAdminCommand {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
  ) {}

  async execute(usernameOrEmail: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    });

    if (!user) {
      console.log(`❌ Usuario '${usernameOrEmail}' no encontrado`);
      return;
    }

    if (user.role === 'admin') {
      console.log(`ℹ️  El usuario '${user.username}' ya es administrador`);
      return;
    }

    await this.userRepository.update(user.id, { role: 'admin' });
    console.log(`✅ Usuario '${user.username}' convertido a administrador exitosamente`);
  }
}