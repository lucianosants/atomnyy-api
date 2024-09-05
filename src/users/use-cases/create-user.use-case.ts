import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { providers } from '../../constants/providers';
import { IUserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export interface ICreateUserUseCaseRequest extends CreateUserDto {}

export interface ICreateUserUseCaseResponse {
  user: User;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(providers.user)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(data: ICreateUserUseCaseRequest): Promise<any> {
    try {
      const userIsAlreadyExist = await this.userRepository.findOneByEmail(
        data.email,
      );

      if (userIsAlreadyExist) {
        throw new BadRequestException('User already exists');
      }

      const password_hash = await bcrypt.hash(data.password_hash, 8);

      const user = await this.userRepository.create({ ...data, password_hash });

      return { user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
