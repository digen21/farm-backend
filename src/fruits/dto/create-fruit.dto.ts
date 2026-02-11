import { IsOptional, IsString } from 'class-validator';

export class CreateFruitDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AddVarietyDto {
  @IsString()
  name: string; // e.g., 'Kesar'

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string; // URL to image
}
