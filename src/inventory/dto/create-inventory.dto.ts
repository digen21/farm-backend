import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';

export class CreateInventoryDto {
  // Matches: seller: Types.ObjectId
  @IsString()
  @IsNotEmpty()
  @IsMongoId() // Ensures the string is a valid MongoDB ObjectId
  seller: string;

  // Matches: fruit: Types.ObjectId
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  fruit: string;

  // Matches: varietyName: string
  @IsString()
  @IsNotEmpty()
  varietyName: string;

  // Matches: pricePerKg: number
  @IsNumber()
  @IsNotEmpty()
  pricePerKg: number;

  // Matches: availableStock: number
  @IsNumber()
  @IsNotEmpty()
  availableStock: number;

  // Matches: harvestDate: Date
  @IsDate()
  @IsOptional() // Made optional as it's not marked required in your Schema @Prop()
  @Type(() => Date) // Transforms string input (e.g., "2023-10-10") to a JS Date object
  harvestDate?: Date;
}

export class CreateInventoryRequestDto extends OmitType(CreateInventoryDto, [
  'seller',
] as const) {}
