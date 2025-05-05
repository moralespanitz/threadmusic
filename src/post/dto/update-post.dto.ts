import { PartialType } from '@nestjs/mapped-types';
import { CreateSongDto
    
 } from 'src/song/dto/create-song.dto';
export class UpdatePostDto extends PartialType(CreateSongDto) {}
