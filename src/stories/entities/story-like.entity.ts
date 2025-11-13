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
export class StoryLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Story', 'likes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: any;

  @Column()
  story_id: number;

  @ManyToOne('User', 'likes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column()
  user_id: number;

  @CreateDateColumn()
  created_at: Date;
}
