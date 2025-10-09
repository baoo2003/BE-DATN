import { ApiProperty } from '@nestjs/swagger';
export class TokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJI...' })
  access_token: string;
}
