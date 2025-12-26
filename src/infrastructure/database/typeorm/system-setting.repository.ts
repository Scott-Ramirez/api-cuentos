import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from '../../../domain/entities';
import { SystemSettingSchema } from './entities/system-setting.schema';
import { SystemSettingRepository } from '../../../domain/repositories';

@Injectable()
export class TypeOrmSystemSettingRepository implements SystemSettingRepository {
  constructor(
    @InjectRepository(SystemSettingSchema)
    private readonly repository: Repository<SystemSettingSchema>,
  ) {}

  async findByKey(key: string): Promise<SystemSetting | null> {
    return await this.repository.findOne({ where: { key } });
  }

  async findByCategory(category: string): Promise<SystemSetting[]> {
    return await this.repository.find({ where: { category } });
  }

  async findAll(): Promise<SystemSetting[]> {
    return await this.repository.find({ order: { category: 'ASC', key: 'ASC' } });
  }

  async upsert(
    key: string, 
    value: string, 
    type: string = 'string', 
    description?: string, 
    category: string = 'system'
  ): Promise<SystemSetting> {
    const existing = await this.findByKey(key);
    
    if (existing) {
      existing.value = value;
      return await this.repository.save(existing);
    } else {
      const newSetting = this.repository.create({
        key,
        value,
        type,
        description,
        category,
      });
      return await this.repository.save(newSetting);
    }
  }

  async update(key: string, value: string): Promise<SystemSetting> {
    await this.repository.update({ key }, { value });
    const updated = await this.findByKey(key);
    if (!updated) {
      throw new Error(`SystemSetting with key "${key}" not found`);
    }
    return updated;
  }

  async delete(key: string): Promise<void> {
    await this.repository.delete({ key });
  }

  async initializeDefaults(): Promise<void> {
    const defaults = [
      {
        key: 'maintenance_warning',
        value: 'false',
        type: 'boolean',
        description: 'Show maintenance warning to users',
        category: 'maintenance'
      },
      {
        key: 'maintenance_active',
        value: 'false',
        type: 'boolean',
        description: 'Enable maintenance mode (blocks entire application)',
        category: 'maintenance'
      },
      {
        key: 'maintenance_message',
        value: 'Sistema en mantenimiento. Volveremos pronto.',
        type: 'string',
        description: 'Message to show during maintenance',
        category: 'maintenance'
      },
      {
        key: 'app_name',
        value: 'StoryForge',
        type: 'string',
        description: 'Application name',
        category: 'system'
      },
      {
        key: 'max_file_size',
        value: '5242880',
        type: 'number',
        description: 'Maximum file size for uploads (bytes)',
        category: 'limits'
      }
    ];

    for (const setting of defaults) {
      const exists = await this.findByKey(setting.key);
      if (!exists) {
        await this.upsert(
          setting.key,
          setting.value,
          setting.type,
          setting.description,
          setting.category
        );
      }
    }
  }
}