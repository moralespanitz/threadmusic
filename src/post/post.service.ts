import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('posts') 
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
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
  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { postId: id } });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
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
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.preload({ postId: id, ...updatePostDto });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.postRepository.save(post);
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
