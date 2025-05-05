import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Song } from 'src/song/entities/song.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  userId: string;

  @IsNotEmpty() 
  @ApiProperty({
    description: 'Song ID',
    type: () => Song,
    example: 'song123',
  })
  songId: Song;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Content of the post',
    example: 'This is a great song!',
  })
  content: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Release date of the post',
    example: '2025-05-01T10:00:00Z',
    required: false,
  })
  release_date?: Date;
}
