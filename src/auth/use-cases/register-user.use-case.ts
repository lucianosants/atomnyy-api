import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { providers } from '../../constants/providers';
import { IUserRepository } from '../../users/repositories/user.repository';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/entities/user.entity';

export interface IRegisterUserUseCaseRequest extends CreateUserDto {}

export interface IRegisterUserUseCaseResponse {
  message: string;
  user: User;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(providers.user)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(
    data: IRegisterUserUseCaseRequest,
  ): Promise<IRegisterUserUseCaseResponse> {
    try {
      const userIsAlreadyExist = await this.userRepository.findByEmail(
        data.email,
      );

      if (userIsAlreadyExist) {
        throw new BadRequestException('User already exists');
      }

      const password_hash = await bcrypt.hash(data.password_hash, 8);

      const user = await this.userRepository.create({ ...data, password_hash });

      return {
        message: 'User created successfully',
        user: { ...user, password_hash: undefined },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
