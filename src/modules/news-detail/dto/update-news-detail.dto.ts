import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDetailDto } from './create-news-detail.dto';

export class UpdateNewsDetailDto extends PartialType(CreateNewsDetailDto) {}
