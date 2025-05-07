import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpringClientService } from 'src/common/spring-client/spring-client.service';
@ApiTags('posts') 
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly spring: SpringClientService,
  ) { }

  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: Post, 
  })
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      release_date: createPostDto.release_date || new Date(),
    });

    return this.postRepository.save(post);
  }

  @ApiResponse({
    status: 200,
    description: 'List of all posts',
    type: [Post],  
  })
  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  @ApiResponse({
    status: 200,
    description: 'Found a post',
    type: Post,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async findOne(id: string): Promise<{ post: any; hilos: any[] }> {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: ['songId'], // ⬅️ Incluye la relación
    });
  
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  
    const hilos = await this.spring.getAllHilos();
  
    const postClean = {
      ...post,
      songId: post.songId?.songId ?? post.songId,
    };
  
    return { post: postClean, hilos };
  }

  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: Post,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  
  async update(id: string, updatePostDto: UpdatePostDto): Promise<any> {
    const post = await this.postRepository.preload({ postId: id, ...updatePostDto });
  
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  
    const saved = await this.postRepository.save(post);
  
    return {
      ...saved,
      songId: saved.songId?.songId ?? saved.songId,
    };
  }
  

  @ApiResponse({
    status: 204,
    description: 'Post deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async remove(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
