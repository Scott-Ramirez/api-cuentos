import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: Partial<User>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}

export const IUserRepository = Symbol('IUserRepository');
