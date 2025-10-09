import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async create(input: {
    email: string;
    password: string;
    fullName: string;
    isActive?: boolean;
  }) {
    const exists = await this.findByEmail(input.email);
    if (exists) throw new BadRequestException('Email already exists');

    const user = this.repo.create({
      email: input.email,
      password: input.password, // ĐÃ HASH ở Auth
      fullName: input.fullName,
      isActive: input.isActive ?? true,
    });
    return this.repo.save(user);
  }

  async update(
    id: number,
    input: {
      email?: string;
      password?: string; // ĐÃ HASH ở Auth (nếu có)
      fullName?: string;
      isActive?: boolean;
    },
  ) {
    const user = await this.findById(id);

    // Nếu đổi email -> kiểm tra trùng
    if (input.email && input.email !== user.email) {
      const existed = await this.findByEmail(input.email);
      if (existed) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Gán các trường được phép cập nhật
    if (typeof input.email !== 'undefined') user.email = input.email;
    if (typeof input.password !== 'undefined') user.password = input.password;
    if (typeof input.fullName !== 'undefined') user.fullName = input.fullName;
    if (typeof input.isActive !== 'undefined') user.isActive = input.isActive;

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    await this.repo.remove(user);
    return { success: true };
  }
}
