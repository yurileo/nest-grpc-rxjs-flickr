import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from '../model/photo.entity';
import { Repository } from 'typeorm';
import { from } from 'rxjs';
import fetch from 'node-fetch';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private readonly repo: Repository<Photo>,
  ) {
    setInterval(() => {
      console.log('setInterval started');
      this.processFlickr();
    }, 15000);
  }

  processFlickr(): void {
    from(
      fetch(
        'https://api.flickr.com/services/feeds/photos_public.gne?format=json',
      ).then((response) => response.text()),
    ).subscribe((result: string) => this.parseFlickr(result));
  }

  parseFlickr(data: string): void {
    const flickrJson = JSON.parse(data.slice(15, data.length - 1));
    for (const item of flickrJson.items) {
      from(this.repo.count({ link: item.link })).subscribe((result) => {
        if (!result) {
          this.repo.save(item as Photo);
        }
      });
    }
  }
}

//pg_ctl -D /usr/local/var/postgres start
//pg_ctl -D /usr/local/var/postgres stop
