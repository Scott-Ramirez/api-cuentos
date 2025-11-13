import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({
    description: 'Número del capítulo',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  chapter_number: number;

  @ApiProperty({
    description: 'Título del capítulo',
    example: 'El Comienzo de la Aventura',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Contenido del capítulo',
    example: 'Había una vez en un reino muy lejano...',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'URL o path de la imagen del capítulo (opcional)',
    example: '/uploads/chapter-123456789.jpg',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
