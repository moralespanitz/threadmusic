import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty({
    description: 'The title of the song',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The artist ID of the song',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  artistId: string;

  @ApiProperty({
    description: 'The genre of the song',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty({
    description: 'The release date of the song',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  release_date?: Date;
}
