import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from '../model/photo.entity';
import { GrpcService } from './grpc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  providers: [PhotoService, GrpcService],
  controllers: [PhotoController],
  exports: [],
})
export class PhotoModule {}
