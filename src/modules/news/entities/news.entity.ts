import { NewsDetail } from 'src/modules/news-detail/entities/news-detail.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
} from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.publishedNews, {
    nullable: true,
    eager: true,
  })
  publisher?: User | null;

  @OneToOne(() => NewsDetail, (detail) => detail.news, { cascade: true })
  detail: NewsDetail;

  @Column({
    type: 'varchar',
    length: 4000,
    nullable: true,
  })
  thumbnail: string | null;
}
