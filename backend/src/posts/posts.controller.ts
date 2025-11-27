import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostModel } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    const post = await this.postsService.post({ id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Get()
  async getPosts(): Promise<PostModel[]> {
    return this.postsService.posts({
      orderBy: { createdAt: 'desc' },
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ): Promise<PostModel> {
    return this.postsService.createPost({
      title: createPostDto.title,
      description: createPostDto.description,
      imageUrl: createPostDto.imageUrl,
      lat: createPostDto.lat,
      lng: createPostDto.lng,
      user: {
        connect: { id: req.user.userId },
      },
    });
  }
}
