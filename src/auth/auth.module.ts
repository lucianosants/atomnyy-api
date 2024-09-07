import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { providers } from 'src/constants/providers';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmUserRepository } from 'src/users/repositories/typeorm-user.repository';

import { JwtStrategy } from './strategies/jwt-strategy';
import { AuthController } from './auth.controller';

import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret', // Use variáveis de ambiente para o secret
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
    JwtStrategy,
  ],
  exports: [RegisterUserUseCase, LoginUserUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
