import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDetailDto {
  @IsInt()
  newsId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
