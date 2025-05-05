import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  import { Song } from 'src/song/entities/song.entity'; 
  
  @Entity('posts')
  export class Post {
    @PrimaryGeneratedColumn('uuid') 
    postId: string;
  
    @Column()
    userId: string;
  
    @ManyToOne(() => Song, (song) => song.posts)
    songId: Song;
  
    @Column()
    content: string;
  
    @Column({ type: 'timestamp',  nullable: true  })
    release_date: Date;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  