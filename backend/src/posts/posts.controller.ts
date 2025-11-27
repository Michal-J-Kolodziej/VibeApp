import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostModel } from '@prisma/client';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.post({ id });
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
    @Body() postData: { title: string; description: string; imageUrl?: string; lat: number; lng: number },
    @Request() req,
  ): Promise<PostModel> {
    const { title, description, imageUrl, lat, lng } = postData;
    return this.postsService.createPost({
      title,
      description,
      imageUrl,
      lat,
      lng,
      user: {
        connect: { id: req.user.userId },
      },
    });
  }
}
