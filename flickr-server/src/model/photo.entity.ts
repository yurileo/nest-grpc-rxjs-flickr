import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'photo' })
export class Photo extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'jsonb' })
  media: object;

  @Column({ type: 'timestamptz' })
  date_taken: Date;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'timestamptz' })
  published: Date;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'varchar' })
  author_id: string;

  @Column({ type: 'varchar' })
  tags: string;
}
