import { Post as PostModel } from '@prisma/client';
import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getPostById(id: string): Promise<PostModel>;
    getPosts(): Promise<PostModel[]>;
    createPost(postData: {
        title: string;
        description: string;
        imageUrl?: string;
        lat: number;
        lng: number;
    }, req: any): Promise<PostModel>;
}
