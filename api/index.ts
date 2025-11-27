import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../backend/src/app.module';
import { PrismaService } from '../backend/src/prisma/prisma.service';

const server = express();
let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server)
    );
    app.setGlobalPrefix('api');
    app.enableCors();
    
    const prismaService = app.get(PrismaService);
    await prismaService.$connect();
    
    await app.init();
  }
  return app;
}

export default async (req: any, res: any) => {
  await bootstrap();
  return server(req, res);
};
