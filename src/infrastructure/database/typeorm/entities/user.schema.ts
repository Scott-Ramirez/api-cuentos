import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Exclude()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @OneToMany('StorySchema', 'user')
  stories: any[];

  @OneToMany('StoryLikeSchema', 'user')
  likes: any[];

  @OneToMany('StoryCommentSchema', 'user')
  comments: any[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
