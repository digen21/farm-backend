import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Fruit, FruitSchema } from './entities/fruit.entity';
import { FruitsController } from './fruits.controller';
import { FruitsService } from './fruits.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fruit.name, schema: FruitSchema }]),
  ],
  controllers: [FruitsController],
  providers: [FruitsService],
  exports: [FruitsService],
})
export class FruitsModule {}
