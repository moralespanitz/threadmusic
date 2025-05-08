import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSongDto {
  @ApiProperty({
    description: 'The title of the song',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The track ID of the song',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  trackId: string;

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
}
