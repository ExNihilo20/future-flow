import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  const jwtService = {
    signAsync: jest.fn().mockResolvedValue('test-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('registers a new user and returns a token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hash',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    });

    const result = await service.register({
      email: 'User@Example.com',
      password: 'securepassword',
    });

    expect(result.accessToken).toBe('test-token');
    expect(result.user.email).toBe('user@example.com');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('rejects duplicate email registration', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(
      service.register({ email: 'user@example.com', password: 'securepassword' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('logs in with valid credentials', async () => {
    const passwordHash = await argon2.hash('securepassword');
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    });

    const result = await service.login({
      email: 'user@example.com',
      password: 'securepassword',
    });

    expect(result.accessToken).toBe('test-token');
    expect(result.user.id).toBe('user-1');
  });

  it('rejects invalid login credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'missing@example.com', password: 'securepassword' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns the current user for getMe', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hash',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    });

    const user = await service.getMe('user-1');
    expect(user.email).toBe('user@example.com');
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('rejects getMe for unknown users', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.getMe('missing')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
