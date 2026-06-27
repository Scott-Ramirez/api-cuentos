import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReleaseNoteService } from '../../application/use-cases/release-notes/release-note.service';
import { CreateReleaseNoteDto, UpdateReleaseNoteDto } from '../../application/dto/release-note.dto';

@ApiTags('Release Notes')
@ApiBearerAuth()
@Controller('admin/release-notes')
// @UseGuards(JwtAuthGuard, RolesGuard) // Comentado hasta que implementes los guards
// @Roles('admin')
export class ReleaseNoteController {
  constructor(private readonly releaseNoteService: ReleaseNoteService) {}

  @ApiOperation({ summary: 'Crear una nueva release note' })
  @Post()
  async create(@Body() createReleaseNoteDto: CreateReleaseNoteDto) {
    return await this.releaseNoteService.create(createReleaseNoteDto);
  }

  @ApiOperation({ summary: 'Obtener todas las release notes' })
  @Get()
  async findAll() {
    return await this.releaseNoteService.findAll();
  }

  @ApiOperation({ summary: 'Obtener release notes publicadas' })
  @Get('published')
  async findPublished() {
    return await this.releaseNoteService.findActiveNotes();
  }

  @ApiOperation({ summary: 'Obtener una release note por ID' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.releaseNoteService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una release note' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReleaseNoteDto: UpdateReleaseNoteDto,
  ) {
    return await this.releaseNoteService.update(id, updateReleaseNoteDto);
  }

  @ApiOperation({ summary: 'Publicar / despublicar una release note' })
  @Patch(':id/toggle-published')
  async togglePublished(@Param('id', ParseIntPipe) id: number) {
    return await this.releaseNoteService.togglePublished(id);
  }

  @ApiOperation({ summary: 'Eliminar una release note' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.releaseNoteService.remove(id);
    return { message: 'Release note deleted successfully' };
  }
}