import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../../../domain/entities/user.entity';
import { UserSchema } from '../entities/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  private mapSchemaToEntity(schema: UserSchema): User {
    return {
      id: schema.id,
      email: schema.email,
      username: schema.username,
      password: schema.password,
      avatar: schema.avatar,
      bio: schema.bio,
      role: schema.role as UserRole,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
    } as User;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    const saved = await this.repository.save(newUser);
    return this.mapSchemaToEntity(saved);
  }

  async findById(id: number): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.mapSchemaToEntity(schema) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { email } });
    return schema ? this.mapSchemaToEntity(schema) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { username } });
    return schema ? this.mapSchemaToEntity(schema) : null;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user);
    const updated = await this.findById(id);
    if (!updated) throw new Error('User not found');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
