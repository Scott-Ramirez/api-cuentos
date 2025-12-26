import { SystemSetting } from '../entities';

export interface SystemSettingRepository {
  findByKey(key: string): Promise<SystemSetting | null>;
  findByCategory(category: string): Promise<SystemSetting[]>;
  findAll(): Promise<SystemSetting[]>;
  upsert(key: string, value: string, type?: string, description?: string, category?: string): Promise<SystemSetting>;
  update(key: string, value: string): Promise<SystemSetting>;
  delete(key: string): Promise<void>;
  initializeDefaults(): Promise<void>;
}