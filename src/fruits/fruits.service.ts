import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PaginateOptions,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
  type PaginateModel,
} from 'mongoose';
import { CreateFruitDto } from './dto/create-fruit.dto';
import { UpdateFruitDto } from './dto/update-fruit.dto';
import { Fruit } from './entities/fruit.entity';

@Injectable()
export class FruitsService {
  constructor(
    @InjectModel(Fruit.name)
    private fruitModel: PaginateModel<Fruit>,
  ) {}

  // 1. Create a new Fruit Category
  async createFruit(createFruitDto: CreateFruitDto): Promise<Fruit> {
    const newFruit = new this.fruitModel(createFruitDto);
    return newFruit.save();
  }

  // 2. Get All Fruits (Populated with varieties)
  async findAll(): Promise<Fruit[]> {
    return this.fruitModel.find().exec();
  }

  // 4. Update Pricing for a specific variety
  async update(
    filter: QueryFilter<Fruit>,
    update: UpdateQuery<UpdateFruitDto>,
    options: QueryOptions = {},
  ) {
    return this.fruitModel.findOneAndUpdate(filter, update, options);
  }

  async findById(id: string | Types.ObjectId) {
    return this.fruitModel.findById(id).exec();
  }

  async find(query: QueryFilter<Fruit>, options: PaginateOptions) {
    return this.fruitModel.paginate(query, options);
  }
}
