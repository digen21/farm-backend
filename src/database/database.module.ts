import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
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
