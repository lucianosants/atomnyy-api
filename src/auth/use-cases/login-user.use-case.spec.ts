import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { LoginUserUseCase } from './login-user.use-case';

import { InMemoryUserRepository } from 'src/users/repositories/in-memory-user-repository';

describe('Login User(Use Case)', () => {
  let userRepository: InMemoryUserRepository;
  let jwtService: JwtService;
  let sut: LoginUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    jwtService = new JwtService({
      secret: 'test-secret',
    });
    sut = new LoginUserUseCase(userRepository, jwtService);
  });

  it('should login successfully and return a token', async () => {
    const createUserDto = {
      name: 'John',
      email: 'johndoe@example.com',
      last_name: 'Doe',
      cellphone: '5589912345678',
      password_hash: await bcrypt.hash('password123', 8),
    };

    await userRepository.create(createUserDto);

    jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_jwt_token');

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password_hash: 'password123',
    });

    expect(result).toHaveProperty('access_token', 'mocked_jwt_token');
  });

  it('should throw UnauthorizedException when email does not exist', async () => {
    await expect(
      sut.execute({
        email: 'nonexistent@example.com',
        password_hash: 'password123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password is incorrect', async () => {
    const createUserDto = {
      name: 'John',
      email: 'janedoe@example.com',
      last_name: 'Doe',
      cellphone: '5589912345678',
      password_hash: await bcrypt.hash('correct_password', 8),
    };

    await userRepository.create(createUserDto);

    await expect(
      sut.execute({
        email: 'janedoe@example.com',
        password_hash: 'wrong_password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw BadRequestException when there is an unexpected error', async () => {
    jest
      .spyOn(userRepository, 'findByEmail')
      .mockRejectedValue(new Error('Unexpected error'));

    await expect(
      sut.execute({
        email: 'error@example.com',
        password_hash: 'password123',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
