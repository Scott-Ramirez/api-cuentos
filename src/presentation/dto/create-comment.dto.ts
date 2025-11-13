import { IsNotEmpty, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Texto del comentario',
    example: '¡Me encantó esta historia! Espero el próximo capítulo.',
    type: String,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  comment: string;

  @ApiPropertyOptional({
    description: 'ID del comentario padre (para respuestas)',
    example: 5,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  parent_comment_id?: number;
}
