import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../infrastructure/file-storage/multer.config';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @Post('avatar')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ 
    summary: 'Subir avatar de usuario',
    description: 'Sube una imagen para usar como avatar del usuario. Formatos: JPEG, PNG, GIF, WebP. Tamaño máximo: 5MB.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (jpeg, png, gif, webp)',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Avatar subido exitosamente',
    schema: {
      example: {
        filename: 'avatar-1704804000000-123456789.jpg',
        path: '/uploads/avatar-1704804000000-123456789.jpg'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Archivo inválido (formato o tamaño)',
    schema: {
      example: {
        statusCode: 400,
        message: 'Only image files are allowed!',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado'
  })
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }

  @Post('cover')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ 
    summary: 'Subir portada de cuento',
    description: 'Sube una imagen de portada para un cuento. Formatos: JPEG, PNG, GIF, WebP. Tamaño máximo: 5MB.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (jpeg, png, gif, webp)',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Portada subida exitosamente',
    schema: {
      example: {
        filename: 'cover-1704804000000-987654321.jpg',
        path: '/uploads/cover-1704804000000-987654321.jpg'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Archivo inválido'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado'
  })
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }

  @Post('chapter-image')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ 
    summary: 'Subir imagen de capítulo',
    description: 'Sube una imagen para ilustrar un capítulo. Formatos: JPEG, PNG, GIF, WebP. Tamaño máximo: 5MB.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (jpeg, png, gif, webp)',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Imagen de capítulo subida exitosamente',
    schema: {
      example: {
        filename: 'chapter-1704804000000-456789123.jpg',
        path: '/uploads/chapter-1704804000000-456789123.jpg'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Archivo inválido'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado'
  })
  uploadChapterImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}
