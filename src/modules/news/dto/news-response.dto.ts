import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';

export class NewsResponseDto {
  @ApiProperty() id: number;

  @ApiProperty() title: string;

  // topic đang lưu dạng varchar (tiếng Việt)
  @ApiProperty() topic: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  publishTime: Date | null;

  @ApiProperty({ type: User, nullable: true })
  publisher: User | null;

  @ApiProperty({ nullable: true })
  author: string | null;

  @ApiProperty({ description: 'Nội dung bài báo', nullable: true })
  content: string | null;

  @ApiProperty({ nullable: true })
  thumbnail: string | null;
}
