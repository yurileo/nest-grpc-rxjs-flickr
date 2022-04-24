import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { GrpcService } from './grpc.service';
import { IPhotoByTag } from './interfaces/photo-by-tag.interface';
import { IPhoto } from './interfaces/photo.interface';

@Controller()
export class PhotoController {
  constructor(@Inject(GrpcService) private readonly grpcService: GrpcService) {}

  @GrpcMethod('PhotoService')
  getPhoto(request: IPhotoByTag): Observable<IPhoto> {
    return this.grpcService.connectClient(request);
  }
}
