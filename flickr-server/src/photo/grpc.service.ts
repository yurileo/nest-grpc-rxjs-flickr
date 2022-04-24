import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { from, Observable, Subject } from 'rxjs';
import { Connection, InsertEvent, Repository } from 'typeorm';
import { Photo } from '../model/photo.entity';
import { IPhotoByTag } from './interfaces/photo-by-tag.interface';
import { IPhoto } from './interfaces/photo.interface';

export interface IGrpcClient {
  limit: number;
  tags: string;
  subject: Subject<IPhoto>;
}

@Injectable()
export class GrpcService {
  private clientForEndpoint: Map<string, IGrpcClient> = new Map();

  constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(Photo) private readonly repo: Repository<Photo>,
  ) {
    connection.subscribers.push(this);
  }

  sendPhotoToConnector(client: IGrpcClient, photo: Photo): void {
    const iphoto: IPhoto = {
      title: photo.title,
      link: photo.link,
      media: photo.media,
      datetaken:
        photo.date_taken instanceof Date
          ? photo.date_taken.toISOString()
          : photo.date_taken,
      description: photo.description,
      published:
        photo.published instanceof Date
          ? photo.published.toISOString()
          : photo.published,
      author: photo.author,
      authorid: photo.author_id,
      tags: photo.tags,
    };

    client.subject.next(iphoto);
  }

  sendFirstSetToConnector(client: IGrpcClient): void {
    from(
      this.repo
        .createQueryBuilder('photo')
        .where('photo.tags like :tags', { tags: `%${client.tags}%` })
        .orderBy('photo.published', 'DESC')
        .limit(client.limit)
        .getMany(),
    ).subscribe((result) => {
      for (const photo of result.sort((a, b) =>
        a.published > b.published ? 1 : -1,
      )) {
        this.sendPhotoToConnector(client, photo);
      }
    });
  }

  connectClient(request: IPhotoByTag): Observable<IPhoto> {
    if (request) {
      const existingClient: IGrpcClient = this.clientForEndpoint.get(
        request.client,
      );

      if (existingClient) {
        return existingClient.subject;
      } else {
        const client: IGrpcClient = {
          limit: request.limit,
          tags: request.tags,
          subject: new Subject<IPhoto>(),
        };
        this.clientForEndpoint.set(request.client, client);

        console.log('A new endpoint connected with ID: ' + request.client);
        setTimeout(() => {
          this.sendFirstSetToConnector(client);
        }, 500);
        return client.subject;
      }
    } else {
      return undefined;
    }
  }

  afterInsert(event: InsertEvent<Photo>) {
    this.clientForEndpoint.forEach((value) => {
      const photo: Photo = event.entity;

      if (photo.tags.includes(value.tags)) {
        this.sendPhotoToConnector(value, photo);
      }
    });
  }
}
