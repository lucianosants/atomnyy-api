import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginRequest } from './models/login-request';

import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user.use-case';
import { IsPublic } from './decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  @Inject(RegisterUserUseCase)
  private readonly registerUserUseCase: RegisterUserUseCase;

  @Inject(LoginUserUseCase)
  private readonly loginUserUseCase: LoginUserUseCase;

  @IsPublic()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.registerUserUseCase.execute(body);
  }

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginRequest) {
    return this.loginUserUseCase.execute({
      email: body.email,
      password_hash: body.password_hash,
    });
  }
}
