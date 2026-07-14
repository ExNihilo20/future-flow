import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { toPublicUser, PublicUser } from './user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ user: PublicUser; accessToken: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new BadRequestException({
        success: false,
        message: 'Email already registered',
        errors: ['email'],
      });
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
      },
    });

    const accessToken = await this.signToken(user.id, user.email);
    return { user: toPublicUser(user), accessToken };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: PublicUser; accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid email or password',
        errors: [],
      });
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid email or password',
        errors: [],
      });
    }

    const accessToken = await this.signToken(user.id, user.email);
    return { user: toPublicUser(user), accessToken };
  }

  async getMe(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Unauthorized',
        errors: [],
      });
    }
    return toPublicUser(user);
  }

  private signToken(userId: string, email: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId, email });
  }
}
