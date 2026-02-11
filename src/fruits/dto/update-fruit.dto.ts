import { PartialType } from '@nestjs/mapped-types';
import { Variety } from '../entities/fruit.entity';
import { CreateFruitDto } from './create-fruit.dto';

export class UpdateFruitDto extends PartialType(CreateFruitDto) {}

export class UpdateVariety extends PartialType(Variety) {}
