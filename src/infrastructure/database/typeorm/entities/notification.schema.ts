import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from './user.schema';
import { StorySchema } from './story.schema';
import { StoryCommentSchema } from './story-comment.schema';

@Entity('notifications')
export class NotificationSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'enum', enum: ['like', 'comment', 'reply'] })
  type: 'like' | 'comment' | 'reply';

  @Column()
  story_id: number;

  @Column()
  triggered_by_user_id: number;

  @Column({ nullable: true })
  comment_id: number;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => UserSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;

  @ManyToOne(() => UserSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'triggered_by_user_id' })
  triggered_by: UserSchema;

  @ManyToOne(() => StorySchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: StorySchema;

  @ManyToOne(() => StoryCommentSchema, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: StoryCommentSchema;
}
