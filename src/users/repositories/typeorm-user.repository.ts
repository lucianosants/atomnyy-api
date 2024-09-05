import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserRepository } from './user.repository';

import { User } from '../entities/user.entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(data: User): Promise<User> {
    const user = await this.userRepository.save(data);

    return user;
  }

  public async findOneById(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async findMany(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }

  public async delete(user: User): Promise<User> {
    await this.userRepository.remove(user);

    return user;
  }
}
