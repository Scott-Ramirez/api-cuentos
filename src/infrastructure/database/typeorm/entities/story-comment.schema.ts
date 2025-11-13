import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('story_comments')
export class StoryCommentSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  comment: string;

  @ManyToOne('StorySchema', 'comments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: any;

  @Column()
  story_id: number;

  @ManyToOne('UserSchema', 'comments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column()
  user_id: number;

  @ManyToOne('StoryCommentSchema', 'replies', { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_comment_id' })
  parent_comment: any;

  @OneToMany('StoryCommentSchema', 'parent_comment')
  replies: any[];

  @Column({ nullable: true })
  parent_comment_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
