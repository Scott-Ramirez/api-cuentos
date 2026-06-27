import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../domain/entities';
import { IUserRepository } from '../../../domain/repositories';
import { UpdateAdminProfileDto, ChangePasswordDto } from '../../dto/system-admin.dto';

@Injectable()
export class AdminProfileService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async getAdminProfile(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Admin user not found');
    const { password, ...profile } = user;
    return profile;
  }

  async updateAdminProfile(userId: number, dto: UpdateAdminProfileDto): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Admin user not found');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing && existing.id !== userId) {
        throw new BadRequestException('Email already in use');
      }
    }

    if (dto.username && dto.username !== user.username) {
      const existing = await this.userRepository.findByUsername(dto.username);
      if (existing && existing.id !== userId) {
        throw new BadRequestException('Username already in use');
      }
    }

    return this.userRepository.update(userId, dto);
  }

  async changeAdminPassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Admin user not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.update(userId, { password: hashed });
  }

  async getAdminSecurityInfo(userId: number): Promise<object> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Admin user not found');

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastPasswordChange: user.updated_at,
      twoFactorEnabled: false,
    };
  }
}
