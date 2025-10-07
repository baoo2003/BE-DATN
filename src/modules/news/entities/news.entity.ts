import { NewsDetail } from 'src/modules/news-detail/entities/news-detail.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity({ name: 'news' })
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 100,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  topic: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  author: string | null;

  @Column({ type: 'datetime', name: 'publish_time', nullable: true })
  publishTime: Date | null;

  @OneToOne(() => NewsDetail, (detail) => detail.news, { cascade: true })
  detail: NewsDetail;
}
