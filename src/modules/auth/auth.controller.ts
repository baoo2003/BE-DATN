import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'Đăng ký thành công',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Email đã tồn tại hoặc dữ liệu không hợp lệ',
  })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Đăng nhập thành công',
    type: TokenResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Sai email hoặc mật khẩu' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Thông tin người dùng từ JWT' })
  @UseGuards(AuthGuard('jwt'))
  profile(@Req() req: any) {
    return req.user; // { userId, email }
  }

  @Patch('profile')
  @ApiOkResponse({ description: 'Cập nhật hồ sơ thành công' })
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    // req.user được gắn từ JwtStrategy.validate -> { userId, email }
    return this.auth.updateProfile(req.user.userId, dto);
  }

  @Patch('change-password')
  @ApiOkResponse({ description: 'Đổi mật khẩu thành công' })
  @ApiUnauthorizedResponse({ description: 'Mật khẩu hiện tại không đúng' })
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.auth.changePassword(
      req.user.userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
