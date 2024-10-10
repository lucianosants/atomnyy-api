import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as request from 'supertest';
import { randomUUID } from 'node:crypto';

import { User } from '../../users/entities/user.entity';

export async function createAndAuthenticateUser(app: INestApplication) {
  const dataSource = app.get(DataSource);

  const user = new User();

  const userData: User = {
    id: randomUUID(),
    name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.com',
    password_hash: await bcrypt.hash('password123', 8),
    cellphone: '5589912345678',
    created_at: new Date(),
    shopping_lists: [],
  };

  Object.assign(user, userData);
  await dataSource.getRepository(User).save(user);

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: 'johndoe@example.com',
      password_hash: 'password123',
    })
    .expect(200);

  const { access_token } = await loginResponse.body;

  return {
    user,
    access_token,
    auth: { field: 'Authorization', val: `Bearer ${access_token}` },
  };
}
