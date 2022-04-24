import { NestFactory } from '@nestjs/core';
import { from } from 'rxjs';
import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc.options';

function bootstrap() {
  from(NestFactory.create(AppModule)).subscribe((app) => {
    app.connectMicroservice(grpcClientOptions);
    app.startAllMicroservices();
  });
}
bootstrap();
