import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(Math.floor(Math.random() * 1000 + 7000));
}
bootstrap();
