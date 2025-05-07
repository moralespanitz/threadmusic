import 'dotenv/config';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongModule } from './song/song.module';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';
import { Song } from './song/entities/song.entity';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER!,
      password: process.env.POSTGRES_PASSWORD!,
      database: process.env.POSTGRES_DB!,
      entities: [Post, Song],
      synchronize: true,
    }),
    SongModule, 
    PostModule,
    HttpModule,
    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
