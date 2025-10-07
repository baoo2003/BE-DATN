import { News } from 'src/modules/news/entities/news.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'news_detail' })
export class NewsDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => News, (news) => news.detail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'news_id' })
  news: News;

  @Column({
    type: 'mediumtext',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  content: string;
}
