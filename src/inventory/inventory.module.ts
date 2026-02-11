import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FruitsModule } from '../fruits/fruits.module';
import { Inventory, InventorySchema } from './entities/inventory.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    FruitsModule,
    MongooseModule.forFeature([
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
