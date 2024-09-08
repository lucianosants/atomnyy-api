import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { providers } from '../../constants/providers';
import { IUserRepository } from '../../users/repositories/user.repository';

import { UserPayload } from '../models/user-payload';
import { UserToken } from '../models/user-token';
import { LoginRequest } from '../models/login-request';

export interface ILoginUserUseCaseRequest extends LoginRequest {}

export interface ILoginUserUseCaseResponse extends UserToken {}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(providers.user)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(
    data: ILoginUserUseCaseRequest,
  ): Promise<ILoginUserUseCaseResponse> {
    try {
      const user = await this.userRepository.findByEmail(data.email);

      if (
        !user ||
        !(await bcrypt.compare(data.password_hash, user.password_hash))
      ) {
        throw new UnauthorizedException('Email or password invalid');
      }

      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      const jwtToken = this.jwtService.sign(payload);

      return { access_token: jwtToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException(error.message);
    }
  }
}
