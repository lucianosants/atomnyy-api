import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { providers } from '../constants/providers';

import { TypeOrmUserRepository } from './repositories/typeorm-user.repository';
import { User } from './entities/user.entity';

import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    TypeOrmUserRepository,
    {
      provide: providers.user,
      useExisting: TypeOrmUserRepository,
    },
  ],
})
export class UsersModule {}
