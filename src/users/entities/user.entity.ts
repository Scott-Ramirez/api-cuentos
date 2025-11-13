import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Story } from '../../stories/entities/story.entity';
import { StoryLike } from '../../stories/entities/story-like.entity';
import { StoryComment } from '../../stories/entities/story-comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
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

  @OneToMany(() => Story, (story) => story.user)
  stories: Story[];

  @OneToMany(() => StoryLike, (like) => like.user)
  likes: StoryLike[];

  @OneToMany(() => StoryComment, (comment) => comment.user)
  comments: StoryComment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
