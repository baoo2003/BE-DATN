import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private users: UserService,
  ) {}

  async register(input: { email: string; password: string; fullName: string }) {
    const hash = await bcrypt.hash(input.password, 10);
    const user = await this.users.create({
      email: input.email,
      password: hash, // lưu HASH
      fullName: input.fullName,
    });
    return this.sign(user.id, user.email);
  }

  async login(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.sign(user.id, user.email);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    return this.users.update(userId, dto);
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.users.findById(userId);
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) throw new UnauthorizedException('Current password is incorrect');

    const hash = await bcrypt.hash(newPassword, 10);
    return this.users.update(userId, { password: hash });
  }

  private async sign(sub: number, email: string) {
    return {
      access_token: await this.jwt.signAsync(
        { sub, email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES || '1d',
        },
      ),
    };
  }
}
