import {
  Controller, Get, Post, Patch, Delete,
  Body, Param,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBody, ApiParam,
  ApiCreatedResponse, ApiOkResponse,
} from '@nestjs/swagger';

import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { GetSongDto } from './dto/get-song.dto';   // ⬅️  DTO sólo-lectura para respuestas

@ApiTags('song')
@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  /* ---------- POST /song ---------- */
  @Post()
  @ApiOperation({ summary: 'Create a new song' })
  @ApiBody({ type: CreateSongDto })
  @ApiCreatedResponse({ description: 'Song created', type: GetSongDto })
  create(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }

  /* ---------- GET /song ---------- */
  @Get()
  @ApiOperation({ summary: 'List all songs' })
  @ApiOkResponse({ description: 'Array of songs', type: GetSongDto, isArray: true })
  findAll() {
    return this.songService.findAll();
  }

  /* ---------- GET /song/:id ---------- */
  @Get(':id')
  @ApiOperation({ summary: 'Get one song by ID' })
  @ApiParam({ name: 'id', example: '64b7f2e0c4ad9a6d5c2b1a90' })
  @ApiOkResponse({ description: 'Song found', type: GetSongDto })
  findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
  }

  /* ---------- PATCH /song/:id ---------- */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a song' })
  @ApiParam({ name: 'id', example: '64b7f2e0c4ad9a6d5c2b1a90' })
  @ApiBody({ type: UpdateSongDto })
  @ApiOkResponse({ description: 'Song updated', type: GetSongDto })
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songService.update(id, updateSongDto);
  }

  /* ---------- DELETE /song/:id ---------- */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a song' })
  @ApiParam({ name: 'id', example: '64b7f2e0c4ad9a6d5c2b1a90' })
  @ApiOkResponse({ description: 'Song removed' })
  remove(@Param('id') id: string) {
    return this.songService.remove(+id);
  }
}
