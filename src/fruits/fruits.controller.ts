import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AddVarietyDto, CreateFruitDto } from './dto/create-fruit.dto';
import { UpdateVariety } from './dto/update-fruit.dto';
import { Fruit } from './entities/fruit.entity';
import { FruitsService } from './fruits.service';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class FindQueryParams {
  @IsString()
  @IsOptional()
  name: string; // search in both fruit and variety

  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  sortBy: string;

  @IsString()
  @IsOptional()
  order: string;
}

@Controller('fruits')
export class FruitsController {
  constructor(private readonly fruitsService: FruitsService) {}

  // 1. Create a new Fruit Category
  @Post()
  async createFruit(@Body() createFruitDto: CreateFruitDto): Promise<Fruit> {
    return await this.fruitsService.createFruit(createFruitDto);
  }

  // 3. Add a Variety to a specific Fruit
  @Patch('/:id/varieties')
  async addVariety(
    @Param('id') id: string,
    @Body() varietyDto: AddVarietyDto[],
  ) {
    const fruit = await this.fruitsService.findById(id);
    if (!fruit) throw new NotFoundException('Fruit not found');

    // Create the variety sub-document
    const newVariety = await this.fruitsService.update(
      { _id: id },
      {
        $push: {
          varieties: {
            $each: varietyDto.map((variety) => ({
              name: variety.name,
              description: variety.description,
            })),
          },
        },
      },
      { returnDocument: 'after' },
    );

    return newVariety;
  }

  @Patch('/:id')
  async updateVarietyByFruitIdAndVarietyName(
    @Param('id') id: string,
    @Query('varietyName') varietyName: string,
    @Body() updateFruitDto: UpdateVariety,
  ) {
    const setQuery = Object.fromEntries(
      Object.entries(updateFruitDto).map(([k, v]) => [`varieties.$.${k}`, v]),
    );
    return await this.fruitsService.update(
      {
        _id: id,
        'varieties.name': {
          $regex: new RegExp(`^${varietyName}$`, 'i'),
        },
      },
      { $set: setQuery },
      { returnDocument: 'after' },
    );
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.fruitsService.findById(id);
  }

  @Get()
  async find(@Query() query: FindQueryParams) {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
    };

    console.log('query', query);

    const searchTerm = query.name || '';
    const searchRegex = new RegExp(searchTerm, 'i');

    const filter = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { 'varieties.name': searchRegex },
        { 'varieties.description': searchRegex },
      ],
    };

    return await this.fruitsService.find(filter, options);
  }
}
