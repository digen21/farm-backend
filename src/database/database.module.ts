import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow('MONGODB_URL'),
        connectionFactory: (conn: Connection) => {
          console.log('MongoDB state:', conn.readyState);
          return conn;
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
