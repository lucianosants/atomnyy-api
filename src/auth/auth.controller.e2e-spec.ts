import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as request from 'supertest';

import { User } from '../users/entities/user.entity';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthController', () => {
  let app: INestApplication;

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: 'atomnyy-api-postgres-test',
    port: 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: 'atomnyyapitest',
    entities: [User],
    synchronize: true,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
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
        })
        .expect(201);
      expect(response.body.message).toEqual('User created successfully');
    });
  });

  describe('POST /auth/login', () => {
    it('should login and return token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'john.doe@example.com',
          password_hash: 'password123',
        })
        .expect(200);

      const { access_token } = response.body;

      expect(access_token).toBeDefined();
    });
  });
});
