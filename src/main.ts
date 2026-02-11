import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DEBUG: Print EVERYTHING in process.env
  console.log('--- DEBUG ENV START ---');
  console.log(process.env.MONGODB_URL); // Check specifically
  console.log(
    'All Env Keys:',
    Object.keys(process.env).filter((k) => k.includes('MONGO')),
  );
  console.log('--- DEBUG ENV END ---');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
  const port = process.env.PORT || 5000;
  console.log('MONGO:', process.env.MONGODB_URL);
  console.log('PORT:', port);
  await app.listen(port);
}

bootstrap()
  .then(() => console.log('Server started'))
  .catch((err) => {
    console.error('❌ Server failed to start', err);
    process.exit(1);
  });
