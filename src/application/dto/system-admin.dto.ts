import { IsString, IsOptional, IsEnum, IsBoolean, IsEmail, MinLength } from 'class-validator';

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

export class UpdateAdminProfileDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  confirmPassword: string;
}