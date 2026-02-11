import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { FruitsModule } from './fruits/fruits.module';
import { OtpModule } from './otp/otp.module';
import { UsersModule } from './users/users.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ConfigsModule,
    DatabaseModule,
    UsersModule,
    FruitsModule,
    OtpModule,
    AuthModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
