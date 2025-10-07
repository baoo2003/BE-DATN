import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';
import { IsOptional } from 'class-validator';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
