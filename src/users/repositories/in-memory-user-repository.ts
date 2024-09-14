import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { IUserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  public users: User[] = [];

  public async create(data: CreateUserDto): Promise<User> {
    const user: User = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
      shopping_lists: [],
    };

    this.users.push(user);
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id === id);

    return user || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email);

    return user || null;
  }

  public async delete(user: User): Promise<User> {
    const userIndex = this.users.findIndex((item) => item.id === user.id);

    const currentUser = this.users[userIndex];

    if (userIndex === -1) return null;

    this.users.splice(userIndex, 1);

    return currentUser;
  }
}
