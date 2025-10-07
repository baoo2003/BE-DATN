import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { NewsDetail } from '../news-detail/entities/news-detail.entity';
import { Topic } from './enums/news.enum';
import { NewsResponseDto } from './dto/news-response.dto';
import { ListNewsQueryDto } from './dto/list-news-query.dto';
import { PaginatedNewsResponseDto } from './dto/paginated-news-response.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,

    @InjectRepository(NewsDetail)
    private readonly detailRepo: Repository<NewsDetail>,
  ) {}

  private toDto(n: News): NewsResponseDto {
    return {
      id: n.id,
      title: n.title,
      topic: n.topic as unknown as string,
      publishTime: n.publishTime ?? null,
      author: n.author ?? null,
      content: n.detail?.content ?? null,
    };
  }

  /**
   * 🆕 Tạo mới bài báo + nội dung chi tiết
   */
  async create(dto: CreateNewsDto): Promise<News> {
    const { content, ...meta } = dto;

    // Tạo bản ghi news cơ bản
    const news = this.newsRepo.create({
      ...meta,
      publishTime: meta.publishTime
        ? new Date(meta.publishTime as unknown as string)
        : new Date(),
    });

    // Nếu có nội dung -> tạo luôn detail
    if (content && content.trim()) {
      news.detail = this.detailRepo.create({ content });
    }

    return this.newsRepo.save(news);
  }

  /**
   * 📜 Lấy danh sách bài báo (không load content để nhẹ)
   */
  async findAll(): Promise<NewsResponseDto[]> {
    const rows = await this.newsRepo.find({
      relations: ['detail'], // lấy luôn content
      order: { id: 'DESC' },
    });
    return rows.map((n) => this.toDto(n));
  }

  async findPaged(q: ListNewsQueryDto): Promise<PaginatedNewsResponseDto> {
    const page = Math.max(q.page ?? 1, 1);
    const pageSize = Math.min(Math.max(q.pageSize ?? 10, 1), 100);
    const order: 'ASC' | 'DESC' = (q.order ?? 'DESC').toUpperCase() as
      | 'ASC'
      | 'DESC';

    const [rows, total] = await this.newsRepo.findAndCount({
      relations: ['detail'],
      order: { publishTime: order, id: 'DESC' }, // thứ tự phụ để ổn định
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const items: NewsResponseDto[] = rows.map((n) => ({
      id: n.id,
      title: n.title,
      topic: n.topic as unknown as string,
      publishTime: n.publishTime ?? null,
      author: n.author ?? null,
      content: n.detail?.content ?? null,
    }));

    const pageCount = Math.ceil(total / pageSize);

    return {
      items,
      meta: {
        total,
        page,
        pageSize,
        pageCount,
        hasNext: page < pageCount,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 🔍 Lấy chi tiết một bài báo (kèm content)
   */
  async findOne(id: number): Promise<NewsResponseDto> {
    const n = await this.newsRepo.findOne({
      where: { id },
      relations: ['detail'],
    });
    if (!n) throw new NotFoundException(`News id=${id} không tồn tại`);
    return this.toDto(n);
  }

  /**
   * ✏️ Cập nhật thông tin bài báo + nội dung
   */
  async update(id: number, dto: UpdateNewsDto): Promise<News> {
    const news = await this.newsRepo.findOne({
      where: { id },
      relations: ['detail'],
    });
    if (!news) {
      throw new NotFoundException(`News id=${id} không tồn tại`);
    }

    // Cập nhật metadata
    if (dto.title !== undefined) news.title = dto.title;
    if (dto.topic !== undefined) news.topic = dto.topic;
    if (dto.publishTime !== undefined) {
      news.publishTime = dto.publishTime
        ? new Date(dto.publishTime as unknown as string)
        : new Date();
    }
    if (dto.author !== undefined) news.author = dto.author;

    // Cập nhật hoặc tạo mới nội dung
    if (dto.content !== undefined) {
      if (news.detail) {
        news.detail.content = dto.content;
      } else if (dto.content.trim()) {
        news.detail = this.detailRepo.create({ content: dto.content });
      }
    }

    return this.newsRepo.save(news);
  }

  /**
   * 🗑️ Xóa một bài báo (detail sẽ bị xóa tự động nhờ cascade)
   */
  async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.newsRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`News id=${id} không tồn tại`);
    }
    return { deleted: true };
  }

  getTopics(): { key: string; label: string }[] {
    return Object.entries(Topic).map(([key, label]) => ({ key, label }));
  }
}
