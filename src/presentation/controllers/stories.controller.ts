import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../guards/current-user.decorator';
import { CreateStoryUseCase } from '../../application/use-cases/stories/create-story.use-case';
import { PublishStoryUseCase } from '../../application/use-cases/stories/publish-story.use-case';
import { CreateStoryDto } from '../dto/create-story.dto';
import { UpdateStoryDto } from '../dto/update-story.dto';
import { CreateChapterDto } from '../dto/create-chapter.dto';
import { IStoryRepository } from '../../domain/repositories';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Stories')
@Controller('stories')
export class StoriesController {
  constructor(
    private readonly createStoryUseCase: CreateStoryUseCase,
    private readonly publishStoryUseCase: PublishStoryUseCase,
    @Inject(IStoryRepository)
    private readonly storyRepository: IStoryRepository,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar todos los cuentos publicados',
    description: 'Obtiene todos los cuentos con status "published". Opcionalmente filtra por tag.'
  })
  @ApiQuery({ 
    name: 'tag', 
    required: false, 
    description: 'Filtrar cuentos por tag específico',
    example: 'aventura'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de cuentos publicados',
    schema: {
      example: [{
        id: 1,
        title: 'El Dragón Perdido',
        description: 'Un dragón solitario busca su hogar...',
        cover_image: '/uploads/cover-123.jpg',
        status: 'published',
        is_public: true,
        views_count: 150,
        user_id: 1,
        created_at: '2025-01-09T12:00:00.000Z',
        updated_at: '2025-01-09T12:00:00.000Z',
        tags: ['aventura', 'fantasía'],
        chapters: []
      }]
    }
  })
  async findAll(@Query('tag') tag?: string) {
    return await this.storyRepository.findAll({
      status: 'published',
      tag,
    });
  }

  @Get('explore')
  @ApiOperation({ 
    summary: 'Explorar cuentos publicados',
    description: 'Obtiene cuentos publicados con filtros básicos. Excluye los cuentos del usuario autenticado si está logueado.'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar en título y descripción',
    example: 'aventura'
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    type: String,
    description: 'Filtrar por tag',
    example: 'fantasía'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de cuentos publicados (excluye cuentos del usuario si está autenticado)',
    schema: {
      example: [{
        id: 1,
        title: 'Aventura Épica',
        description: 'Una gran aventura...',
        cover_image: '/uploads/cover-123.jpg',
        views: 150,
        user: {
          id: 2,
          username: 'autor123'
        },
        tags: [
          { tag_name: 'aventura' }
        ]
      }]
    }
  })
  async explore(
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Headers('authorization') authorization?: string,
  ) {
    const stories = await this.storyRepository.findAll({
      status: 'published',
      tag,
    });

    // Extraer usuario del token si existe
    let userId: number | null = null;
    if (authorization && authorization.startsWith('Bearer ')) {
      try {
        const token = authorization.substring(7);
        const decoded = this.jwtService.verify(token);
        userId = decoded.sub; // El token usa 'sub' para el user ID
      } catch (error) {
        // Token inválido o expirado, continuar sin filtrar
      }
    }

    // Filtrar cuentos del usuario autenticado
    let filtered = stories;
    if (userId) {
      filtered = filtered.filter(story => story.user_id !== userId);
    }

    // Filtro simple por búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(searchLower) ||
        story.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  @Get('tags')
  @ApiOperation({ 
    summary: 'Obtener todos los tags',
    description: 'Retorna una lista de todos los tags únicos usados en los cuentos.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tags únicos',
    schema: {
      example: ['aventura', 'fantasía', 'ciencia ficción']
    }
  })
  async getTags() {
    const stories: any[] = await this.storyRepository.findAll({ status: 'published' });
    const tagsSet = new Set<string>();
    
    stories.forEach((story: any) => {
      if (story.tags) {
        story.tags.forEach((tag: any) => {
          if (tag && tag.tag_name) {
            tagsSet.add(tag.tag_name);
          }
        });
      }
    });
    
    return Array.from(tagsSet).sort();
  }

  @Get('my-stories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Obtener mis cuentos',
    description: 'Lista todos los cuentos del usuario autenticado (publicados, borradores, archivados).'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuentos del usuario autenticado',
    schema: {
      example: [{
        id: 1,
        title: 'Mi Historia',
        description: 'Una historia personal...',
        status: 'draft',
        is_public: false,
        views_count: 0,
        user_id: 1,
        tags: ['personal']
      }]
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }
  })
  async getMyStories(@CurrentUser() user: any) {
    return await this.storyRepository.findByUserId(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Obtener cuento por ID',
    description: 'Obtiene un cuento específico. Requiere autenticación. Los usuarios pueden ver cuentos publicados y sus propios borradores.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuento encontrado',
    schema: {
      example: {
        id: 1,
        title: 'El Dragón Perdido',
        description: 'Un dragón solitario...',
        cover_image: '/uploads/cover-123.jpg',
        status: 'published',
        views_count: 151,
        user: {
          id: 1,
          username: 'johndoe'
        },
        tags: ['aventura', 'fantasía'],
        chapters: [
          {
            id: 1,
            chapter_number: 1,
            title: 'El Comienzo',
            content: 'Había una vez...',
            image: '/uploads/chapter-456.jpg'
          }
        ]
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado - Necesita iniciar sesión para ver cuentos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuento no encontrado'
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    const story = await this.storyRepository.findById(id);
    if (!story) {
      throw new NotFoundException(`Cuento con ID ${id} no encontrado`);
    }

    // Si el cuento es borrador, solo el dueño puede verlo
    if (story.status === 'draft' && user.id !== story.user_id) {
      throw new NotFoundException(`Cuento con ID ${id} no encontrado`);
    }

    return story;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Crear nuevo cuento',
    description: 'Crea un cuento en estado "draft". Requiere autenticación.'
  })
  @ApiBody({ type: CreateStoryDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Cuento creado exitosamente',
    schema: {
      example: {
        id: 1,
        title: 'El Dragón Perdido',
        description: 'Un dragón solitario...',
        cover_image: '/uploads/cover-123.jpg',
        status: 'draft',
        is_public: false,
        views_count: 0,
        user_id: 1,
        created_at: '2025-01-09T12:00:00.000Z',
        updated_at: '2025-01-09T12:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado'
  })
  async create(
    @Body() createStoryDto: CreateStoryDto,
    @CurrentUser() user: any,
  ) {
    return await this.createStoryUseCase.execute({
      ...createStoryDto,
      user_id: user.id,
    });
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Actualizar cuento',
    description: 'Actualiza un cuento existente. Solo el autor puede actualizar.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiBody({ type: UpdateStoryDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuento actualizado',
    schema: {
      example: {
        id: 1,
        title: 'El Dragón Perdido - Edición Revisada',
        description: 'Una nueva descripción...',
        status: 'draft',
        updated_at: '2025-01-09T13:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado o no autorizado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuento no encontrado'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoryDto: UpdateStoryDto,
    @CurrentUser() user: any,
  ) {
    const story = await this.storyRepository.findById(id);
    if (!story) {
      throw new NotFoundException(`Cuento con ID ${id} no encontrado`);
    }
    if (story.user_id !== user.id) {
      throw new UnauthorizedException('No tienes permiso para actualizar este cuento');
    }
    
    if (updateStoryDto.tags) {
      await this.storyRepository.removeTags(id);
      await this.storyRepository.addTags(id, updateStoryDto.tags);
    }
    
    return await this.storyRepository.update(id, updateStoryDto);
  }

  @Patch(':id/publish')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Publicar cuento',
    description: 'Cambia el status del cuento de "draft" a "published". Solo el autor puede publicar.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuento publicado',
    schema: {
      example: {
        id: 1,
        title: 'El Dragón Perdido',
        status: 'published',
        is_public: true,
        updated_at: '2025-01-09T13:30:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado o no autorizado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuento no encontrado'
  })
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.publishStoryUseCase.execute(id, user.id);
  }

  @Post(':id/view')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Incrementar contador de vistas',
    description: 'Incrementa el contador de vistas del cuento. Solo cuenta si el usuario NO es el autor.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Vista contada o ignorada si es el autor',
    schema: {
      example: {
        message: 'View counted',
        views_count: 151
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuento no encontrado'
  })
  async incrementView(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    const story = await this.storyRepository.findById(id);
    if (!story) {
      throw new NotFoundException(`Cuento con ID ${id} no encontrado`);
    }
    
    // Solo incrementar si el usuario NO es el autor
    if (user.id !== story.user_id) {
      const newViewsCount = (story.views_count || 0) + 1;
      await this.storyRepository.update(id, { views_count: newViewsCount });
      
      return { 
        message: 'View counted',
        views_count: newViewsCount
      };
    }
    
    // Si es el autor, no contar la vista
    return { 
      message: 'View not counted (own story)',
      views_count: story.views_count || 0
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Eliminar cuento',
    description: 'Elimina permanentemente un cuento. Solo el autor puede eliminar.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuento eliminado',
    schema: {
      example: {
        message: 'Story deleted successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado o no autorizado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuento no encontrado'
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    const story = await this.storyRepository.findById(id);
    if (!story) {
      throw new NotFoundException(`Cuento con ID ${id} no encontrado`);
    }
    if (story.user_id !== user.id) {
      throw new UnauthorizedException('No tienes permiso para eliminar este cuento');
    }
    await this.storyRepository.delete(id);
    return { message: 'Story deleted successfully' };
  }

  // CHAPTERS ENDPOINTS
  @Post(':id/chapters')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Agregar capítulo a un cuento',
    description: 'Agrega un nuevo capítulo al cuento. Solo el autor puede agregar capítulos.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiBody({ type: CreateChapterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Capítulo creado exitosamente'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado o no autorizado'
  })
  async addChapter(
    @Param('id', ParseIntPipe) id: number,
    @Body() chapterData: CreateChapterDto,
    @CurrentUser() user: any,
  ) {
    const story = await this.storyRepository.findById(id);
    if (!story) {
      throw new NotFoundException(`Cuento con ID ${id} no encontrado`);
    }
    if (story.user_id !== user.id) {
      throw new UnauthorizedException('No tienes permiso para agregar capítulos a este cuento');
    }

    return await this.storyRepository.addChapter(id, chapterData);
  }

  @Get(':id/chapters')
  @ApiOperation({ 
    summary: 'Obtener capítulos de un cuento',
    description: 'Obtiene todos los capítulos de un cuento ordenados por número.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de capítulos'
  })
  async getChapters(@Param('id', ParseIntPipe) id: number) {
    return await this.storyRepository.findChaptersByStoryId(id);
  }

  @Put(':id/chapters/:chapterId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Actualizar un capítulo',
    description: 'Actualiza el título, contenido o imagen de un capítulo. Solo el autor puede actualizar. Puedes enviar solo los campos que deseas actualizar.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del cuento',
    example: 1
  })
  @ApiParam({ 
    name: 'chapterId', 
    description: 'ID del capítulo a actualizar',
    example: 1
  })
  @ApiBody({
    description: 'Datos a actualizar (todos los campos son opcionales)',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Nuevo título del capítulo',
          example: 'El Comienzo de una Gran Aventura'
        },
        content: {
          type: 'string',
          description: 'Nuevo contenido del capítulo (acepta formato markdown: **negrita**, *cursiva*, - listas)',
          example: 'Había una vez en un reino muy lejano...\n\n**Un día importante**\n\nEl héroe descubrió:\n- Un mapa antiguo\n- Una espada mágica'
        },
        image: {
          type: 'string',
          description: 'Nueva ruta de la imagen del capítulo o null para eliminarla',
          example: '/uploads/chapter-1704804000000-123456789.jpg',
          nullable: true
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Capítulo actualizado exitosamente',
    schema: {
      example: {
        message: 'Capítulo actualizado exitosamente'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado o no autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No tienes permiso para actualizar capítulos de este cuento'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuento o capítulo no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Cuento con ID 1 no encontrado'
      }
    }
  })
  async updateChapter(
    @Param('id', ParseIntPipe) id: number,
    @Param('chapterId', ParseIntPipe) chapterId: number,
    @Body() updateData: Partial<CreateChapterDto>,
    @CurrentUser() user: any,
  ) {
    const story = await this.storyRepository.findById(id);
    if (!story) {
      throw new NotFoundException(`Cuento con ID ${id} no encontrado`);
    }
    if (story.user_id !== user.id) {
      throw new UnauthorizedException('No tienes permiso para actualizar capítulos de este cuento');
    }

    await this.storyRepository.updateChapter(chapterId, updateData);
    return { message: 'Capítulo actualizado exitosamente' };
  }
}
