import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { providers } from '../constants/providers';
import { User } from '../users/entities/user.entity';
import { TypeOrmUserRepository } from '../users/repositories/typeorm-user.repository';

import { AuthController } from './auth.controller';

import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    TypeOrmUserRepository,
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: providers.user,
      useExisting: TypeOrmUserRepository,
    },
  ],
  exports: [RegisterUserUseCase, LoginUserUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
