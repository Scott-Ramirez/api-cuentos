export class StoryComment {
  id: number;
  comment: string;
  story_id: number;
  user_id: number;
  parent_comment_id?: number;
  created_at: Date;
  updated_at: Date;
}
