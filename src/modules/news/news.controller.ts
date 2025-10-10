import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListNewsQueryDto } from './dto/list-news-query.dto';
import { PaginatedNewsResponseDto } from './dto/paginated-news-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ description: 'Tạo bài báo thành công' })
  @ApiBody({ type: CreateNewsDto })
  create(@Req() req: any, @Body() createNewsDto: CreateNewsDto) {
    const user = req.user; // { userId, email } từ JwtStrategy.validate
    return this.newsService.create(createNewsDto, user.userId);
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

  @Get('my/paged')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: PaginatedNewsResponseDto })
  getMyPaged(@Query() q: ListNewsQueryDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.newsService.findPaged({ ...q, publisherId: userId });
  }

  @Get(':id')
  @ApiCreatedResponse({ description: 'Lấy bài báo theo ID thành công' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ description: 'Cập nhật bài báo thành công' })
  @ApiBody({ type: UpdateNewsDto })
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    const user = req.user;
    return this.newsService.update(+id, updateNewsDto, user.userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ description: 'Xóa bài báo thành công' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
