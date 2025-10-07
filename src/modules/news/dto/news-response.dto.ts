import { ApiProperty } from '@nestjs/swagger';

export class NewsResponseDto {
  @ApiProperty() id: number;

  @ApiProperty() title: string;

  // topic đang lưu dạng varchar (tiếng Việt)
  @ApiProperty() topic: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  publishTime: Date | null;

  @ApiProperty({ nullable: true })
  author: string | null;

  @ApiProperty({ description: 'Nội dung bài báo', nullable: true })
  content: string | null;
}
