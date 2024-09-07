import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { providers } from '../../constants/providers';
import { IUserRepository } from '../repositories/user.repository';

export interface IFindUserByEmailUseCaseRequest {
  email: string;
  password_hash: string;
}

export interface IFindUserByEmailUseCaseResponse {
  accessToken: string;
}

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(providers.user)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(
    data: IFindUserByEmailUseCaseRequest,
  ): Promise<IFindUserByEmailUseCaseResponse> {
    try {
      const user = await this.userRepository.findByEmail(data.email);

      if (
        !user ||
        !(await bcrypt.compare(data.password_hash, user.password_hash))
      ) {
        throw new NotFoundException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
