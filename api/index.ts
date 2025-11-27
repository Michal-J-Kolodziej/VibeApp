import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import 'reflect-metadata';

// Import backend modules
import { AppModule } from '../backend/src/app.module';
import { AllExceptionsFilter } from '../backend/src/filters/all-exceptions.filter';
import { PrismaService } from '../backend/src/prisma/prisma.service';

const server = express();
let app: any;

async function bootstrap() {
  if (!app) {
    const expressApp = server;
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { cors: true }
    );
    
    app.setGlobalPrefix('api');
    app.enableCors();
    
    // Enable validation globally
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    // Enable exception filter globally
    app.useGlobalFilters(new AllExceptionsFilter());
    
    const prismaService = app.get(PrismaService);
    await prismaService.$connect();
    
    await app.init();
  }
  return server;
}

export default async (req: Request, res: Response) => {
  const expressApp = await bootstrap();
  expressApp(req, res);
};
