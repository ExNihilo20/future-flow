import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ApiExceptionFilter } from '../src/common/api-exception.filter';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const email = `e2e-${Date.now()}@example.com`;
  const password = 'securepassword';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('registers, logs in, and returns the current user', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password })
      .expect(201);

    expect(register.body.success).toBe(true);
    expect(register.body.data.accessToken).toBeDefined();
    expect(register.body.data.user.email).toBe(email);
    expect(register.body.data.user.passwordHash).toBeUndefined();

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password })
      .expect(400);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    expect(login.body.success).toBe(true);
    expect(login.body.data.accessToken).toBeDefined();

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'wrongpassword' })
      .expect(401);

    await request(app.getHttpServer()).get('/api/v1/users/me').expect(401);

    const me = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`)
      .expect(200);

    expect(me.body.success).toBe(true);
    expect(me.body.data.email).toBe(email);
  });
});
