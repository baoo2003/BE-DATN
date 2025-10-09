import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Topic } from '../enums/news.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({ example: 'Tiêu đề bài viết', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: Topic, enumName: 'Topic', example: Topic.CongNghe })
  @IsEnum(Topic)
  @IsOptional()
  topic: Topic;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2025-10-07T12:00:00Z',
    description: 'ISO 8601 date-time',
  })
  @IsOptional()
  @IsDateString()
  publishTime: Date;

  @ApiProperty({ example: 'Tác giả bài viết' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'Nội dung bài báo (MEDIUMTEXT)',
    example: 'Đây là nội dung rất dài...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
