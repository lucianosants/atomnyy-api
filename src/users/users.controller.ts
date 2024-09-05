import { Controller, Post, Body, Inject } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
