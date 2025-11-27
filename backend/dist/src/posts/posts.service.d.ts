import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    post(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post | null>;
    posts(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PostWhereUniqueInput;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput;
    }): Promise<Post[]>;
    createPost(data: Prisma.PostCreateInput): Promise<Post>;
    deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post>;
}
