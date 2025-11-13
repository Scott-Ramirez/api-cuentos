import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('story_tags')
export class StoryTagSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag_name: string;

  @ManyToOne('StorySchema', 'tags', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: any;

  @Column()
  story_id: number;
}
