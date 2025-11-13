import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';

@Entity('story_likes')
@Unique(['story_id', 'user_id'])
export class StoryLikeSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('StorySchema', 'likes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: any;

  @Column()
  story_id: number;

  @ManyToOne('UserSchema', 'likes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column()
  user_id: number;

  @CreateDateColumn()
  created_at: Date;
}
