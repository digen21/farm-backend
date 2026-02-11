import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthUser } from '../auth/strategies/jwt.strategy';
import { User } from '../common/decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@User() user: AuthUser) {
    return await this.usersService.findOne({ _id: user.userId });
  }

  @Patch()
  @HttpCode(200)
  async updateProfile(
    @User() { userId }: AuthUser,
    @Body() updateData: UpdateUserDto,
  ) {
    // 1. Check if user exists
    const user = await this.usersService.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Handle Address Update Strategy
    // If updateData contains an address object, we merge it with the existing address.
    if (updateData.address && typeof updateData.address === 'object') {
      // Create a new address object combining old data + new changes
      const updatedAddress = {
        ...(user.address || {}), // Spread existing address (or empty object)
        ...updateData.address, // Spread new address fields over it
      };

      // Replace the address in the update data
      updateData.address = updatedAddress;
    }

    // 3. Perform the Update
    // { returnDocument: "after" } returns the updated document instead of the old one
    const updatedUser = await this.usersService.update(
      userId,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }, // runValidators ensures schema rules are checked
    );

    return updatedUser;
  }
}
