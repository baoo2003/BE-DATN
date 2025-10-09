import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { News } from 'src/modules/news/entities/news.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => News, (news) => news.publisher)
  publishedNews: News[];
}
