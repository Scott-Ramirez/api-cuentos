import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({
    description: 'Título del cuento',
    example: 'El Dragón Perdido',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descripción o sinopsis del cuento',
    example: 'Un dragón solitario busca su hogar perdido en las montañas...',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'URL o path de la imagen de portada',
    example: '/uploads/cover-123456789.jpg',
    type: String,
  })
  @IsString()
  @IsOptional()
  cover_image?: string;

  @ApiPropertyOptional({
    description: 'Tags o categorías del cuento',
    example: ['aventura', 'fantasía', 'infantil'],
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
