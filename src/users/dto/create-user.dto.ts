// users/dto/create-user.dto.ts
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

// 1. DTO for the Address Sub-document
export class CreateUserAddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, { message: 'Invalid zip code format' })
  pincode: string;

  @IsString()
  @IsOptional()
  country?: string;
}

// 2. Main DTO for Creating the User
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // Defaults to BUYER in the schema if not provided

  // Validate nested address object
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserAddressDto)
  @IsOptional()
  address?: CreateUserAddressDto;
}
