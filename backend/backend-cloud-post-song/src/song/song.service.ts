import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ApiResponse } from '@nestjs/swagger';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Song created successfully',
    type: Song,
  })
  async create(createSongDto: CreateSongDto): Promise<Song> {
    const song = this.songRepository.create({
      ...createSongDto,
      release_date: createSongDto.release_date || new Date(),
    });
    try {
      return await this.songRepository.save(song);
    } catch (error) {
      throw new NotFoundException('Error while saving the song');
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Get all songs',
    type: [Song],
  })
  async findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  @ApiResponse({
    status: 200,
    description: 'Get a song by ID',
    type: Song,
  })
  @ApiResponse({
    status: 404,
    description: 'Song not found',
  })
  async findOne(id: string): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: { songId: id },
    });
    if (!song) {
      throw new NotFoundException(`Song with id ${id} not found`);
    }
    return song;
  }

  @ApiResponse({
    status: 200,
    description: 'Song updated successfully',
    type: Song,
  })
  @ApiResponse({
    status: 404,
    description: 'Song not found',
  })
  async update(id: string, updateSongDto: UpdateSongDto): Promise<Song> {
    const song = await this.songRepository.preload({
      songId: id,
      ...updateSongDto,
    });

    if (!song) {
      throw new NotFoundException(`Song with id ${id} not found`);
    }

    return this.songRepository.save(song);
  }

  @ApiResponse({
    status: 200,
    description: 'Song removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Song not found',
  })
  async remove(id: number): Promise<void> {
    const result = await this.songRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Song with id ${id} not found`);
    }
  }
}
