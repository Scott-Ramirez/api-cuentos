import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('chapters')
export class ChapterSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chapter_number: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne('StorySchema', 'chapters', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: any;

  @Column()
  story_id: number;

  @CreateDateColumn()
  created_at: Date;
}
