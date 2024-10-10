import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';

import { ShoppingListModule } from './shopping-list.module';

import { dataSourceTest } from '../database/database-source-test';

import { createAndAuthenticateUser } from '../utils/test/create-and-authenticate-user';
import { setExpirationDateShoppingList } from '../utils/set-expiration-date-shopping-list';

import { ShoppingList } from './entities/shopping-list.entity';

describe('ShoppingListController', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET || 'supersecret',
          signOptions: { expiresIn: '1d' },
        }),
        ShoppingListModule,
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
    dataSource = await new DataSource(dataSourceTest).initialize();
    await dataSource.synchronize(true);
    await dataSource.destroy();
  });

  afterAll(async () => {
    dataSource = await new DataSource(dataSourceTest).initialize();
    await dataSource.dropDatabase();
    await dataSource.destroy();

    await app.close();
  });

  describe('POST /shopping-list', () => {
    it('should be create a shopping list', async () => {
      const { auth, user } = await createAndAuthenticateUser(app);

      const createShoppingList = await request(app.getHttpServer())
        .post('/shopping-list')
        .set(auth.field, auth.val)
        .send({
          userId: user.id,
          name: 'Lista de compras',
          total_price: 0,
        });

      expect(createShoppingList.statusCode).toBe(201);
    });
  });

  describe('GET /shopping-list/user/:userId', () => {
    it('should be show all shopping lists', async () => {
      dataSource = app.get(DataSource);

      const { auth, user } = await createAndAuthenticateUser(app);

      const shoppingList = new ShoppingList();

      const shoppingListData: ShoppingList = {
        id: randomUUID(),
        name: 'Lista de compras',
        total_price: 0,
        created_at: new Date(),
        expires_at: setExpirationDateShoppingList().expires_at,
        user: user,
      };

      Object.assign(shoppingList, shoppingListData);
      await dataSource.getRepository(ShoppingList).save(shoppingList);

      const shoppingLists = await request(app.getHttpServer())
        .get(`/shopping-list/user/${user.id}`)
        .set(auth.field, auth.val);

      expect(shoppingLists.statusCode).toBe(200);
    });
  });

  describe('GET /shopping-list/:id', () => {
    it('should get a shopping list', async () => {
      dataSource = app.get(DataSource);

      const { auth, user } = await createAndAuthenticateUser(app);

      const shoppingList = new ShoppingList();

      const shoppingListData: ShoppingList = {
        id: randomUUID(),
        name: 'Lista de compras',
        total_price: 0,
        created_at: new Date(),
        expires_at: setExpirationDateShoppingList().expires_at,
        user: user,
      };

      Object.assign(shoppingList, shoppingListData);
      await dataSource.getRepository(ShoppingList).save(shoppingList);

      const foundShoppingList = await request(app.getHttpServer())
        .get(`/shopping-list/${shoppingList.id}`)
        .set(auth.field, auth.val);

      expect(foundShoppingList.statusCode).toBe(200);
    });
  });

  describe('DELETE /shopping-list/:id', () => {
    it('should be able to delete a shopping list', async () => {
      dataSource = app.get(DataSource);

      const { auth, user } = await createAndAuthenticateUser(app);

      const shoppingList = new ShoppingList();

      const shoppingListData: ShoppingList = {
        id: randomUUID(),
        name: 'Lista de compras',
        total_price: 0,
        created_at: new Date(),
        expires_at: setExpirationDateShoppingList().expires_at,
        user: user,
      };

      Object.assign(shoppingList, shoppingListData);
      await dataSource.getRepository(ShoppingList).save(shoppingList);

      const deletedShoppingList = await request(app.getHttpServer())
        .delete(`/shopping-list/${shoppingList.id}`)
        .set(auth.field, auth.val);

      expect(deletedShoppingList.statusCode).toBe(200);
    });
  });

  describe('PATCH /shopping-list/:id', () => {
    it('should able to rename a shopping list', async () => {
      dataSource = app.get(DataSource);

      const { auth, user } = await createAndAuthenticateUser(app);

      const shoppingList = new ShoppingList();

      const shoppingListData: ShoppingList = {
        id: randomUUID(),
        name: 'Lista de compras',
        total_price: 0,
        created_at: new Date(),
        expires_at: setExpirationDateShoppingList().expires_at,
        user: user,
      };

      Object.assign(shoppingList, shoppingListData);
      await dataSource.getRepository(ShoppingList).save(shoppingList);

      const renamedShoppingList = await request(app.getHttpServer())
        .patch(`/shopping-list/${shoppingList.id}`)
        .set(auth.field, auth.val)
        .send({ name: 'Lista renomeada' });

      expect(renamedShoppingList.statusCode).toBe(200);
    });
  });
});
