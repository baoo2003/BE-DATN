import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { NewsDetail } from '../news-detail/entities/news-detail.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([News, NewsDetail]), HttpModule],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [TypeOrmModule],
})
export class NewsModule {}
