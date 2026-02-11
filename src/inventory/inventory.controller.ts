import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { type AuthUser } from '../auth/strategies/jwt.strategy';
import { Roles } from '../common/decorator/roles.decorator';
import { User } from '../common/decorator/user.decorator';
import { Variety } from '../fruits/entities/fruit.entity';
import { FruitsService } from '../fruits/fruits.service';
import { UserRole } from '../users/entities/user.entity';
import { CreateInventoryRequestDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly fruitService: FruitsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async addInventory(
    @User() user: AuthUser,
    @Body() dto: CreateInventoryRequestDto,
  ) {
    // 1. VALIDATION: Does this Fruit exist?
    const fruit = await this.fruitService.findById(dto.fruit);
    if (!fruit) throw new NotFoundException('Fruit category not found');

    // 2. VALIDATION: Does this Variety exist inside this Fruit?
    // We check if the requested varietyName exists in the master list
    const varietyExists = fruit.varieties.some(
      (v) => v.name === dto.varietyName,
    );

    if (!varietyExists) {
      fruit.varieties.push({ name: dto.varietyName });
      await fruit.save();
    }

    // 3. CREATE INVENTORY: Link Master Data + Seller Data
    return await this.inventoryService.create({
      ...dto,
      seller: user.userId,
    });
  }

  @Get()
  async getMarketListings() {
    return this.inventoryService.findAll(
      {},
      {
        populate: [
          { path: 'fruit', select: 'name varieties' },
          { path: 'seller', select: 'name region' },
        ],
      },
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Patch('/:id')
  async updateInventory(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDto,
    @User() user: AuthUser,
  ) {
    // 1. Find the Inventory Item
    const item = await this.inventoryService.findOne({ _id: id });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    if (item.seller.toString() !== user.userId)
      throw new ForbiddenException('You are not allowed to update this item');

    // 3. DYNAMIC VARIETY CHECK (If updating the varietyName)
    if (dto.varietyName) {
      const fruit = await this.fruitService.findById(item.fruit);

      if (!fruit)
        throw new NotFoundException('Associated fruit category missing');

      const varietyExists = fruit.varieties.some(
        (v) => v.name.toLowerCase() === dto?.varietyName?.toLowerCase(),
      );

      // If new variety doesn't exist, add it to Master Catalog
      if (!varietyExists) {
        const newVariety: Variety = { name: dto.varietyName };
        fruit.varieties.push(newVariety);
        await fruit.save();
      }
    }

    // 4. Perform the Update
    const updatedItem = await this.inventoryService.update(
      id,
      { $set: dto },
      { returnDocument: 'after', runValidators: true },
    );

    return updatedItem;
  }
}
