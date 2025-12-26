import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class UpdateSystemSettingDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsEnum(['string', 'boolean', 'number', 'json'])
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['system', 'maintenance', 'features', 'limits'])
  category?: string;
}

export class MaintenanceControlDto {
  @IsBoolean()
  maintenanceWarning: boolean;

  @IsBoolean()
  maintenanceActive: boolean;

  @IsOptional()
  @IsString()
  maintenanceMessage?: string;

  @IsOptional()
  @IsString()
  warningMessage?: string;
}