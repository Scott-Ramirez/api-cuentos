import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStoryDto {
  @ApiPropertyOptional({
    description: 'Nuevo título del cuento',
    example: 'El Dragón Perdido - Edición Revisada',
    type: String,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nueva descripción del cuento',
    example: 'En las profundidades de las montañas olvidadas...',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Nueva imagen de portada',
    example: '/uploads/cover-987654321.jpg',
    type: String,
  })
  @IsString()
  @IsOptional()
  cover_image?: string;

  @ApiPropertyOptional({
    description: 'Nuevos tags del cuento',
    example: ['aventura', 'fantasía', 'drama'],
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
