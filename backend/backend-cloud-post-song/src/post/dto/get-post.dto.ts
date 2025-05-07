import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Song } from 'src/song/entities/song.entity';

export class GetPostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  userId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Song ID associated with the post',
    type: String,
    example: '893a7daa-db6f-4664-87b1-ed5f0f715a6b',
  })
  songId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Content of the post',
    example: 'This is a great song!',
  })
  content: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Timestamp of the post',
    example: '2025-05-01T10:00:00Z',
  })
  timestamp: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Creation date of the post',
    example: '2025-05-01T10:00:00Z',
  })
  createdAt: Date;
}
