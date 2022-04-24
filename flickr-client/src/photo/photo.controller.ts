import { Controller, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcClientOptions } from '../grpc.options';
import { IPhotoByTag } from './interfaces/photo-by-tag.interface';
import { v4 as uuidv4 } from 'uuid';
import { IPhoto } from './interfaces/photo.interface';

interface PhotoService {
  getPhoto(data: IPhotoByTag): Observable<any>;
}

@Controller('photo')
export class PhotoController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private photoService: PhotoService;
  private clientId: string;

  onModuleInit() {
    //  console.log('[onModuleInit] PhotoContloller: ', this.client, process.argv);

    this.photoService = this.client.getService<PhotoService>('PhotoService');
    this.clientId = uuidv4();
    this.startListener(process.argv[2], Number(process.argv[3]));
  }

  startListener(tags: string, limit: number): void {
    console.log(this.clientId);

    const observable = this.photoService.getPhoto({
      client: this.clientId,
      tags,
      limit,
    });

    observable.subscribe((message: IPhoto) => {
      console.log(
        `[${message.published}]`,
        `[${message.title.substring(0, 40)}]`,
        `[${message.link}]`,
      );
    });
  }
}
