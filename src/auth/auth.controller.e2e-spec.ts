import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth.module';
import { dataSourceTest } from '../database/database-source-test';
import { AuthGuard } from './auth.guard';

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    await dataSource.destroy();
  });

  afterAll(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    await dataSource.dropDatabase();
    await dataSource.destroy();

    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register user and return success message', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password_hash: 'password123',
          cellphone: '5589912345678',
        });
      expect(response.body.message).toEqual('User created successfully');
      expect(response.statusCode).toBe(201);
    });
  });

  describe('POST /auth/login', () => {
    it('should login and return token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'john.doe@example.com',
          password_hash: 'password123',
        });

      const { access_token } = response.body;

      expect(access_token).toBeDefined();
      expect(response.statusCode).toBe(200);
    });
  });
});
