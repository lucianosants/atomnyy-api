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

  public async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async delete(user: User): Promise<User> {
    await this.userRepository.remove(user);

    return user;
  }
}
