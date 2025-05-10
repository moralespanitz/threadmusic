import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
  } from 'typeorm';
 import { Post } from 'src/post/entities/post.entity';  

  @Entity('songs')
  export class Song {
    @PrimaryGeneratedColumn('uuid')  
    songId: string;
  
    @Column()
    title: string;

    @Column({ type: 'varchar', nullable: true })
    trackId: string;
  
    @Column()
    artistId: string;
  
    @Column()
    genre: string;
  
    @Column({ type: 'timestamp'})
    release_date: Date;

    @OneToMany(() => Post, (post) => post.songId,  {eager: true, onDelete: 'CASCADE'})
    posts: Post[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  