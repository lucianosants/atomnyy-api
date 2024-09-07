import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { providers } from '../constants/providers';

import { TypeOrmUserRepository } from './repositories/typeorm-user.repository';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    TypeOrmUserRepository,
    {
      provide: providers.user,
      useExisting: TypeOrmUserRepository,
    },
  ],
})
export class UsersModule {}
