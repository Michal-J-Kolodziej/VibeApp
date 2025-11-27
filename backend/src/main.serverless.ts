import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    
    const prismaService = app.get(PrismaService);
    await prismaService.$connect();
    
    await app.init();
  }

  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}
