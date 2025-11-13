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

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  cover_image: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status: string;

  @Column({ default: true })
  is_public: boolean;

  @Column({ default: 0 })
  views_count: number;

  @ManyToOne('User', 'stories', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column()
  user_id: number;

  @OneToMany('Chapter', 'story', { cascade: true })
  chapters: any[];

  @OneToMany('StoryTag', 'story', { cascade: true })
  tags: any[];

  @OneToMany('StoryLike', 'story')
  likes: any[];

  @OneToMany('StoryComment', 'story')
  comments: any[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
