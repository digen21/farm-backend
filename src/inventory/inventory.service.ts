import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PaginateOptions,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
  type PaginateModel,
} from 'mongoose';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

type Options = QueryOptions<Inventory> & {
  projection?: ProjectionType<Inventory>;
};

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: PaginateModel<Inventory>,
  ) {}

  create(createInventoryDto: CreateInventoryDto) {
    return this.inventoryModel.create(createInventoryDto);
  }

  findAll(filter: QueryFilter<Inventory> = {}, options: PaginateOptions = {}) {
    return this.inventoryModel.paginate(filter, options);
  }

  findOne(filter: QueryFilter<Inventory>, options?: Options) {
    return this.inventoryModel.findOne(filter, options?.projection, options);
  }

  update(
    id: string | Types.ObjectId,
    updateInventoryDto: UpdateQuery<UpdateInventoryDto>,
    options: Options,
  ) {
    return this.inventoryModel.findByIdAndUpdate(
      id,
      updateInventoryDto,
      options,
    );
  }
}
