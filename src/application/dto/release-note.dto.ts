import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreateReleaseNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  version: string;

  @IsOptional()
  @IsEnum(['major', 'minor', 'patch', 'security'])
  type?: 'major' | 'minor' | 'patch' | 'security' = 'minor';

  @IsOptional()
  @IsNumber()
  priority?: number = 0;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = false;
}

export class UpdateReleaseNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsEnum(['major', 'minor', 'patch', 'security'])
  type?: 'major' | 'minor' | 'patch' | 'security';

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}