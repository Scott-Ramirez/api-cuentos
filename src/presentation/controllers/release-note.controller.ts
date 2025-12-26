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
import { ReleaseNoteService } from '../../application/use-cases/release-notes/release-note.service';
import { CreateReleaseNoteDto, UpdateReleaseNoteDto } from '../../application/dto/release-note.dto';

@Controller('admin/release-notes')
// @UseGuards(JwtAuthGuard, RolesGuard) // Comentado hasta que implementes los guards
// @Roles('admin')
export class ReleaseNoteController {
  constructor(private readonly releaseNoteService: ReleaseNoteService) {}

  @Post()
  async create(@Body() createReleaseNoteDto: CreateReleaseNoteDto) {
    return await this.releaseNoteService.create(createReleaseNoteDto);
  }

  @Get()
  async findAll() {
    return await this.releaseNoteService.findAll();
  }

  @Get('published')
  async findPublished() {
    return await this.releaseNoteService.findActiveNotes();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.releaseNoteService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReleaseNoteDto: UpdateReleaseNoteDto,
  ) {
    return await this.releaseNoteService.update(id, updateReleaseNoteDto);
  }

  @Patch(':id/toggle-published')
  async togglePublished(@Param('id', ParseIntPipe) id: number) {
    return await this.releaseNoteService.togglePublished(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.releaseNoteService.remove(id);
    return { message: 'Release note deleted successfully' };
  }
}