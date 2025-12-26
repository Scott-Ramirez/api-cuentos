export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export class User {
  id: number;
  email: string;
  username: string;
  password: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
