export class Story {
  id: number;
  title: string;
  description: string;
  cover_image?: string;
  status: 'draft' | 'published' | 'archived';
  is_public: boolean;
  views_count: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
