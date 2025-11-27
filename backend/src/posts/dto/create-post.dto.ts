import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Latitude is required' })
  lat: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Longitude is required' })
  lng: number;
}
