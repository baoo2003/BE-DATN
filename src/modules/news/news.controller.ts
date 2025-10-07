import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ListNewsQueryDto } from './dto/list-news-query.dto';
import { PaginatedNewsResponseDto } from './dto/paginated-news-response.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Tạo bài báo thành công' })
  @ApiBody({ type: CreateNewsDto })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiCreatedResponse({ description: 'Lấy danh sách bài báo thành công' })
  findAll() {
    return this.newsService.findAll();
  }

  @Get('topics')
  @ApiCreatedResponse({ description: 'Lấy danh sách chủ đề thành công' })
  getTopics() {
    return this.newsService.getTopics();
  }

  @Get('paged')
  @ApiOkResponse({ type: PaginatedNewsResponseDto })
  getPaged(@Query() q: ListNewsQueryDto) {
    return this.newsService.findPaged(q);
  }

  @Get(':id')
  @ApiCreatedResponse({ description: 'Lấy bài báo theo ID thành công' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: 'Cập nhật bài báo thành công' })
  @ApiBody({ type: UpdateNewsDto })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ description: 'Xóa bài báo thành công' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
